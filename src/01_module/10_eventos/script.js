
let state = 0

function EventoClick() {
    //alert('Acionou um evento de clique');
    if(state == 0){
        document.body.style.backgroundColor = "yellow";
        state +=1}
    else if (state ==1 ){
        document.body.style.backgroundColor = "black";
        state -=1
    }

}


function EventoChange() {
    console.log('Acionou um evento de change');
}