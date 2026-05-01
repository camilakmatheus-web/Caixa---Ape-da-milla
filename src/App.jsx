import { useState, useEffect } from "react";

const API = "https://caixa-ape-da-milla.onrender.com";

export default function App() {
  const [produtos, setProdutos] = useState([]);
  const [vendas, setVendas] = useState([]);
  const [pendentes, setPendentes] = useState([]);

  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [estoque, setEstoque] = useState("");

  const [carrinho, setCarrinho] = useState([]);
  const [busca, setBusca] = useState("");

  const [carregado, setCarregado] = useState(false);

  // 🔥 CARREGAR DADOS
  useEffect(() => {
    const carregar = async () => {
      try {
        const res = await fetch(`${API}/dados`);

        if (!res.ok) return;

        const dados = await res.json();

        setProdutos(dados?.produtos || []);
        setVendas(dados?.vendas || []);
        setPendentes(dados?.pendentes || []);

        setCarregado(true);
      } catch (err) {
        console.log("Erro ao carregar:", err);
      }
    };

    carregar();
  }, []);

  // 🔥 SALVAR (SÓ DEPOIS DE CARREGAR)
  useEffect(() => {
    if (!carregado) return;

    const salvar = async () => {
      try {
        await fetch(`${API}/dados`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            produtos,
            vendas,
            pendentes
          })
        });
      } catch (err) {
        console.log("Erro ao salvar:", err);
      }
    };

    salvar();
  }, [produtos, vendas, pendentes, carregado]);

  // PRODUTOS
  const adicionarProduto = () => {
    if (!nome || !preco || !estoque) return;

    setProdutos([
      ...produtos,
      {
        id: Date.now(),
        nome,
        preco: parseFloat(preco),
        estoque: parseInt(estoque)
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

  const totalCarrinho = carrinho.reduce((a, p) => a + p.preco, 0);

  const finalizarVenda = () => {
    if (carrinho.length === 0) return;

    setVendas([
      ...vendas,
      {
        itens: carrinho,
        total: totalCarrinho,
        data: new Date().toISOString()
      }
    ]);

    setCarrinho([]);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>💰 Apé da Milla</h1>

      <h2>Produtos</h2>

      <input placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
      <input placeholder="Preço" value={preco} onChange={e => setPreco(e.target.value)} />
      <input placeholder="Estoque" value={estoque} onChange={e => setEstoque(e.target.value)} />

      <button onClick={adicionarProduto}>Salvar</button>

      {produtos.map(p => (
        <div key={p.id}>
          {p.nome} - R$ {p.preco} (Estoque: {p.estoque})
        </div>
      ))}

      <hr />

      <h2>Caixa</h2>

      <input
        placeholder="Buscar produto"
        value={busca}
        onChange={e => setBusca(e.target.value)}
      />

      {produto && (
        <div>
          {produto.nome} - R$ {produto.preco}
          <button onClick={addCarrinho}>Adicionar</button>
        </div>
      )}

      <h3>Total: R$ {totalCarrinho.toFixed(2)}</h3>

      <button onClick={finalizarVenda}>Finalizar Venda</button>
    </div>
  );
}