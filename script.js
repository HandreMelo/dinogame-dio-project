// DINOSSAURO
const dino = document.querySelector('.dino');
const background = document.querySelector('.background');
let score = document.getElementById("score");
let hiscore = document.getElementById("hiscore");
var hiscoreCache = localStorage['hiscore'] || '0'; //cache local
let isJumping = false;
let position = 0;
let actualScore = 0;
let gameOver = false;
var callCreateCactus;

function handlePressSpace(event) {
    if (event.keyCode === 32) {
        if (!isJumping && !gameOver) {
            jump();
        }
    }
}
function handlePressEnter(event) {
    if (event.keyCode === 13) {
        location.reload();
    }
}

//verifica se o jogo acabou e troca a imagem do personagem
function dinoState() {
    if (gameOver) {
        dino.style.backgroundImage = "url('img/sonic-wait.gif')";
        clearTimeout(dinoStateCall);
    }
    var dinoStateCall = setTimeout(dinoState, 600);
}

//pular e trocar a imagem conforme a posição, se pulando ou não
function jump() {
    isJumping = true;
    var tempo = 0;
    var fator_up = 0;
    var fator_down = 0;
    dino.style.backgroundImage = "url('img/sonic-jump.gif')";
    let upInterval = setInterval(() => { //para repetições em intervalo de tempo
        tempo += 0.3;
        fator_up = 10 * position;
        fator_down = 20 + position * 0.05;
        if (position >= 120) {
            clearInterval(upInterval);
            tempo = 0;
            let downInterval = setInterval(() => {
                tempo += 0.2;
                if (position <= 0) {
                    clearInterval(downInterval);
                    isJumping = false;
                    dino.style.backgroundImage = "url('img/sonic-run2.gif')";
                } else {
                    position -= 9.8 * ((tempo * tempo) / 2);
                    dino.style.bottom = position + 'px';
                }
            }, 20);
        } else {
            position = 60 * tempo - (9.8 * ((tempo * tempo) / 2));
            dino.style.bottom = position + 'px';
        }
    }, 20); //20ms
}

//para gerar um inteiro aleatório, usado no tempo de criação dos cactus
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

//Display de Fim de Jogo e gravar em Cache a pontuação mais alta.
function gameOverDisplay() {
    const gameOverMsg = document.createElement('h1');
    const pressSpaceMsg = document.createElement('h2');
	
    gameOverMsg.classList.add('gameOver'); //adicionar classe
    gameOverMsg.innerHTML = 'Game Over :(';
    pressSpaceMsg.classList.add('gameOver')
    pressSpaceMsg.innerHTML = 'Press Enter To Reload'
    background.appendChild(gameOverMsg);
    background.appendChild(pressSpaceMsg);
    if (hiscoreCache == 'defaultValue' || parseInt(hiscoreCache) < actualScore) {
		var hi = actualScore+1;
        hiscore.innerText = hi;
        localStorage['hiscore'] = hi.toString();
    }
}

//CACTUS e Condição de fim de jogo
function createCactus() {

    const cactus = document.createElement('div');
    let cactusPosition = 1000;
    let randomTime = getRandomInt(2000, 360);

    cactus.classList.add('cactus'); //adicionar classe
    cactus.style.left = 1000 + 'px';

    if (randomTime <= 1800) cactus.style.backgroundImage = "url('img/cactus.png')";
    else cactus.style.backgroundImage = "url('img/dino-inverse.png')";

    background.appendChild(cactus);
    let leftInterval = setInterval(() => {
        if (cactusPosition < -60) {
            clearInterval(leftInterval);
            background.removeChild(cactus);
        } else if (cactusPosition > 0 && cactusPosition < 60 && position < 60) {
            gameOver = true;
            background.style.animationIterationCount = 0;
            gameOverDisplay();
            clearTimeout(callCreateCactus);
            clearInterval(leftInterval);
            dino.style.backgroundImage = "url('img/sonic-wait.gif')";
        } else if (!gameOver) {
            cactusPosition -= 10;
            cactus.style.left = cactusPosition + 'px';
        }

    }, 20);
    //executar uma função depois de um tempo
    callCreateCactus = setTimeout(createCactus, randomTime);
}

//Score do jogo
function scoreMaker() {
    if (!gameOver) {
        let timeInterval = setInterval(() => {
            actualScore += 1;
            score.innerText = 'NOW: ' + actualScore.toString();
            if (gameOver) clearInterval(timeInterval);
        }, 100);
    }
    hiscore.innerText = 'HI: ' + hiscoreCache;
}


scoreMaker();
createCactus();
dinoState();
document.addEventListener('keypress', handlePressSpace);
document.addEventListener('keypress', handlePressEnter);
