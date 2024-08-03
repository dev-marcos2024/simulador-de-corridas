class Personagem{
    constructor(nome, veloc, manobr, poder){
        this.nome = nome;
        this.velocidade = veloc;
        this.manobrabilidade = manobr;
        this.poder = poder;
        this.resultado = 0;
        this.pontos = 0;
    }

    rollDice(){
        return Math.floor(Math.random() * 6) + 1;
    }

    zerarResult(){
        this.resultado = 0;
    }

    setPonto(p){
        this.pontos += p
    }
}

const personagens = {
    mario: new Personagem("Mario", 4, 3, 3),
    peach: new Personagem("Peach", 3, 4, 2),
    yoshi: new Personagem("Yoshi", 2, 4, 3),
    bowser: new Personagem("Bowser", 5, 2, 5),
    luigi: new Personagem("Luigi", 3, 4, 4),
    donkeyKong: new Personagem("Donkey Kong", 2, 2, 5)
}
// SORTEANDO UM BLOCO
function getBlock(){
    const bloks = ['Reta', 'Curva', 'Confronto'];
    return bloks[Math.floor(Math.random() * 3)];
}

// OBTENDO RESULTADOS E PONTUACOES
function getResult(jogador1, jogador2, bloc, spid1, spid2){

    let ponto = bloc === 'Confronto'? -1 : 1;
    let j1_dado = jogador1.rollDice();
    let j2_dado = jogador2.rollDice();

    jogador1.resultado= spid1 + j1_dado;
    jogador2.resultado= spid2 + j2_dado;

    console.log('ponto  '+ponto)
    console.log('dado  '+j1_dado, j2_dado)
    console.log('resultado  '+jogador1.resultado, jogador2.resultado)

    if ((jogador1.resultado > jogador2.resultado) && ponto === 1) {
        jogador1.setPonto(ponto);
    }else if((jogador1.resultado < jogador2.resultado) && ponto === 1) {
        jogador2.setPonto(ponto);
    }else if((jogador1.resultado > jogador2.resultado) && ponto === -1 && pontosJogador2 !== 0) {
        jogador2.setPonto(ponto);
    }else if((jogador2.resultado > jogador2.resultado) && ponto === -1 && pontosJogador2 !== 0) {
        jogador1.setPonto(ponto);
    }else{
        jogador1.zerarResult();
        jogador2.zerarResult();
    }

}


// INICIANDO O JOGO
function player(p1, p2){
 
    for (let i = 1; i <= 5; i++) {

        let bloco = getBlock()
        console.log(`${i}ª Rodada Bloco Selecionado: ${bloco}`);

        if (bloco === 'Reta'){
            getResult(p1, p2, 'Reta', p1.velocidade, p2.velocidade);
        }else if (bloco === 'Curva') {
            getResult(p1, p2, 'Curva', p1.manobrabilidade, p2.manobrabilidade);
        } else {
            getResult(p1, p2, 'Confronto', p1.poder, p2.poder);
        }

        p1.zerarResult();
        p1.zerarResult();

        console.log(p1.pontos, p2.pontos)
  
    }
}

async function main() {

    let personage1 = personagens["mario"];
    let personage2 = personagens["bowser"];

    console.log(`Iniciou a corrida entre ${personage1.nome} e ${personage2.nome}`);
    player(personage1, personage2);

    //let imprimirVencedor = await exibirResultado(personage1, personage2);
    if(personage1.pontos === personage2.pontos ){
        console.log("Empatou nenhum jogador venceu !!!")
    }else if (personage1.pontos > personage2.pontos ){
        console.log(`O personagem ${personage1.nome} é o vencedor !!!`)
    }else{
        console.log(`O personagem ${personage2.nome} é o vencedor !!!`)
    }
};

main()
// console.log(p1.pontos, p1.pontos)