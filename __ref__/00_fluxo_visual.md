# Mapa de fluxo cenarizado

> Um modo de visualização para explicar sistemas com partes que se comunicam.
> O `00_fluxo_visual.html` é a primeira instância concreta desse modo, aplicado
> ao ciclo de vida de uma requisição em Express. Este documento descreve o
> **método** por trás dele, para que ele possa ser reaplicado a outros temas
> (lifecycle do React, pipeline de CI/CD, fluxo OAuth, request HTTP/2, etc).

---

## 1. A ideia em uma frase

> *Um diagrama estático de caixas e setas, que sabe se animar para contar
> várias histórias diferentes sobre o mesmo mapa.*

Você desenha o sistema **uma vez** — todas as peças, todas as ligações
possíveis. Depois define um conjunto de **cenários** (uma compra com login,
uma compra anônima, uma falha de validação…). Cada cenário é só uma sequência
de arestas a percorrer. O leitor escolhe um cenário, aperta play, e vê uma
partícula viajar pelo mapa enquanto o terminal narra o que está acontecendo.

---

## 2. Por que funciona como ferramenta de ensino

1. **O mapa é estável, a história muda.**
   O leitor reconhece os mesmos lugares (browser, middleware X, banco) em
   todos os cenários. A energia mental que sobra vai para entender a
   *diferença* entre os fluxos.

2. **Mostra o que NÃO acontece.**
   Em cada cenário, nós irrelevantes ficam acinzentados (`skipped`). Isso
   responde uma pergunta que o aluno raramente verbaliza: *"essa peça também
   é usada aqui?"*. Saber que algo é pulado vale tanto quanto saber que algo
   é usado.

3. **Ordem importa, e o tempo torna isso óbvio.**
   Em um diagrama estático com setas, a ordem dos middlewares é informação
   textual. Aqui ela vira informação **temporal**: você vê helmet acender
   antes de session. Não dá para confundir.

4. **Camadas de detalhe sob demanda.**
   - Olhar passivo → segue a partícula no mapa.
   - Quer mais detalhe → lê o terminal de log.
   - Quer ver a forma canônica → lê o painel de código.

   Três níveis de profundidade num único quadro, sem precisar abrir
   referências externas.

---

## 3. Anatomia — os ingredientes mínimos

Todo mapa cenarizado é feito de **seis** peças. Se faltar uma, o método perde
algo.

| # | Peça             | Papel                                                              |
|---|------------------|--------------------------------------------------------------------|
| 1 | **Nós**          | Entidades nomeadas (componentes, estados, papéis).                 |
| 2 | **Arestas**      | Toda ligação que *pode* existir entre dois nós, mesmo que rara.    |
| 3 | **Frames**       | Agrupam nós por fronteira semântica (ex.: o que é "dentro da app"). |
| 4 | **Partícula**    | A unidade de informação trafegando — request, evento, mensagem.     |
| 5 | **Cenários**     | Sequências ordenadas de arestas + falas para o terminal.            |
| 6 | **Painéis**      | Código canônico ao lado, log narrando o que a partícula faz.        |

Tudo o que parece "decoração" (cores, opacidades, sombras, ícones) serve só
para reforçar essas seis peças. Se uma decoração não está reforçando uma
delas, ela é ruído e deve sair.

---

## 4. Linguagem visual — as regras que mantemos

São poucas, e justamente por isso o diagrama lê limpo:

### 4.1 Cores por *tipo de fluxo*, não por componente

Cada partícula carrega um **kind**. O kind define a cor da partícula, da
aresta acesa e da borda do nó ativo. Fluxos válidos:

- `req` — entrada / pedido / disparo (azul)
- `res` — resposta / retorno / propagação para trás (roxo)
- `err` — desvio para tratamento de erro (vermelho)
- `db`  — chamada para um sistema externo (i/o, verde)

Os componentes em si **não têm cor própria**. Só ganham cor quando estão
ativos, e a cor que ganham é a do kind da hora. Isso evita a explosão de
"cor por componente" que vira semáforo.

### 4.2 Opacidade conta a história

- **Em repouso**: arestas em opacidade baixíssima (~0.22). O mapa está lá,
  mas não compete pela atenção.
- **No caminho ativo**: opacidade 1, traço mais grosso. O olhar segue
  naturalmente.
- **Pulado no cenário**: nó com opacidade ~0.4. Visível, mas claramente
  "fora desta história".

### 4.3 Linhas curvas, nunca em ângulo reto

Bezier cúbica entre os centros dos nós, com um parâmetro `curve` (-1..+1)
que dá personalidade à ligação. Linhas em ângulo reto sugerem hierarquia
rígida que raramente existe; curvas suaves dão a sensação de "fluxo".

### 4.4 Tipografia mínima

- Sans-serif para rótulos (o que é).
- Mono para valores e descrições técnicas (o que carrega).
- Sem títulos em caixa-alta; sem letter-spacing exagerado.

### 4.5 Tema claro, decoração contida

- Fundo branco / quase-branco.
- Bordas em cinza muito claro.
- Nenhuma sombra colorida, glow, gradiente, halo pulsante.
- Cor só aparece quando algo *significa*.

A regra geral: **o ruído visual no estado de repouso deve ser próximo de
zero**. O movimento e a cor são privilégios do estado ativo.

---

## 5. A receita — aplicando a outro tema

Suponha que você queira explicar o **lifecycle de hooks do React**, ou o
**fluxo OAuth Authorization Code**, ou um **pipeline de CI/CD**. Os passos
são sempre os mesmos:

### Passo 1 · Listar os nós

Escreva, em um papel, **toda entidade nomeada** que aparece em qualquer um
dos cenários. Não filtre. Para o Express:

> browser, tcp, helmet, static, urlencoded, session, flash, csurf,
> custom-mw, router, controller, model, view, send, error-handler,
> mongo, public/

Cada nó vira uma chave em `NODES` com `{ x, y, type, label, sub }`.

### Passo 2 · Listar as arestas possíveis

Para cada par de nós que pode trocar informação, escreva uma aresta. Inclua
**todas** mesmo que algumas só apareçam em um cenário raro. É melhor ter
uma aresta sobrando do que precisar redesenhar o mapa para um cenário novo.

Cada aresta vira uma chave em `EDGES` com `{ from, to, kind, curve? }`.

### Passo 3 · Posicionar os nós

Espacialmente, organize por **direção do fluxo principal**:

- **Esquerda → direita** geralmente é o sentido do tempo.
- **Cima ↔ baixo** é hierarquia / camadas / branches.
- Sistemas externos vão **fora dos frames** (browser à esquerda, banco à
  direita). Ficam visualmente "do outro lado da fronteira".
- Caminhos raros (error handler, fallback) ficam em uma faixa **separada**,
  não no meio do fluxo feliz.

### Passo 4 · Escrever os cenários

Um cenário é:

```js
{
  title: 'frase curta que vira o título do play',
  code:  'arquivo/contexto canônico de referência',
  skip:  ['ids', 'de', 'nós', 'que', 'não', 'aparecem'],
  seq: [
    { edge: 'a-b', log: 'frase narrando',           kind: 'req' },
    { edge: 'b-c', log: 'próxima frase',                          },
    { edge: 'c-d', log: 'agora começa a resposta',  kind: 'res' },
    ...
  ]
}
```

Comece pelo **caminho feliz** (o cenário "tudo dá certo"). Depois adicione
variantes: erro de validação, timeout, branch alternativo. Cada variante
revela uma parte do mapa que o caminho feliz não cruzou.

### Passo 5 · Escrever os logs

Os logs são onde a explicação textual mora. Boas práticas:

- Use o vocabulário que a comunidade usa de fato (`req.body`, não "o corpo
  da requisição").
- Conte o **porquê** quando ele não é óbvio: *"static: pulou (não é asset)"*
  é melhor que só *"static: skip"*.
- Marque marcos: *"`mongo retorna doc com _id: 6f9a…`"* deixa o leitor
  acompanhar o estado do dado.

### Passo 6 · Escolher os painéis laterais

Sempre dois:

1. **Painel de código** — a forma canônica de escrever o que o cenário
   está mostrando. É o "tradução do desenho para a linguagem real".
2. **Painel de log** — o terminal narrando passo a passo.

Se você sentir necessidade de um terceiro painel, provavelmente o cenário
está fazendo coisas demais e precisa virar dois.

### Passo 7 · Iterar visualmente

Rode os cenários. Olhe o que está congestionado, o que cruza, o que parece
caótico. **Reposicionar é mais barato do que adicionar legenda**. Se você
está adicionando texto explicativo para o desenho, geralmente é sinal de
que o desenho ainda não está limpo.

---

## 6. Quando NÃO usar este formato

Este modo brilha quando há **fluxo temporal** entre componentes. Ele é
desperdício quando:

- O assunto é **estrutural** (ex.: árvore de tipos TypeScript) — uma figura
  estática serve melhor.
- Há **uma única história** sem variantes — vira uma linha do tempo, e
  ferramentas como mermaid são mais baratas.
- A audiência precisa **executar** o exemplo, não só entender — aí é
  preferível um repl/sandbox real.

Como heurística: se você consegue listar **três cenários distintos** que
contam histórias diferentes pelo mesmo mapa, vale o investimento.

---

## 7. Estrutura técnica de referência

A implementação concreta vive em um único arquivo HTML, sem build.
Camadas:

```
00_fluxo_visual.html
├─ <style>          tema claro, paleta de 4 acentos, tipografia mínima
├─ <header/console> título + cenário + velocidade + status
├─ <svg>            paths das arestas (gerados em JS) + partículas (circle)
├─ <div.nodes>      cards HTML absolutos sobre o SVG, em coordenadas %
├─ <pre.code>       código canônico do cenário
├─ <div.log>        terminal animado
└─ <script>
   ├─ NODES         { id: { x, y, type, label, sub } }
   ├─ EDGES         { 'from-to': { from, to, kind, curve? } }
   ├─ SCENARIOS     { id: { title, code, skip, seq:[…] } }
   ├─ render        drawNodes / drawEdges / pathFor (cubic bezier)
   └─ runner        play() percorre seq disparando travel(edge) em série
```

A função `travel(edgeKey)` é onde a mágica acontece: ela pega o
`<path>` da aresta, mede `getTotalLength`, e move um `<circle>` de
`t=0` a `t=1` ao longo do path com `getPointAtLength`. Sincronização
acontece via `Promise` resolvida quando a partícula chega.

Trocar a partícula em SVG por algo mais elaborado (vários pontos seguindo
a aresta, partícula com *trail*, dois flows simultâneos) é só estender
essa função.

---

## 8. Exemplo de referência

[`00_fluxo_visual.html`](./00_fluxo_visual.html) implementa este método para
o ciclo de vida de uma requisição HTTP em uma app Express, cobrindo os
módulos `01_servidor_basico` até `08_mongodb_session_seguranca`.

Cinco cenários disponíveis:

1. **GET /** — servidor básico, fluxo mínimo.
2. **POST /produtos** — pipeline completo (sessão + csrf + mongoose).
3. **GET /admin** — middleware que barra a request antes do router.
4. **GET /style.css** — atalho do `express.static`, sai pela esquerda.
5. **GET /erro** — `throw` capturado pelo middleware de erro de 4 args.

Cada um acende um sub-conjunto diferente do mesmo mapa.

---

## 9. Checklist para criar um novo

- [ ] Identifiquei os nós (sem agrupar prematuramente).
- [ ] Listei todas as arestas possíveis, incluindo as raras.
- [ ] Posicionei nós para que o caminho feliz seja "lido" da esquerda
      para a direita / de cima para baixo.
- [ ] Sistemas externos estão **fora** dos frames.
- [ ] Caminhos de erro estão em uma faixa visualmente separada.
- [ ] Tenho ao menos **três cenários** que contam histórias distintas.
- [ ] Cada log diz mais que o nome da etapa — diz o **porquê** quando
      não é óbvio.
- [ ] Em repouso, o mapa quase não compete pela atenção.
- [ ] Quando um cenário roda, fica claro **o que ele pula**.
- [ ] O painel de código mostra a forma canônica do mesmo cenário.
