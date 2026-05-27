# Parte 2 - Nodemon

Na parte 1, o servidor foi executado assim:

```bash
node server.js
```

Isso funciona, mas tem um detalhe importante: quando voce altera o
arquivo `server.js`, o Node nao reinicia sozinho. O processo que esta
rodando no terminal continua usando a versao antiga do codigo.

O fluxo manual fica assim:

1. Alterar o codigo.
2. Parar o servidor com `Ctrl+C`.
3. Rodar `node server.js` de novo.
4. Voltar para o navegador e testar.

Para poucas alteracoes tudo bem. Em uma aula ou projeto real, isso fica
repetitivo rapido.

## O que e o nodemon

`nodemon` e uma ferramenta de desenvolvimento que observa os arquivos do
projeto. Quando voce salva uma mudanca, ele encerra o processo atual do
Node e sobe o servidor de novo automaticamente.

Ele nao muda o Express, nao muda as rotas e nao vai para producao. Ele
so melhora o fluxo durante o desenvolvimento.

Pense assim:

```txt
node server.js
  -> roda uma vez e fica parado ate voce encerrar manualmente

nodemon server.js
  -> roda o servidor e reinicia automaticamente a cada alteracao
```

## Instalando

Dentro desta pasta:

```bash
cd src/02_module/express/01_servidor_basico
npm install --save-dev nodemon
```

Por que `--save-dev`?

Porque o `nodemon` e uma dependencia de desenvolvimento. Ele ajuda quem
esta programando, mas a aplicacao nao precisa dele para responder
requisicoes em producao.

Depois da instalacao, o `package.json` deve ganhar uma area parecida com:

```json
"devDependencies": {
  "nodemon": "^3.x.x"
}
```

## Rodando diretamente com npx

Uma forma simples de testar:

```bash
npx nodemon server.js
```

Agora abra:

```txt
http://localhost:3000
```

Altere alguma mensagem dentro de uma rota, salve o arquivo e veja o
terminal. O `nodemon` deve mostrar que reiniciou o servidor.

## Rodando com npm script

O `package.json` desta pasta ja tem estes scripts:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

Entao temos dois comandos com intencoes diferentes:

```bash
npm start
```

Roda o servidor com Node puro.

```bash
npm run dev
```

Roda o servidor com `nodemon`, reiniciando automaticamente a cada save.

Esse e o comando mais comum durante o desenvolvimento.

## Como testar se esta funcionando

1. Rode:

```bash
npm run dev
```

2. Abra:

```txt
http://localhost:3000
```

3. No `server.js`, altere o texto da rota `/`, por exemplo:

```js
<h1>Ola mundo com nodemon!</h1>
```

4. Salve o arquivo.

5. Veja o terminal. Ele deve indicar que reiniciou.

6. Recarregue o navegador.

Se a nova mensagem aparecer, o `nodemon` esta funcionando.

## Importante: nodemon nao recarrega o navegador

O `nodemon` reinicia o servidor, mas ele nao da refresh automatico na aba
do navegador.

Depois de salvar o arquivo, normalmente voce ainda precisa apertar `F5`
ou recarregar a pagina manualmente.

## Quando ainda preciso usar Ctrl+C?

Mesmo com `nodemon`, o processo continua rodando no terminal.

Use `Ctrl+C` quando quiser parar tudo:

```txt
Ctrl+C
```

Isso libera a porta `3000`.

## Erros comuns

### `nodemon` nao e reconhecido

Provavelmente ele ainda nao foi instalado nesta pasta.

Rode:

```bash
npm install --save-dev nodemon
```

Depois:

```bash
npm run dev
```

### `EADDRINUSE: address already in use :::3000`

Ja existe outro servidor usando a porta `3000`.

Resolva parando o terminal antigo com `Ctrl+C`, ou trocando a porta no
codigo:

```js
const PORTA = 3001;
```

### O servidor reinicia, mas a pagina nao muda

Confira tres coisas:

1. Voce salvou o arquivo?
2. Voce alterou a rota certa?
3. Voce recarregou o navegador?

## Resumo mental

```txt
node server.js
  -> bom para entender o basico

nodemon server.js
  -> bom para desenvolver sem reiniciar manualmente

npm start
  -> script para rodar com Node puro

npm run dev
  -> script para rodar com nodemon
```

Para estudar Express no dia a dia, use:

```bash
npm run dev
```
