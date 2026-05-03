import { useState, useEffect } from "react";
import { auth, provider } from "./firebase";
import { signInWithPopup, signOut } from "firebase/auth";

const API = "https://caixa-ape-da-milla.onrender.com";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("vendas");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [produtos, setProdutos] = useState([]);
  const [vendas, setVendas] = useState([]);
  const [pendentes, setPendentes] = useState([]);

  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [precoVenda, setPrecoVenda] = useState(""); // ✅ NOVO
  const [estoque, setEstoque] = useState("");
  const [imagem, setImagem] = useState(null); // ✅ NOVO

  const [busca, setBusca] = useState("");
  const [carrinho, setCarrinho] = useState([]);

  const [cliente, setCliente] = useState("");
  const [pagamento, setPagamento] = useState("dinheiro");
  const [modoVenda, setModoVenda] = useState("normal");

  // ================= LOGIN =================
  const login = async () => {
    const res = await fetch(API + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    localStorage.setItem("token", data.token);
    setToken(data.token);
  };

  const register = async () => {
    await fetch(API + "/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    alert("Conta criada");
  };

  // ================= GOOGLE LOGIN =================
  const loginGoogle = async () => {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const idToken = await user.getIdToken();

    setUser(user);
    setToken(idToken);
    localStorage.setItem("token", idToken);
  };

  // ================= LOAD =================
  useEffect(() => {
    if (!token) return;

    fetch(API + "/dados", {
      headers: { Authorization: token }
    })
      .then(r => r.json())
      .then(d => {
        setProdutos(d.produtos || []);
        setVendas(d.vendas || []);
        setPendentes(d.pendentes || []);
      });
  }, [token]);

  // ================= SAVE =================
  useEffect(() => {
    if (!token) return;

    const timeout = setTimeout(() => {
      fetch(API + "/dados", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify({ produtos, vendas, pendentes })
      });
    }, 500);

    return () => clearTimeout(timeout);
  }, [produtos, vendas, pendentes]);

  // ================= PRODUTOS =================
  const adicionarProduto = () => {
    if (!nome || !preco || !estoque || !precoVenda) return;

    setProdutos(prev => [
      ...prev,
      {
        id: Date.now(),
        nome,
        preco: Number(preco),
        precoVenda: Number(precoVenda),
        estoque: Number(estoque),
        imagem
      }
    ]);

    setNome("");
    setPreco("");
    setPrecoVenda("");
    setEstoque("");
    setImagem(null);
  };

  const produto = produtos.find(p =>
    p.nome?.toLowerCase().includes(busca.toLowerCase())
  );

  // ================= CARRINHO =================
  const addCarrinho = () => {
    if (!produto || produto.estoque <= 0) return;

    setCarrinho(prev => {
      const existe = prev.find(p => p.id === produto.id);

      if (existe) {
        return prev.map(p =>
          p.id === produto.id
            ? { ...p, qtd: (p.qtd || 1) + 1 }
            : p
        );
      }

      return [...prev, { ...produto, qtd: 1 }];
    });

    setProdutos(prev =>
      prev.map(p =>
        p.id === produto.id
          ? { ...p, estoque: p.estoque - 1 }
          : p
      )
    );
  };

  const removerItem = (id) => {
    setCarrinho(prev =>
      prev
        .map(p =>
          p.id === id
            ? { ...p, qtd: p.qtd - 1 }
            : p
        )
        .filter(p => p.qtd > 0)
    );

    setProdutos(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, estoque: p.estoque + 1 }
          : p
      )
    );
  };

  const limparCarrinho = () => setCarrinho([]);

  const total = carrinho.reduce(
    (a, p) => a + p.precoVenda * (p.qtd || 1),
    0
  );

  // ================= FINALIZAR =================
  const finalizar = () => {
    if (!carrinho.length) return;

    const agora = new Date();

    const venda = {
      id: Date.now(),
      cliente: cliente || "Sem nome",
      pagamento: modoVenda === "normal" ? pagamento : null,
      modo: modoVenda,
      itens: carrinho,
      total,
      data: agora.toISOString().split("T")[0],
      hora: agora.toTimeString().slice(0, 5),
      timestamp: Date.now()
    };

    if (modoVenda === "pendente") {
      setPendentes(prev => [...prev, venda]);
    } else {
      setVendas(prev => [...prev, venda]);
    }

    setCarrinho([]);
    setCliente("");
    setPagamento("dinheiro");
    setModoVenda("normal");
  };

  const hoje = new Date().toISOString().split("T")[0];
  const vendasHoje = vendas.filter(v => v.data === hoje);
  const totalHoje = vendasHoje.reduce((soma, v) => soma + v.total, 0);

  // ================= LOGIN =================
  if (!token) {
    return (
      <div style={{ padding: 20 }}>
        <h2>MAGNUS Login</h2>

        <input placeholder="email" onChange={e => setEmail(e.target.value)} />
        <input placeholder="senha" type="password" onChange={e => setPassword(e.target.value)} />

        <button onClick={login}>Entrar</button>
        <button onClick={register}>Criar conta</button>

        <hr />

        <button onClick={loginGoogle}>🔐 Entrar com Google</button>
      </div>
    );
  }

  // ================= UI =================
  return (
    <div style={{ display: "flex", fontFamily: "Arial" }}>

      {/* MENU */}
      <div style={{ width: 220, minHeight: "100vh", background: "#0f0f1a", color: "#fff", padding: 20 }}>
        <h2 style={{ color: "#a855f7" }}>MAGNUS</h2>

        <button onClick={() => setTab("vendas")}>Vendas</button>
        <button onClick={() => setTab("produtos")}>Produtos</button>
        <button onClick={() => setTab("pendentes")}>Pendentes</button>
        <button onClick={() => setTab("stats")}>Estatísticas</button>
        <button onClick={() => setTab("extrato")}>Extrato</button>

        <hr />

        <button onClick={() => {
          signOut(auth);
          localStorage.removeItem("token");
          setToken("");
        }}>
          Sair
        </button>
      </div>

      {/* CONTEÚDO */}
      <div style={{ flex: 1, padding: 20, display: "flex" }}>

        {/* AREA PRINCIPAL */}
        <div style={{ flex: 2 }}>
          <h1>💰 MAGNUS</h1>

          {tab === "produtos" && (
            <div>
              <h2>📦 Produtos</h2>

              <input placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
              <input placeholder="Preço de compra" value={preco} onChange={e => setPreco(e.target.value)} />
              <input placeholder="Preço de venda" value={precoVenda} onChange={e => setPrecoVenda(e.target.value)} />
              <input placeholder="Estoque" value={estoque} onChange={e => setEstoque(e.target.value)} />

              {/* UPLOAD */}
              <input type="file" onChange={e => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => setImagem(reader.result);
                  reader.readAsDataURL(file);
                }
              }} />

              <button onClick={adicionarProduto}>➕ Adicionar produto</button>
            </div>
          )}
        </div>

        {/* AREA DIREITA */}
        <div style={{ flex: 1, paddingLeft: 20 }}>
          <h3>🛍️ Produtos cadastrados</h3>

          {produtos.map(p => (
            <div key={p.id} style={{ border: "1px solid #333", marginBottom: 10, padding: 10 }}>
              {p.imagem && (
                <img src={p.imagem} alt="" style={{ width: "100%", height: 120, objectFit: "cover" }} />
              )}
              <strong>{p.nome}</strong>
              <p>R$ {p.precoVenda}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}