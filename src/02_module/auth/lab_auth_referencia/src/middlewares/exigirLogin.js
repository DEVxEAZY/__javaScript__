/**
 * Middleware de autorizacao basica: so deixa passar quem tem sessao autenticada.
 *
 * AuthN (login) ja aconteceu no POST /login e gravou req.session.usuario.
 * AuthZ (papeis, permissoes) seria outro middleware — este lab so checa "esta logado?".
 *
 * Para API JSON devolvemos 401; em app com views HTML voce redirecionaria:
 *   return res.redirect("/login?next=" + encodeURIComponent(req.originalUrl));
 */

"use strict";

function exigirLogin(req, res, next) {
    if (!req.session?.usuario?.id) {
        return res.status(401).json({
            erro: "Autenticacao necessaria. Faca POST /login antes.",
        });
    }
    next();
}

module.exports = exigirLogin;
