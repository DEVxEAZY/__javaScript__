/**
 * ============================================================
 * MIDDLEWARE — injetarLocals               (Aulas 142 e 144)
 * ============================================================
 *
 * "Injetar conteudo nos views" = colocar variaveis em
 * res.locals pra que TODAS as views renderizadas naquela
 * request enxerguem, sem voce precisar passar manualmente em
 * cada res.render(...).
 *
 * Casos tipicos:
 *   • Mensagens flash (sucesso/erro) que aparecem em qualquer
 *     pagina depois de um redirect.
 *   • Token CSRF, pra cada formulario gerar um <input hidden>.
 *   • Usuario logado da sessao, pra mostrar nome no header.
 *
 * Com res.locals voce escreve isso uma unica vez e o EJS le.
 * ============================================================
 */

module.exports = function injetarLocals(req, res, next) {
    // connect-flash guarda mensagens na sessao e devolve
    // arrays — drena tudo nessa primeira leitura. Por isso, ao
    // fazer um GET depois do redirect, a mensagem aparece UMA
    // vez e some.
    res.locals.sucesso = req.flash("sucesso");
    res.locals.erro    = req.flash("erro");

    // Token CSRF gerado pelo csurf. A view usa em <input
    // type="hidden" name="_csrf" value="<%= csrfToken %>">.
    // Em rota GET sem CSRF (ex.: erro antes de instalar) a
    // funcao pode nao existir — protegemos com optional call.
    res.locals.csrfToken = typeof req.csrfToken === "function"
        ? req.csrfToken()
        : "";

    // URL atual: util pra marcar item de menu ativo.
    res.locals.urlAtual = req.originalUrl;

    next();
};
