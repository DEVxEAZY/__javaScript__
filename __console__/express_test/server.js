const express = require("express");
const app = express();

// Um require + um app.use por recurso (livros, filmes, usuarios, ...)
const livrosRouter = require("./routes/livros");
// const filmesRouter = require("./routes/filmes");
// const usuariosRouter = require("./routes/usuarios");

app.get("/", (req, res) => {
    res.send(
        "API ok — <a href='/livros'>/livros</a>"
        // + futuros: /filmes, /usuarios, ...
    );
});

app.use("/livros", livrosRouter);
// app.use("/filmes", filmesRouter);
// app.use("/usuarios", usuariosRouter);

app.listen(3000, () => {
    console.log("http://localhost:3000");
});
