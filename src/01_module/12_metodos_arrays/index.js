// Listas iniciais
const frutas = ["banana", "maçã", "uva", "laranja"];
const veiculos = ["carro", "moto", "bicicleta", "patinete"];

// 1. Join -> Insere um separador entre os elementos e retorna uma string
const frutasJoin = frutas.join(' - ');
document.getElementById('container_join').innerHTML = `<code>frutas.join(' - ')</code>: ${frutasJoin}`;

// 2. Concat -> Une dois ou mais arrays
const tudoJunto = frutas.concat(veiculos);
document.getElementById('container_concat').innerHTML = `<code>frutas.concat(veiculos)</code>: ${tudoJunto}`;

// 3. Slice -> Retorna uma cópia de parte do array (não altera o original)
const algumasFrutas = frutas.slice(1, 3); // Pega do índice 1 até o 2 (3 não incluso)
document.getElementById('container_slice').innerHTML = `<code>frutas.slice(1, 3)</code>: ${algumasFrutas} (Original: ${frutas})`;

// 4. Sort & Reverse -> Ordenação
const numeros = [5, 2, 10, 43, 50, 1, 20];
const numerosOrdenados = [...numeros].sort((a, b) => a - b); // Cópia ordenada (numérico)
const frutasReversas = [...frutas].reverse(); // Cópia em ordem reversa

document.getElementById('container_sort').innerHTML = `
    Original: ${numeros}<br>
    Ordenado (numérico): ${numerosOrdenados}<br>
    Frutas Reversas: ${frutasReversas}
`;

// 5. Push & Pop -> Adiciona/Remove no final (Altera o original)
const listaPushPop = ["Item A", "Item B"];
listaPushPop.push("Item C"); // Adiciona no fim
const removido = listaPushPop.pop(); // Remove o último ("Item C")
document.getElementById('container_push_pop').innerHTML = `
    Estado final: ${listaPushPop}<br>
    Elemento removido com pop(): ${removido}
`;

// 6. Splice -> Adiciona/Remove em qualquer posição (Altera o original)
const cores = ["azul", "verde", "vermelho"];
cores.splice(1, 1, "amarelo", "roxo"); // No índice 1, remove 1 e adiciona "amarelo" e "roxo"
document.getElementById('container_splice').innerHTML = `
    <code>cores.splice(1, 1, "amarelo", "roxo")</code>: ${cores}
`;
