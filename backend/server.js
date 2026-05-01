const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 MongoDB conexão segura (CORRIGIDO)
mongoose.connect(
  process.env.MONGO_URL ||
  "mongodb+srv://apedamila:92533911@cluster0.fyggn20.mongodb.net/caixa?retryWrites=true&w=majority",
  {
    serverSelectionTimeoutMS: 10000,
  }
)
.then(() => console.log("MongoDB conectado"))
.catch((err) => console.log("Erro MongoDB:", err));

// Schema
const CaixaSchema = new mongoose.Schema({
  produtos: Array,
  vendas: Array,
  pendentes: Array,
});

const Caixa = mongoose.model("Caixa", CaixaSchema);

// 🔵 HEALTH CHECK
app.get("/", (req, res) => {
  res.send("API rodando 🚀");
});

// 🔵 PEGAR DADOS
app.get("/dados", async (req, res) => {
  try {
    let dados = await Caixa.findOne();

    if (!dados) {
      dados = await Caixa.create({
        produtos: [],
        vendas: [],
        pendentes: [],
      });
    }

    res.json(dados);
  } catch (error) {
    console.log("Erro /dados:", error);
    res.status(500).json({ error: "Erro ao buscar dados" });
  }
});

// 🟢 SALVAR DADOS
app.post("/dados", async (req, res) => {
  try {
    let dados = await Caixa.findOne();

    if (!dados) {
      dados = await Caixa.create(req.body);
    } else {
      dados.produtos = req.body.produtos;
      dados.vendas = req.body.vendas;
      dados.pendentes = req.body.pendentes;
      await dados.save();
    }

    res.json({ ok: true });
  } catch (error) {
    console.log("Erro POST /dados:", error);
    res.status(500).json({ error: "Erro ao salvar dados" });
  }
});

// 🔥 PORT Render
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("Backend rodando na porta", PORT);
});