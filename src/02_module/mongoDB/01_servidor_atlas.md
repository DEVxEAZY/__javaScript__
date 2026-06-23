# MongoDB Atlas — ter um servidor pronto para o curso

Fala pessoal. Como comentamos nas aulas anteriores, ainda faltam módulos da aplicação e, para ir além da memória do processo Node, precisamos de **persistência**: uma base de dados.

Você pode usar qualquer sistema que preferir — por exemplo **MariaDB**, **PostgreSQL** e tantos outros. Neste curso específico a escolha é **MongoDB**: o modelo mental de **coleções** e **documentos** costuma ficar bem próximo do fluxo que você já usa em **JavaScript/JSON**. Os detalhes de modelagem aparecem nas aulas seguintes; aqui o foco é **só uma coisa**: ter um **servidor MongoDB acessível** para continuarmos o projeto sem precisar instalar nem administrar uma máquina inteira só para o banco.

Para isso usamos o **MongoDB Atlas** — serviço da própria MongoDB que oferece um **cluster gerenciado** na nuvem. Em contas gratuitas há um nível (**M0** / Free) adequado para estudo; valores de espaço ou limites podem mudar ao longo do tempo — vale conferir no painel oficial o que aparece para a sua conta (historicamente aparece algo na ordem de **centenas de MB** para o tier gratuito).

Assim você passa a ter um servidor hospedado em infraestrutura de grandes provedores, sem configurar VMs ou firewall manualmente só para chegar ao primeiro `connect`.

---

## 1. Acessar e criar conta

1. Abra o site do Atlas. Formas diretas que costumam funcionar sempre:
   - [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - ou procure no Google por **MongoDB Atlas** e entre no resultado oficial (`mongodb.com`).

2. Use a opção de **experimentar gratuitamente** / **cadastro** que o site oferecer no momento — o fluxo muda um pouco na interface, mas a ideia é sempre: criar conta (e-mail, nome, aceite de termos) e entrar no painel.

---

## 2. Criar o primeiro cluster (o “servidor”)

1. O assistente vai pedir para criar o **primeiro cluster**. Esse cluster é onde seu Mongo vai rodar.
2. **Escolha o tier gratuito** (M0 “Free”). Não há necessidade de pagar nesta etapa do curso.
3. Escolha o **provedor de nuvem** (AWS, Google Cloud ou Azure, conforme o painel mostrar).
4. Escolha uma **região** onde o tier gratuito esteja disponível e que faça sentido para latência — por exemplo algo na América do Sul se existir, ou a região padrão sugerida.
5. Você pode **renomear o cluster** para algo como `curso-js` ou deixar o nome automático — não altera o aprendizado.
6. Confirme a criação e **aguarde o provisionamento** (costuma levar alguns minutos). Enquanto isso você pode pausar o vídeo ou o estudo até o status ficar pronto no painel.

---

## 3. Usuário do banco (Database Access)

Com o cluster ativo:

1. No menu lateral, procure **Database Access** (acesso/usuários de banco).
2. Crie um **usuário de banco** com usuário **e senha**.
3. Guarde esse par em um lugar seguro — você vai precisar na **URI de conexão**. Se a senha tiver caracteres especiais (`@`, `#`, espaços etc.), na string de conexão eles precisam ser **codificados** para URL; na prática, muitos cursos recomendam senha só com letras e números para evitar dor de cabeça no primeiro contato.

---

## 4. Quem pode conectar pela rede (Network Access)

Para o cliente (seu notebook, outro servidor, ou o app Node no futuro) conseguir falar com o Atlas:

1. Abra **Network Access** no painel lateral.
2. Clique para **adicionar endereço IP** (“Add IP Address”).
3. Em **aulas** costuma aparecer a opção **Allow access from anywhere**, que equivale ao intervalo **`0.0.0.0/0`** (qualquer IPv4 pode tentar autenticar).
   - **Observação de segurança**: isso facilita estudar em qualquer rede; para produção você restringiria IPs conhecidos ou usaria outros mecanismos. Aqui só precisamos deixar o firewall do Atlas permissivo como no vídeo.

Aguarde a regra ficar **Active** antes de testar conexões.

---

## 5. Obter o link de conexão (URI)

1. Na área do **cluster**, use o botão **Connect**.
2. Escolha uma opção do tipo **Connect your application** ou **Drivers** (o rótulo muda conforme o layout do Atlas).
3. Copie a **connection string**. Ela vem parecida com:

   ```
   mongodb+srv://<user>:<password>@CLUSTER_HOST/nome_do_banco?opcoes
   ```

4. Troque `<user>` e `<password>` (e o trecho `<password>` se vier como placeholder) pelos valores reais do usuário que você criou.
5. Ajuste o **nome da base** no caminho ao final da URI se quiser (ex.: `aulas`), em linha com o que as próximas aulas do projeto usam.

Salve esse link em um arquivo local seguro (**não** commite senha em repositório público). Para o projeto Express deste repo, o modelo esperado aparece em `src/02_module/express/08_mongodb_session_seguranca/.env.example` como `MONGO_URI=...`.

---

## 6. O que *não* fazemos nesta aula

- Não modelamos coleções nem escrevemos queries aqui — só garantimos que o servidor existe e aceita conexão.
- Para **Mongo local com `mongod`**, Compass e erros típicos de conexão, o material já consolidado está em **`src/02_module/express/08_mongodb_session_seguranca/MONGODB_SESSION_SEGURANCA.md`** (secção Atlas / Compass / ambiente local).

---

Próximo passo no curso: usar essa URI no projeto Node/Mongoose (`dotenv`, `mongoose.connect`, primeiro model): [`03_dotenv_mongoose_conexao_e_model.md`](./03_dotenv_mongoose_conexao_e_model.md). Se precisar refazer Atlas ou separar Atlas de Compass, há também [`02_projeto_atlas_do_zero.md`](./02_projeto_atlas_do_zero.md).

Grande abraço.
