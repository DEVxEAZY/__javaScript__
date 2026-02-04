/**
 * JS CLASSES - Classes e Herança
 * Este arquivo demonstra classes ES6+ e conceitos de OOP em JavaScript
 */

console.log("=== JS CLASSES - Classes e Herança ===\n");

// ============================================
// 1. Class Declaration
// ============================================
console.log("1. CLASS DECLARATION");

class Pessoa {
    // Constructor
    constructor(nome, idade) {
        this.nome = nome;
        this.idade = idade;
    }
    
    // Método de instância
    apresentar() {
        return `Olá, sou ${this.nome} e tenho ${this.idade} anos`;
    }
    
    // Getter
    get info() {
        return `${this.nome} (${this.idade} anos)`;
    }
    
    // Setter
    set novaIdade(idade) {
        if (idade > 0) {
            this.idade = idade;
        }
    }
}

const pessoa1 = new Pessoa("Ana", 25);
console.log("Classe:", pessoa1.apresentar());
console.log("Getter:", pessoa1.info);
pessoa1.novaIdade = 26;
console.log("Após setter:", pessoa1.idade);

// ============================================
// 2. Class Expression
// ============================================
console.log("\n2. CLASS EXPRESSION");

const Animal1 = class {
    constructor(nome) {
        this.nome = nome;
    }
    
    fazerSom() {
        return `${this.nome} faz um som`;
    }
};

const animal = new Animal("Cachorro");
console.log("Class expression:", animal.fazerSom());

// ============================================
// 3. Static Methods
// ============================================
console.log("\n3. STATIC METHODS");

class Calculadora {
    static somar(a, b) {
        return a + b;
    }
    
    static multiplicar(a, b) {
        return a * b;
    }
    
    // Static getter
    static get PI() {
        return 3.14159;
    }
}

console.log("Static method:", Calculadora.somar(5, 3));
console.log("Static getter:", Calculadora.PI);

// ============================================
// 4. Inheritance (Herança)
// ============================================
console.log("\n4. INHERITANCE");

class Veiculo {
    constructor(marca, modelo) {
        this.marca = marca;
        this.modelo = modelo;
    }
    
    acelerar() {
        return `${this.marca} ${this.modelo} está acelerando`;
    }
    
    frear() {
        return `${this.marca} ${this.modelo} está freando`;
    }
}

class Carro extends Veiculo {
    constructor(marca, modelo, portas) {
        super(marca, modelo); // Chama constructor da classe pai
        this.portas = portas;
    }
    
    // Sobrescrever método
    acelerar() {
        return `${super.acelerar()} com ${this.portas} portas`;
    }
    
    // Novo método
    abrirPorta(numero) {
        return `Abrindo porta ${numero}`;
    }
}

const carro = new Carro("Toyota", "Corolla", 4);
console.log("Herança:", carro.acelerar());
console.log("Método próprio:", carro.abrirPorta(1));

// ============================================
// 5. Private Fields (ES2022)
// ============================================
console.log("\n5. PRIVATE FIELDS");

class ContaBancaria {
    // Campos privados (usar #)
    #saldo = 0;
    #senha;
    
    constructor(titular, senha) {
        this.titular = titular;
        this.#senha = senha;
    }
    
    depositar(valor, senha) {
        if (senha === this.#senha) {
            this.#saldo += valor;
            return `Depósito de R$ ${valor} realizado`;
        }
        return "Senha incorreta";
    }
    
    sacar(valor, senha) {
        if (senha !== this.#senha) {
            return "Senha incorreta";
        }
        if (valor > this.#saldo) {
            return "Saldo insuficiente";
        }
        this.#saldo -= valor;
        return `Saque de R$ ${valor} realizado`;
    }
    
    getSaldo(senha) {
        if (senha === this.#senha) {
            return this.#saldo;
        }
        return "Senha incorreta";
    }
}

const conta = new ContaBancaria("João", "1234");
console.log("Depósito:", conta.depositar(1000, "1234"));
console.log("Saldo:", conta.getSaldo("1234"));
// console.log(conta.#saldo); // Erro! Campo privado

// ============================================
// 6. Abstract Classes (simulação)
// ============================================
console.log("\n6. ABSTRACT CLASSES (simulação)");

class Forma {
    constructor(nome) {
        if (this.constructor === Forma) {
            throw new Error("Forma é uma classe abstrata e não pode ser instanciada");
        }
        this.nome = nome;
    }
    
    calcularArea() {
        throw new Error("Método calcularArea deve ser implementado");
    }
    
    calcularPerimetro() {
        throw new Error("Método calcularPerimetro deve ser implementado");
    }
}

class Retangulo extends Forma {
    constructor(largura, altura) {
        super("Retângulo");
        this.largura = largura;
        this.altura = altura;
    }
    
    calcularArea() {
        return this.largura * this.altura;
    }
    
    calcularPerimetro() {
        return 2 * (this.largura + this.altura);
    }
}

const retangulo = new Retangulo(5, 3);
console.log("Área:", retangulo.calcularArea());
console.log("Perímetro:", retangulo.calcularPerimetro());

// ============================================
// 7. Mixins
// ============================================
console.log("\n7. MIXINS");

// Função mixin
const Voar = {
    voar() {
        return `${this.nome} está voando`;
    }
};

const Nadar = {
    nadar() {
        return `${this.nome} está nadando`;
    }
};

class Pato {
    constructor(nome) {
        this.nome = nome;
    }
}

// Aplicar mixins
Object.assign(Pato.prototype, Voar, Nadar);

const pato = new Pato("Donald");
console.log("Mixin voar:", pato.voar());
console.log("Mixin nadar:", pato.nadar());

// ============================================
// 8. Getters e Setters Avançados
// ============================================
console.log("\n8. GETTERS E SETTERS AVANÇADOS");

class Temperatura {
    constructor(celsius) {
        this._celsius = celsius;
    }
    
    get celsius() {
        return this._celsius;
    }
    
    set celsius(valor) {
        this._celsius = valor;
    }
    
    get fahrenheit() {
        return (this._celsius * 9/5) + 32;
    }
    
    set fahrenheit(valor) {
        this._celsius = (valor - 32) * 5/9;
    }
    
    get kelvin() {
        return this._celsius + 273.15;
    }
}

const temp = new Temperatura(25);
console.log("Celsius:", temp.celsius);
console.log("Fahrenheit:", temp.fahrenheit);
temp.fahrenheit = 86;
console.log("Após set Fahrenheit:", temp.celsius);

// ============================================
// 9. Class Fields (Public e Private)
// ============================================
console.log("\n9. CLASS FIELDS");

class Produto {
    // Campo público
    categoria = "Geral";
    
    // Campo privado
    #preco = 0;
    
    constructor(nome, preco) {
        this.nome = nome;
        this.#preco = preco;
    }
    
    get preco() {
        return this.#preco;
    }
    
    aplicarDesconto(percentual) {
        this.#preco = this.#preco * (1 - percentual / 100);
    }
}

const produto = new Produto("Notebook", 5000);
console.log("Produto:", produto.nome, produto.categoria);
console.log("Preço:", produto.preco);
produto.aplicarDesconto(10);
console.log("Preço com desconto:", produto.preco);

// ============================================
// 10. Super Keyword
// ============================================
console.log("\n10. SUPER KEYWORD");

class Animal {
    constructor(nome) {
        this.nome = nome;
    }
    
    mover() {
        return `${this.nome} está se movendo`;
    }
}

class Peixe extends Animal {
    constructor(nome, tipoAgua) {
        super(nome); // Chama constructor da classe pai
        this.tipoAgua = tipoAgua;
    }
    
    mover() {
        return `${super.mover()} na água ${this.tipoAgua}`;
    }
}

const peixe = new Peixe("Nemo", "salgada");
console.log("Super:", peixe.mover());

// ============================================
// 11. instanceof e isPrototypeOf
// ============================================
console.log("\n11. INSTANCEOF");

console.log("carro instanceof Carro:", carro instanceof Carro);
console.log("carro instanceof Veiculo:", carro instanceof Veiculo);
console.log("carro instanceof Object:", carro instanceof Object);

// ============================================
// 12. Class com Symbol
// ============================================
console.log("\n12. CLASS COM SYMBOL");

const METODO_PRIVADO = Symbol('metodoPrivado');

class Exemplo {
    [METODO_PRIVADO]() {
        return "Método privado usando Symbol";
    }
    
    metodoPublico() {
        return this[METODO_PRIVADO]();
    }
}

const exemplo = new Exemplo();
console.log("Symbol method:", exemplo.metodoPublico());

console.log("\n=== FIM JS CLASSES ===");
