import { get } from 'https';

/**
 * Função responsável por integrar com a API de notícias do IBGE
 * e retornar entre 3 e 5 notícias mais recentes.
 */
export function fetchLatestNews(limit = 5) {
  return new Promise((resolve, reject) => {
    // Garantir que limitamos de 3 a 5 conforme especificado
    const qtd = Math.max(3, Math.min(limit, 5));
    const url = `https://servicodados.ibge.gov.br/api/v3/noticias/?qtd=${qtd}`;

    get(url, (res) => {
      let data = '';

      // Recebendo os chunks de dados
      res.on('data', (chunk) => {
        data += chunk;
      });

      // Toda a resposta recebida
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          resolve(parsedData.items || []);
        } catch (e) {
          reject(new Error('Erro ao processar dados da integração com IBGE'));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}
