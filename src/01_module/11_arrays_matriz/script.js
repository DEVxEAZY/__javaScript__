/**
 * GUIA DE ARRAYS E MATRIZES
 */

// --- Utilitário para exibir na tela ---
const logToHTML = (id, title, content) => {
    const el = document.getElementById(id);
    if (el) {
        const section = document.createElement('div');
        section.innerHTML = `<span class="highlight"># ${title}</span>\n${content}\n\n`;
        if (el.innerText.includes("Carregando")) el.innerText = "";
        el.appendChild(section);
    }
};

// ==========================================
// 1. ARRAYS (UNIDIMENSIONAIS)
// ==========================================
const frutas = ["maçã", "uva", "laranja", "banana"];

// Adição e Remoção
let manipulacao = [...frutas];
manipulacao.push("manga"); // Fim
manipulacao.unshift("morango"); // Início
logToHTML("array-output", "Adição", `Original: [${frutas}]\nModificado: [${manipulacao}]`);

// Iteração Moderna (Map e Filter)
const maiusculas = frutas.map(f => f.toUpperCase());
const filtroB = frutas.filter(f => f.startsWith("b"));
logToHTML("array-output", "Transformação (Map/Filter)", `Maiúsculas: ${maiusculas.join(" | ")}\nComeçam com 'b': ${filtroB}`);

// ==========================================
// 2. MATRIZES (MULTIDIMENSIONAIS)
// ==========================================

// Criando uma matriz 3x3 (ex: Tabuleiro ou Grade de Notas)
const matriz = [
    ["A1", "A2", "A3"], // Linha 0
    ["B1", "B2", "B3"], // Linha 1
    ["C1", "C2", "C3"]  // Linha 2
];

// Acessando elementos: matriz[linha][coluna]
const elementoC2 = matriz[2][1]; // Linha 2, Coluna 1
logToHTML("matrix-output", "Acesso Direto", `Acessando matriz[2][1]: ${elementoC2}`);

// Iterando sobre a matriz (Loop dentro de Loop)
let estrutura = "";
matriz.forEach((linha, i) => {
    linha.forEach((valor, j) => {
        estrutura += `Posição [${i}][${j}] = ${valor}\n`;
    });
});
logToHTML("matrix-output", "Iteração Completa (Nested forEach)", estrutura);

// Exemplo Prático: Modificando a matriz
matriz[1][1] = "X"; // Muda B2 para X
logToHTML("matrix-output", "Modificação", `Alterado matriz[1][1] para "X"`);

// --- Renderizando a Matriz Visualmente no HTML ---
const renderGrid = (data) => {
    const table = document.getElementById("matrix-grid");
    table.innerHTML = "";
    data.forEach(linha => {
        const tr = document.createElement("tr");
        linha.forEach(valor => {
            const td = document.createElement("td");
            td.textContent = valor;
            if (valor === "X") td.style.backgroundColor = "#ffcdd2";
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });
};

renderGrid(matriz);

console.log("Matriz completa no console:", matriz);
