import { useState, useEffect } from "react";
import { auth, provider } from "./firebase";
import { signInWithPopup, signOut } from "firebase/auth";

const API = "https://caixa-ape-da-milla.onrender.com";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [produtos, setProdutos] = useState([]);
  const [vendas, setVendas] = useState([]);
  const [pendentes, setPendentes] = useState([]);

  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [estoque, setEstoque] = useState("");

  const [busca, setBusca] = useState("");
  const [carrinho, setCarrinho] = useState([]);

  // ================= LOGIN NORMAL =================
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

  // ================= LOGIN GOOGLE =================
  const loginGoogle = async () => {
    const res = await signInWithPopup(auth, provider);
    const user = res.user;

    // aqui você pode futuramente mandar pro backend
    setUser(user);

    // simula login (até integrar backend)
    setToken("google-logado");
  };

  // ================= CARREGAR =================
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

  // ================= SALVAR =================
  useEffect(() => {
    if (!token) return;

    fetch(API + "/dados", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({ produtos, vendas, pendentes })
    });
  }, [produtos, vendas, pendentes]);

  // ================= PRODUTOS =================
  const adicionarProduto = () => {
    if (!nome || !preco || !estoque) return;

    setProdutos([
      ...produtos,
      {
        id: Date.now(),
        nome,
        preco: Number(preco),
        estoque: Number(estoque)
      }
    ]);

    setNome("");
    setPreco("");
    setEstoque("");
  };

  const produto = produtos.find(p =>
    p.nome?.toLowerCase().includes(busca.toLowerCase())
  );

  const addCarrinho = () => {
    if (!produto || produto.estoque <= 0) return;

    setCarrinho([...carrinho, produto]);

    setProdutos(produtos.map(p =>
      p.id === produto.id
        ? { ...p, estoque: p.estoque - 1 }
        : p
    ));

    setBusca("");
  };

  const total = carrinho.reduce((a, p) => a + p.preco, 0);

  const finalizar = () => {
    if (!carrinho.length) return;

    setVendas([
      ...vendas,
      {
        itens: carrinho,
        total,
        data: new Date().toISOString()
      }
    ]);

    setCarrinho([]);
  };

  // ================= LOGIN SCREEN =================
  if (!token) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Login</h2>

        <input placeholder="email" onChange={e => setEmail(e.target.value)} />
        <input placeholder="senha" type="password" onChange={e => setPassword(e.target.value)} />

        <button onClick={login}>Entrar</button>
        <button onClick={register}>Criar conta</button>

        <hr />

        {/* LOGIN GOOGLE */}
        <button onClick={loginGoogle}>
          🔐 Entrar com Google
        </button>
      </div>
    );
  }

  // ================= APP =================
  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>💰 Sistema Caixa</h1>

      {user && <p>👤 {user.displayName}</p>}

      <button onClick={() => {
        localStorage.removeItem("token");
        setToken("");
        setUser(null);
        signOut(auth);
      }}>
        Sair
      </button>

      <hr />

      <h2>Produtos</h2>

      <input placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
      <input placeholder="Preço" value={preco} onChange={e => setPreco(e.target.value)} />
      <input placeholder="Estoque" value={estoque} onChange={e => setEstoque(e.target.value)} />

      <button onClick={adicionarProduto}>Adicionar</button>

      {produtos.map(p => (
        <div key={p.id}>
          {p.nome} - R$ {p.preco} ({p.estoque})
        </div>
      ))}

      <hr />

      <h2>Caixa</h2>

      <input placeholder="Buscar" value={busca} onChange={e => setBusca(e.target.value)} />

      {produto && (
        <div>
          {produto.nome} - R$ {produto.preco}
          <button onClick={addCarrinho}>Adicionar</button>
        </div>
      )}

      <h3>Total: R$ {total.toFixed(2)}</h3>

      <button onClick={finalizar}>Finalizar</button>
    </div>
  );
}