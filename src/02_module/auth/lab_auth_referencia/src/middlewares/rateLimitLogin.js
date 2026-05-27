/**
 * Rate limit especifico para POST /login.
 *
 * Por que limitar so o login e nao o app inteiro?
 *   Brute force tenta milhares de senhas no mesmo endpoint. Limitar
 *   /login protege credenciais sem atrapalhar navegacao normal.
 *
 * Em producao com varios processos/instancias, use store Redis (ou similar)
 * compartilhado — o default deste pacote e memoria por processo.
 *
 * Ver tambem: express/08/__test__/03-rate-limit-e-csp.md
 */

"use strict";

const rateLimit = require("express-rate-limit");

const rateLimitLogin = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 10, // no maximo 10 tentativas por IP nesta janela
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        erro: "Muitas tentativas de login. Tente novamente em alguns minutos.",
    },
    // So conta POST que falhou? Opcional — aqui contamos todas as tentativas.
});

module.exports = rateLimitLogin;
