/**
 * Controllers de autenticacao: cadastro, login, logout.
 *
 * Padroes de seguranca aplicados:
 *   • SQL sempre parametrizado ($1, $2) — nunca concatena input do usuario
 *   • Senha nunca persiste em texto puro — so bcrypt hash
 *   • Login com mensagem generica — nao revela se o e-mail existe
 *   • session.regenerate apos login — mitiga session fixation
 *   • session.destroy no logout — invalida sessao no servidor
 *
 * Teoria: ../03_senhas_armazenamento_bcrypt.md e ../04_sessoes_cookies_express.md
 */

"use strict";

const bcrypt = require("bcryptjs");
const pool = require("../db/pool");

const BCRYPT_ROUNDS = 12;
const ERRO_CREDENCIAIS = "Credenciais invalidas";

function normalizarEmail(email) {
    return String(email || "").trim().toLowerCase();
}

/**
 * POST /cadastro
 * Body JSON: { email, senha, nome }
 */
async function cadastrar(req, res, next) {
    try {
        const { senha, nome } = req.body;
        const email = normalizarEmail(req.body.email);

        if (!email || !senha || !nome) {
            return res.status(400).json({ erro: "Informe email, senha e nome." });
        }

        if (String(senha).length < 8) {
            return res.status(400).json({ erro: "Senha deve ter pelo menos 8 caracteres." });
        }

        // Cost 12: equilibrio entre tempo de hash e resistencia a brute force offline.
        const senha_hash = await bcrypt.hash(String(senha), BCRYPT_ROUNDS);

        await pool.query(
            `INSERT INTO usuarios (email, senha_hash, nome) VALUES ($1, $2, $3)`,
            [email, senha_hash, String(nome).trim()]
        );

        // Nao fazemos login automatico aqui — usuario confirma credenciais de novo.
        return res.status(201).json({
            ok: true,
            mensagem: "Cadastro realizado. Faca POST /login.",
        });
    } catch (err) {
        // 23505 = unique_violation (e-mail duplicado)
        if (err.code === "23505") {
            // Mensagem generica — nao confirmar que o e-mail ja existe (enumeração).
            return res.status(400).json({ erro: "Nao foi possivel concluir o cadastro." });
        }
        return next(err);
    }
}

/**
 * POST /login
 * Body JSON: { email, senha }
 */
async function login(req, res, next) {
    try {
        const email = normalizarEmail(req.body.email);
        const senha = req.body.senha;

        if (!email || !senha) {
            return res.status(400).json({ erro: "Informe email e senha." });
        }

        const { rows } = await pool.query(
            `SELECT id, email, senha_hash, nome FROM usuarios WHERE email = $1`,
            [email]
        );

        const usuario = rows[0];
        const senhaOk =
            usuario && (await bcrypt.compare(String(senha), usuario.senha_hash));

        // Mesma resposta para "e-mail inexistente" e "senha errada" — evita user enumeration.
        if (!senhaOk) {
            return res.status(401).json({ erro: ERRO_CREDENCIAIS });
        }

        // Session fixation: atacante pode ter fixado um session id antes do login.
        // regenerate() cria id novo; so entao gravamos dados autenticados.
        req.session.regenerate((err) => {
            if (err) return next(err);

            // Nunca grave senha ou hash na sessao — so o minimo para AuthZ/UI.
            req.session.usuario = {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
            };

            return res.json({
                ok: true,
                mensagem: "Login realizado.",
                usuario: req.session.usuario,
            });
        });
    } catch (err) {
        return next(err);
    }
}

/**
 * POST /logout
 */
function logout(req, res, next) {
    if (!req.session) {
        return res.json({ ok: true, mensagem: "Ja deslogado." });
    }

    req.session.destroy((err) => {
        if (err) return next(err);

        // Limpa cookie no browser — nome padrao do express-session.
        res.clearCookie("connect.sid");

        return res.json({ ok: true, mensagem: "Logout realizado." });
    });
}

module.exports = {
    cadastrar,
    login,
    logout,
};
