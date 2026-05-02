const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

// 🔐 CONFIG
const SECRET = "segredo_super_forte_123";

// 📦 MONGODB
mongoose.connect(
  process.env.MONGO_URL ||
    "mongodb+srv://apedamila:92533911@cluster0.fyggn20.mongodb.net/caixa?retryWrites=true&w=majority"
)
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.log("Erro Mongo:", err));

// ================= MODELS =================
const User = mongoose.model("User", {
  email: String,
  password: String
});

const Caixa = mongoose.model("Caixa", {
  userId: String,
  produtos: Array,
  vendas: Array,
  pendentes: Array
});

// ================= AUTH MIDDLEWARE =================
function auth(req, res, next) {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ error: "Sem token" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido" });
  }
}

// ================= REGISTER =================
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ error: "Usuário já existe" });

  const hash = await bcrypt.hash(password, 10);

  await User.create({ email, password: hash });

  res.json({ ok: true });
});

// ================= LOGIN =================
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(401).json({ error: "Usuário não existe" });

  const ok = await bcrypt.compare(password, user.password);

  if (!ok) return res.status(401).json({ error: "Senha inválida" });

  const token = jwt.sign({ id: user._id }, SECRET, {
    expiresIn: "7d"
  });

  res.json({ token });
});

// ================= GET DADOS =================
app.get("/dados", auth, async (req, res) => {
  let dados = await Caixa.findOne({ userId: req.userId });

  if (!dados) {
    dados = await Caixa.create({
      userId: req.userId,
      produtos: [],
      vendas: [],
      pendentes: []
    });
  }

  res.json(dados);
});

// ================= SAVE DADOS (ESTÁVEL) =================
app.post("/dados", auth, async (req, res) => {
  const { produtos, vendas, pendentes } = req.body;

  const updated = await Caixa.findOneAndUpdate(
    { userId: req.userId },
    {
      $set: {
        produtos: produtos || [],
        vendas: vendas || [],
        pendentes: pendentes || []
      }
    },
    {
      upsert: true,
      new: true
    }
  );

  res.json(updated);
});

// ================= START =================
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("🚀 MAGNUS backend rodando na porta", PORT);
});