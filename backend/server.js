const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// ================= BANCO SIMPLES (DEMO) =================
let db = [];

// ================= FUNÇÃO PEGAR USUÁRIO =================
function getUser(userId) {
  let user = db.find(u => u.userId === userId);

  if (!user) {
    user = {
      userId,
      produtos: [],
      vendas: [],
      pendentes: []
    };
    db.push(user);
  }

  return user;
}

// ================= GET DADOS =================
app.get("/dados", (req, res) => {
  const userId = req.headers.authorization;

  if (!userId) return res.status(401).json({ error: "sem user" });

  const user = getUser(userId);

  res.json(user);
});

// ================= SALVAR DADOS =================
app.post("/dados", (req, res) => {
  const userId = req.headers.authorization;

  if (!userId) return res.status(401).json({ error: "sem user" });

  const user = getUser(userId);

  user.produtos = req.body.produtos || [];
  user.vendas = req.body.vendas || [];
  user.pendentes = req.body.pendentes || [];

  res.json({ ok: true });
});

// ================= RESET DIÁRIO (opcional futuro) =================
app.post("/reset", (req, res) => {
  const userId = req.headers.authorization;

  const user = getUser(userId);
  user.vendas = [];

  res.json({ ok: true });
});

// ================= START =================
app.listen(3000, () => {
  console.log("MAGNUS BACKEND rodando na porta 3000");
});