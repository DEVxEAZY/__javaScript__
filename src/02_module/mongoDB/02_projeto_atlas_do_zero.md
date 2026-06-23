# Atlas — projeto do zero (quando a interface atrapalha)

Fala pessoal. Se você está com dificuldade para criar “projetos” e recursos no **Atlas**, este guia acompanha o fluxo da aula desde uma conta já logada, **sem nada montado**. Complementa o roteiro geral em [`01_servidor_atlas.md`](./01_servidor_atlas.md).

---

## Atlas vs Compass — nomes parecidos, coisas diferentes

- **MongoDB Atlas** — painel na web onde você define **projeto Atlas**, cluster, usuários (**Database Access**) e IPs (**Network Access**). Ou seja, é onde o servidor “na nuvem” é criado e controlado.

- **[MongoDB Compass](https://www.mongodb.com/products/compass)** — aplicativo de **desktop** para você se conectar a um Mongo qualquer com uma connection string e **ver bancos, coleções e documentos**. No vídeo, quando aparece algo como “testar a conexão”, costuma ser este cliente (ou o **Browse Collections** dentro do próprio Atlas), não “outro site” com nome parecido.

Se você procurava um programa com outro nome, provavelmente era o **Compass** (e não “Atlas” de novo).

---

## 1. Criar um **projeto Atlas** novo

Na console do Atlas, você trabalha dentro de uma **Organization** e, dentro dela, de **Projects**. Um projeto agrupa clusters, equipes e permissões.

1. Crie ou escolha **New Project**.
2. Dê um **nome ao projeto** (por exemplo algo que identifique o curso ou o trabalho atual).
3. Avance até o projeto existir — depois dá para ajustar permissões de equipe; para estudo basta um projeto onde o próximo cluster fique.

> **Por que isso importa**: se você ficou “preso” a um projeto antigo ou a um cluster com estado estranho, um **projeto novo** mais um cluster novo devolve um ambiente limpo **sem precisar** apagar sua conta inteira.

---

## 2. Cluster gratuito desde o primeiro deploy

1. Dentro deste projeto, use o fluxo de **criar deployment** / cluster.
2. Garanta o **tier gratuito** (em geral algo **Shared** tipo **M0** / **Free**) — ele costuma vir pré-selecionado quando a conta está no uso gratuito.
3. Você pode **manter** provedor, região e até o nome sugeridos; mudar não é obrigatório.

4. Ao confirmar (**Create**, **Deploy** ou equivalente), o estado fica algo como **Creating…** até ficar disponível.

**Por que tudo demora aqui**: regras de rede, usuário de banco e criação de cluster são aplicadas no serviço do Atlas — na prática aparece com frequência **de alguns segundos a vários minutos**, com linhas em **pending** até virarem **active**.

Enquanto o cluster inicializa:

- você pode já fazer rede + usuário abaixo;
- volte ao painel do cluster quando o botão **Connect** ficar clicável.

---

## 3. Network Access — quem pode falar com o cluster

No menu lateral (área **Security**, conforme o layout atual):

1. **Network Access** → **Add IP Address**.
2. Para estudo com IP que muda (**casa**, escola, 4G):

   Use **Allow access from anywhere**, equivalente a **`0.0.0.0/0`** (qualquer cliente IPv4 com usuário/senha corretos pode tentar se conectar).

   > **Fora das aulas**: se você tiver IP fixo confiável, pode restrigir só a esse IP e reduzir a superfície de tentativa de acesso pela rede.

3. Confirme; a regra aparece **pending** e depois **active**.

**Não espere uma conexão estável até a regra ficar ativa.**

---

## 4. Database Access — usuário e senha do banco

1. **Database Access** → **Add New Database User**.
2. Defina **nome** e **senha** — **anote já** usuário e senha para colar na URI (próxima seção).
3. Para o curso, um papel com leitura/escrita nas bases em que você vai trabalhar costuma bastar (**Read and write to any database** ou equivalente sugerido pelo assistente — confira os rótulos no momento da criação).
4. **Create User** e aguarde sair do estado pendente (de novo, pode levar alguns minutos).

**Dica**: se fechar o popup sem copiar dados, abra **Database Access**, edite o usuário no painel e confira o nome ou redefina a senha antes de atualizar o URI.

---

## 5. Copiar URI e montar direito

No painel **Clusters**, quando **Connect** estiver ativo:

1. **Connect** → **Connect your application** / **Drivers**.
2. Se pedir versão do driver, escolha uma compatível com seu projeto Node (às vezes série 7.x ou a que Mongoose espera na documentação do pacote naquele período).
3. **Copie** a connection string inteira.

Ajustes obrigatórios:

- troque placeholders de usuário e senha pelos valores reais do **Database Access**;
- se a senha tiver caracteres especiais (`@`, `/`, espaço etc.), aplique **encode** na parte da senha dentro da URI, como já comentamos em **`01_servidor_atlas.md`**.

No caminho antes do primeiro `?`, use o nome de banco que quiser usar por padrão (ex.: **`/aulas`**) — isso só define qual database o cliente usa se não sobrescrever no código.

---

## 6. Provar na prática (Atlas ou Compass)

1. Cole a URI no **MongoDB Compass** (**New Connection**) **ou** use o fluxo equivalente em **Browse Collections** no próprio Atlas, quando a interface pedir a string para conectar.
2. Opcionalmente crie uma **database** + uma **collection** vazia pelo botão tipo **Create Database** / **Create Collection**. Assim você vê na interface que o cluster está respondendo **antes** de rodar o Node.
3. Abra de novo a lista de bancos/coleções para confirmar que tudo aparece.

Se isso funciona, o próximo passo com **Mongoose** e `MONGO_URI` no Express deixa de ser “adivinhação” de rede.

---

## 7. Apagar, refazer e limites do free tier

- Para “zerar” de novo: apague o cluster antigo ou crie outro **Project** no Atlas e suba outro cluster — sempre respeitando **limites atuais** da camada gratuita da sua conta.
- Em muitos fluxos o free tier **não exige cartão**; o limite de **quantos clusters** ou recursos paralelos você ainda pode criar muda com o tempo — vale olhar o que o painel mostra hoje em **Billing** / documentação Atlas se precisar de mais de um ambiente.

---

## Resumo rápido de bloqueadores

| Sintoma | Onde olhar |
|--------|-------------|
| `Connect` inactive / cluster “creating” | Aguardar o cluster ficar pronto |
| Linha em **Network Access** ainda pending | Esperar ficar active antes de testar de novo |
| Timeout ou “cannot resolve host” | IP liberado no Atlas; redes que bloqueiam `mongodb+srv` |
| `Authentication failed` | usuário/senha na URI ou caracteres especiais sem encode |

Lista mais longa de erros típicos (incluindo app Express): **`src/02_module/express/08_mongodb_session_seguranca/MONGODB_SESSION_SEGURANCA.md`**.

Conexão no Node (`dotenv` + primeira string em variável): [`03_dotenv_mongoose_conexao_e_model.md`](./03_dotenv_mongoose_conexao_e_model.md).
