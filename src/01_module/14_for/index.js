// Exemplo de Loop For em JavaScript

// 1. Loop simples para contar de 1 a 5
const lista = document.getElementById('resultado-lista');

console.log("Iniciando contagem...");

for (let i = 1; i <= 5; i++) {
    const item = document.createElement('li');
    item.textContent = `Número: ${i}`;
    lista.appendChild(item);
    console.log(`Contagem: ${i}`);
}

// 2. Iterando sobre um array
const frutas = ['Maçã', 'Banana', 'Laranja', 'Morango'];
const outputDiv = document.getElementById('output');

outputDiv.innerHTML += '<p><strong>Iterando sobre um array de frutas:</strong></p>';

for (let j = 0; j < frutas.length; j++) {
    outputDiv.innerHTML += `Fruta ${j + 1}: ${frutas[j]}<br>`;
}
