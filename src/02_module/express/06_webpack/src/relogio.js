/**
 * src/relogio.js
 *
 * Outro modulo isolado. Atualiza a hora a cada segundo.
 */

export function iniciarRelogio(elemento) {
    function atualizar() {
        elemento.textContent = new Date().toLocaleTimeString();
    }

    atualizar();
    setInterval(atualizar, 1000);
}
