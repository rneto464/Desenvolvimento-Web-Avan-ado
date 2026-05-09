/**
 * Calcula a similaridade entre duas strings usando o Coeficiente de Dice / Jaccard simplificado.
 * Remove stop words e pontuações para focar no núcleo semântico da notícia.
 */

const STOP_WORDS = new Set([
  'o', 'a', 'os', 'as', 'um', 'uma', 'uns', 'umas', 'de', 'do', 'da', 'dos', 'das',
  'em', 'no', 'na', 'nos', 'nas', 'por', 'pelo', 'pela', 'pelos', 'pelas', 'para',
  'pro', 'pra', 'com', 'sem', 'sob', 'sobre', 'entre', 'que', 'e', 'ou', 'mas', 'se'
]);

function tokenize(text) {
  if (!text) return new Set();
  
  // Converter para minúsculo, remover acentos e pontuação
  const normalized = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, ' ')
    .trim();
    
  // Separar em palavras, filtrando vazios e stop words
  const words = normalized.split(/\s+/).filter(word => word.length > 2 && !STOP_WORDS.has(word));
  
  return new Set(words);
}

/**
 * Retorna um valor entre 0 e 1 indicando a similaridade.
 * @param {string} textA 
 * @param {string} textB 
 * @returns {number}
 */
export function calculateSimilarity(textA, textB) {
  const setA = tokenize(textA);
  const setB = tokenize(textB);
  
  if (setA.size === 0 && setB.size === 0) return 1;
  if (setA.size === 0 || setB.size === 0) return 0;
  
  let intersectionCount = 0;
  for (const word of setA) {
    if (setB.has(word)) {
      intersectionCount++;
    }
  }
  
  // Índice de similaridade baseando na interseção pelo conjunto do texto mais curto
  // (Pois um título pode ser longo e o outro curto, mas relatando exatamente o mesmo fato)
  const minSize = Math.min(setA.size, setB.size);
  
  if (minSize === 0) return 0;
  
  return intersectionCount / minSize;
}
