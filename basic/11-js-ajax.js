/**
 * JS AJAX - Requisições HTTP
 * Este arquivo demonstra Fetch API e XMLHttpRequest
 */

console.log("=== JS AJAX - Requisições HTTP ===\n");

// ============================================
// 1. Fetch API - GET Request
// ============================================
console.log("1. FETCH API - GET");

async function exemploFetchGET() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Fetch GET:", data);
        return data;
    } catch (error) {
        console.error("Erro:", error);
    }
}

// Simulação (sem fazer requisição real)
console.log("Fetch GET configurado");

// ============================================
// 2. Fetch API - POST Request
// ============================================
console.log("\n2. FETCH API - POST");

async function exemploFetchPOST() {
    const dados = {
        title: 'Novo Post',
        body: 'Conteúdo do post',
        userId: 1
    };
    
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });
        
        const resultado = await response.json();
        console.log("Fetch POST:", resultado);
        return resultado;
    } catch (error) {
        console.error("Erro:", error);
    }
}

console.log("Fetch POST configurado");

// ============================================
// 3. Fetch API - PUT Request
// ============================================
console.log("\n3. FETCH API - PUT");

async function exemploFetchPUT() {
    const dados = {
        id: 1,
        title: 'Post Atualizado',
        body: 'Conteúdo atualizado',
        userId: 1
    };
    
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });
        
        const resultado = await response.json();
        console.log("Fetch PUT:", resultado);
        return resultado;
    } catch (error) {
        console.error("Erro:", error);
    }
}

console.log("Fetch PUT configurado");

// ============================================
// 4. Fetch API - DELETE Request
// ============================================
console.log("\n4. FETCH API - DELETE");

async function exemploFetchDELETE() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
            method: 'DELETE'
        });
        
        console.log("Status:", response.status);
        return response.ok;
    } catch (error) {
        console.error("Erro:", error);
    }
}

console.log("Fetch DELETE configurado");

// ============================================
// 5. Fetch API - Headers Customizados
// ============================================
console.log("\n5. FETCH API - HEADERS");

async function exemploFetchHeaders() {
    try {
        const response = await fetch('https://api.exemplo.com/dados', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer token123',
                'X-Custom-Header': 'valor-customizado'
            }
        });
        
        // Ler headers da resposta
        const contentType = response.headers.get('content-type');
        console.log("Content-Type:", contentType);
        
        return await response.json();
    } catch (error) {
        console.error("Erro:", error);
    }
}

console.log("Fetch com headers customizados");

// ============================================
// 6. Fetch API - Timeout
// ============================================
console.log("\n6. FETCH API - TIMEOUT");

function fetchComTimeout(url, options = {}, timeout = 5000) {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), timeout)
        )
    ]);
}

console.log("Fetch com timeout criado");

// ============================================
// 7. Fetch API - AbortController
// ============================================
console.log("\n7. FETCH API - ABORTCONTROLLER");

async function exemploAbortController() {
    const controller = new AbortController();
    const signal = controller.signal;
    
    // Cancelar após 3 segundos
    setTimeout(() => controller.abort(), 3000);
    
    try {
        const response = await fetch('https://api.exemplo.com/dados', {
            signal
        });
        return await response.json();
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log("Requisição cancelada");
        } else {
            console.error("Erro:", error);
        }
    }
}

console.log("AbortController configurado");

// ============================================
// 8. Fetch API - Upload de Arquivo
// ============================================
console.log("\n8. FETCH API - UPLOAD");

async function exemploUpload(arquivo) {
    const formData = new FormData();
    formData.append('arquivo', arquivo);
    formData.append('descricao', 'Meu arquivo');
    
    try {
        const response = await fetch('https://api.exemplo.com/upload', {
            method: 'POST',
            body: formData
            // Não definir Content-Type, o browser faz automaticamente
        });
        
        return await response.json();
    } catch (error) {
        console.error("Erro:", error);
    }
}

console.log("Upload configurado");

// ============================================
// 9. XMLHttpRequest - GET
// ============================================
console.log("\n9. XMLHTTPREQUEST - GET");

function exemploXHRGET() {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.open('GET', 'https://jsonplaceholder.typicode.com/posts/1', true);
        
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                const data = JSON.parse(xhr.responseText);
                resolve(data);
            } else {
                reject(new Error(`HTTP ${xhr.status}`));
            }
        };
        
        xhr.onerror = function() {
            reject(new Error('Erro de rede'));
        };
        
        xhr.send();
    });
}

console.log("XMLHttpRequest GET configurado");

// ============================================
// 10. XMLHttpRequest - POST
// ============================================
console.log("\n10. XMLHTTPREQUEST - POST");

function exemploXHRPOST(dados) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.open('POST', 'https://jsonplaceholder.typicode.com/posts', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(JSON.parse(xhr.responseText));
            } else {
                reject(new Error(`HTTP ${xhr.status}`));
            }
        };
        
        xhr.onerror = function() {
            reject(new Error('Erro de rede'));
        };
        
        xhr.send(JSON.stringify(dados));
    });
}

console.log("XMLHttpRequest POST configurado");

// ============================================
// 11. XMLHttpRequest - Progress
// ============================================
console.log("\n11. XMLHTTPREQUEST - PROGRESS");

function exemploXHRProgress() {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.open('GET', 'https://api.exemplo.com/arquivo-grande', true);
        
        // Progresso do download
        xhr.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
                const percentual = (e.loaded / e.total) * 100;
                console.log(`Progresso: ${percentual.toFixed(2)}%`);
            }
        });
        
        xhr.onload = function() {
            resolve(xhr.response);
        };
        
        xhr.onerror = function() {
            reject(new Error('Erro'));
        };
        
        xhr.send();
    });
}

console.log("XMLHttpRequest com progresso");

// ============================================
// 12. Axios (Biblioteca Popular)
// ============================================
console.log("\n12. AXIOS (conceito)");

function exemploAxios() {
    return `
        // Instalar: npm install axios
        
        import axios from 'axios';
        
        // GET
        const response = await axios.get('/api/dados');
        
        // POST
        await axios.post('/api/dados', { nome: 'João' });
        
        // Configuração global
        axios.defaults.baseURL = 'https://api.exemplo.com';
        axios.defaults.headers.common['Authorization'] = 'Bearer token';
        
        // Interceptors
        axios.interceptors.request.use(config => {
            console.log('Requisição:', config);
            return config;
        });
    `;
}

console.log("Axios:", exemploAxios());

// ============================================
// 13. Helper Class - HTTP Client
// ============================================
console.log("\n13. HELPER CLASS");

class HTTPClient {
    constructor(baseURL = '', headers = {}) {
        this.baseURL = baseURL;
        this.headers = headers;
    }
    
    async get(endpoint, options = {}) {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'GET',
            headers: { ...this.headers, ...options.headers }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        return await response.json();
    }
    
    async post(endpoint, data, options = {}) {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...this.headers,
                ...options.headers
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        return await response.json();
    }
    
    async put(endpoint, data, options = {}) {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...this.headers,
                ...options.headers
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        return await response.json();
    }
    
    async delete(endpoint, options = {}) {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'DELETE',
            headers: { ...this.headers, ...options.headers }
        });
        
        return response.ok;
    }
}

const api = new HTTPClient('https://jsonplaceholder.typicode.com');
console.log("HTTPClient criado");

// ============================================
// 14. Retry Pattern para Requisições
// ============================================
console.log("\n14. RETRY PATTERN");

async function fetchComRetry(url, options = {}, tentativas = 3) {
    for (let i = 0; i < tentativas; i++) {
        try {
            const response = await fetch(url, options);
            if (response.ok) {
                return await response.json();
            }
            throw new Error(`HTTP ${response.status}`);
        } catch (error) {
            if (i === tentativas - 1) throw error;
            console.log(`Tentativa ${i + 1} falhou, tentando novamente...`);
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
    }
}

console.log("Fetch com retry criado");

// ============================================
// 15. CORS e Preflight
// ============================================
console.log("\n15. CORS E PREFLIGHT");

function exemploCORS() {
    return `
        // Requisições CORS precisam de headers apropriados no servidor:
        // Access-Control-Allow-Origin: *
        // Access-Control-Allow-Methods: GET, POST, PUT, DELETE
        // Access-Control-Allow-Headers: Content-Type
        
        // Preflight (OPTIONS) é automático para métodos não-simples
        const response = await fetch('https://api.exemplo.com/dados', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Custom-Header': 'valor'
            },
            body: JSON.stringify({ dados: 'valor' })
        });
    `;
}

console.log("CORS:", exemploCORS());

// ============================================
// 16. Exemplo Completo - API Wrapper
// ============================================
console.log("\n16. EXEMPLO COMPLETO");

class APIClient {
    constructor(baseURL) {
        this.baseURL = baseURL;
        this.token = null;
    }
    
    setToken(token) {
        this.token = token;
    }
    
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
                ...options.headers
            }
        };
        
        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }
            
            return await response.text();
        } catch (error) {
            console.error('Erro na requisição:', error);
            throw error;
        }
    }
    
    get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }
    
    post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    
    put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
    
    delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
}

const client = new APIClient('https://jsonplaceholder.typicode.com');
console.log("APIClient completo criado");

console.log("\n=== FIM JS AJAX ===");
