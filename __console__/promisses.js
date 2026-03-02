import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

/**
 * 1. FUNÇÃO DE ENTRADA (Input)
 */
async function obterDadosDoUsuario() {
    const nome = await rl.question('Digite seu nome: ');
    return { nome };
}

let animation = false;
let animationPromise = null;

async function blinkCursor(character) {
    let visible = false;
    process.stdout.write(character);
    visible = true;
    while (animation) {
        await new Promise(resolve => setTimeout(resolve, 100));
        if (!animation) break;
        process.stdout.write(`\b \b`);
        visible = false;
        await new Promise(resolve => setTimeout(resolve, 100));
        if (!animation) break;
        process.stdout.write(character);
        visible = true;
    }
    if (visible) {
        process.stdout.write(`\b \b`);
    }
}

function startAnimation(character) {
    animation = true;
    animationPromise = blinkCursor(character);
}

async function stopAnimation() {
    animation = false;
    if (animationPromise) {
        await animationPromise;
        animationPromise = null;
    }
}

async function writeLetter(letter) {
    process.stdout.write(letter);
    await new Promise(resolve => setTimeout(resolve, 100));
}

/**
 * 2. FUNÇÃO DE LÓGICA (Processamento)
 */
async function processarUsuario(usuario) {
    console.log('\n--- Relatório do Usuário (ES Modules) ---\n\n');
    console.log(`Nome: ${usuario.nome}`);
    const nameArray = usuario.nome.trim().split(/\s+/);
    console.log(nameArray);
    startAnimation("*");
    await new Promise(resolve => setTimeout(resolve, 3000));
    for (let j = 0; j < nameArray.length; j++) {
        if (j > 0) {
            await stopAnimation();
            await writeLetter(` `);
        }
        const parcialName = nameArray[j];
        for (let i = 0; i < parcialName.length; i++) {
            await stopAnimation();
            await writeLetter(parcialName[i]);
            startAnimation('*');
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    await stopAnimation();
}

/**
 * 3. FLUXO PRINCIPAL
 */
async function main() {
    try {
        const dados = await obterDadosDoUsuario();
        await processarUsuario(dados);
        console.log('\nO programa terminou com sucesso.');
    } catch (err) {
        console.error('Ocorreu um erro:', err);
    } finally {
        rl.close();
    }
}

main();