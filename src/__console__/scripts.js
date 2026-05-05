const grid_container = document.querySelector('.container');
const grid = Array.from({ length: 10 }, () => Array(10).fill(0));

for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 10; j++) {
    const cell = document.createElement('div');
    cell.id = `cell-${i}-${j}`;
    cell.className = 'box';
    // cell.textContent = `${i},${j}`;
    grid_container.appendChild(cell);
  }
}

function initialSize(number) {
    for (let i = 0; i < number; i++) {
        document.getElementById(`cell-0-${i}`).style.backgroundColor = 'green';
    }
}


const Intial = initialSize(3); 
  





