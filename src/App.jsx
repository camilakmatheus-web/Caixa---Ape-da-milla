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
  const [imagem, setImagem] = useState(""); // ✅ NOVO

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
    setImagem("");
  };

  const produto = produtos.find(p =>
    p.nome?.toLowerCase().includes(busca.toLowerCase())
  );

  // ================= UPLOAD IMAGEM =================
  const handleImagem = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagem(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // ================= RESTO DO CÓDIGO (SEM ALTERAÇÃO) =================
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
    (a, p) => a + p.preco * (p.qtd || 1),
    0
  );

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

  // ================= UI =================
  if (!token) {
    return <div>Login...</div>;
  }

  return (
    <div style={{ display: "flex", fontFamily: "Arial" }}>

      {/* LADO ESQUERDO ORIGINAL */}
      <div style={{ flex: 1, padding: 20 }}>

        {tab === "produtos" && (
          <div>
            <h2>📦 Produtos</h2>

            <input placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
            <input placeholder="Preço de compra" value={preco} onChange={e => setPreco(e.target.value)} />

            {/* ✅ CORRIGIDO */}
            <input
              placeholder="Preço de venda"
              value={precoVenda}
              onChange={e => setPrecoVenda(e.target.value)}
            />

            <input placeholder="Estoque" value={estoque} onChange={e => setEstoque(e.target.value)} />

            {/* ✅ UPLOAD */}
            <input type="file" onChange={handleImagem} />

            <button onClick={adicionarProduto}>➕ Adicionar produto</button>
          </div>
        )}

      </div>

      {/* ✅ NOVA AREA DIREITA */}
      <div style={{
        width: 300,
        background: "#111",
        color: "#fff",
        padding: 15,
        overflowY: "auto"
      }}>
        <h3>🛍 Produtos</h3>

        {produtos.map(p => (
          <div key={p.id} style={{
            marginBottom: 15,
            borderBottom: "1px solid #333",
            paddingBottom: 10
          }}>
            {p.imagem && (
              <img
                src={p.imagem}
                alt=""
                style={{ width: "100%", borderRadius: 8 }}
              />
            )}

            <p>{p.nome}</p>
            <p>R$ {p.precoVenda}</p>
          </div>
        ))}
      </div>

    </div>
  );
}