/**
 * JS ASYNCHRONOUS - Programação Assíncrona
 * Este arquivo demonstra Promises, async/await, callbacks e mais
 */

console.log("=== JS ASYNCHRONOUS - Programação Assíncrona ===\n");

// ============================================
// 1. Callbacks
// ============================================
console.log("1. CALLBACKS");

function processarDados(dados, callback) {
    setTimeout(() => {
        const resultado = dados.toUpperCase();
        callback(null, resultado);
    }, 100);
}

processarDados("hello", (erro, resultado) => {
    if (erro) {
        console.error("Erro:", erro);
    } else {
        console.log("Callback:", resultado);
    }
});

// Callback Hell (problema)
function passo1(callback) {
    setTimeout(() => callback("Passo 1"), 100);
}

function passo2(dados, callback) {
    setTimeout(() => callback(dados + " -> Passo 2"), 100);
}

function passo3(dados, callback) {
    setTimeout(() => callback(dados + " -> Passo 3"), 100);
}

// Callback Hell
passo1((resultado1) => {
    passo2(resultado1, (resultado2) => {
        passo3(resultado2, (resultado3) => {
            console.log("Callback Hell:", resultado3);
        });
    });
});

// ============================================
// 2. Promises
// ============================================
console.log("\n2. PROMISES");

// Criar Promise
const minhaPromise = new Promise((resolve, reject) => {
    const sucesso = true;
    
    setTimeout(() => {
        if (sucesso) {
            resolve("Operação bem-sucedida!");
        } else {
            reject("Operação falhou!");
        }
    }, 100);
});

// Usar Promise
minhaPromise
    .then(resultado => {
        console.log("Promise resolve:", resultado);
        return resultado + " (processado)";
    })
    .then(resultadoProcessado => {
        console.log("Promise chain:", resultadoProcessado);
    })
    .catch(erro => {
        console.error("Promise reject:", erro);
    })
    .finally(() => {
        console.log("Promise finally: sempre executa");
    });

// ============================================
// 3. Promise.all()
// ============================================
console.log("\n3. PROMISE.ALL()");

const promise1 = Promise.resolve(1);
const promise2 = Promise.resolve(2);
const promise3 = new Promise(resolve => setTimeout(() => resolve(3), 100));

Promise.all([promise1, promise2, promise3])
    .then(valores => {
        console.log("Promise.all:", valores); // [1, 2, 3]
    });

// Promise.all com erro (falha se qualquer uma falhar)
const promiseErro = Promise.reject("Erro!");
Promise.all([promise1, promiseErro])
    .catch(erro => {
        console.log("Promise.all erro:", erro);
    });

// ============================================
// 4. Promise.allSettled()
// ============================================
console.log("\n4. PROMISE.ALLSETTLED()");

Promise.allSettled([promise1, promiseErro, promise2])
    .then(resultados => {
        console.log("Promise.allSettled:", resultados);
        // Retorna todos os resultados, mesmo com erros
    });

// ============================================
// 5. Promise.race()
// ============================================
console.log("\n5. PROMISE.RACE()");

const rapida = new Promise(resolve => setTimeout(() => resolve("Rápida"), 50));
const lenta = new Promise(resolve => setTimeout(() => resolve("Lenta"), 200));

Promise.race([rapida, lenta])
    .then(vencedora => {
        console.log("Promise.race:", vencedora); // "Rápida"
    });

// ============================================
// 6. Promise.any()
// ============================================
console.log("\n6. PROMISE.ANY()");

const falha1 = Promise.reject("Erro 1");
const falha2 = Promise.reject("Erro 2");
const sucesso = Promise.resolve("Sucesso!");

Promise.any([falha1, falha2, sucesso])
    .then(resultado => {
        console.log("Promise.any:", resultado); // "Sucesso!"
    });

// ============================================
// 7. Async/Await
// ============================================
console.log("\n7. ASYNC/AWAIT");

// Função assíncrona
async function buscarUsuario(id) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ id, nome: `Usuário ${id}` });
        }, 100);
    });
}

async function exemploAsync() {
    try {
        const usuario = await buscarUsuario(1);
        console.log("Async/Await:", usuario);
    } catch (erro) {
        console.error("Erro:", erro);
    }
}

exemploAsync();

// ============================================
// 8. Async/Await com múltiplas Promises
// ============================================
console.log("\n8. ASYNC/AWAIT MÚLTIPLAS PROMISES");

async function buscarMultiplosUsuarios() {
    // Sequencial (lento)
    const inicioSequencial = Date.now();
    const user1 = await buscarUsuario(1);
    const user2 = await buscarUsuario(2);
    const user3 = await buscarUsuario(3);
    const tempoSequencial = Date.now() - inicioSequencial;
    console.log("Sequencial:", tempoSequencial, "ms");
    
    // Paralelo (rápido)
    const inicioParalelo = Date.now();
    const [u1, u2, u3] = await Promise.all([
        buscarUsuario(1),
        buscarUsuario(2),
        buscarUsuario(3)
    ]);
    const tempoParalelo = Date.now() - inicioParalelo;
    console.log("Paralelo:", tempoParalelo, "ms");
}

buscarMultiplosUsuarios();

// ============================================
// 9. Async Generators
// ============================================
console.log("\n9. ASYNC GENERATORS");

async function* geradorAssincrono() {
    for (let i = 1; i <= 3; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        yield i;
    }
}

(async () => {
    for await (const valor of geradorAssincrono()) {
        console.log("Async Generator:", valor);
    }
})();

// ============================================
// 10. Fetch API (será detalhado em AJAX)
// ============================================
console.log("\n10. FETCH API (preview)");

// Simulação de fetch
async function simularFetch(url) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                ok: true,
                json: async () => ({ dados: "Resposta da API" })
            });
        }, 100);
    });
}

async function exemploFetch() {
    try {
        const response = await simularFetch("https://api.exemplo.com/dados");
        const dados = await response.json();
        console.log("Fetch:", dados);
    } catch (erro) {
        console.error("Erro fetch:", erro);
    }
}

exemploFetch();

// ============================================
// 11. Tratamento de Erros
// ============================================
console.log("\n11. TRATAMENTO DE ERROS");

async function operacaoComErro() {
    try {
        throw new Error("Algo deu errado!");
    } catch (erro) {
        console.log("Erro capturado:", erro.message);
        throw erro; // Re-throw
    }
}

operacaoComErro().catch(erro => {
    console.log("Erro no catch externo:", erro.message);
});

// ============================================
// 12. Promise com Timeout
// ============================================
console.log("\n12. PROMISE COM TIMEOUT");

function promiseComTimeout(promise, timeout) {
    return Promise.race([
        promise,
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout!")), timeout)
        )
    ]);
}

const promiseLenta = new Promise(resolve => 
    setTimeout(() => resolve("Sucesso"), 1000)
);

promiseComTimeout(promiseLenta, 500)
    .then(resultado => console.log("Resultado:", resultado))
    .catch(erro => console.log("Timeout:", erro.message));

// ============================================
// 13. Retry Pattern
// ============================================
console.log("\n13. RETRY PATTERN");

async function tentarComRetry(fn, tentativas = 3) {
    for (let i = 0; i < tentativas; i++) {
        try {
            return await fn();
        } catch (erro) {
            if (i === tentativas - 1) throw erro;
            console.log(`Tentativa ${i + 1} falhou, tentando novamente...`);
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
}

const operacaoInstavel = () => {
    return new Promise((resolve, reject) => {
        const sucesso = Math.random() > 0.5;
        setTimeout(() => {
            sucesso ? resolve("Sucesso!") : reject("Falhou!");
        }, 100);
    });
};

tentarComRetry(operacaoInstavel, 3)
    .then(resultado => console.log("Retry sucesso:", resultado))
    .catch(erro => console.log("Retry falhou:", erro));

// ============================================
// 14. Queue de Promises
// ============================================
console.log("\n14. QUEUE DE PROMISES");

class PromiseQueue {
    constructor(concorrencia = 1) {
        this.concorrencia = concorrencia;
        this.running = 0;
        this.queue = [];
    }
    
    async add(promiseFn) {
        return new Promise((resolve, reject) => {
            this.queue.push({
                promiseFn,
                resolve,
                reject
            });
            this.process();
        });
    }
    
    async process() {
        if (this.running >= this.concorrencia || this.queue.length === 0) {
            return;
        }
        
        this.running++;
        const { promiseFn, resolve, reject } = this.queue.shift();
        
        try {
            const resultado = await promiseFn();
            resolve(resultado);
        } catch (erro) {
            reject(erro);
        } finally {
            this.running--;
            this.process();
        }
    }
}

const queue = new PromiseQueue(2); // Máximo 2 concorrentes

for (let i = 1; i <= 5; i++) {
    queue.add(async () => {
        console.log(`Processando ${i}...`);
        await new Promise(resolve => setTimeout(resolve, 200));
        return `Concluído ${i}`;
    }).then(resultado => console.log("Queue:", resultado));
}

console.log("\n=== FIM JS ASYNCHRONOUS ===");
