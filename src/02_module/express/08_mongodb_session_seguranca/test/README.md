# Desafios praticos — MongoDB, Sessao e Seguranca

Tres exercicios de dificuldade crescente para fixar o que foi
visto em [AULA.md](../AULA.md). Cada um vem com **objetivo**,
**roteiro tecnico**, **criterios de aceite** e **dicas**.

A ideia e voce **modificar o projeto da pasta pai**, nao criar
outro do zero. O exemplo de produtos ja tem a infraestrutura;
estes desafios estendem, refatoram ou estressam ela.

| Nivel | Desafio                                                 |
|-------|----------------------------------------------------------|
| 1     | [01-edicao-de-produto.md](01-edicao-de-produto.md)       |
| 2     | [02-login-com-sessao.md](02-login-com-sessao.md)         |
| 3     | [03-rate-limit-e-csp.md](03-rate-limit-e-csp.md)         |

---

## Como abordar

Antes de codar:

1. Leia o desafio inteiro.
2. Releia a secao correspondente em [AULA.md](../AULA.md).
3. **Antecipe onde vai mexer** — qual model, qual controller, qual
   middleware. Se nao consegue antecipar, releia.
4. So entao abra o editor.

Depois de terminar:

- Confira **todos** os criterios de aceite, um por um.
- Tente quebrar o que voce fez (input vazio, sessao expirada,
  token CSRF removido). Se quebra feio, ainda nao acabou.
- Compare com o seu codigo de tres dias atras: voce escreveria
  diferente hoje? Por que?

---

## Para destravar

Se ficar mais de 30 minutos preso no mesmo ponto:

- Veja o terminal: o erro real costuma estar la, nao na pagina.
- Use o **Compass** pra confirmar que o documento foi gravado
  como voce esperava.
- Lembre da ordem dos middlewares — 80% dos bugs de sessao/flash
  /CSRF sao "fulano registrado antes de cicrano".
- Teste UMA coisa por vez. Quando empilha mudancas, fica dificil
  isolar a causa.
