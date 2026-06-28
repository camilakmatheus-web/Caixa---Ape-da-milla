// ================= IMPORTAÇÕES =================
// 📦 importação das bibliotecas principais do backend

const express = require("express"); // framework web para criar API
const cors = require("cors"); // libera acesso entre frontend e backend
const mongoose = require("mongoose"); // banco de dados MongoDB
const bcrypt = require("bcrypt"); // criptografia de senha
const admin = require("firebase-admin"); // integração com Firebase Admin (auth, etc)


// ================= FIREBASE ADMIN =================
// 🔐 inicializa o Firebase Admin com credenciais privadas

// admin.initializeApp({
//   credential: admin.credential.cert(require("./firebase-admin.json"))
// });


// ================= INSTÂNCIA DO EXPRESS =================
// 🚀 cria o servidor principal da aplicação

const app = express();


// ================= CORS =================
// 🌐 define quem pode acessar o backend (frontend autorizado)

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://sistema-caixa-pi.vercel.app"
  ],
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true
}));


// ================= CONFIGURAÇÃO GLOBAL =================
// 📦 permite o backend entender JSON nas requisições

app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));


// ================= CONEXÃO MONGODB =================
// 🗄️ conecta com banco de dados MongoDB

mongoose.connect(
  process.env.MONGO_URL || // usa variável de ambiente se existir
  "mongodb+srv://apedamila:apedamila@cluster0.fyggn20.mongodb.net/caixa?retryWrites=true&w=majority"
)
.then(() => console.log("🔥 CONECTADO AO MONGO")) // sucesso na conexão
.catch(err => console.log("💥 ERRO MONGO:", err.message)); // erro na conexão


// ================= MODELS (MONGOOSE) =================
// 🧠 definição das estruturas do banco de dados
 


// 👤 modelo de usuário
const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true }, // email único por usuário
  password: String // senha criptografada
});



const CaixaSchema = new mongoose.Schema({
  userId: String,

  produtos: Array,
  categoriasProdutos: Array,
  categoriasDespesas: Array,


  vendas: Array,
  pendentes: Array,
  clientes: Array,

  despesas: Array,
  anotacoes: Array,

  caixa: {
    type: Number,
    default: 0
  },

  ajusteCaixa: {
    type: Number,
    default: 0
  },

  consumos: {
    type: Array,
    default: []
  }
});


// 📦 criação dos models (tabelas do MongoDB)
const User = mongoose.model("User", UserSchema);
const Caixa = mongoose.model("Caixa", CaixaSchema);
// ================= AUTH (MIDDLEWARE DE AUTENTICAÇÃO) =================
// 🔐 função que protege rotas verificando se o usuário está logado

async function auth(req, res, next) {
  
  // pega o header de autorização da requisição
  const authHeader = req.headers.authorization;

  // ❌ se não tiver token, bloqueia acesso
  if (!authHeader) {
    return res.status(401).json({ error: "Sem token" });
  }

  try {
    // 🔥 separa o "Bearer TOKEN" e pega só o token puro
    const token = authHeader.split(" ")[1];

    // 🔐 valida o token no Firebase Admin
    const decoded = await admin.auth().verifyIdToken(token);

    // 💾 salva o id do usuário na requisição para usar nas rotas
    req.userId = decoded.uid;

    // ➡️ libera acesso para próxima função/rota
    next();

  } catch (err) {
    // ❌ erro ao validar token (expirado ou inválido)
    console.log("❌ ERRO TOKEN:", err.message);

    return res.status(401).json({ error: "Token inválido" });
  }
}


// ================= ROTAS TESTE =================
// 🧪 rota simples para testar se o backend está online

app.get("/", (req, res) => {
  res.send("🚀 Backend rodando");
});


// 📦 rota de teste retornando produto fake
app.get("/produtos", (req, res) => {
  res.json([{ nome: "Produto Teste", preco: 10 }]);
});


// ================= REGISTER =================
// ⚠️ (placeholder - não implementado ainda no trecho enviado)


// ================= LOGIN =================
// 🔑 rota de login com email e senha

app.post("/login", async (req, res) => {
  try {

    // 📥 recebe dados do frontend
    const { email, password } = req.body;

    // 🔍 procura usuário no banco pelo email
    const user = await User.findOne({ email });

    // ❌ se não existir usuário
    if (!user) {
      return res.status(401).json({ error: "Usuário não existe" });
    }

    // 🔐 compara senha digitada com senha criptografada
    const valid = await bcrypt.compare(password, user.password);

    // ❌ se senha estiver errada
    if (!valid) {
      return res.status(401).json({ error: "Senha inválida" });
    }

    // 🔑 gera token JWT para autenticação futura
    const token = jwt.sign(
      { id: user._id }, // dados dentro do token
      SECRET, // chave secreta do servidor
      { expiresIn: "7d" } // validade de 7 dias
    );

    // 📤 retorna token para o frontend
    res.json({ token });

  } catch (err) {
    // 💥 erro geral do login
    res.status(500).json({ error: "Erro no login" });
  }
});
// ================= GET DADOS (BUSCAR DADOS DO USUÁRIO) =================
// 📦 rota protegida que retorna todos os dados do usuário logado

app.get("/dados", async (req, res) => {
  try {

        const userId = req.userId; // 👈 AQUI

    // 🔍 busca no banco o documento do usuário atual
    const caixa = await Caixa.findOne({ userId: userId });

    // 👤 log para debug do usuário autenticado
    console.log("👤 USER ID:", userId);

    // ❌ se não existir registro ainda no banco, retorna estrutura vazia
    if (!caixa) {
 return res.json({
  produtos: [],
  categoriasProdutos: [],
  categoriasDespesas: [],
  
  pendentes: [],
  clientes: [],
  despesas: [],
  anotacoes: [],
  consumos: [],   // 🔥 ADD ISSO
  caixa: 0
});
}

    // 📤 retorna os dados do usuário
    console.log(caixa);

res.json(caixa);

  } catch (err) {
    // 💥 erro ao buscar dados no banco
    res.status(500).json({ error: "Erro ao buscar dados" });
  }
});


// ================= SAVE DADOS (SALVAR/ATUALIZAR BANCO) =================
// 💾 rota protegida que salva todos os dados do sistema no MongoDB

app.post("/dados", async (req, res) => {
  try {

    // 📥 recebe dados enviados pelo frontend
    const {
  produtos,
  categoriasProdutos,
  categoriasDespesas,
  
  pendentes,
  clientes,
  
  anotacoes,
  consumos, // 🔥 ADD ISSO
  caixa
} = req.body;

    // 🧠 atualiza ou cria documento do usuário no banco
    const updated = await Caixa.findOneAndUpdate(
      { userId: req.userId }, // filtro pelo usuário logado
      {
$set: {
  produtos: produtos ?? [],
  categoriasProdutos: categoriasProdutos ?? [],
  categoriasDespesas: categoriasDespesas ?? [],
  
  pendentes: pendentes ?? [],
  clientes: clientes ?? [],
  
  anotacoes: anotacoes ?? [],
  consumos: consumos ?? [],   // 🔥 ADD ISSO
  caixa: caixa,
  ajusteCaixa: req.body.ajusteCaixa ?? 0
}
      },
      {
        upsert: true, // cria documento se não existir
        new: true     // retorna documento atualizado
      }
    );

    // 📤 retorna dados atualizados
    res.json(updated);

  } catch (err) {
    // 💥 erro ao salvar dados no banco
    res.status(500).json({ error: "Erro ao salvar dados" });
  }
});


// ================= START SERVER =================
// 🚀 inicializa o servidor backend

const PORT = process.env.PORT || 3001;

app.put("/cancelar-venda/:id", auth, async (req, res) => {
  try {

    const userId = req.userId;

    const caixa = await Caixa.findOne({ userId });

    if (!caixa) {
      return res.status(404).json({ error: "Caixa não encontrado" });
    }

    const venda = caixa.vendas.find(v => v.id === req.params.id);

    if (!venda) {
      return res.status(404).json({ error: "Venda não encontrada" });
    }

    if (venda.status === "cancelada") {
      return res.status(400).json({ error: "Venda já cancelada" });
    }

    venda.status = "cancelada";

    const produto = caixa.produtos.find(p => p.id === venda.produtoId);

    if (produto) {
      if (produto.estoque != null) {
  produto.estoque += venda.quantidade;
}

      if (produto.vendidos !== undefined) {
        produto.vendidos -= venda.quantidade;
      }
    }

    caixa.caixa -= venda.valor;

    await caixa.save();

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: "Erro ao cancelar venda" });
  }
});

app.post("/resetar", async (req, res) => {
  try {

    await Caixa.updateMany(
      {},
      {
        $set: {
          produtos: [],
          categoriasProdutos: [],
          categoriasDespesas: [],

          vendas: [],
          pendentes: [],
          clientes: [],

          despesas: [],
          anotacoes: [],

          caixa: 0,
           ajusteCaixa: 0
        }
      }
    );

    res.json({
      success: true,
      message: "Sistema resetado"
    });

  } catch (err) {

    res.status(500).json({
      error: "Erro ao resetar sistema"
    });

  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

app.put("/cancelar-venda/:id", async (req, res) => {
  try {

    const userId = req.userId;

    const caixa = await Caixa.findOne({ userId });

    if (!caixa) {
      return res.status(404).json({ error: "Caixa não encontrado" });
    }

    const venda = caixa.vendas.find(v => v.id === req.params.id);

    if (!venda) {
      return res.status(404).json({ error: "Venda não encontrada" });
    }

    if (venda.status === "cancelada") {
      return res.status(400).json({ error: "Venda já cancelada" });
    }

    // 🔴 MARCA COMO CANCELADA
    venda.status = "cancelada";

    // 🔴 VOLTA ESTOQUE
    const produto = caixa.produtos.find(p => p.id === venda.produtoId);

    if (produto) {
      if (produto.estoque != null) {
  produto.estoque += venda.quantidade;
}

      // 🔴 AJUSTA RANKING
      if (produto.vendidos !== undefined) {
        produto.vendidos -= venda.quantidade;
      }
    }

    // 🔴 AJUSTA CAIXA (FATURAMENTO)
    caixa.caixa -= venda.valor;

    await caixa.save();

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: "Erro ao cancelar venda" });
  }
});

app.post("/consumo", async (req, res) => {
  try {

    const { itens, descricao } = req.body;

    // Enquanto não usa auth, pega o primeiro caixa
    // Depois é só trocar por:
    // const caixa = await Caixa.findOne({ userId: req.userId });

    const caixa = await Caixa.findOne();

    if (!caixa) {
      return res.status(404).json({
        error: "Caixa não encontrado"
      });
    }

    // Garante os arrays
    if (!Array.isArray(caixa.produtos)) {
      caixa.produtos = [];
    }

    if (!Array.isArray(caixa.consumos)) {
      caixa.consumos = [];
    }

    // Baixa estoque
    itens.forEach((item) => {

      const produto = caixa.produtos.find((p) =>
        String(p.id) === String(item.id) ||
        String(p._id) === String(item.id)
      );

      if (!produto) return;

      // Não baixa estoque ilimitado
      if (produto.estoqueIlimitado) return;

      const qtd = Number(item.qtd || 1);

      produto.estoque = Math.max(
        0,
        Number(produto.estoque || 0) - qtd
      );

    });

    // Cria consumo
    const novoConsumo = {
      id: Date.now(),
      descricao: descricao || "Consumo interno",
      itens,
      data: new Date()
    };

    // Adiciona ao histórico
    caixa.consumos.unshift(novoConsumo);

    // Salva alterações (estoque + histórico)
    await caixa.save();

    return res.json({
      success: true,
      consumo: novoConsumo,
      produtos: caixa.produtos
    });

  } catch (err) {

    console.log("ERRO CONSUMO:", err);

    return res.status(500).json({
      error: "Erro ao registrar consumo"
    });

  }
});


// ===== GET VENDAS =====
app.get("/vendas", async (req, res) => {
  try {
    const caixa = await Caixa.findOne({ userId: req.userId });

    if (!caixa) {
      return res.json([]);
    }

    res.json(caixa.vendas || []);

  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar vendas" });
  }
});


// ===== SAVE VENDAS =====
app.post("/vendas", async (req, res) => {
  try {

    const vendas = req.body;

    const updated = await Caixa.findOneAndUpdate(
      { userId: req.userId },
      {
        $set: {
          vendas: vendas
        }
      },
      {
        upsert: true,
        new: true
      }
    );

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: "Erro ao salvar vendas" });
  }
});

// ===== GET DESPESAS =====
app.get("/despesas", async (req, res) => {
  try {
    const caixa = await Caixa.findOne({ userId: req.userId });

    if (!caixa) {
      return res.json([]);
    }

    res.json(caixa.despesas || []);

  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar despesas" });
  }
});

// ===== SAVE DESPESAS =====
app.post("/despesas", async (req, res) => {
  try {

    const despesas = req.body;

    const updated = await Caixa.findOneAndUpdate(
      { userId: req.userId },
      {
        $set: {
          despesas: despesas
        }
      },
      {
        upsert: true,
        new: true
      }
    );

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: "Erro ao salvar despesas" });
  }
});


app.get("/consumos", async (req, res) => {

  try {

    const caixa = await Caixa.findOne();

    if (!caixa) {
      return res.json([]);
    }

    // Garante que consumos seja um array
    if (!Array.isArray(caixa.consumos)) {
      caixa.consumos = [];
      await caixa.save();
    }

    return res.json(caixa.consumos);

  } catch (err) {

    console.log("ERRO GET CONSUMOS:", err);

    return res.status(500).json({
      error: "Erro ao buscar consumos"
    });

  }

});

