let car = {
    marca: "ford",
    nome: "XYVZ",
    ano: 2014,
    buzina: function() {
        alert(`Olha a buzina do carro ${this.marca}`);
    }
}

car.buzina();