const readline = require('node:readline'); // importando modulo para ler a entrada do terminal - readline é utilizado para ler o que o usuario digita.
const rl = readline.createInterface({ //createInterface() é uma função do módulo readline que cria esse canal de comunicação.
    input: process.stdin, // Define que a entrada virá do teclado (stdin = standard input)
    output: process.stdout //Define que a saída vai para o terminal (stdout = standard output)
});


// 1. Carregar o mapa.
//    O './' significa "na mesma pasta que este arquivo".
//    Node.js lê o 'mapa.json', faz o parse e já nos dá o OBJETO.
const mapaDoJogo = require('./mapa.json');
// Apenas imprime um título
console.log("\n### INICIANDO O JOGO... ###");



// Pega o NOME da sala inicial
let nomeSalaAtual = mapaDoJogo.main; //inicia no portao principal
let inventario = {}

function jogar() {

    // Usa o NOME para buscar os DADOS da sala.
    const dadosSalaAtual = mapaDoJogo.rooms[nomeSalaAtual];

    console.log("\n-----------------------");
    console.log("Você está em: ", dadosSalaAtual.description);

    const direcoes = ["north", "south", "east", "west", "up", "down"];
    const direcoes_disponiveis = [];

    for (const saida of direcoes) {
        if (dadosSalaAtual[saida]) {
            direcoes_disponiveis.push(saida);
        }
    }

    console.log("\nDireções disponíveis: " + direcoes_disponiveis.join(", "));

    const itens_na_sala = Object.keys(dadosSalaAtual.itens); //“Pegue o objeto itens dentro de dadosSalaAtual, e crie uma lista com os nomes de todos os itens dessa sala.”
    if (itens_na_sala.length > 0) {
        console.log("Itens na sala: " + itens_na_sala.join(", "));
    }

    rl.question("\nO que você quer fazer? > ", (resposta) => {

        const partes = resposta.toLowerCase().trim().split(' ');
        const comando = partes[0] //vai ser a primeira parte da resposta: "pegar" tal coisa, "ir" em tal direçaõ
        const argumento = partes[1] // vai ser a segunda parte da resposta: "vela", "norte"


        const proximaSala = dadosSalaAtual[resposta];

        if (proximaSala) {

            nomeSalaAtual = proximaSala;

        } else if (comando === "olhar") {


        } else if (comando === "inventario" || comando === "i") {

            const itens_no_inventario = Object.keys(inventario);
            if (itens_no_inventario.length === 0) {
                console.log("Seu inventário está vazio");
            } else {
                console.log("Você está carregando: " + itens_no_inventario.join(", "));
            }

        } else if (comando == "pegar") {

            const item_para_pegar = argumento;

            if (dadosSalaAtual.itens[item_para_pegar]) {

                const descricao_item = dadosSalaAtual.itens[item_para_pegar];
                inventario[item_para_pegar] = descricao_item;

                delete dadosSalaAtual.itens[item_para_pegar];

                console.log(`\nVocê pegou: ${item_para_pegar}`);
            } else {
                console.log(`\nNão há ${item_para_pegar} aqui`)
            }
        }
        else {
            console.log("\nVocê não pode seguir esse caminho.")
        }

        //Chamar 'jogar()' de novo, criando o loop
        jogar();
    });

}


module.exports = { jogar }; // Isso diz: "Quem 'importar' este arquivo, terá acesso à função 'jogar'"