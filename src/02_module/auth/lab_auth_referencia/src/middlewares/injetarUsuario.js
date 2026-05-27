/**
 * Copia req.session.usuario para res.locals — padrao do express/08 (injetarLocals).
 *
 * Views EJS leriam res.locals.usuario sem passar manualmente em cada render.
 * Esta API e JSON-only; o middleware existe para mostrar o padrao e facilitar
 * migracao para HTML + CSRF depois (ver express/08_mongodb_session_seguranca).
 *
 * Ordem no server.js: DEPOIS de express-session, ANTES das rotas.
 */

"use strict";

function injetarUsuario(req, res, next) {
    res.locals.usuario = req.session?.usuario ?? null;
    next();
}

module.exports = injetarUsuario;
