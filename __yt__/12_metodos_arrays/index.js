const lista1 = ["banana", "maçã", "uva", "laranja"];
const lista2 = ["carro","moto","bicicleta","patinete"];



//document.getElementById('container_id').innerHTML = lista1_join + '<br>' + lista2_join;

// metodo pop -> remove o último elemento do array
const lista1_pop = lista1.pop();
const lista2_pop = lista2.pop();

//document.getElementById('container_id').innerHTML = lista1_pop + '<br>' + lista2_pop;

// metodo push -> adiciona um elemento ao final do array
const lista1_push = lista1.push('abacaxi');
const lista2_push = lista2.push('trator');


const lista_splice = lista1.splice(0, 2,'banana nova','maça nova');

// metodo join -> insere um separador entre os elementos do array
const lista1_join = lista1.join(' || ');
const lista2_join = lista2.join(' || ');


document.getElementById('container_id').innerHTML = lista1_join + '<br>' + '<br>' + lista2_join + '<br>' + '<br>' + '<br>' + '<br>';

const lista_concat = lista1.concat(lista2);
document.getElementById('container_concat').innerHTML = lista_concat;
//document.getElementById('container_id').innerHTML = lista1_push + '<br>' + lista2_push;