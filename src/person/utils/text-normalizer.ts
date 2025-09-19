/**
 * Normaliza texto removendo acentos e convertendo para minúsculas
 * Exemplo: "João" → "joao", "José" → "jose"
 */
export const normalizeText = (text: string): string => {
  return text
    .normalize('NFD') // Decompõe acentos: "João" → "Jo\u0303o"
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos: "Jo\u0303o" → "Joo"
    .toLowerCase(); // Converte para minúsculas: "Joo" → "joo"
};
