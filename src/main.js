const contadorElement = document.getElementById('contador');
let jogadorSelecionado = [];

function getSrcPersonagem(element) {
    return element.querySelector('img').getAttribute('src');
}

function setResultsDisplay(src1, src2) {
    document.getElementById('sorte-jogador').style.backgroundImage = `url(${src1})`;
    document.getElementById('sorte-opon').style.backgroundImage = `url(${src2})`;
}

function setResultadosJogador(abilidade, dado, resultado) {
    document.getElementById('bloco-voce').textContent = abilidade;
    document.getElementById('dado-voce').textContent = dado;
    const total = document.getElementById('total-voce');
    total.textContent = `${abilidade} + ${dado} = ${resultado}`;
    total.classList.add('resultado-destaque');
}

function setResultadosOponente(abilidade, dado, resultado) {
    document.getElementById('bloco-oponente').textContent = abilidade;
    document.getElementById('dado-oponente').textContent = dado;
    const total = document.getElementById('total-oponente');
    total.textContent = `${abilidade} + ${dado} = ${resultado}`;
    total.classList.add('resultado-destaque');
}

async function selecionarPersonagem(element) {
    const personagens = document.querySelectorAll('.cartao');
    const srcJogador = getSrcPersonagem(element);

    document.getElementById('animate').style.backgroundImage = `url(${srcJogador})`;

    const oponente = personagens[Math.floor(Math.random() * personagens.length)];
    const srcOponente = getSrcPersonagem(oponente);

    document.getElementById('animate2').style.backgroundImage = `url(${srcOponente})`;

    setResultsDisplay(srcJogador, srcOponente);

    element.classList.toggle('visible');

    personagens.forEach(pers => {
        if (pers !== element) pers.classList.remove('visible');
    });

    jogadorSelecionado = [element.id, oponente.id];

    console.log(jogadorSelecionado);
}

async function moverPersonagem(id, increment) {
    const elem = document.getElementById(id);
    let pos = 0;

    function frame() {
        if (pos >= 830) return;
        pos += increment;
        elem.style.left = `${pos}px`;
        requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
}

function largada() {
    let tempo = 2;

    function atualizarContador() {
        if (tempo <= 0) {
            contadorElement.textContent = 'Largada!';
            contadorElement.classList.add('largada');
            setTimeout(() => contadorElement.style.display = 'none', 1000);
            clearInterval(contadorInterval);
        } else {
            contadorElement.textContent = tempo--;
        }
    }

    const contadorInterval = setInterval(atualizarContador, 1000);
}

async function exec(id1, id2, i1, i2, mensagem) {
    largada();

    setTimeout(() => {
        moverPersonagem(id1, i1);
        moverPersonagem(id2, i2);
    }, 4000);

    setTimeout(() => {
        contadorElement.textContent = mensagem;
        contadorElement.classList.add('resultado-final');
    }, 11000);
}

class Personagem {
    constructor(nome, velocidade, manobrabilidade, poder) {
        this.nome = nome;
        this.velocidade = velocidade;
        this.manobrabilidade = manobrabilidade;
        this.poder = poder;
        this.resultado = 0;
        this.pontos = 0;
    }

    rolarDado() {
        return Math.floor(Math.random() * 6) + 1;
    }

    zerarResultado() {
        this.resultado = 0;
    }

    adicionarPonto(ponto) {
        this.pontos += ponto;
    }
}

const personagens = {
    mario: new Personagem("Mario", 4, 3, 3),
    peach: new Personagem("Peach", 3, 4, 2),
    yoshi: new Personagem("Yoshi", 2, 4, 3),
    bowser: new Personagem("Bowser", 5, 2, 5),
    luigi: new Personagem("Luigi", 3, 4, 4),
    donkeyKong: new Personagem("Donkey Kong", 2, 2, 5)
};

function getBloco() {
    const blocos = ['Reta', 'Curva', 'Confronto'];
    return blocos[Math.floor(Math.random() * blocos.length)];
}

function calcularResultado(jogador1, jogador2, bloco, habilidade1, habilidade2) {
    const ponto = bloco === 'Confronto' ? -1 : 1;
    const dado1 = jogador1.rolarDado();
    const dado2 = jogador2.rolarDado();

    jogador1.resultado = habilidade1 + dado1;
    jogador2.resultado = habilidade2 + dado2;

    setResultadosJogador(habilidade1, dado1, jogador1.resultado);
    document.getElementById('valor-bloco').textContent = bloco.toUpperCase();
    setResultadosOponente(habilidade2, dado2, jogador2.resultado);

    if (jogador1.resultado > jogador2.resultado) {
        if (ponto === 1) jogador1.adicionarPonto(ponto);
    } else if (jogador1.resultado < jogador2.resultado) {
        if (ponto === 1) jogador2.adicionarPonto(ponto);
    } else if (ponto === -1) {
        if (jogador2.resultado > jogador1.resultado && jogador1.pontos !== 0) {
            jogador1.adicionarPonto(ponto);
        } else if (jogador1.resultado > jogador2.resultado && jogador2.pontos !== 0) {
            jogador2.adicionarPonto(ponto);
        }
    } else {
        jogador1.zerarResultado();
        jogador2.zerarResultado();
    }
}

function iniciarPartida(jogador1, jogador2) {
    for (let i = 0; i < 5; i++) {
        const bloco = getBloco();

        if (bloco === 'Reta') {
            calcularResultado(jogador1, jogador2, 'Reta', jogador1.velocidade, jogador2.velocidade);
        } else if (bloco === 'Curva') {
            calcularResultado(jogador1, jogador2, 'Curva', jogador1.manobrabilidade, jogador2.manobrabilidade);
        } else {
            calcularResultado(jogador1, jogador2, 'Confronto', jogador1.poder, jogador2.poder);
        }

        jogador1.zerarResultado();
        jogador2.zerarResultado();
    }
}

function main() {
    const jogador1 = personagens[jogadorSelecionado[0].toLowerCase()];
    const jogador2 = personagens[jogadorSelecionado[1].toLowerCase()];

    iniciarPartida(jogador1, jogador2);

    if (jogador1.pontos === jogador2.pontos) {
        exec('animate', 'animate2', 3, 3, "Empatou!!!");
    } else if (jogador1.pontos > jogador2.pontos) {
        exec('animate', 'animate2', 3, 2, "Você foi o vencedor!");
    } else {
        exec('animate', 'animate2', 2, 3, "Você perdeu, tente outra vez!");
    }
}

document.getElementById('jogar').addEventListener('click', main);

document.getElementById('reset').addEventListener('click', () => location.reload());



