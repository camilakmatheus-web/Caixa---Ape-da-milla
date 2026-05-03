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
  const [precoCompra, setPrecoCompra] = useState("");
  const [precoVenda, setPrecoVenda] = useState("");
  const [estoque, setEstoque] = useState("");

  const [imagem, setImagem] = useState("");

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
    if (!nome || !precoCompra || !precoVenda || !estoque) return;

    setProdutos(prev => [
      ...prev,
      {
        id: Date.now(),
        nome,
        preco: Number(precoCompra),
        precoVenda: Number(precoVenda),
        estoque: Number(estoque),
        imagem
      }
    ]);

    setNome("");
    setPrecoCompra("");
    setPrecoVenda("");
    setEstoque("");
    setImagem("");
  };

  const produto = produtos.find(p =>
    p.nome?.toLowerCase().includes(busca.toLowerCase())
  );

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
          p.id === id ? { ...p, qtd: p.qtd - 1 } : p
        )
        .filter(p => p.qtd > 0)
    );
  };

  const limparCarrinho = () => setCarrinho([]);

  const total = carrinho.reduce(
    (a, p) => a + p.precoVenda * (p.qtd || 1),
    0
  );

  const finalizar = () => {
    if (!carrinho.length) return;

    const agora = new Date();

    const venda = {
      id: Date.now(),
      cliente: cliente || "Sem nome",
      pagamento,
      modo: modoVenda,
      itens: carrinho,
      total,
      data: agora.toISOString().split("T")[0],
      hora: agora.toTimeString().slice(0, 5)
    };

    if (modoVenda === "pendente") {
      setPendentes(prev => [...prev, venda]);
    } else {
      setVendas(prev => [...prev, venda]);
    }

    setCarrinho([]);
  };

  // ================= LOGIN SCREEN =================
  if (!token) {
    return (
      <div style={{ padding: 20 }}>
        <h2>MAGNUS Login</h2>

        <input placeholder="email" onChange={e => setEmail(e.target.value)} />
        <input placeholder="senha" type="password" onChange={e => setPassword(e.target.value)} />

        <button onClick={login}>Entrar</button>
        <button onClick={register}>Criar conta</button>
        <button onClick={loginGoogle}>Google</button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex" }}>

      {/* MENU */}
      <div style={{ width: 220, background: "#111", color: "#fff", padding: 20 }}>
        <h2>MAGNUS</h2>

        <button onClick={() => setTab("vendas")}>Vendas</button>
        <button onClick={() => setTab("produtos")}>Produtos</button>
        <button onClick={() => setTab("pendentes")}>Pendentes</button>

        <button onClick={() => {
          signOut(auth);
          setToken("");
        }}>
          Sair
        </button>
      </div>

      {/* CONTEÚDO */}
      <div style={{ flex: 1, padding: 20 }}>

        {/* PRODUTOS */}
        {tab === "produtos" && (
          <div>
            <h2>Produtos</h2>

            <input placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
            <input placeholder="Compra" value={precoCompra} onChange={e => setPrecoCompra(e.target.value)} />
            <input placeholder="Venda" value={precoVenda} onChange={e => setPrecoVenda(e.target.value)} />
            <input placeholder="Estoque" value={estoque} onChange={e => setEstoque(e.target.value)} />

            <input type="file" onChange={e => {
              const file = e.target.files[0];
              const reader = new FileReader();
              reader.onload = () => setImagem(reader.result);
              reader.readAsDataURL(file);
            }} />

            <button onClick={adicionarProduto}>Adicionar</button>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {produtos.map(p => (
                <div key={p.id} style={{ border: "1px solid #333", padding: 10, width: 200 }}>
                  {p.imagem && <img src={p.imagem} width={80} />}
                  <h4>{p.nome}</h4>
                  <p>Compra: {p.preco}</p>
                  <p>Venda: {p.precoVenda}</p>
                  <p>Estoque: {p.estoque}</p>
                </div>
              ))}
            </div>

          </div>
        )}

        {tab === "vendas" && (
          <div>
            <h2>Vendas</h2>

            <input placeholder="Cliente" value={cliente} onChange={e => setCliente(e.target.value)} />

            <select value={modoVenda} onChange={e => setModoVenda(e.target.value)}>
              <option value="normal">Normal</option>
              <option value="pendente">Pendente</option>
            </select>

            {modoVenda === "normal" && (
              <select value={pagamento} onChange={e => setPagamento(e.target.value)}>
                <option value="dinheiro">Dinheiro</option>
                <option value="pix">Pix</option>
                <option value="cartao">Cartão</option>
              </select>
            )}

            <button onClick={finalizar}>Finalizar</button>

          </div>
        )}

        {tab === "pendentes" && <h2>Pendentes</h2>}

      </div>
    </div>
  );
}