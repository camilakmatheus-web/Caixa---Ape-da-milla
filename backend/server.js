const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

// ================= CONFIG =================
const SECRETO = "segredo_super_forte_123";

// ================= MONGODB =================
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.log(err));

// ================= MODELOS =================
const User = mongoose.model("User", {
  email: String,
  senha: String
});

const Caixa = mongoose.model("Caixa", {
  userId: String,
  produtos: Array,
  vendas: Array,
  pendentes: Array
});

// ================= AUTH =================
function auth(req, res, next) {
  const token = req.headers.authorization;

  if (!token) return res.status(401).send("Sem token");

  try {
    const decoded = jwt.verify(token, SECRETO);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).send("Token inválido");
  }
}

// ================= PEGAR DADOS =================
app.get("/dados", auth, async (req, res) => {
  let caixa = await Caixa.findOne({ userId: req.userId });

  if (!caixa) {
    caixa = await Caixa.create({
      userId: req.userId,
      produtos: [],
      vendas: [],
      pendentes: []
    });
  }

  res.json(caixa);
});

// ================= SALVAR DADOS =================
app.post("/dados", auth, async (req, res) => {
  const { produtos, vendas, pendentes } = req.body;

  await Caixa.findOneAndUpdate(
    { userId: req.userId },
    { produtos, vendas, pendentes },
    { upsert: true }
  );

  res.json({ ok: true });
});

// ================= LOGIN SIMPLES (BASE) =================
app.post("/login", async (req, res) => {
  const { email } = req.body;

  const token = jwt.sign({ id: email }, SECRETO);

  res.json({ token });
});

// ================= START =================
app.listen(3000, () => {
  console.log("MAGNUS rodando na porta 3000");
});