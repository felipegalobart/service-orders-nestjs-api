import { normalizeText } from './text-normalizer';

/**
 * Exemplos de uso da função normalizeText
 * Demonstra como a busca ignora acentos
 */

// Exemplos de normalização
console.log('=== Exemplos de Normalização ===');
console.log('João →', normalizeText('João')); // "joao"
console.log('José →', normalizeText('José')); // "jose"
console.log('André →', normalizeText('André')); // "andre"
console.log('María →', normalizeText('María')); // "maria"
console.log('João Silva →', normalizeText('João Silva')); // "joao silva"

// Exemplos de busca
console.log('\n=== Exemplos de Busca ===');

// Dados de exemplo no banco
const pessoasExemplo = [
  { name: 'João Silva' },
  { name: 'José Santos' },
  { name: 'André Costa' },
  { name: 'Maria José' },
  { name: 'João Pedro' },
];

// Simulação de busca
const buscarPessoa = (termo: string) => {
  const termoNormalizado = normalizeText(termo);

  return pessoasExemplo.filter((pessoa) => {
    const nomeNormalizado = normalizeText(pessoa.name);
    return nomeNormalizado.includes(termoNormalizado);
  });
};

console.log('Busca por "joao":');
console.log(buscarPessoa('joao')); // Encontra: João Silva, João Pedro

console.log('\nBusca por "joão":');
console.log(buscarPessoa('joão')); // Encontra: João Silva, João Pedro

console.log('\nBusca por "jose":');
console.log(buscarPessoa('jose')); // Encontra: José Santos, Maria José

console.log('\nBusca por "josé":');
console.log(buscarPessoa('josé')); // Encontra: José Santos, Maria José

console.log('\nBusca por "andre":');
console.log(buscarPessoa('andre')); // Encontra: André Costa

console.log('\nBusca por "andré":');
console.log(buscarPessoa('andré')); // Encontra: André Costa
