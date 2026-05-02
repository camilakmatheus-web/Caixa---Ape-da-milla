import { useState, useEffect } from "react";

const API = "https://caixa-ape-da-milla.onrender.com";

export default function App() {
  const [produtos, setProdutos] = useState([]);
  const [vendas, setVendas] = useState([]);
  const [pendentes, setPendentes] = useState([]);

  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [estoque, setEstoque] = useState("");

  const [busca, setBusca] = useState("");
  const [carrinho, setCarrinho] = useState([]);

  useEffect(() => {
    fetch(`${API}/dados`)
      .then(r => r.json())
      .then(d => {
        setProdutos(d.produtos || []);
        setVendas(d.vendas || []);
        setPendentes(d.pendentes || []);
      })
      .catch(console.log);
  }, []);

  useEffect(() => {
    fetch(`${API}/dados`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ produtos, vendas, pendentes })
    }).catch(console.log);
  }, [produtos, vendas, pendentes]);

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
    p.nome.toLowerCase().includes(busca.toLowerCase())
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

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        <h1 style={styles.title}>💰 Apé da Milla</h1>

        {/* PRODUTOS */}
        <div style={styles.card}>
          <h2>📦 Produtos</h2>

          <div style={styles.row}>
            <input style={styles.input} placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
            <input style={styles.input} placeholder="Preço" value={preco} onChange={e => setPreco(e.target.value)} />
            <input style={styles.input} placeholder="Estoque" value={estoque} onChange={e => setEstoque(e.target.value)} />
          </div>

          <button style={styles.button} onClick={adicionarProduto}>
            + Adicionar
          </button>

          <div style={styles.list}>
            {produtos.map(p => (
              <div key={p.id} style={styles.item}>
                <b>{p.nome}</b> — R$ {p.preco} | estoque: {p.estoque}
              </div>
            ))}
          </div>
        </div>

        {/* CAIXA */}
        <div style={styles.card}>
          <h2>🛒 Caixa</h2>

          <input
            style={styles.inputFull}
            placeholder="Buscar produto..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />

          {produto && (
            <div style={styles.result}>
              {produto.nome} — R$ {produto.preco}
              <button style={styles.smallBtn} onClick={addCarrinho}>Adicionar</button>
            </div>
          )}

          <h3>Total: R$ {total.toFixed(2)}</h3>

          <button style={styles.buttonGreen} onClick={finalizar}>
            Finalizar Venda
          </button>
        </div>

      </div>
    </div>
  );
}

const styles = {
  page: {
    background: "#0f172a",
    minHeight: "100vh",
    padding: 20,
    color: "#fff",
    fontFamily: "Arial"
  },
  container: {
    maxWidth: 900,
    margin: "0 auto"
  },
  title: {
    textAlign: "center",
    marginBottom: 20
  },
  card: {
    background: "#1e293b",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
  },
  row: {
    display: "flex",
    gap: 10,
    marginBottom: 10
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    border: "none"
  },
  inputFull: {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10
  },
  button: {
    padding: 10,
    background: "#3b82f6",
    border: "none",
    color: "#fff",
    borderRadius: 8,
    cursor: "pointer"
  },
  buttonGreen: {
    padding: 10,
    background: "#22c55e",
    border: "none",
    color: "#fff",
    borderRadius: 8,
    cursor: "pointer",
    width: "100%"
  },
  list: {
    marginTop: 10
  },
  item: {
    padding: 8,
    borderBottom: "1px solid #334155"
  },
  result: {
    margin: "10px 0",
    padding: 10,
    background: "#334155",
    borderRadius: 8,
    display: "flex",
    justifyContent: "space-between"
  },
  smallBtn: {
    background: "#f59e0b",
    border: "none",
    padding: "5px 10px",
    borderRadius: 6,
    cursor: "pointer"
  }
};