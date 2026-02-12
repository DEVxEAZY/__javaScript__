
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  

//const displayTime = document.getElementById('timer-display');

const hour = 0 
const minute = 0
const second = 0

const textDisplayTimer = `${hour}:${minute}:${second}`

// timer 10 s 

function startTimer(segundos) {
    
    const segundos_timer = 1000 * segundos;

    const counting = async () => {
        for(let i = 0; i < 10; i++){
            
            let second = i
            await sleep(segundos_timer)
            //displayTime.innerHTML = `${second}`         
            console.log(second)
        }
    }
    return counting

};


startTimer(10);