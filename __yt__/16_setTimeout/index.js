// Selecionando os elementos do DOM
const displayCounter = document.getElementById("show-counter");
const statusMessage = document.getElementById("status-message");
const inputTimer = document.getElementById("input-timer");

let intervalId = null;
let timeoutId = null;
let counter = 0;

/**
 * ATUALIZA O STATUS NA INTERFACE (Minimalista)
 */
function updateStatus(msg) {
    statusMessage.innerText = msg.toUpperCase();
}

/**
 * EXEMPLO DE setInterval
 */
function startInterval() {
    if (intervalId !== null) return;

    updateStatus("Running");
    
    intervalId = setInterval(() => {
        counter++;
        displayCounter.innerText = counter;
    }, 1000);
}

/**
 * PARANDO O setInterval
 */
function stopInterval() {
    if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
        updateStatus("Stopped");
    }
}

/**
 * EXEMPLO DE setTimeout
 */
function startTimeout() {
    const seconds = parseInt(inputTimer.value);

    if (isNaN(seconds) || seconds <= 0) {
        updateStatus("Error: Set Sec");
        return;
    }

    if (timeoutId !== null) {
        clearTimeout(timeoutId);
    }

    updateStatus(`Wait ${seconds}s`);

    timeoutId = setTimeout(() => {
        updateStatus("Timeout Done");
        alert(`Time's up: ${seconds}s`);
        timeoutId = null;
    }, seconds * 1000);
}

/**
 * PARANDO O setTimeout
 */
function clearMyTimeout() {
    if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
        updateStatus("Cancelled");
    }
}
