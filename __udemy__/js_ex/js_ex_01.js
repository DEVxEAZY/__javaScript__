function showHigher(a , b) {

    const x = Number(a) 
    const y = Number(b)

    if (typeof a !== 'number' || typeof b !== 'number' || Number.isNaN(a)|| Number.isNaN(b)){
        console.error("Erro: Ambos os argumentos devem ser válidos.");
    }
    
    if(x > y) {
        console.log(`O número maior número é o ${a}`)
    } else if (x > y) {
        console.log(`O número maior é o ${b}`)
    } else 
        console.log("Os número são iguais.")

}