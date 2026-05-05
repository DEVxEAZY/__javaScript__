/**
 * Padrão: exportar uma CLASSE.
 *
 * Mesma ideia do logger.js: `module.exports = ClassName`.
 * O require do outro lado já recebe a classe pronta para `new`.
 */

class Pessoa {
    constructor(nome, idade) {
        this.nome  = nome;
        this.idade = idade;
    }

    apresentar() {
        return `Olá, sou ${this.nome} e tenho ${this.idade} anos.`;
    }
}

module.exports = Pessoa;
