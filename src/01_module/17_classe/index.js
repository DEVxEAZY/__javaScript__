/**
 * @class Car
 * Representação minimalista de um sistema de veículos
 */
class Car {
    constructor(marca, modelo, ano) {
        this.marca = marca;
        this.modelo = modelo;
        this.ano = ano;
        this.ligado = false;
    }

    buzina(info_add = "") {
        return `[ALERT] A buzina do ${this.marca.toUpperCase()} ${this.modelo.toUpperCase()} está ligada! ${info_add}`;
    }

    ligar() {
        if (this.ligado) {
            return `[STATE] O ${this.modelo} já se encontra LIGADO.`;
        }
        this.ligado = true;
        return `[ACTION] Ignigção: O ${this.modelo} foi LIGADO com sucesso.`;
    }

    desligar() {
        if (!this.ligado) {
            return `[STATE] O ${this.modelo} já se encontra DESLIGADO.`;
        }
        this.ligado = false;
        return `[ACTION] O ${this.modelo} foi DESLIGADO.`;
    }

    getDados() {
        return `[DATA] Marca: ${this.marca} | Modelo: ${this.modelo} | Ano: ${this.ano} | Status: ${this.ligado ? "LIGADO" : "DESLIGADO"}`;
    }

    atualizarAno(novoAno) {
        const anoAtual = new Date().getFullYear();
        if (novoAno > 1900 && novoAno <= anoAtual + 1) {
            this.ano = novoAno;
            return `[UPDATE] Registro atualizado: Novo ano definido para ${this.ano}.`;
        }
        return "[ERROR] Falha na atualização: Ano informado é inválido.";
    }
}

// Inicialização de Instâncias
const uno = new Car("Fiat", "Uno", 2004);
const ferrari = new Car("Ferrari", "F8 Tributo", 2023);

/**
 * Função para renderização minimalista no DOM
 */
function logToPage(message) {
    console.log(message);
    const output = document.getElementById('output');
    
    if (output) {
        if (message === "DIVIDER") {
            const div = document.createElement('div');
            div.className = 'divider';
            output.appendChild(div);
            return;
        }

        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.textContent = `> ${message}`;
        output.appendChild(entry);
    }
}

// Execução da Simulação
logToPage(uno.getDados());
logToPage(uno.ligar());
logToPage(uno.buzina("Remova a escada do teto!"));
logToPage(uno.getDados());

logToPage("DIVIDER");

logToPage(ferrari.getDados());
logToPage(ferrari.buzina());
logToPage(ferrari.atualizarAno(2025));
logToPage(ferrari.getDados());
logToPage(ferrari.desligar());
