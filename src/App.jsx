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
  const [clientes, setClientes] = useState([]);
  const [novoCliente, setNovoCliente] = useState("");
  const [clienteSelecionado, setClienteSelecionado] = useState(null);

  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [estoque, setEstoque] = useState("");

  const [busca, setBusca] = useState("");
  const [carrinho, setCarrinho] = useState([]);

  // 🔥 NIVEL 3
  const [cliente, setCliente] = useState("");
  const [pagamento, setPagamento] = useState("dinheiro");
  const [modoVenda, setModoVenda] = useState("normal"); // normal | pendente
  const [precoVenda, setPrecoVenda] = useState("");
  const [imagem, setImagem] = useState("");
  const [subTab, setSubTab] = useState("cadastro");
  const [produtoSelecionado, setProdutoSelecionado] = useState(null); 


  // ================= LOGIN =================
  const toNumber = (value) => {
  if (!value) return 0;
  return parseFloat(value.replace(",", "."));
};

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
  const precoNum = toNumber(preco);
  const precoVendaNum = toNumber(precoVenda);
  const estoqueNum = parseInt(estoque);

  // 🔥 VALIDAÇÃO
  if (!nome || precoNum <= 0 || precoVendaNum <= 0 || isNaN(estoqueNum)) {
    alert("Preencha os valores corretamente");
    return;
  }

  setProdutos(prev => [
    ...prev,
    {
      id: Date.now(),
      nome,
      preco: precoNum,
      precoVenda: precoVendaNum,
      estoque: estoqueNum,
      imagem
    }
  ]);

  // limpar campos
  setNome("");
  setPreco("");
  setPrecoVenda("");
  setEstoque("");
  setImagem("");
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
    (a, p) => a + (p.precoVenda || 0) * (p.qtd || 1),
    0
  );

  // ================= FINALIZAR (VENDA + PENDENTE) =================
 // ================= FINALIZAR (VENDA + PENDENTE) =================
const finalizar = () => {
  if (!carrinho.length) return;

  // 🚨 OBRIGAR CLIENTE EM VENDA PENDENTE
  if (modoVenda === "pendente" && !cliente) {
    alert("Selecione um cliente");
    return;
  }

  const agora = new Date();
  const timestamp = Date.now();

  const venda = {
    id: timestamp,
    cliente: cliente, // ✅ agora é obrigatório
    pagamento: modoVenda === "normal" ? pagamento : null,
    modo: modoVenda,
    itens: carrinho,
    total,
    data: agora.toISOString().split("T")[0],
    hora: agora.toTimeString().slice(0, 5),
    timestamp
  };

  // 🔥 SEPARAÇÃO CORRETA
  if (modoVenda === "pendente") {
    setPendentes(prev => [...prev, venda]);
  } else {
    setVendas(prev => [...prev, venda]);
  }

  // 🔄 RESET
  setCarrinho([]);
  setCliente("");
  setPagamento("dinheiro");
  setModoVenda("normal");
};
// ================= REMOVER PENDENTE =================
const removerPendente = (id) => {
  setPendentes(prev => prev.filter(p => p.id !== id));
};
const adicionarCliente = () => {
  if (!novoCliente) return;

  setClientes(prev => [
    ...prev,
    {
      id: Date.now(),
      nome: novoCliente
    }
  ]);

  setNovoCliente("");
};
// 📊 RESUMO DO DIA
const hoje = new Date().toISOString().split("T")[0];

const vendasHoje = vendas.filter(v => v.data === hoje);

const totalHoje = vendasHoje.reduce(
  (soma, v) => soma + v.total,
  0
);
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

      <div style={{ flex: 1, padding: 20 }}>

        <h1>💰 MAGNUS</h1>
        {user && <p>👤 {user.displayName}</p>}

        {tab === "vendas" && (
          <div>

            <h2>💰 Vendas</h2>

            <input placeholder="Cliente (opcional)" value={cliente} onChange={e => setCliente(e.target.value)} />

            <select value={modoVenda} onChange={e => setModoVenda(e.target.value)}>
              <option value="normal">Venda normal</option>
              <option value="pendente">Venda pendente</option>
            </select>

            {modoVenda === "normal" && (
              <select value={pagamento} onChange={e => setPagamento(e.target.value)}>
                <option value="dinheiro">Dinheiro</option>
                <option value="pix">Pix</option>
                <option value="cartao">Cartão</option>
              </select>
            )}

            <input placeholder="Buscar produto" value={busca} onChange={e => setBusca(e.target.value)} />

            {produto && (
              <div>
                {produto.nome} - R$ {produto.preco}
                <button onClick={addCarrinho}>Adicionar</button>
              </div>
            )}

            <h3>Carrinho</h3>

            {carrinho.map((item, i) => (
              <div key={i}>
                {item.nome} x{item.qtd || 1}
                <button onClick={() => removerItem(item.id)}>➖</button>
              </div>
            ))}

            <button onClick={limparCarrinho}>Limpar</button>

            <h3>Total: R$ {total.toFixed(2)}</h3>

            <button onClick={finalizar}>Finalizar</button>

            <hr />

            <h3>Total do dia: R$ {totalHoje.toFixed(2)}</h3>

            {vendasHoje.map(v => (
              <div key={v.id}>
                🕒 {v.hora} - R$ {v.total}
              </div>
            ))}

          </div>
        )}

        {tab === "produtos" && (
  <div>
    <h2>📦 Produtos</h2>

    {/* SUB MENU */}
    <div style={{ marginBottom: 20 }}>
      <button onClick={() => setSubTab("cadastro")}>➕ Cadastrar</button>
      <button onClick={() => setSubTab("lista")}>📦 Produtos adicionados</button>
    </div>

    {/* ================= CADASTRO ================= */}
    {subTab === "cadastro" && (
      <div>
        <div>
          <input
            placeholder="Nome"
            value={nome}
            onChange={e => setNome(e.target.value)}
          />
        </div>

        <div>
          <span>R$ </span>
          <input
            placeholder="Preço de compra"
            value={preco}
            onChange={e => setPreco(e.target.value)}
          />
        </div>

        <div>
          <span>R$ </span>
          <input
            placeholder="Preço de venda"
            value={precoVenda}
            onChange={e => setPrecoVenda(e.target.value)}
          />
        </div>

        <div>
          <input
            placeholder="Estoque"
            value={estoque}
            onChange={e => setEstoque(e.target.value)}
          />
        </div>

        <div>
          <input
            type="file"
            onChange={e => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setImagem(reader.result);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
        </div>

        <button onClick={adicionarProduto}>
          ➕ Adicionar produto
        </button>
      </div>
    )}
    {/* ================= LISTA ================= */}
 {subTab === "lista" && (
  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
    <div style={{ display: "flex", gap: 20 }}>

      <div style={{ width: 200 }}>
        {produtos.map(p => (
          <div
            key={p.id}
            style={{
              padding: 10,
              border: "1px solid #333",
              marginBottom: 10,
              cursor: "pointer"
            }}
            onClick={() => setProdutoSelecionado(p)}
          >
            {p.nome}
          </div>
        ))}
      </div>

      <div style={{ flex: 1 }}>
        {produtoSelecionado ? (
          <div>
            <h3>{produtoSelecionado.nome}</h3>

            {produtoSelecionado.imagem && (
              <img
                src={produtoSelecionado.imagem}
                style={{ width: 200, borderRadius: 10 }}
              />
            )}

            <p>💰 Compra: R$ {produtoSelecionado.preco}</p>
            <p>💸 Venda: R$ {produtoSelecionado.precoVenda}</p>
            <p>📦 Estoque: {produtoSelecionado.estoque}</p>

            <p>
              📊 Lucro unit: R${" "}
              {(produtoSelecionado.precoVenda - produtoSelecionado.preco).toFixed(2)}
            </p>

            <p>
              📈 Lucro total: R${" "}
              {(
                (produtoSelecionado.precoVenda - produtoSelecionado.preco) *
                produtoSelecionado.estoque
              ).toFixed(2)}
            </p>
          </div>
        ) : (
          <p>Selecione um produto</p>
        )}
      </div>

    </div>

    <div style={{ borderTop: "2px solid #333", paddingTop: 20 }}>
      <h3>📊 Estatísticas gerais</h3>

      <p>
        💰 Total investido: R${" "}
        {produtos.reduce((s, p) => s + p.preco * p.estoque, 0).toFixed(2)}
      </p>

      <p>
        💸 Valor potencial de venda: R${" "}
        {produtos.reduce((s, p) => s + (p.precoVenda || 0) * p.estoque, 0).toFixed(2)}
      </p>

      <p>
        📈 Lucro total estimado: R${" "}
        {produtos.reduce(
          (s, p) =>
            s + ((p.precoVenda || 0) - p.preco) * p.estoque,
          0
        ).toFixed(2)}
      </p>
    </div>

  </div>
)}

</div>
)}  // 👈 🔥 ISSO AQUI FALTAVA
{tab === "pendentes" && (
  <div>
    <h2>📌 Pendentes</h2>

    {/* ADICIONAR CLIENTE */}
    <div style={{ marginBottom: 20 }}>
      <input
        placeholder="Nome do cliente"
        value={novoCliente}
        onChange={e => setNovoCliente(e.target.value)}
      />
      <button onClick={adicionarCliente}>➕ Adicionar</button>
    </div>

    {/* LISTA DE CLIENTES */}
    {clientes.map(c => {
      const vendasCliente = pendentes.filter(p => p.cliente === c.nome);

      const totalCliente = vendasCliente.reduce(
        (soma, v) => soma + v.total,
        0
      );

      return (
        <div
          key={c.id}
          style={{
            border: "1px solid #333",
            padding: 10,
            marginBottom: 10,
            borderRadius: 8
          }}
        >
          <h3 onClick={() => setClienteSelecionado(c.nome)}>
            👤 {c.nome}
          </h3>

          <p>💰 Total: R$ {totalCliente.toFixed(2)}</p>

          <button
            onClick={() =>
              vendasCliente.forEach(v => marcarComoPago(v))
            }
          >
            ✅ Finalizar tudo
          </button>

          <button
            onClick={() =>
              setClientes(prev => prev.filter(x => x.id !== c.id))
            }
          >
            ❌ Excluir cliente
          </button>

          {/* DETALHES */}
          {clienteSelecionado === c.nome && (
            <div style={{ marginTop: 10 }}>
              {vendasCliente.map(v => (
                <div key={v.id}>
                  🧾 R$ {v.total.toFixed(2)} - {v.hora}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    })}

    {/* TOTAL GERAL */}
    <h3>
      💵 Total geral: R${" "}
      {pendentes
        .reduce((soma, v) => soma + v.total, 0)
        .toFixed(2)}
    </h3>
  </div>
)}
{tab === "stats" && <h2>Estatísticas</h2>}
{tab === "extrato" && <h2>Extrato</h2>}

    </div>
  </div>
);
}