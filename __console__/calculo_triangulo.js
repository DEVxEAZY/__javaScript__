import * as readline from 'node:readline/promises';
import {stdin as input, stdout as output} from 'node:process';
import { notStrictEqual } from 'node:assert';



// hipotenusa

const rl = readline.createInterface({input, output})

const ladoA = Number(await rl.question("coloque o  lado A: "))
const ladoB = Number(await rl.question("coloque o laod B: "))

function pitagoras(ladoA,ladoB) {
    const C = Math.sqrt(Number((ladoA**2) + (ladoB**2)));
    return C
}

const hipoteusa = pitagoras(ladoA,ladoB)

console.log(`A hipoteusa do triangulo é: ${hipoteusa}`)





// rl.question("")