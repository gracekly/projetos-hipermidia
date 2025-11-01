/*  - Importar (fazer o 'require') da nossa função 'jogar'
    - A sintaxe { jogar } pega especificamente a função 'jogar'que foi exportada do arquivo './jogo.js'
    */


const { jogar } = require('./jogo.js');

console.log("\n\n\n----- BEM-VINDO ao CASTELO do CORVO -----");
console.log("Digite para qual direção você deseja ir (north, south, east, west).");

jogar();