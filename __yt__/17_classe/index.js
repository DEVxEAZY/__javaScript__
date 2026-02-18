class Car {
    constructor(marca, modelo, ano) {
        this.marca = marca;
        this.modelo = modelo;
        this.ano = ano;
        this.ligado = false;
    }

    buzina(info_add = "") {
        return `A buzina do ${this.marca} ${this.modelo} está ligada! ${info_add}`;
    }

    ligar() {
        if (this.ligado) {
            return `O ${this.modelo} já está ligado.`;
        }
        this.ligado = true;
        return `O ${this.modelo} foi ligado agora!`;
    }

    desligar() {
        if (!this.ligado) {
            return `O ${this.modelo} já está desligado.`;
        }
        this.ligado = false;
        return `O ${this.modelo} foi desligado.`;
    }

    getDados() {
        return `Carro: ${this.marca} ${this.modelo} (${this.ano}) - Status: ${this.ligado ? "Ligado" : "Desligado"}`;
    }

    // Exemplo de um método que altera um valor
    atualizarAno(novoAno) {
        if (novoAno > 1900 && novoAno <= new Date().getFullYear() + 1) {
            this.ano = novoAno;
            return `Ano atualizado para ${this.ano}.`;
        }
        return "Ano inválido!";
    }
}

// Criando instâncias (objetos) da classe Car
const uno = new Car("Fiat", "Uno de escada", 2004);
const ferrari = new Car("Ferrari", "F8 Tributo", 2023);

// Usando os métodos
console.log(uno.getDados());
console.log(uno.ligar());
console.log(uno.buzina("Sai da frente!"));
console.log(uno.getDados());

console.log("--------------------");

console.log(ferrari.getDados());
console.log(ferrari.buzina());
console.log(ferrari.atualizarAno(2024));
console.log(ferrari.getDados());
