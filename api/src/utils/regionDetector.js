// Ordem importa: cidades mais específicas primeiro para evitar falso match com São Luís
export const REGIONS_MAP = [
  { regionId: '4', keywords: ['são josé de ribamar', 'sao jose de ribamar', 'sao-jose-de-ribamar', 'são jose de ribamar', 'sao josé de ribamar', 'ribamar'] },
  { regionId: '3', keywords: ['paço do lumiar', 'paco do lumiar', 'paco-do-lumiar', 'paço-do-lumiar'] },
  { regionId: '2', keywords: ['raposa'] },
  { regionId: '1', keywords: ['são luís', 'sao luis', 'são luis', 'sao luís', 'sao-luis', 'são-luís'] }
];

export function detectRegion(text) {
  if (!text) return '1';
  const lower = text.toLowerCase();
  for (const region of REGIONS_MAP) {
    if (region.keywords.some(kw => lower.includes(kw))) {
      return region.regionId;
    }
  }
  return '1'; // fallback: São Luís (cobertura geral do MA)
}
