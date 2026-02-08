/**
 * Estudo de Switch Case em JavaScript
 * 
 * O switch possui duas formas principais de uso:
 */

// ---------------------------------------------------------
// TIPO 1: SWITCH NORMAL (Baseado em Valor Fixo)
// ---------------------------------------------------------
// É o uso mais comum, onde comparamos uma variável com valores exatos.
// Exemplo: 'case 0', 'case 1', 'case "red"'
function verificarDia() {
    const input = document.getElementById('input-dia');
    const dia = parseInt(input.value);
    const result = document.getElementById('resultado-dia');

    switch (dia) {
        case 0:
            result.innerText = "Hoje é Domingo 😴";
            break;
        case 1:
            result.innerText = "Hoje é Segunda-feira 💼";
            break;
        case 2:
            result.innerText = "Hoje é Terça-feira 🛠️";
            break;
        case 3:
            result.innerText = "Hoje é Quarta-feira 🐪";
            break;
        case 4:
            result.innerText = "Hoje é Quinta-feira 🚀";
            break;
        case 5:
            result.innerText = "Hoje é Sexta-feira 🍺";
            break;
        case 6:
            result.innerText = "Hoje é Sábado 🏖️";
            break;
        default:
            result.innerText = "Dia inválido! Digite de 0 a 6.";
            break;
    }
}

// ---------------------------------------------------------
// TIPO 2: SWITCH COM CONDIÇÕES (switch true)
// ---------------------------------------------------------
// Aqui passamos 'true' no switch, permitindo usar condições lógicas (>, <, &&)
// em cada 'case'. É excelente para verificar faixas de valores.
function verificarFaixaEtaria() {
    const input = document.getElementById('input-idade');
    const idade = parseInt(input.value);
    const result = document.getElementById('resultado-idade');

    if (isNaN(idade)) {
        result.innerText = "Por favor, digite uma idade válida.";
        return;
    }

    switch (true) {
        case (idade >= 0 && idade <= 12):
            result.innerText = "Você é uma Criança 🧸";
            break;
        case (idade >= 13 && idade <= 17):
            result.innerText = "Você é um Adolescente 🎮";
            break;
        case (idade >= 18 && idade <= 64):
            result.innerText = "Você é um Adulto 👔";
            break;
        case (idade >= 65):
            result.innerText = "Você é um Idoso 👴";
            break;
        default:
            result.innerText = "Idade impossível! 👽";
            break;
    }
}

// Mantendo a lógica original de cores para referência (Agrupamento de cases)
function mudarCor(cor) {
    const container = document.getElementById('container-result-id');
    const corNormalizada = cor.trim().toLowerCase();
    
    // Resetando a cor do texto para preto por padrão
    container.style.color = "black";

    switch (corNormalizada) {
        case 'red':
        case 'blue':
        case 'green':
        case 'yellow':
        case 'orange':
            container.style.backgroundColor = corNormalizada;
            container.innerHTML = `Cor: ${corNormalizada}`;
            break;
        
        case 'black':
            container.style.backgroundColor = corNormalizada;
            container.innerHTML = `Cor: ${corNormalizada}`;
            container.style.color = "white"; // Muda a cor do texto para branco no fundo preto
            break;

        default:
            container.style.backgroundColor = '#f0f0f0';
            container.innerHTML = "invalid color";
            break;
    }
}

function verificarCorInput() {
    let cor = document.getElementById('cor').value;
    mudarCor(cor);
}

function verificarCorList(cor) {
    mudarCor(cor);
}
