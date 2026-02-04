/**
 * JS DOM NAVIGATION - Navegação no DOM
 * Este arquivo demonstra manipulação e navegação do DOM
 * Nota: Execute em ambiente com DOM (navegador)
 */

console.log("=== JS DOM NAVIGATION - Navegação no DOM ===\n");

// ============================================
// 1. Seletores de Elementos
// ============================================
console.log("1. SELETORES DE ELEMENTOS");

// getElementById
// const elemento = document.getElementById('meuId');

// getElementsByClassName
// const elementos = document.getElementsByClassName('minhaClasse');

// getElementsByTagName
// const divs = document.getElementsByTagName('div');

// querySelector (primeiro elemento)
// const elemento = document.querySelector('.classe');

// querySelectorAll (todos os elementos)
// const elementos = document.querySelectorAll('.classe');

console.log("Seletores disponíveis no DOM");

// ============================================
// 2. Navegação entre Elementos
// ============================================
console.log("\n2. NAVEGAÇÃO ENTRE ELEMENTOS");

// Simulação de estrutura DOM
const estruturaDOM = {
    parentNode: "elemento pai",
    childNodes: ["filho1", "filho2"],
    firstChild: "primeiro filho",
    lastChild: "último filho",
    nextSibling: "próximo irmão",
    previousSibling: "irmão anterior"
};

console.log("Propriedades de navegação:", estruturaDOM);

// Exemplo real (comentado para não quebrar em Node.js):
/*
const elemento = document.querySelector('.exemplo');
console.log("Parent:", elemento.parentNode);
console.log("Children:", elemento.children);
console.log("First child:", elemento.firstElementChild);
console.log("Last child:", elemento.lastElementChild);
console.log("Next sibling:", elemento.nextElementSibling);
console.log("Previous sibling:", elemento.previousElementSibling);
*/

// ============================================
// 3. Manipulação de Conteúdo
// ============================================
console.log("\n3. MANIPULAÇÃO DE CONTEÚDO");

// innerHTML - HTML
// elemento.innerHTML = '<strong>Texto</strong>';

// textContent - Texto puro
// elemento.textContent = 'Texto simples';

// innerText - Texto visível (considera CSS)

// Exemplo de função
function manipularConteudo() {
    return {
        innerHTML: "Permite HTML",
        textContent: "Apenas texto",
        innerText: "Texto visível"
    };
}

console.log("Métodos de conteúdo:", manipularConteudo());

// ============================================
// 4. Manipulação de Atributos
// ============================================
console.log("\n4. MANIPULAÇÃO DE ATRIBUTOS");

// getAttribute
// const valor = elemento.getAttribute('data-id');

// setAttribute
// elemento.setAttribute('data-id', '123');

// removeAttribute
// elemento.removeAttribute('data-id');

// hasAttribute
// const tem = elemento.hasAttribute('data-id');

// dataset (para data-*)
// elemento.dataset.id = '123';
// const id = elemento.dataset.id;

console.log("Métodos de atributos disponíveis");

// ============================================
// 5. Manipulação de Classes
// ============================================
console.log("\n5. MANIPULAÇÃO DE CLASSES");

// classList API
const classes = {
    add: "adiciona classe",
    remove: "remove classe",
    toggle: "alterna classe",
    contains: "verifica se tem classe",
    replace: "substitui classe"
};

console.log("classList métodos:", classes);

// Exemplo:
// elemento.classList.add('ativo');
// elemento.classList.remove('inativo');
// elemento.classList.toggle('visivel');
// const tem = elemento.classList.contains('ativo');

// ============================================
// 6. Manipulação de Estilos
// ============================================
console.log("\n6. MANIPULAÇÃO DE ESTILOS");

// style property
// elemento.style.color = 'red';
// elemento.style.backgroundColor = 'blue';
// elemento.style.display = 'none';

// getComputedStyle
// const estilos = window.getComputedStyle(elemento);
// const cor = estilos.color;

console.log("Manipulação de estilos disponível");

// ============================================
// 7. Criar e Remover Elementos
// ============================================
console.log("\n7. CRIAR E REMOVER ELEMENTOS");

// createElement
// const novoElemento = document.createElement('div');

// createTextNode
// const texto = document.createTextNode('Texto');

// appendChild
// elemento.appendChild(novoElemento);

// insertBefore
// elemento.insertBefore(novoElemento, elementoReferencia);

// removeChild
// elemento.removeChild(filho);

// remove (método moderno)
// elemento.remove();

// cloneNode
// const clone = elemento.cloneNode(true); // deep clone

console.log("Métodos de criação/remoção disponíveis");

// ============================================
// 8. Event Listeners
// ============================================
console.log("\n8. EVENT LISTENERS");

// addEventListener
function exemploEventListener() {
    return {
        tipo: "click",
        handler: function(event) {
            console.log("Clique detectado");
        },
        options: {
            once: true,      // executa uma vez
            capture: true,  // fase de captura
            passive: true   // não chama preventDefault
        }
    };
}

console.log("addEventListener:", exemploEventListener());

// removeEventListener
// elemento.removeEventListener('click', handler);

// ============================================
// 9. Event Delegation
// ============================================
console.log("\n9. EVENT DELEGATION");

// Delegar eventos ao elemento pai
function exemploDelegation() {
    return `
        // Pai escuta eventos dos filhos
        pai.addEventListener('click', (e) => {
            if (e.target.matches('.botao')) {
                console.log('Botão clicado:', e.target);
            }
        });
    `;
}

console.log("Event delegation:", exemploDelegation());

// ============================================
// 10. Traversing (Percorrer DOM)
// ============================================
console.log("\n10. TRAVERSING");

function percorrerDOM(elemento) {
    const resultado = [];
    
    function traverse(el) {
        if (!el) return;
        resultado.push(el.tagName || el.nodeName);
        if (el.children) {
            for (let child of el.children) {
                traverse(child);
            }
        }
    }
    
    traverse(elemento);
    return resultado;
}

console.log("Função de traversing criada");

// ============================================
// 11. Document Fragment
// ============================================
console.log("\n11. DOCUMENT FRAGMENT");

// Fragment é mais eficiente para múltiplas inserções
function exemploFragment() {
    return `
        const fragment = document.createDocumentFragment();
        
        for (let i = 0; i < 100; i++) {
            const div = document.createElement('div');
            div.textContent = 'Item ' + i;
            fragment.appendChild(div);
        }
        
        // Uma única inserção no DOM
        container.appendChild(fragment);
    `;
}

console.log("Document Fragment:", exemploFragment());

// ============================================
// 12. MutationObserver
// ============================================
console.log("\n12. MUTATIONOBSERVER");

// Observar mudanças no DOM
function exemploObserver() {
    return `
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                console.log('DOM mudou:', mutation.type);
            });
        });
        
        observer.observe(elemento, {
            childList: true,
            attributes: true,
            subtree: true
        });
    `;
}

console.log("MutationObserver:", exemploObserver());

// ============================================
// 13. Performance - Reflow e Repaint
// ============================================
console.log("\n13. PERFORMANCE");

// Evitar múltiplos reflows
function exemploPerformance() {
    return {
        ruim: "Múltiplas mudanças de estilo causam múltiplos reflows",
        bom: "Agrupar mudanças ou usar requestAnimationFrame",
        dica: "Usar DocumentFragment para múltiplas inserções"
    };
}

console.log("Performance:", exemploPerformance());

// ============================================
// 14. Exemplo Completo
// ============================================
console.log("\n14. EXEMPLO COMPLETO");

class DOMHelper {
    static criarElemento(tag, atributos = {}, conteudo = '') {
        const elemento = document.createElement(tag);
        
        // Atributos
        Object.entries(atributos).forEach(([key, value]) => {
            if (key === 'class') {
                elemento.className = value;
            } else if (key.startsWith('data-')) {
                elemento.setAttribute(key, value);
            } else {
                elemento[key] = value;
            }
        });
        
        // Conteúdo
        if (conteudo) {
            elemento.textContent = conteudo;
        }
        
        return elemento;
    }
    
    static adicionarEvento(elemento, evento, handler) {
        elemento.addEventListener(evento, handler);
        return () => elemento.removeEventListener(evento, handler); // retorna função de remoção
    }
    
    static animar(elemento, propriedades, duracao = 300) {
        elemento.style.transition = `all ${duracao}ms`;
        Object.assign(elemento.style, propriedades);
    }
}

console.log("DOMHelper criado com métodos úteis");

console.log("\n=== FIM JS DOM NAVIGATION ===");
console.log("\nNota: Este código deve ser executado em ambiente com DOM (navegador)");
