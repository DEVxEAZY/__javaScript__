# Desafio 3 — Rate limit no login e endurecimento da CSP

> **Nivel:** dificil
> **Tempo estimado:** 3–6h (dependendo de quanto voce
> mergulhar)
> **Conceitos exercitados:** middlewares customizados, store
> de estado por request (memoria/Mongo), Helmet com CSP
> customizada, leitura de console do browser, ajuste fino de
> diretivas de seguranca.
>
> **Pre-requisito:** Desafio 2 concluido (precisa do `/login`).

---

## Contexto

Voce protegeu a aplicacao com sessao, CSRF e Helmet. Em produ-
cao isso ainda e a *baseline*. Faltam dois passos importantes:

1. **Brute force no login** — o token de CSRF nao impede um
   atacante autenticado/script tentar 10.000 senhas. CSRF
   protege contra cliques cross-site, nao contra automacao
   direta. Para isso usamos **rate limit**.
2. **CSP padrao do Helmet** — ela e estrita demais, mas em
   producao voce nao quer simplesmente desligar. Quer **ajustar
   pro seu site**.

## Objetivo

1. Limitar tentativas de login a, por exemplo, 5 a cada 10 min
   por IP.
2. Servir um asset externo (uma fonte do Google Fonts) com a
   CSP **ligada** e ajustada — sem desligar `contentSecurityPolicy`.
3. Manter dev funcional (HSTS off, etc.).

---

## Roteiro tecnico

### Parte A — Rate limit

#### A.1 Pacote

```bash
npm install express-rate-limit
```

#### A.2 Middleware especifico

```js
const rateLimit = require("express-rate-limit");

const limitarLogin = rateLimit({
    windowMs: 10 * 60 * 1000,      // 10 min
    max:      5,                     // 5 requests por janela
    standardHeaders: true,          // headers RateLimit-* (RFC)
    legacyHeaders:   false,         // some X-RateLimit-*
    message: "Muitas tentativas. Aguarde 10 minutos.",
});
```

Aplique somente na rota POST `/login`:

```js
router.post("/login", limitarLogin, authCtrl.entrar);
```

> Nao queremos limitar GET — o usuario pode recarregar o form.
> Tambem nao queremos limitar todo o site, so o ponto sensivel.

#### A.3 Loja persistente (opcional)

O default e em memoria — cada processo tem o proprio contador.
Em prod com varios processos, voce quer um store compartilhado
(Redis ou Mongo). Para esse desafio, em memoria basta. Anote no
seu README pessoal o trade-off.

#### A.4 UX

Em vez do `message` padrao, devolva um flash + redirect. Para
isso, troque `message` por um handler:

```js
handler: (req, res) => {
    req.flash("erro", "Muitas tentativas. Aguarde 10 minutos.");
    res.redirect("/login");
}
```

### Parte B — CSP customizada

#### B.1 Comportamento atual

Adicione no header (ou em qualquer view) um link de Google Fonts:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter&display=swap">
```

Suba o servidor com `NODE_ENV=production` (so pra ativar a CSP).
Abra o DevTools → console. Voce vera erros como:

```
Refused to load the stylesheet 'https://fonts.googleapis.com/css2…'
because it violates the following Content Security Policy directive:
"style-src 'self' https: 'unsafe-inline'"
```

#### B.2 Ajuste

Em vez de `helmet({ contentSecurityPolicy: false })`, customize:

```js
helmet({
    contentSecurityPolicy: {
        useDefaults: true,
        directives: {
            "style-src":     ["'self'", "https://fonts.googleapis.com"],
            "font-src":      ["'self'", "https://fonts.gstatic.com"],
            "connect-src":   ["'self'"],
            "script-src":    ["'self'"],
            "img-src":       ["'self'", "data:"],
            // adicione apenas o necessario, na granularidade certa
        },
    },
    hsts: ehProducao,
})
```

#### B.3 Exercite

Tente quebrar de proposito:

- Adicione um `<style>` inline na view e veja a CSP bloquear.
  Mude pra arquivo CSS em `public/`.
- Adicione `<img src="data:image/svg+xml;base64,...">` e veja a
  diretiva `img-src` deixar passar (porque tem `data:`).
- Tente carregar `<script src="https://unpkg.com/...">` — o
  console reclama. So adicione a origem na CSP se voce
  realmente confia.

---

## Criterios de aceite

### Rate limit
- [ ] Apos a 6a tentativa de POST `/login` em 10 min do mesmo IP,
      a resposta retorna **429** ou redireciona com flash.
- [ ] Tentativas de GET `/login` continuam funcionando normalmente.
- [ ] Apos a janela de 10 min, o IP volta a poder tentar.
- [ ] As respostas trazem headers `RateLimit-Limit`,
      `RateLimit-Remaining`, `RateLimit-Reset`.

### CSP
- [ ] Helmet roda com `contentSecurityPolicy` **ligado** em prod.
- [ ] A pagina renderiza corretamente com Google Fonts.
- [ ] Console do browser **sem violacoes** de CSP.
- [ ] Tentar carregar uma origem nao listada **e bloqueado** pela
      CSP (verifique no console).
- [ ] HSTS continua **off** em dev (sem URL forcada para https).

---

## Discussao

Depois de terminar, escreva 4–6 linhas em comentario no topo do
seu `server.js` respondendo:

1. Qual a diferenca conceitual entre o que rate-limit protege e
   o que CSRF protege?
2. Onde voce poria o rate limit em produ-cao com varios
   processos? Por que?
3. CSP totalmente liberada (`'unsafe-inline'`, `*`) ainda traz
   algum beneficio? Qual? Quando seria aceitavel?
4. Em que cenario voce trocaria `connect-mongo` por `connect-redis`?

Nao precisa "acertar" — precisa ter uma opiniao informada. Se
voce nao consegue formar uma, releia [AULA.md](../AULA.md) e
volte aqui.

---

## Bonus avancado

Imagine que voce vai abrir o sistema pra clientes externos
embutirem produtos via `<iframe>`. Sua CSP atual com
`X-Frame-Options: SAMEORIGIN` bloqueia isso. Como voce
permitiria embed apenas para uma lista whitelist de dominios?
(Pesquise `frame-ancestors` e veja a interacao com
`X-Frame-Options`.)

Esse e o tipo de exercicio que te tira do "copia e cola helmet
e segue a vida" pra "entendo o pacote de seguranca que estou
servindo".
