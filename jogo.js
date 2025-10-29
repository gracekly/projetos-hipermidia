/*

/ 2. Usamos o "parse" para transformar o TEXTO em um OBJETO JavaScript.
// 2. Usamos o "parse" para criar uma NOVA variável (const) para o OBJETO.
//    (Nós não estamos mudando 'texto_mapa', estamos LENDO ele).
const mapaDoJogo = JSON.parse(texto_mapa);

*/

// 1. Carregar o mapa.
//    O './' significa "na mesma pasta que este arquivo".
//    Node.js lê o 'mapa.json', faz o parse e já nos dá o OBJETO.
const mapaDoJogo = require('./mapa.json');

// 3. Vamos testar se funcionou (o mesmo teste da aula passada)
console.log("--- DADOS GERAIS DO MAPA ---");
console.log("Ponto de início:", mapaDoJogo.main);
console.log("Ponto de saída:", mapaDoJogo.exit);
console.log("Itens máximos:", mapaDoJogo.max_itens);

// Apenas imprime um título
console.log("\n--- INICIANDO O JOGO ---");

// Linha 1: Pega o NOME da sala inicial
const nomeSalaAtual = mapaDoJogo.main;

// Linha 2: Usa o NOME para buscar os DADOS da sala
const dadosSalaAtual = mapaDoJogo.rooms[nomeSalaAtual];

// Linha 3: Imprime a descrição
console.log(dadosSalaAtual.description);