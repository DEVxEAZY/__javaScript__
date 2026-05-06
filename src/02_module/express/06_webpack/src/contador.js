/**
 * src/contador.js
 *
 * Modulo isolado. So sabe contar cliques num botao. Nao conhece
 * o resto da aplicacao — quem o "encaixa" no DOM e o index.js.
 *
 * Esse desacoplamento so e barato porque temos webpack: voce
 * pode quebrar a UI em modulos pequenos sem se preocupar em
 * "como isso vira UM script no browser".
 */

export function iniciarContador(elemento) {
    let n = 0;

    const botao = document.createElement("button");
    botao.textContent = "Cliques: 0";
    botao.addEventListener("click", () => {
        n += 1;
        botao.textContent = "Cliques: " + n;
    });

    elemento.appendChild(botao);
}
