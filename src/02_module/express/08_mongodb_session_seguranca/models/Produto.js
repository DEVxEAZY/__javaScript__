/**
 * ============================================================
 * MODEL — Produto                              (Aula 140)
 * ============================================================
 *
 * Mongoose e uma camada ODM (Object Document Mapper) sobre o
 * driver oficial do MongoDB. Ele adiciona algo que o Mongo puro
 * NAO tem: SCHEMA. No Mongo um documento pode ter qualquer
 * forma; com Mongoose voce define a forma esperada e ganha:
 *
 *   • Validacao automatica          (required, min, enum, ...)
 *   • Tipos coercitivos             (string "10" -> Number 10)
 *   • Hooks (pre/post save)         (ex.: hash de senha)
 *   • Metodos de instancia/estaticos
 *   • Casts e default values
 *
 * O preco em troca: voce paga uma fina camada de overhead e
 * abre mao da liberdade total de schema. Pra 95% dos apps web
 * isso e o trade-off correto.
 * ============================================================
 */

const mongoose = require("mongoose");

// ────────────────────────────────────────────────────────────
// SCHEMA
// ────────────────────────────────────────────────────────────
//
// Cada chave e um campo do documento. Voce pode usar a forma
// curta (tipo direto) ou a longa (objeto com regras).
const produtoSchema = new mongoose.Schema(
    {
        nome: {
            type: String,
            required: [true, "Nome e obrigatorio"],
            trim: true,
            minlength: 2,
        },

        preco: {
            type: Number,
            required: true,
            min: [0, "Preco nao pode ser negativo"],
        },

        categoria: {
            type: String,
            enum: ["eletronico", "vestuario", "alimento", "outro"],
            default: "outro",
        },

        ativo: {
            type: Boolean,
            default: true,
        },
    },
    {
        // timestamps cria createdAt/updatedAt automaticamente.
        // E uma das opcoes mais uteis do Mongoose — voce nunca
        // mais vai querer um schema sem isso.
        timestamps: true,
    }
);


// ────────────────────────────────────────────────────────────
// MODEL
// ────────────────────────────────────────────────────────────
//
// mongoose.model("Produto", schema) faz duas coisas:
//   1. Cria a classe Produto que voce usa pra CRUD
//   2. Liga ela a uma collection no Mongo. Por convencao, ele
//      pluraliza e poe em minusculas: "Produto" -> "produtos".
//
// Reaproveitar require: o module cache do Node garante que
// chamar require("./models/Produto") em varios arquivos retorna
// SEMPRE a mesma instancia — voce nao registra o model duas
// vezes.
module.exports = mongoose.model("Produto", produtoSchema);
