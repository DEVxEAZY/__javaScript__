async function sleep(segundo) {
    // 1. Criamos o "dispositivo" (Promise)
    return new Promise((resolve) => { 
        
        // 2. Iniciamos o trabalho demorado (Cozinha)
        setTimeout(() => {
            
            // 3. O tempo acabou! Apertamos o botão de "OK"
            resolve(); 
            
        }, segundo * 1000);
        
    });
}

/*

function startButton() {
    for(let i = 0; i < 10;i++){
        sleep(1)
        document.getElementById("timer-display").innerHTML = `0${10-i}`
    }
}
    
*/

const statusDisplay = document.getElementById("status-timer")

let contador = 0
let segundo = 0

async function startButton() {
    let contador = 0 
    statusDisplay.textContent = "em andamento..."
    for(contador; contador < 11; contador+=1){
        await sleep(1);
        segundo = String(contador).padStart(2, '0')
        document.getElementById("time").innerHTML = `00:00:${segundo}`
    
    }
    if (contador === 11) {
        statusDisplay.textContent = "o tempo acabou!!!"
    }


}


function stopTimer(){
    segundo = String(contador).padStart(2, '0')
    document.getElementById("time").innerHTML = `00:00:${segundo}`
    statusDisplay.innerHTML = "pausa"
}

console.log();
