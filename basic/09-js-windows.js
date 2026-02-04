/**
 * JS WINDOWS - Window API
 * Este arquivo demonstra a API Window do navegador
 * Nota: Execute em ambiente de navegador
 */

console.log("=== JS WINDOWS - Window API ===\n");

// ============================================
// 1. Window Object
// ============================================
console.log("1. WINDOW OBJECT");

// window é o objeto global no navegador
// No Node.js, global é o objeto global

console.log("window === this:", typeof window !== 'undefined' ? window === this : "N/A (Node.js)");

// ============================================
// 2. Window Properties
// ============================================
console.log("\n2. WINDOW PROPERTIES");

const windowProps = {
    innerWidth: "Largura da janela",
    innerHeight: "Altura da janela",
    outerWidth: "Largura total (com barras)",
    outerHeight: "Altura total",
    screenX: "Posição X",
    screenY: "Posição Y",
    location: "Objeto Location",
    history: "Objeto History",
    document: "Objeto Document",
    navigator: "Objeto Navigator"
};

console.log("Propriedades do window:", windowProps);

// ============================================
// 3. Window Methods - Alert, Confirm, Prompt
// ============================================
console.log("\n3. ALERT, CONFIRM, PROMPT");

// window.alert() - Alerta
// window.alert("Mensagem");

// window.confirm() - Confirmação
// const confirmado = window.confirm("Deseja continuar?");
// console.log("Confirmado:", confirmado);

// window.prompt() - Entrada de texto
// const nome = window.prompt("Digite seu nome:");
// console.log("Nome:", nome);

console.log("Métodos de diálogo disponíveis");

// ============================================
// 4. Window.open() e Window.close()
// ============================================
console.log("\n4. WINDOW.OPEN() E WINDOW.CLOSE()");

function exemploOpen() {
    return `
        // Abrir nova janela
        const novaJanela = window.open(
            'https://example.com',
            'nomeJanela',
            'width=800,height=600'
        );
        
        // Fechar janela
        novaJanela.close();
    `;
}

console.log("window.open():", exemploOpen());

// ============================================
// 5. Window.resizeTo() e Window.moveTo()
// ============================================
console.log("\n5. REDIMENSIONAR E MOVER JANELA");

function exemploResize() {
    return `
        // Redimensionar
        window.resizeTo(800, 600);
        
        // Mover
        window.moveTo(100, 100);
        
        // Mover relativo
        window.moveBy(50, 50);
    `;
}

console.log("Resize e move:", exemploResize());

// ============================================
// 6. Window.scrollTo() e Window.scrollBy()
// ============================================
console.log("\n6. SCROLL");

function exemploScroll() {
    return `
        // Scroll para posição
        window.scrollTo(0, 500);
        window.scrollTo({ top: 500, behavior: 'smooth' });
        
        // Scroll relativo
        window.scrollBy(0, 100);
        
        // Scroll para elemento
        elemento.scrollIntoView({ behavior: 'smooth' });
    `;
}

console.log("Scroll methods:", exemploScroll());

// ============================================
// 7. Window.location
// ============================================
console.log("\n7. WINDOW.LOCATION");

const locationProps = {
    href: "URL completa",
    protocol: "Protocolo (http/https)",
    host: "Host + porta",
    hostname: "Apenas host",
    port: "Porta",
    pathname: "Caminho",
    search: "Query string",
    hash: "Hash (#)",
    origin: "Origem (protocol + host)"
};

console.log("Location properties:", locationProps);

// Exemplo de uso:
// window.location.href = 'https://example.com'; // Navegar
// window.location.reload(); // Recarregar
// window.location.replace('https://example.com'); // Substituir (sem histórico)

// ============================================
// 8. Window.history
// ============================================
console.log("\n8. WINDOW.HISTORY");

const historyMethods = {
    back: "Voltar uma página",
    forward: "Avançar uma página",
    go: "Ir para posição específica",
    pushState: "Adicionar ao histórico (SPA)",
    replaceState: "Substituir no histórico",
    length: "Número de entradas"
};

console.log("History methods:", historyMethods);

// Exemplo:
// window.history.back();
// window.history.forward();
// window.history.go(-2); // Voltar 2 páginas
// window.history.pushState({}, '', '/nova-rota');

// ============================================
// 9. Window.navigator
// ============================================
console.log("\n9. WINDOW.NAVIGATOR");

const navigatorProps = {
    userAgent: "User agent string",
    platform: "Plataforma",
    language: "Idioma",
    cookieEnabled: "Cookies habilitados",
    onLine: "Status de conexão",
    geolocation: "API de geolocalização"
};

console.log("Navigator properties:", navigatorProps);

// ============================================
// 10. Window.screen
// ============================================
console.log("\n10. WINDOW.SCREEN");

const screenProps = {
    width: "Largura da tela",
    height: "Altura da tela",
    availWidth: "Largura disponível",
    availHeight: "Altura disponível",
    colorDepth: "Profundidade de cor",
    pixelDepth: "Profundidade de pixel"
};

console.log("Screen properties:", screenProps);

// ============================================
// 11. Window.localStorage e sessionStorage
// ============================================
console.log("\n11. STORAGE");

// localStorage - Persiste entre sessões
function exemploLocalStorage() {
    return `
        // Salvar
        localStorage.setItem('chave', 'valor');
        
        // Ler
        const valor = localStorage.getItem('chave');
        
        // Remover
        localStorage.removeItem('chave');
        
        // Limpar tudo
        localStorage.clear();
        
        // Tamanho
        const tamanho = localStorage.length;
    `;
}

// sessionStorage - Apenas na sessão atual
function exemploSessionStorage() {
    return `
        // Mesma API do localStorage
        sessionStorage.setItem('chave', 'valor');
        const valor = sessionStorage.getItem('chave');
    `;
}

console.log("localStorage:", exemploLocalStorage());
console.log("sessionStorage:", exemploSessionStorage());

// ============================================
// 12. Window.setTimeout e setInterval
// ============================================
console.log("\n12. TIMERS");

// setTimeout - Executar após delay
const timeoutId = setTimeout(() => {
    console.log("Timeout executado");
}, 1000);

// clearTimeout - Cancelar
// clearTimeout(timeoutId);

// setInterval - Executar repetidamente
const intervalId = setInterval(() => {
    console.log("Interval executado");
}, 2000);

// clearInterval - Cancelar
// clearInterval(intervalId);

console.log("Timers configurados");

// ============================================
// 13. Window.requestAnimationFrame
// ============================================
console.log("\n13. REQUESTANIMATIONFRAME");

// Otimizado para animações
function exemploAnimationFrame() {
    return `
        function animar() {
            // Código de animação
            requestAnimationFrame(animar);
        }
        
        requestAnimationFrame(animar);
    `;
}

console.log("requestAnimationFrame:", exemploAnimationFrame());

// ============================================
// 14. Window Events
// ============================================
console.log("\n14. WINDOW EVENTS");

const windowEvents = {
    load: "Página carregada",
    DOMContentLoaded: "DOM carregado",
    resize: "Janela redimensionada",
    scroll: "Página rolada",
    beforeunload: "Antes de sair",
    unload: "Ao sair",
    focus: "Janela ganhou foco",
    blur: "Janela perdeu foco"
};

console.log("Window events:", windowEvents);

// Exemplo:
// window.addEventListener('resize', () => {
//     console.log('Janela redimensionada');
// });

// ============================================
// 15. Window.matchMedia
// ============================================
console.log("\n15. MATCHMEDIA");

// Media queries em JavaScript
function exemploMatchMedia() {
    return `
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        
        function handleChange(e) {
            if (e.matches) {
                console.log('Mobile');
            } else {
                console.log('Desktop');
            }
        }
        
        mediaQuery.addEventListener('change', handleChange);
        handleChange(mediaQuery);
    `;
}

console.log("matchMedia:", exemploMatchMedia());

// ============================================
// 16. Window.postMessage
// ============================================
console.log("\n16. POSTMESSAGE");

// Comunicação entre janelas/origins
function exemploPostMessage() {
    return `
        // Enviar mensagem
        window.postMessage('dados', 'https://example.com');
        
        // Receber mensagem
        window.addEventListener('message', (event) => {
            if (event.origin === 'https://example.com') {
                console.log('Mensagem recebida:', event.data);
            }
        });
    `;
}

console.log("postMessage:", exemploPostMessage());

// ============================================
// 17. Window.getComputedStyle
// ============================================
console.log("\n17. GETCOMPUTEDSTYLE");

// Obter estilos computados
function exemploComputedStyle() {
    return `
        const estilos = window.getComputedStyle(elemento);
        const cor = estilos.color;
        const largura = estilos.width;
    `;
}

console.log("getComputedStyle:", exemploComputedStyle());

// ============================================
// 18. Window.btoa e atob
// ============================================
console.log("\n18. BASE64");

// Base64 encoding/decoding
const texto = "Hello World";
// const encoded = window.btoa(texto);
// const decoded = window.atob(encoded);

console.log("btoa/atob disponíveis para Base64");

// ============================================
// 19. Window.console
// ============================================
console.log("\n19. CONSOLE");

const consoleMethods = {
    log: "Log normal",
    error: "Log de erro",
    warn: "Log de aviso",
    info: "Log de informação",
    debug: "Log de debug",
    table: "Tabela",
    group: "Agrupar logs",
    time: "Medir tempo",
    assert: "Asserção"
};

console.log("Console methods:", consoleMethods);

// ============================================
// 20. Exemplo Completo
// ============================================
console.log("\n20. EXEMPLO COMPLETO");

class WindowHelper {
    static redimensionarParaMobile() {
        if (window.innerWidth > 768) {
            window.resizeTo(375, 667);
        }
    }
    
    static salvarEstado(chave, valor) {
        try {
            localStorage.setItem(chave, JSON.stringify(valor));
        } catch (e) {
            console.error("Erro ao salvar:", e);
        }
    }
    
    static carregarEstado(chave) {
        try {
            const item = localStorage.getItem(chave);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error("Erro ao carregar:", e);
            return null;
        }
    }
    
    static detectarDispositivo() {
        return {
            mobile: window.innerWidth < 768,
            tablet: window.innerWidth >= 768 && window.innerWidth < 1024,
            desktop: window.innerWidth >= 1024,
            online: navigator.onLine
        };
    }
}

console.log("WindowHelper criado");

console.log("\n=== FIM JS WINDOWS ===");
console.log("\nNota: Execute em ambiente de navegador para funcionalidade completa");
