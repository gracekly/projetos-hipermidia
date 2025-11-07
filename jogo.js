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

    const monstro_na_sala = dadosSalaAtual.monster;
    let saida_bloqueada = false;


    if (monstro_na_sala) {
        console.log("!! PERIGO !!: " + monstro_na_sala.description);
        saida_bloqueada = true;
    }

    if (!saida_bloqueada) {
        const direcoes = ["north", "south", "east", "west", "up", "down"];
        const direcoes_disponiveis = [];
        for (const saida of direcoes) {
            if (dadosSalaAtual[saida]) {
                direcoes_disponiveis.push(saida);
            }
        }

        console.log("\nDireções disponíveis: " + direcoes_disponiveis.join(", "));

    } else {
        console.log("\nO monstro bloqueou todas as saídas!!!");
    }


    const itens_na_sala = Object.keys(dadosSalaAtual.itens); //“Pegue o objeto itens dentro de dadosSalaAtual, e crie uma lista com os nomes de todos os itens dessa sala.”
    if (itens_na_sala.length > 0) {
        console.log("Itens na sala: " + itens_na_sala.join(", "));
    }

    rl.question("\nO que você quer fazer? > ", (resposta) => {

        const partes = resposta.toLowerCase().trim().split(' ');
        const comando = partes[0] //vai ser a primeira parte da resposta: "pegar" tal coisa, "ir" em tal direçaõ
        const argumento = partes[1] // vai ser a segunda parte da resposta: "vela", "norte"


        const proximaSala = dadosSalaAtual[comando];

        if (proximaSala && !saida_bloqueada) {

            nomeSalaAtual = proximaSala;

        } else if (proximaSala && saida_bloqueada) {
            console.log("\nVocê não pode sair, o monstro bloqueou o caminho!");
        }

        else if (comando === "olhar") {


        } else if (comando === "inventario" || comando === "i") {

            const itens_no_inventario = Object.keys(inventario);
            if (itens_no_inventario.length === 0) {
                console.log("\nSeu inventário está vazio");
            } else {
                console.log("\nVocê está carregando: " + itens_no_inventario.join(", "));
            }


        } else if (comando == "pegar") {

            const item_para_pegar = argumento;

            if (dadosSalaAtual.itens[item_para_pegar]) {

                if (Object.keys(inventario).length >= mapaDoJogo.max_itens) {
                    console.log("\nSeu inventário está cheio! Você não pode pegar mais itens.")
                }
                else {
                    const descricao_item = dadosSalaAtual.itens[item_para_pegar];
                    inventario[item_para_pegar] = descricao_item;

                    console.log(`\nVocê pegou: ${item_para_pegar}`);
                    console.log("\nDescrição: " + dadosSalaAtual.itens[item_para_pegar]);

                    delete dadosSalaAtual.itens[item_para_pegar];

                }
            }
            else {
                console.log(`\nNão há ${item_para_pegar} aqui`)
            }


        } else if (comando === "usar") {
            const item_para_usar = argumento;

            if ((!inventario[item_para_usar]) && !monstro_na_sala) {
                console.log(`\nVocê não tem ${item_para_usar} no seu inventário.`);
            }
            else if (monstro_na_sala) {

                if (item_para_usar === monstro_na_sala.defeat_item && inventario[item_para_usar]) {
                    console.log(monstro_na_sala.defeat_message);
                    console.log(`\n!!Parabéns. Você conseguiu!!`);
                    dadosSalaAtual.monster = null;
                    delete inventario[item_para_usar];
                }
                else {
                    console.log(`\nVocê não conseguiu derrotar ${monstro_na_sala.name} e perdeu sua vida.`);
                    nomeSalaAtual = "saguao_principal";
                    console.log(`Você renasceu no ${nomeSalaAtual}`);
                }
            }
            else {

                // Tenta encontrar uma interação válida para este item no array 'use' da sala
                // O .find() procura na lista 'use' por um objeto 'u' onde 'u.item' é igual ao 'itemParaUsar'
                const interacao = dadosSalaAtual.use.find(objeto_interacao => objeto_interacao.item === item_para_usar);

                if (interacao) {
                    console.log(interacao.description);

                    switch (interacao.action) {
                        case "abrir nova direção":
                            console.log("Ainda nao podemos seguir esse caminho...");
                            break;

                        case "sumir com item":
                            delete inventario[item_para_usar];
                            console.log(`Você não tem mais posse de ${item_para_usar}`);
                            break;
                    }

                } else { console.log("\nNão há mosntros aqui."); }


            }


        } else if (comando === "drop") {

            const item_para_dropar = argumento;

            if (!inventario[item_para_dropar]) {
                console.log(`Você não tem ${item_para_dropar} no seu inventário.`);
            }
            else {
                console.log(`Você dropou: ${item_para_dropar}`);

                const descricao_item = inventario[item_para_dropar];
                dadosSalaAtual.itens[item_para_dropar] = descricao_item;

                delete inventario[item_para_dropar];
            }


        }
        else {
            console.log("\n--- Comando inválido! ---")
        }


        if (nomeSalaAtual === mapaDoJogo.exit) {
            console.log("\n\n---------------------------");
            console.log(mapaDoJogo.rooms[nomeSalaAtual].description);
            console.log("!!!!! VOCÊ VENCEU !!!!!!");
            rl.close();
        }
        else {
            jogar();
        }






        //Chamar 'jogar()' de novo, criando o loop

    });

}


module.exports = { jogar }; // Isso diz: "Quem 'importar' este arquivo, terá acesso à função 'jogar'"