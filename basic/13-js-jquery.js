/**
 * JS JQUERY - jQuery Library
 * Este arquivo demonstra conceitos básicos do jQuery
 * Nota: jQuery precisa ser incluído via CDN ou npm
 */

console.log("=== JS JQUERY - jQuery Library ===\n");

// ============================================
// 1. Seletores jQuery
// ============================================
console.log("1. SELETORES JQUERY");

const seletores = {
    id: "$('#meuId')",
    classe: "$('.minhaClasse')",
    tag: "$('div')",
    multiplos: "$('div, .classe, #id')",
    atributo: "$('[data-id]')",
    filho: "$('ul > li')",
    descendente: "$('ul li')",
    primeiro: "$('li:first')",
    ultimo: "$('li:last')",
    par: "$('li:even')",
    impar: "$('li:odd')"
};

console.log("Seletores:", seletores);

// ============================================
// 2. Manipulação de DOM
// ============================================
console.log("\n2. MANIPULAÇÃO DE DOM");

function exemploManipulacao() {
    return `
        // Texto
        $('.elemento').text('Novo texto');
        const texto = $('.elemento').text();
        
        // HTML
        $('.elemento').html('<strong>HTML</strong>');
        const html = $('.elemento').html();
        
        // Atributos
        $('.elemento').attr('data-id', '123');
        const id = $('.elemento').attr('data-id');
        
        // Classes
        $('.elemento').addClass('ativo');
        $('.elemento').removeClass('inativo');
        $('.elemento').toggleClass('visivel');
        const tem = $('.elemento').hasClass('ativo');
        
        // CSS
        $('.elemento').css('color', 'red');
        $('.elemento').css({ color: 'red', fontSize: '16px' });
    `;
}

console.log("Manipulação:", exemploManipulacao());

// ============================================
// 3. Eventos jQuery
// ============================================
console.log("\n3. EVENTOS JQUERY");

function exemploEventos() {
    return `
        // Click
        $('.botao').click(function() {
            console.log('Clicado');
        });
        
        // On (mais flexível)
        $('.botao').on('click', function() {
            console.log('Clicado');
        });
        
        // Múltiplos eventos
        $('.elemento').on('click mouseenter', function() {
            console.log('Evento');
        });
        
        // Event delegation
        $(document).on('click', '.botao', function() {
            console.log('Delegado');
        });
        
        // Off (remover)
        $('.botao').off('click');
        
        // Trigger (disparar)
        $('.botao').trigger('click');
    `;
}

console.log("Eventos:", exemploEventos());

// ============================================
// 4. AJAX com jQuery
// ============================================
console.log("\n4. AJAX COM JQUERY");

function exemploAJAX() {
    return `
        // GET
        $.get('/api/dados', function(data) {
            console.log(data);
        });
        
        // POST
        $.post('/api/dados', { nome: 'João' }, function(data) {
            console.log(data);
        });
        
        // AJAX completo
        $.ajax({
            url: '/api/dados',
            method: 'GET',
            success: function(data) {
                console.log(data);
            },
            error: function(xhr, status, error) {
                console.error(error);
            }
        });
        
        // AJAX com Promise (jQuery 3+)
        $.ajax({
            url: '/api/dados',
            method: 'GET'
        }).done(function(data) {
            console.log(data);
        }).fail(function(xhr) {
            console.error(xhr.status);
        });
    `;
}

console.log("AJAX:", exemploAJAX());

// ============================================
// 5. Animações jQuery
// ============================================
console.log("\n5. ANIMAÇÕES JQUERY");

function exemploAnimacoes() {
    return `
        // Hide/Show
        $('.elemento').hide();
        $('.elemento').show();
        $('.elemento').toggle();
        
        // Fade
        $('.elemento').fadeIn();
        $('.elemento').fadeOut();
        $('.elemento').fadeToggle();
        
        // Slide
        $('.elemento').slideUp();
        $('.elemento').slideDown();
        $('.elemento').slideToggle();
        
        // Animate
        $('.elemento').animate({
            opacity: 0.5,
            left: '+=50',
            height: 'toggle'
        }, 500);
        
        // Stop
        $('.elemento').stop();
    `;
}

console.log("Animações:", exemploAnimacoes());

// ============================================
// 6. Traversing
// ============================================
console.log("\n6. TRAVERSING");

function exemploTraversing() {
    return `
        // Parent
        $('.elemento').parent();
        $('.elemento').parents('.classe');
        
        // Children
        $('.elemento').children();
        $('.elemento').children('.classe');
        
        // Siblings
        $('.elemento').siblings();
        $('.elemento').next();
        $('.elemento').prev();
        
        // Find
        $('.elemento').find('.filho');
        
        // Filter
        $('.elemento').filter('.ativo');
        
        // First/Last
        $('.elemento').first();
        $('.elemento').last();
    `;
}

console.log("Traversing:", exemploTraversing());

// ============================================
// 7. Manipulação de Elementos
// ============================================
console.log("\n7. MANIPULAÇÃO DE ELEMENTOS");

function exemploManipulacaoElementos() {
    return `
        // Criar
        const novo = $('<div>Novo elemento</div>');
        
        // Adicionar
        $('.container').append(novo);
        $('.container').prepend(novo);
        $('.elemento').after(novo);
        $('.elemento').before(novo);
        
        // Remover
        $('.elemento').remove();
        $('.elemento').detach(); // Mantém dados/eventos
        $('.elemento').empty(); // Remove filhos
        
        // Clonar
        const clone = $('.elemento').clone();
    `;
}

console.log("Manipulação:", exemploManipulacaoElementos());

// ============================================
// 8. Utilitários jQuery
// ============================================
console.log("\n8. UTILITÁRIOS JQUERY");

function exemploUtilitarios() {
    return `
        // Each
        $('.elemento').each(function(index, elemento) {
            console.log(index, elemento);
        });
        
        // Map
        const valores = $('.elemento').map(function() {
            return $(this).text();
        }).get();
        
        // Filter
        $('.elemento').filter(function() {
            return $(this).hasClass('ativo');
        });
        
        // Extend (merge objetos)
        const obj = $.extend({}, obj1, obj2);
        
        // Each (arrays/objetos)
        $.each(array, function(index, value) {
            console.log(index, value);
        });
        
        // Type
        $.type(valor); // Retorna tipo
        
        // IsArray, IsFunction, etc
        $.isArray([]);
        $.isFunction(function() {});
    `;
}

console.log("Utilitários:", exemploUtilitarios());

// ============================================
// 9. jQuery Ready
// ============================================
console.log("\n9. JQUERY READY");

function exemploReady() {
    return `
        // Forma curta
        $(function() {
            // Código quando DOM está pronto
        });
        
        // Forma completa
        $(document).ready(function() {
            // Código quando DOM está pronto
        });
        
        // Múltiplos ready
        $(function() {
            // Primeiro
        });
        
        $(function() {
            // Segundo (executa em ordem)
        });
    `;
}

console.log("Ready:", exemploReady());

// ============================================
// 10. Chaining (Encadeamento)
// ============================================
console.log("\n10. CHAINING");

function exemploChaining() {
    return `
        $('.elemento')
            .addClass('ativo')
            .css('color', 'red')
            .fadeIn(500)
            .on('click', function() {
                $(this).removeClass('ativo');
            });
    `;
}

console.log("Chaining:", exemploChaining());

// ============================================
// 11. Deferred e Promises
// ============================================
console.log("\n11. DEFERRED E PROMISES");

function exemploDeferred() {
    return `
        // Criar Deferred
        const deferred = $.Deferred();
        
        // Resolver
        deferred.resolve('Sucesso');
        
        // Rejeitar
        deferred.reject('Erro');
        
        // Usar
        deferred.promise().done(function(data) {
            console.log(data);
        }).fail(function(error) {
            console.error(error);
        });
        
        // When (múltiplas promises)
        $.when(promise1, promise2).done(function(result1, result2) {
            console.log(result1, result2);
        });
    `;
}

console.log("Deferred:", exemploDeferred());

// ============================================
// 12. Plugins jQuery
// ============================================
console.log("\n12. PLUGINS JQUERY");

function exemploPlugin() {
    return `
        // Criar plugin
        $.fn.meuPlugin = function(options) {
            const settings = $.extend({
                cor: 'red',
                tamanho: '16px'
            }, options);
            
            return this.each(function() {
                $(this).css({
                    color: settings.cor,
                    fontSize: settings.tamanho
                });
            });
        };
        
        // Usar
        $('.elemento').meuPlugin({ cor: 'blue' });
    `;
}

console.log("Plugin:", exemploPlugin());

// ============================================
// 13. jQuery vs Vanilla JS
// ============================================
console.log("\n13. JQUERY VS VANILLA JS");

const comparacao = {
    "jQuery": {
        selecionar: "$('.classe')",
        evento: "$('.el').on('click', fn)",
        ajax: "$.ajax({...})",
        animacao: "$('.el').fadeIn()"
    },
    "Vanilla JS": {
        selecionar: "document.querySelector('.classe')",
        evento: "el.addEventListener('click', fn)",
        ajax: "fetch('url')",
        animacao: "el.style.transition = '...'"
    }
};

console.log("Comparação:", comparacao);

// ============================================
// 14. Exemplo Completo
// ============================================
console.log("\n14. EXEMPLO COMPLETO");

class jQueryHelper {
    static criarTabela(dados) {
        return `
            const tabela = $('<table></table>');
            const thead = $('<thead><tr></tr></thead>');
            const tbody = $('<tbody></tbody>');
            
            // Cabeçalho
            Object.keys(dados[0]).forEach(col => {
                thead.find('tr').append($('<th>').text(col));
            });
            
            // Linhas
            dados.forEach(linha => {
                const tr = $('<tr>');
                Object.values(linha).forEach(valor => {
                    tr.append($('<td>').text(valor));
                });
                tbody.append(tr);
            });
            
            tabela.append(thead).append(tbody);
            $('.container').append(tabela);
        `;
    }
    
    static criarModal(titulo, conteudo) {
        return `
            const modal = $('<div class="modal">')
                .append($('<div class="modal-content">')
                    .append($('<span class="close">&times;</span>'))
                    .append($('<h2>').text(titulo))
                    .append($('<div>').html(conteudo))
                );
            
            $('body').append(modal);
            
            $('.close, .modal').on('click', function(e) {
                if (e.target === this) {
                    modal.fadeOut(300, function() {
                        $(this).remove();
                    });
                }
            });
            
            modal.fadeIn(300);
        `;
    }
}

console.log("jQueryHelper criado");

console.log("\n=== FIM JS JQUERY ===");
console.log("\nNota: jQuery precisa ser incluído:");
console.log("<script src='https://code.jquery.com/jquery-3.6.0.min.js'></script>");
console.log("ou: npm install jquery");
