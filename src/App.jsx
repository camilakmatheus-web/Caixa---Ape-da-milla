       // ===== BLOCO: IMPORTAÇÕES =====
// Importa Firebase (auth), bibliotecas externas e hooks do React

import { auth, provider } from "./firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import jsPDF from "jspdf";
import { useState, useEffect, useMemo } from "react";
import "./Css dois.css";


// ===== BLOCO: CONFIGURAÇÃO API =====
// URL base do seu backend

const API = "https://caixa-ape-da-milla.onrender.com";


// ===== BLOCO: FUNÇÃO UTILITÁRIA (safeNumber) =====
// Converte valores para número com segurança (aceita vírgula, texto, etc)

const safeNumber = (value) => {
  if (value === null || value === undefined) return 0;

  const num = Number(
    String(value)
      .replace(",", ".")
      .replace(/[^\d.-]/g, "")
  );

  return isNaN(num) ? 0 : num;
};
const cardStyle = {
  background:
    "linear-gradient(180deg, rgba(25,25,35,0.95), rgba(12,12,18,0.98))",

  border: "1px solid rgba(255,255,255,0.08)",

  borderRadius: 22,

  padding: 22,

  color: "#fff",

  boxShadow:
    "0 15px 40px rgba(0,0,0,0.35)",

  backdropFilter: "blur(14px)",

  transition: "0.25s ease",

  position: "relative",

  overflow: "hidden"
};

// ===== BLOCO: COMPONENTE PRINCIPAL =====

export default function App() {



  const normalizarData = (data) => {
  if (!data) return null;

  // já está em ISO (2026-06-03)
  if (data.includes("-")) {
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  // já está em BR
  if (data.includes("/")) {
    const [dia, mes, ano] = data.split("/");
    return `${dia}/${mes}/${ano}`;
  }

  return null;
};
const dataParaDate = (data) => {
  if (!data) return new Date(0);

  if (data.includes("-")) {
    return new Date(data);
  }

  const [dia, mes, ano] = data.split("/");
  return new Date(Number(ano), Number(mes) - 1, Number(dia));
};
  // ===== BLOCO: ESTADOS GERAIS =====
  // Controle geral da aplicação

  const [ajusteEstoque, setAjusteEstoque] =
  useState(1);

const [estoqueIlimitadoTemp,
  setEstoqueIlimitadoTemp] =
  useState(false);
  const [produtoModal, setProdutoModal] =
  useState(null);
  const [modalCategoria, setModalCategoria] =
  useState(false);
  const [openHistoricoConsumo, setOpenHistoricoConsumo] = useState(false);
  const [consumos, setConsumos] = useState([]);
  const [buscaConsumo, setBuscaConsumo] = useState("");
  const [openConsumo, setOpenConsumo] = useState(false);
  const [carrinhoConsumo, setCarrinhoConsumo] = useState([]);
  const [dataInicioConsumo, setDataInicioConsumo] = useState("");
  
const [dataFimConsumo, setDataFimConsumo] = useState("");
const [filtroAplicadoConsumo, setFiltroAplicadoConsumo] = useState(false);
  const [registrosPendentes, setRegistrosPendentes] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("vendas");
  const hojeBR = normalizarData(new Date().toLocaleDateString("pt-BR"));
  const [editando, setEditando] = useState(null);
  const [abrirClientePendente, setAbrirClientePendente] = useState(false);
  const [anotacaoSelecionada, setAnotacaoSelecionada] = useState(null);
  const [clientePendente, setClientePendente] = useState("");
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);
  const [anotacaoExcluir, setAnotacaoExcluir] = useState(null);
  const [mostrarCaixa, setMostrarCaixa] = useState(true);
  const [confirmarVenda, setConfirmarVenda] = useState(false);
  const [confirmarDespesa, setConfirmarDespesa] = useState(false);
  const [modalHistorico, setModalHistorico] = useState(false);
  const [ajusteCaixa, setAjusteCaixa] = useState(0);
  const [clienteHistorico, setClienteHistorico] = useState(null);
  const [confirmarCancelamento, setConfirmarCancelamento] =
  useState(false);

const consumosFiltrados = consumos.filter(c => {

let dataConsumo;

if(c.data.includes("-")){

const [ano, mes, dia] = c.data.split("-");

dataConsumo = new Date(
Number(ano),
Number(mes)-1,
Number(dia)
);

}else{

const [dia, mes, ano] = c.data.split("/");

dataConsumo = new Date(
Number(ano),
Number(mes)-1,
Number(dia)
);

}

if(dataInicioConsumo){

const inicio = new Date(dataInicioConsumo);

inicio.setHours(0,0,0,0);

if(dataConsumo < inicio){

return false;

}

}

if(dataFimConsumo){

const fim = new Date(dataFimConsumo);

fim.setHours(23,59,59,999);

if(dataConsumo > fim){

return false;

}

}

return true;

});

  const [modalHistoricoDespesa,setModalHistoricoDespesa] = useState(false);

const [categoriaDespesaSelecionada,setCategoriaDespesaSelecionada] = useState(null);

const [dataInicioDespesa,setDataInicioDespesa] = useState("");

const [filtroAplicadoDespesa, setFiltroAplicadoDespesa] = useState(false);

const [dataFimDespesa,setDataFimDespesa] = useState("");

const [modalReajuste, setModalReajuste] =
  useState(false);

const [clienteReajuste, setClienteReajuste] =
  useState(null);

const [novoValorCliente, setNovoValorCliente] =
  useState("");

  const [modalQuitarTotal, setModalQuitarTotal] =
  useState(false);

const [clienteQuitarTotal, setClienteQuitarTotal] =
  useState(null);

const [vendaCancelar, setVendaCancelar] =
  useState(null);
const [confirmarQuitacao, setConfirmarQuitacao] =
  useState(false);

const [resumoQuitacao, setResumoQuitacao] =
  useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loaded, setLoaded] = useState(false);
  const [firstLoadDone, setFirstLoadDone] = useState(false);
  const [menuAberto, setMenuAberto] = useState(true);
  const [confirmarExcluirCliente, setConfirmarExcluirCliente] =
  useState(false);

const [clienteExcluir, setClienteExcluir] =
  useState(null);

  const [desconto, setDesconto] = useState(0);
const [modalDesconto, setModalDesconto] = useState(false);
const [valorDesconto, setValorDesconto] = useState("");



  // ===== BLOCO: DESPESAS =====
  // Controle de despesas do sistema

  const [despesas, setDespesas] = useState([]);
  const [nomeDespesa, setNomeDespesa] = useState("");
  const [valorDespesa, setValorDespesa] = useState("");
  const [categoriaDespesa, setCategoriaDespesa] = useState("Geral");
  const categoriasDespesa = [...new Set(despesas.map(d => d.categoria))];
  const [filtroDespesaCategoria, setFiltroDespesaCategoria] = useState(null);
 
const despesasFiltradas = despesas.filter(d => {

if(
categoriaDespesaSelecionada &&
d.categoria !== categoriaDespesaSelecionada
){
return false;
}


// NORMALIZA DATA DA DESPESA
const converterDataFiltro = (data) => {

if(!data) return null;


// 2026-06-28
if(data.includes("-")){

const [ano, mes, dia] = data.split("-");

return new Date(
Number(ano),
Number(mes)-1,
Number(dia)
);

}


// 28/06/2026
if(data.includes("/")){

const [dia, mes, ano] = data.split("/");

return new Date(
Number(ano),
Number(mes)-1,
Number(dia)
);

}


return null;

};


const dataDespesa = converterDataFiltro(d.data);

if(!dataDespesa) return false;

dataDespesa.setHours(0,0,0,0);


// DATA INICIAL

if(dataInicioDespesa){

const inicio = converterDataFiltro(dataInicioDespesa);

inicio.setHours(0,0,0,0);


if(dataDespesa < inicio){
return false;
}

}


// DATA FINAL

if(dataFimDespesa){

const fim = converterDataFiltro(dataFimDespesa);

fim.setHours(23,59,59,999);


if(dataDespesa > fim){
return false;
}

}


return true;

});
  // ===== BLOCO: DADOS PRINCIPAIS =====
  // Dados do sistema (produtos, vendas, clientes)

  const [produtos, setProdutos] = useState([]);
  const [categoria, setCategoria] = useState("");
  const [categoriasProdutos, setCategoriasProdutos] = useState([]);
const [categoriasDespesas, setCategoriasDespesas] = useState([]);
  const [novaCategoria, setNovaCategoria] = useState("");
  const [vendas, setVendas] = useState([]);
  const [historicoClientes, setHistoricoClientes] = useState(() => {
  return JSON.parse(
    localStorage.getItem("historicoClientes")
  ) || [];
});
  const [pendentes, setPendentes] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [menuPagamento, setMenuPagamento] = useState(false);
  
  // Bloqueio de quitação Total  //

const possuiPendencias = pendentes.some(
  p => p.cliente === clienteQuitarTotal?.nome
);

const possuiQuitacaoParcial = possuiPendencias &&
  vendas.some(
    v =>
      v.cliente === clienteQuitarTotal?.nome &&
      v.modo === "pendente_pago" &&
      v.origem === "quitacao"
    );

 

// converter data//

const converterData = (data) => {

  if (!data) return new Date();

  const [dia, mes, ano] = data.split("/");

  return new Date(
    Number(ano),
    Number(mes) - 1,
    Number(dia)
  );
};
  // ===== BLOCO: CLIENTES =====
  // Controle de cliente selecionado e cadastro

  const [novoCliente, setNovoCliente] = useState("");
  const [clienteSelecionado, setClienteSelecionado] = useState(null);


  // ===== BLOCO: CADASTRO DE PRODUTO =====

  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [estoque, setEstoque] = useState("");


  // ===== BLOCO: BUSCA E CARRINHO =====

  const [busca, setBusca] = useState("");
  const [carrinho, setCarrinho] = useState([]);


  // ===== BLOCO: VENDA (NÍVEL 3) =====

  const [cliente, setCliente] = useState("");
  const [pagamento, setPagamento] = useState("dinheiro");
  const [modoVenda, setModoVenda] = useState("normal"); // normal | pendente
  const [menuModoVenda, setMenuModoVenda] = useState(false);
  const [anotacao, setAnotacao] = useState("");
  const [precoVenda, setPrecoVenda] = useState("");
  const [imagem, setImagem] = useState("");
  const [anotacoes, setAnotacoes] = useState([]);
  const [anotacaoTexto, setAnotacaoTexto] = useState("");
  const [modalQuitar, setModalQuitar] = useState(false);
  const [clienteQuitar, setClienteQuitar] = useState(null);
  const [valorQuitacao, setValorQuitacao] = useState("");
  

  const [subTab, setSubTab] = useState("cadastro");
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  const [periodo, setPeriodo] = useState("7d");

  const [caixa, setCaixa] = useState(0);

  const [ajusteAberto, setAjusteAberto] = useState(false);
  const [valorAjuste, setValorAjuste] = useState("");
 const vendasCliente = pendentes.filter(
  p => p.cliente === clienteReajuste?.nome
);

const totalDivida = vendasCliente.reduce(
  (soma, v) => soma + Number(v.total || 0),
  0
);

const lucroTotal = vendasCliente.reduce(
  (soma, venda) =>
    soma +
    (venda.itens || []).reduce(
      (lucro, item) =>
        lucro +
        (
          (item.precoVenda || 0) -
          (item.preco || 0)
        ) *
        (item.qtd || 1),
      0
    ),
  0
);



  // ===== BLOCO: QUITAR CLIENTE (FIADO) =====
  // Move vendas pendentes para vendas pagas e adiciona ao caixa

 const quitarCliente = () => {

  if (!clienteQuitar) return;

  const valorPago = Number(
    valorQuitacao.replace(",", ".")
  );

  if (isNaN(valorPago) || valorPago <= 0) {
    alert("Digite um valor válido");
    return;
  }

  const vendasCliente = pendentes.filter(
    p => p.cliente === clienteQuitar.nome
  );

  const totalDivida = vendasCliente.reduce(
    (soma, v) => soma + (v.total || 0),
    0
  );

  if (valorPago > totalDivida) {
    alert("Valor maior que a dívida");
    return;
  }

  // 💰 caixa
  setCaixa(prev => prev + valorPago);

  const agora = new Date();

  // 🔥 custo total
  const custoTotal = vendasCliente.reduce(
    (soma, venda) =>
      soma +
      (venda.itens || []).reduce(
        (acc, item) =>
          acc +
          (item.preco || 0) *
          (item.qtd || 1),
        0
      ),
    0
  );

  // 📊 margem média REAL do cliente
 const lucroEstimado =
  valorPago * 0.35;

  // 🔥 CONFIRMAÇÃO BONITA
  

  // 🔥 registro da quitação
  const vendasQuitadas = [
  {
    id: Date.now(),
    cliente: clienteQuitar.nome,
    modo: "pendente_pago",
    origem: "quitacao",
    total: valorPago,
    lucroQuitacao: lucroEstimado,
    data: agora.toLocaleDateString("pt-BR"),
    hora: agora.toTimeString().slice(0, 5),
    timestamp: Date.now(),
    itens: []
  }
];

console.log("VENDAS QUITADAS");
console.log(
  "LUCRO QUITAÇÃO:",
  vendasQuitadas[0].lucroQuitacao
);

  setVendas(prev => [...prev, ...vendasQuitadas]);

  setClientes(prev =>
  prev.map(c =>
    c.nome === clienteQuitar.nome
      ? {
          ...c,
          possuiQuitacaoParcial: true
        }
      : c
  )
);


  const novoHistorico = [
  ...historicoClientes,
  ...vendasQuitadas
];

setHistoricoClientes(novoHistorico);

localStorage.setItem(
  "historicoClientes",
  JSON.stringify(novoHistorico)
);

  // 🔥 atualização pendentes
  let restante = valorPago;
  const novosPendentes = [];

  vendasCliente.forEach(v => {

    if (restante <= 0) {
      novosPendentes.push(v);
      return;
    }

    if (restante >= v.total) {
      restante -= v.total;
    } else {
      novosPendentes.push({
        ...v,
        total: v.total - restante
      });
      restante = 0;
    }

  });

  const outrosPendentes = pendentes.filter(
    p => p.cliente !== clienteQuitar.nome
  );

  setPendentes([
    ...outrosPendentes,
    ...novosPendentes
  ]);

  const saldoRestante = novosPendentes.reduce(
  (soma, p) => soma + (p.total || 0),
  0
);

if (saldoRestante <= 0) {

  setClientes(prev =>
    prev.map(c =>
      c.nome === clienteQuitar.nome
        ? {
            ...c,
            pagamentoParcial: false
          }
        : c
    )
  );

  setClientes(prev =>
  prev.map(c =>
    c.nome === clienteQuitar.nome
      ? {
          ...c,
          possuiQuitacaoParcial: true
        }
      : c
  )
);

}

const pendenciasRestantes = [
  ...outrosPendentes,
  ...novosPendentes
];

setPendentes(pendenciasRestantes);

if (
  !pendenciasRestantes.some(
    p => p.cliente === clienteQuitar.nome
  )
) {
  setClientes(prev =>
    prev.map(c =>
      c.nome === clienteQuitar.nome
        ? {
            ...c,
            possuiQuitacaoParcial: false
          }
        : c
    )
  );
}
  // 🔄 reset
  setModalQuitar(false);
  setClienteQuitar(null);
  setValorQuitacao("");
};


const quitarClienteTotal = (nomeCliente) => {

  const vendasCliente = pendentes.filter(
    p => p.cliente === nomeCliente
  );

  if (!vendasCliente.length) {
    alert("Cliente não possui pendências");
    return;
  }

  const totalDivida = vendasCliente.reduce(
    (soma, venda) => soma + (venda.total || 0),
    0
  );

  // 💰 adiciona ao caixa
  setCaixa(prev => prev + totalDivida);

  const agora = new Date();

 // 📈 lucro REAL das vendas pendentes

const lucroEstimado = vendasCliente.reduce(
  (soma, venda) =>
    soma +
    (venda.itens || []).reduce(
      (lucro, item) =>
        lucro +
        (
          Number(item.precoVenda || 0) -
          Number(item.preco || 0)
        ) *
        Number(item.qtd || 1),
      0
    ),
  0
);

  // 📝 registra a quitação
 const quitacaoTotal = {
  id: Date.now(),
  cliente: nomeCliente,
  modo: "pendente_pago_total",
  origem: "quitacao",
  total: totalDivida,
  lucroQuitacao: lucroEstimado,
  data: agora.toLocaleDateString("pt-BR"),
  hora: agora.toTimeString().slice(0, 5),
  timestamp: Date.now(),
  itens: []
};

setVendas(prev => [
  ...prev,
  {
    ...quitacaoTotal,
    itens: [
      {
        nome: `Quitação total - ${nomeCliente}`,
        qtd: 1,
        preco: totalDivida,
        precoVenda: totalDivida
      }
    ]
  }
]);

setClientes(prev =>
  prev.map(c =>
    c.nome === nomeCliente
      ? {
          ...c,
          possuiQuitacaoParcial: false
        }
      : c
  )
);

const novoHistorico = [
  ...historicoClientes,
  quitacaoTotal
];

setHistoricoClientes(novoHistorico);

localStorage.setItem(
  "historicoClientes",
  JSON.stringify(novoHistorico)
);

  // ❌ remove todos os pendentes do cliente
  setPendentes(prev =>
    prev.filter(
      p => p.cliente !== nomeCliente
    )
  );

};


  // ===== BLOCO: FILTRO DE CLIENTES =====
  // Sugestão automática baseada no nome digitado

  const clientesFiltrados =
    cliente.trim().length > 0
      ? clientes
          .filter(c =>
            c.nome?.toLowerCase().includes(cliente.toLowerCase())
          )
          .slice(0, 5)
      : [];



  // ===== BLOCO: RESET TOTAL (FRONTEND) =====
  // Apaga todos os dados do sistema local

 const resetarSistema = async () => {

  const confirmar = window.confirm(
    "⚠️ ATENÇÃO!\n\nIsso irá APAGAR TODO o sistema:\n- Produtos\n- Vendas\n- Pendentes\n- Clientes\n- Despesas\n- Anotações\n\nDeseja continuar?"
  );

  if (!confirmar) return;

  const confirmar2 = window.confirm(
    "🚨 ÚLTIMA CONFIRMAÇÃO!\n\nEssa ação NÃO pode ser desfeita.\n\nTem certeza absoluta?"
  );

  if (!confirmar2) return;

  try {

    await fetch(`${API}/resetar`, {
      method: "POST"
    });

    setProdutos([]);
    setCategoriasProdutos([]);
setCategoriasDespesas([]);

    setVendas([]);
    setPendentes([]);
    setClientes([]);

    setDespesas([]);
    setAnotacoes([]);

    console.log("ZEROU O CAIXA");
setCaixa(0);

    alert("✅ Sistema resetado com sucesso!");

  } catch (err) {

    alert("Erro ao resetar sistema");

  }

};



  // ===== BLOCO: ADICIONAR DESPESA =====

if(!categoriaDespesa){
 alert("Selecione uma categoria");
 return;
}

 const adicionarDespesa = () => {
  if (!nomeDespesa || !valorDespesa) return;

  const agora = new Date();

  setDespesas(prev => [
{
  id: Date.now(),

  categoria: categoriaDespesa,

  nome: nomeDespesa,

  valor: safeNumber(valorDespesa),

  data: agora.toISOString().split("T")[0],

  hora: agora.toTimeString().slice(0, 5),

  timestamp: Date.now()
},
...prev
]);

  setNomeDespesa("");
  setValorDespesa("");
  setCategoriaDespesa("Geral");
};


  // ===== BLOCO: TOTAL DE DESPESAS =====

  const totalDespesas = despesas.reduce(
    (s, d) => s + d.valor,
    0
  );



  // ===== BLOCO: MÉTRICAS (useMemo) =====

  // Total investido no estoque
  const totalInvestido = useMemo(() => {
    return produtos.reduce(
      (s, p) =>
        s + safeNumber(p.preco) * safeNumber(p.estoque),
      0
    );
  }, [produtos]);

  // Valor potencial de venda
  const valorVenda = useMemo(() => {
    return produtos.reduce(
      (s, p) =>
        s + safeNumber(p.precoVenda) * safeNumber(p.estoque),
      0
    );
  }, [produtos]);

  // Lucro estimado
  const lucroEstimado = useMemo(() => {
    return produtos.reduce(
      (s, p) =>
        s +
        (safeNumber(p.precoVenda) - safeNumber(p.preco)) *
          safeNumber(p.estoque),
      0
    );
  }, [produtos]);

  // 📊 Margem média do estoque
const margemMediaEstoque = useMemo(() => {
  return totalInvestido > 0
    ? (lucroEstimado / totalInvestido) * 100
    : 0;
}, [lucroEstimado, totalInvestido]);



  // ===== BLOCO: EXCLUIR PRODUTO =====
  // Remove do estado e tenta remover do backend

  const excluirProduto = async (id) => {
    setProdutos(prev => prev.filter(p => p.id !== id));

    await fetch(API + "/produtos/" + id, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  };



  // ===== BLOCO: RESET BACKEND =====
  // Reseta também no servidor

  const resetSistema = async () => {
    if (!window.confirm("Tem certeza?")) return;

    setProdutos([]);
    setVendas([]);
    setPendentes([]);
    setClientes([]);

    await fetch(API + "/reset", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  };


  // ===== BLOCO: TOP PRODUTOS =====
  // Calcula os produtos mais vendidos
const topProdutos = useMemo(() => {
  const mapa = {};

  vendas
    .filter(v => v.origem !== "quitacao" && v.status !== "cancelada") // 🔥 ignora canceladas
    .forEach(v => {

      (v.itens || []).forEach(item => {

        const id = item.id;
        const qtd = item.qtd || 1;

        if (!mapa[id]) {
          mapa[id] = {
            id,
            nome: item.nome,
            total: 0
          };
        }

        mapa[id].total += qtd;

      });

    });

  return Object.values(mapa)
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

}, [vendas]);


  // ===== BLOCO: AUTENTICAÇÃO (FIREBASE TOKEN) =====
// Mantém usuário logado mesmo após F5

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      const token = await user.getIdToken();

      localStorage.setItem("token", token);
      setToken(token);
      setUser(user);
    } else {
      setToken("");
      setUser(null);
    }
  });

  return () => unsubscribe();
}, []);


// ===== BLOCO: FUNÇÃO AUXILIAR (toNumber) =====
// Converte string para número (aceita vírgula)

const toNumber = (value) => {
  if (!value) return 0;
  return parseFloat(value.replace(",", "."));
};


// ===== BLOCO: LOGIN (BACKEND JWT) =====
// Faz login via API (email/senha)

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


// ===== BLOCO: REGISTRO (BACKEND) =====
// Cria nova conta no backend

const register = async () => {
  await fetch(API + "/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  alert("Conta criada");
};


// ===== BLOCO: LOGIN COM GOOGLE (FIREBASE) =====
// Autenticação via popup do Google

const loginGoogle = async () => {
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  const idToken = await user.getIdToken();

  setUser(user);
  setToken(idToken);
  localStorage.setItem("token", idToken);
};


// ===== BLOCO: LOAD (CARREGAR DADOS DO BACKEND) =====
// Busca todos os dados do sistema ao logar

useEffect(() => {
  let isMounted = true;

  if (!token) return;

  fetch(API + "/dados", {
    headers: {
      Authorization: `Bearer ${token}` 
    }
  })
    .then(async (r) => {
      if (!r.ok) {
        const text = await r.text();
        throw new Error(text);
      }
      return r.json();
    })
    .then((d) => {
      if (!isMounted) return;

      // Evita quebrar se vier vazio
      if (!d || Object.keys(d).length === 0) {
        console.log("⚠️ BACKEND VEIO VAZIO");
        return;
      }

      // Garante estrutura segura
      setProdutos(d.produtos || []);
      
      setPendentes(d.pendentes || []);
      setClientes(d.clientes || []);
      
      setAnotacoes(d.anotacoes || []);
      setCategoriasProdutos(d.categoriasProdutos || []);
setCategoriasDespesas(d.categoriasDespesas || []);
      console.log("DADOS BACKEND:", d);
setAjusteCaixa(d.ajusteCaixa || 0);
setCaixa(d.caixa || 0);
console.log("CAIXA BACKEND:", d.caixa);
console.log("AJUSTE BACKEND:", d.ajusteCaixa);

      setLoaded(true);
      setFirstLoadDone(true);
    })
    .catch((err) => {
      console.log("❌ ERRO LOAD:", err);
    });

  return () => {
    isMounted = false;
  };
}, [token]);

// ===== LOAD VENDAS SEPARADO =====
useEffect(() => {
  if (!token) return;

  fetch(API + "/vendas", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(r => r.json())
    .then(data => {
  console.log("📦 VENDAS:", data);

  if (Array.isArray(data)) {
    setVendas(data);
  } else {
    console.log("⚠️ RESPOSTA INVÁLIDA:", data);
    setVendas([]);
  }
})
    .catch(err => console.log("❌ ERRO VENDAS:", err));
}, [token]);

// ===== LOAD DESPESAS SEPARADO =====
useEffect(() => {
  if (!token) return;

  fetch(API + "/despesas", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(async (r) => {
      if (!r.ok) throw await r.json();
      return r.json();
    })
    .then(data => {
      console.log("💸 DESPESAS:", data);

      if (Array.isArray(data)) {
        setDespesas(data);
      } else {
        setDespesas([]);
      }
    })
    .catch(err => {
      console.log("❌ ERRO DESPESAS:", err);
      setDespesas([]);
    });

}, [token]);

// LOAD CONSUMO SEPARADO //
useEffect(() => {
  if (!token) return;

  const loadConsumos = async () => {
    try {
      const res = await fetch(API + "/consumos", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      setConsumos(data || []);

    } catch (err) {
      console.log("ERRO LOAD CONSUMOS:", err);
    }
  };

  loadConsumos();
}, [token]);



// ===== BLOCO: SAVE (SALVAR NO BACKEND - AUTO SAVE) =====
// Salva automaticamente quando algo muda

useEffect(() => {
  if (!token || !firstLoadDone || !loaded) return;

  const hasData =
  produtos.length > 0 ||
  vendas.length > 0 ||
  pendentes.length > 0 ||
  clientes.length > 0 ||
  categoriasProdutos.length > 0 ||
  categoriasDespesas.length > 0;

  // Proteção contra sobrescrever com vazio
  if (!hasData) {
    console.log("⛔ BLOQUEADO: evitando sobrescrever banco com vazio");
    return;
  }

  const timeout = setTimeout(() => {
    fetch(API + "/dados", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`  
             },
      body: JSON.stringify({
  produtos,
  
  pendentes,
  clientes,
  
  anotacoes,
  categoriasProdutos,
categoriasDespesas,
  
  caixa,

   ajusteCaixa
})
    })
      .then(async r => {
        if (!r.ok) {
          const text = await r.text();
          throw new Error(text);
        }
        return r.json();
      })
      .then(() => console.log("💾 SALVO COM SUCESSO"))
      .catch(err => console.log("❌ ERRO SAVE:", err.message));
  }, 800);

  return () => clearTimeout(timeout);
}, [
  produtos,
  vendas,
  pendentes,
  clientes,

  despesas,
  anotacoes,

  categoriasProdutos,
  categoriasDespesas,

  caixa,
  ajusteCaixa,

  firstLoadDone,
  loaded,
  token
]);

// ===== SAVE VENDAS SEPARADO =====
useEffect(() => {
  if (!token || !firstLoadDone || !loaded) return;

  if (!vendas.length) return;

  const timeout = setTimeout(() => {
    fetch(API + "/vendas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(vendas)
    })
      .then(r => r.json())
      .then(() => console.log("💾 VENDAS SALVAS"))
      .catch(err => console.log("❌ ERRO VENDAS:", err));
  }, 800);

  return () => clearTimeout(timeout);
}, [vendas, token, firstLoadDone, loaded]);

// ===== SAVE DESPESAS SEPARADO =====
useEffect(() => {
  if (!token || !firstLoadDone || !loaded) return;

  if (!despesas.length) return;

  const timeout = setTimeout(() => {
    fetch(API + "/despesas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(despesas)
    })
      .then(r => r.json())
      .then(() => console.log("💾 DESPESAS SALVAS"))
      .catch(err => console.log("❌ ERRO DESPESAS:", err));
  }, 800);

  return () => clearTimeout(timeout);
}, [despesas, token, firstLoadDone, loaded]);



// historico // 
useEffect(() => {

  const historicoSalvo =
    localStorage.getItem(
      "historicoClientes"
    );

  if (!historicoSalvo && vendas.length) {

    localStorage.setItem(
      "historicoClientes",
      JSON.stringify(vendas)
    );

    setHistoricoClientes(vendas);

  }

}, [vendas]);


  // ================= PRODUTOS =================
const adicionarProduto = () => {
  const precoNum = toNumber(preco);
  const precoVendaNum = toNumber(precoVenda);
  const estoqueNum = parseInt(estoque);

  // 🔥 VALIDAÇÃO
  if (
    !nome ||
    !categoria ||
    precoNum <= 0 ||
    precoVendaNum <= 0 ||
    isNaN(estoqueNum)
  ) {
    alert("Preencha os valores corretamente");
    return;
  }

if (!categoria || !categoria.trim()) {
  alert("⚠️ Selecione uma categoria para o produto.");
  return;
}

  setProdutos(prev => [
  ...prev,
  {
    id: Date.now(),

    nome: nome.trim(),

    preco: safeNumber(preco),
    precoVenda: safeNumber(precoVenda),

    estoque: estoqueIlimitadoTemp
      ? 0
      : safeNumber(estoque),

    estoqueIlimitado: estoqueIlimitadoTemp,

    imagem,

    categoria: categoria.trim()
  }
]);

  // limpa categoria selecionada
  setCategoria("");

  // limpar campos
  setNome("");
  setPreco("");
  setPrecoVenda("");
  setEstoque("");
  setImagem("");
  setEstoqueIlimitadoTemp(false);
};

const produtosFiltrados =
  busca.trim().length > 0
    ? produtos
        .filter(p =>
          p.nome?.toLowerCase().includes(busca.toLowerCase())
        )
        .slice(0, 5)
    : [];

const produtosConsumoFiltrados = Array.isArray(produtos)
  ? produtos.filter((p) => {
      if (!p?.nome) return false;

      return p.nome
        .toLowerCase()
        .includes((buscaConsumo || "").toLowerCase());
    })
  : [];

const criarCategoriaProduto = () => {
  if (!novaCategoria.trim()) return;

  const existe = categoriasProdutos.some(
    c =>
      c.nome.toLowerCase() ===
      novaCategoria.trim().toLowerCase()
  );

  if (existe) {
    alert("Essa categoria já existe.");
    return;
  }

  setCategoriasProdutos(prev => [
    ...prev,
    {
      id: Date.now(),
      nome: novaCategoria.trim()
    }
  ]);

  setNovaCategoria("");
};

const criarCategoriaDespesa = () => {

  if (!novaCategoria.trim()) return;

  const existe = categoriasDespesas.some(
    c =>
      c.nome.toLowerCase() ===
      novaCategoria.trim().toLowerCase()
  );

  if (existe) {
    alert("Essa categoria já existe.");
    return;
  }

  setCategoriasDespesas(prev => [
    ...prev,
    {
      id: Date.now(),
      nome: novaCategoria.trim()
    }
  ]);

  setNovaCategoria("");

};
  // ================= BLOCO: ADICIONAR PRODUTO NO CARRINHO =================
// Adiciona um produto ao carrinho e reduz o estoque automaticamente

const addCarrinho = (produto) => {
  if (
  !produto ||
  (
    !produto.estoqueIlimitado &&
    produto.estoque <= 0
  )
) return;

  setCarrinho(prev => {

    const existe = prev.find(
      p => p.id === produto.id
    );

    // 🔥 BLOQUEIA vender acima do estoque
    if (
  !produto.estoqueIlimitado &&
  (existe?.qtd || 0) >= produto.estoque
) {
  alert("Estoque máximo atingido");
  return prev;
}

    // já existe no carrinho
    if (existe) {
      return prev.map(p =>
        p.id === produto.id
          ? {
              ...p,
              qtd: (p.qtd || 1) + 1
            }
          : p
      );
    }

    // novo item
    return [
      ...prev,
      {
        ...produto,
        qtd: 1
      }
    ];
  });
};

const addConsumo = (produto) => {

  if (
  !produto ||
  (
    !produto.estoqueIlimitado &&
    produto.estoque <= 0
  )
) return;

  setCarrinhoConsumo(prev => {

    const existe = prev.find(
      p => p.id === produto.id
    );

    if (
  !produto.estoqueIlimitado &&
  (existe?.qtd || 0) >= produto.estoque
) {
  alert("Estoque máximo atingido");
  return prev;
}

    if (existe) {

      return prev.map(p =>
        p.id === produto.id
          ? {
              ...p,
              qtd: p.qtd + 1
            }
          : p
      );

    }

    return [
      ...prev,
      {
        id: produto.id,
        nome: produto.nome,
        preco: produto.preco,
        qtd: 1
      }
    ];

  });

};


// ================= BLOCO: REMOVER ITEM DO CARRINHO =================
// Remove 1 unidade do item ou exclui se quantidade chegar a 0
// E devolve o estoque automaticamente

const removerConsumo = (id) => {

  setCarrinhoConsumo(prev =>
    prev
      .map(item =>
        item.id === id
          ? {
              ...item,
              qtd: item.qtd - 1
            }
          : item
      )
      .filter(item => item.qtd > 0)
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

  
};



// ================= BLOCO: LIMPAR CARRINHO =================
// Remove todos os produtos do carrinho

const limparCarrinho = () => setCarrinho([]);

// 🔥 Lucro da venda atual (somente carrinho)

const lucroCarrinho = carrinho.reduce(
  (soma, item) => {

    const lucroUnitario =
      Number(item.precoVenda || 0) -
      Number(item.preco || 0);

    return soma + (
      lucroUnitario *
      Number(item.qtd || 1)
    );

  },
  0
);

// ================= BLOCO: TOTAL DO CARRINHO =================
// Calcula o valor total da compra

const subtotal = carrinho.reduce(
  (a, p) =>
    a + safeNumber(p.precoVenda) * safeNumber(p.qtd),
  0
);

const total = Math.max(
  0,
  subtotal - desconto
);

const totalConsumo = carrinhoConsumo.reduce(
  (soma, item) =>
    soma +
    Number(item.preco || 0) *
    Number(item.qtd || 1),
  0
);

// ================= BLOCO: FINALIZAR VENDA =================
// Converte o carrinho em uma venda normal ou pendente

const finalizar = () => {
if (modoVenda === "anotacao") {

  if (!anotacaoTexto?.trim()) return;

  const agora = new Date();

  const dataAtual =
    agora.toLocaleDateString("pt-BR");

  const vendaAnotacao = {
    id: Date.now(),
    itens: carrinho,
    total: total,
    modo: "anotacao",
    data: dataAtual,
    hora: agora.toTimeString().slice(0, 5),
    timestamp: Date.now()
  };

  const produtosTexto = carrinho
    .map(item => `${item.nome} x${item.qtd || 1}`)
    .join(", ");

  const novaAnotacao = {
  id: Date.now(),
  itens: [...carrinho],
  descricao: anotacaoTexto,
  valor: total,
  hora: agora.toTimeString().slice(0, 5),
  data: dataAtual,
  timestamp: Date.now()
};

  setAnotacoes(prev => [
    novaAnotacao,
    ...prev
  ]);
  // 🔥 ENTRA NO RANKING IMEDIATAMENTE
  setVendas(prev => [
    ...prev,
    vendaAnotacao
  ]);

  // 🔥 BAIXA ESTOQUE
  setProdutos(prev =>
  prev.map(produto => {
    const itemCarrinho = carrinho.find(
      item => item.id === produto.id
    );

    if (!itemCarrinho) return produto;

    // 🔥 NÃO baixa se for ilimitado
    if (produto.estoqueIlimitado) return produto;

    return {
      ...produto,
      estoque:
        produto.estoque - (itemCarrinho.qtd || 1)
    };
  })
);

  setAnotacaoTexto("");
  limparCarrinho();

  return;
}

  if (!carrinho.length) return;

  // 🚨 Se for venda pendente, cliente é obrigatório
  if (modoVenda === "pendente" && !cliente) {
    alert("Selecione um cliente");
    return;
  }

  // 🔥 Se cliente não existir, cadastra automaticamente
  if (modoVenda === "pendente" && cliente) {
    const existe = clientes.some(
      c => c.nome.toLowerCase() === cliente.toLowerCase()
    );

    if (!existe) {
      setClientes(prev => [
        ...prev,
        {
          id: Date.now(),
          nome: cliente
        }
      ]);
    }
  }

  const agora = new Date();
  const timestamp = Date.now();

  const venda = {
  id: timestamp,
  cliente: cliente,
  pagamento: modoVenda === "normal" ? pagamento : null,
  modo: modoVenda,
  desconto: desconto || 0,
  itens: carrinho,
  total,

  data: agora.toLocaleDateString("pt-BR"),
  hora: agora.toTimeString().slice(0, 5),
  timestamp
};

  // 🔥 NOVO BLOCO: ANOTAÇÃO
  if (modoVenda === "anotacao") {

  const anotacao = {
    id: timestamp,
    descricao: carrinho.map(i => i.nome).join(", "),
    itens: carrinho,
    valor: total,
    data: venda.data,
    hora: venda.hora,
    timestamp
  };

  setAnotacoes(prev => [
    ...prev,
    anotacao
  ]);

  // 🔥 Entra no ranking de produtos
  // mas NÃO entra no caixa
  setVendas(prev => [
    ...prev,
    {
      ...venda,
      tipo: "anotacao"
    }
  ]);

}

  // 💰 PENDENTE
if (modoVenda === "pendente") {

  setPendentes(prev => [
    ...prev,
    venda
  ]);

  setVendas(prev => [
    ...prev,
    venda
  ]);

  if (cliente) {

    const novoHistorico = [
      ...historicoClientes,
      venda
    ];

    setHistoricoClientes(novoHistorico);

    localStorage.setItem(
      "historicoClientes",
      JSON.stringify(novoHistorico)
    );

  }

}

// 💵 NORMAL
else {

  setVendas(prev => [
    ...prev,
    venda
  ]);

  if (cliente) {

    setHistoricoClientes(prev => {

      const novoHistorico = [
        ...prev,
        venda
      ];

      localStorage.setItem(
        "historicoClientes",
        JSON.stringify(novoHistorico)
      );

      return novoHistorico;
    });

  }

  // 💰 entra no caixa
  setCaixa(prev => prev + total);

}

// 🔥 BAIXA ESTOQUE SOMENTE AO FINALIZAR

setProdutos(prev =>
  prev.map(produto => {

    const itemCarrinho = carrinho.find(
      item => item.id === produto.id
    );

    if (!itemCarrinho) return produto;

    // 🔥 REGRA PRINCIPAL
    if (produto.estoqueIlimitado) return produto;

    return {
      ...produto,
      estoque: Math.max(
        0,
        produto.estoque - (itemCarrinho.qtd || 1)
      )
    };
  })
);

  // 🔄 RESET
  setCarrinho([]);
  setCliente("");
  setPagamento("dinheiro");
  setModoVenda("normal");
setDesconto(0);
setValorDesconto("");

};


const marcarComoPago = (a) => {

  const agora = new Date();

  setCaixa(prev => prev + (a.valor || 0));

  // ✔️ atualiza anotação (vira venda válida pro sistema)
  setVendas(prev =>
  prev.map(v =>
    v.id === a.id
      ? {
          ...v,
          modo: "anotacao_paga",
          itens: a.itens || [],
          total: a.valor || 0,
          data: agora.toLocaleDateString("pt-BR"),
          hora: agora.toTimeString().slice(0, 5)
        }
      : v
  )
);

  setAnotacoes(prev =>
    prev.filter(item => item.id !== a.id)
  );
};

const marcarComoPendente = (a) => {

  const agora = new Date();

  const vendaPendente = {
    ...a,
    modo: "pendente",
    total: a.valor,

    data:
      a.data ||
      agora.toLocaleDateString("pt-BR"),

    hora:
      a.hora ||
      agora.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
      }),

    timestamp:
      a.timestamp ||
      Date.now()
  };

  setPendentes(prev => [
    ...prev,
    vendaPendente
  ]);
setRegistrosPendentes(prev => [
  ...prev,
  {
    ...vendaPendente,
    tipo: "registro_pendente"
  }
]);

  if (vendaPendente.cliente) {

    setHistoricoClientes(prev => {

      const novoHistorico = [
        ...prev,
        vendaPendente
      ];

      localStorage.setItem(
        "historicoClientes",
        JSON.stringify(novoHistorico)
      );

      return novoHistorico;
    });

  }

  setAnotacoes(prev =>
    prev.filter(item => item.id !== a.id)
  );
};

const excluirAnotacao = (id) => {
  setAnotacoes(prev => prev.filter(a => a.id !== id));
};

// ================= PENDENTES: REMOVER =================
// Remove uma venda pendente pelo ID

const removerPendente = (id) => {
  setPendentes(prev => prev.filter(p => p.id !== id));
};


// ================= CLIENTES: ADICIONAR =================
// Adiciona um novo cliente manualmente

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


// ================= RESUMO: VENDAS DO DIA =================
// Filtra vendas do dia atual
const cancelarVenda = (id) => {
  

  const venda = vendas.find(v => v.id === id);
  if (!venda) return;

  // 🟢 DEVOLVER PRODUTOS AO ESTOQUE
  const novosProdutos = produtos.map(prod => {

    // CASO SUA VENDA TENHA VARIOS ITENS
    if (venda.itens) {
      const item = venda.itens.find(
  i => i.id === prod.id
);

if (item) {
  return {
    ...prod,
    estoque: prod.estoque + (item.qtd || 1)
  };
}
    }

    // CASO SEJA UM PRODUTO SÓ
    if (venda.produtoId === prod.id) {
      return {
        ...prod,
        estoque: prod.estoque + venda.quantidade
      };
    }

    return prod;
  });

  // 🔴 MARCAR VENDA COMO CANCELADA
  const novasVendas = vendas.map(v =>
    v.id === id ? { ...v, status: "cancelada" } : v
  );

if (
  ["normal", "pendente_pago", "anotacao_paga"].includes(venda.modo) &&
  venda.status !== "cancelada"
) {
  setCaixa(prev =>
    prev - Number(venda.total || 0)
  );
}

  setProdutos(novosProdutos);
  setVendas(novasVendas);
};

const hoje = new Date().toLocaleDateString("pt-BR");

const registrosHoje = [

  ...vendas
    .filter(v => v.data === hojeBR)
    .map(v => ({
      ...v,
      tipo: "venda",
      status: v.status || "paga"
 
    })),

  ...registrosPendentes
    .filter(r => r.data === hoje),

  ...despesas
    .filter(d => d.data === hoje)
    .map(d => ({
      ...d,
      tipo: "despesa"
    }))

].sort(
  (a, b) =>
    (b.timestamp || 0) -
    (a.timestamp || 0)
);

const vendasHoje = vendas.filter(
  v =>
    v.data === hojeBR &&
    v.status !== "cancelada"
);

const totalHoje = vendasHoje.reduce(
  (soma, v) => soma + (v.total || 0),
  0
);


// ================= FILTRO: PERÍODO DE VENDAS =================
// Filtra vendas por período selecionado (hoje, 7d, 1m etc)

const filtrarVendas = () => {
  const hoje = new Date();

  return vendas.filter(v => {
    const dataVenda = dataParaDate(v.data);

    const diff =
      (hoje - dataVenda) / (1000 * 60 * 60 * 24);

    if (periodo === "hoje") return diff < 1;
    if (periodo === "7d") return diff <= 7;
    if (periodo === "14d") return diff <= 14;
    if (periodo === "1m") return diff <= 30;
    if (periodo === "3m") return diff <= 90;
    if (periodo === "1y") return diff <= 365;

    return true;
  });
};

// ================= VENDAS: FILTRADAS =================
// Resultado após aplicar filtro de período

const vendasFiltradas = filtrarVendas();


// ================= FINANCEIRO: FATURAMENTO =================
// Soma total das vendas filtradas

const faturamento = vendasFiltradas
  .filter(
    v =>
      [
        "normal",
        "pendente_pago",
        "pendente_pago_total",
        "anotacao_paga"
      ].includes(v.modo) &&
      v.status !== "cancelada"
  )
  .reduce(
    (soma, v) => soma + (v.total || 0),
    0
  );

// ================= FINANCEIRO: CAIXA LÍQUIDO =================
// Caixa final menos despesas

const caixaLiquido =
  caixa - totalDespesas + ajusteCaixa;



// ================= FINANCEIRO: LUCRO REAL =================
// Lucro baseado em preço de venda vs custo

const vendasPagas = vendasFiltradas.filter(v =>
  v.modo === "normal" ||
  v.modo === "pendente_pago" ||
  v.modo === "pendente_pago_total" ||
  v.modo === "anotacao_paga"
);


const lucro = vendasPagas
  .filter(v => v.status !== "cancelada")
  .reduce((soma, v) => {

    console.log("VENDA", v);

    (v.itens || []).forEach(item => {
      console.log(
        "ITEM",
        item.precoVenda,
        item.preco,
        item.qtd
      );
    });

    if (v.lucroQuitacao !== undefined) {

      console.log(
        "ENTROU QUITAÇÃO",
        v.cliente,
        v.lucroQuitacao
      );

      return soma + Number(v.lucroQuitacao || 0);
    }

    const lucroVenda = (v.itens || []).reduce(
      (acc, item) => {
const precoVenda = Number(
  String(item.precoVenda || 0).replace(",", ".")
);

const precoCompra = Number(
  String(item.preco || 0).replace(",", ".")
);

const lucroUnit =
  precoVenda - precoCompra;

        return acc + lucroUnit * (item.qtd || 1);

      },
      0
    );

    return soma + (
      lucroVenda - (v.desconto || 0)
    );

  }, 0);

console.log("LUCRO FINAL:", lucro);
// ================= ESTOQUE: INVESTIMENTO =================
// Quanto dinheiro está parado em estoque

const investimento = produtos.reduce(
  (s, p) => s + (p.preco || 0) * (p.estoque || 0),
  0
);


// ================= ESTOQUE: VALOR DE VENDA =================
// Valor total do estoque se vendido pelo preço final

const valorEstoqueVenda = produtos.reduce(
  (s, p) => s + (p.precoVenda || 0) * (p.estoque || 0),
  0
);


// ================= ESTOQUE: LUCRO POTENCIAL =================
// Lucro possível se todo estoque for vendido

const lucroEstoque = valorEstoqueVenda - investimento;


// ================= ESTATÍSTICAS EXTRAS =================

const despesasTotais = totalDespesas;

const margemLucro =
  faturamento > 0
    ? (lucro / faturamento) * 100
    : 0;

const totalVendas = vendasFiltradas.filter(
  v => v.origem !== "quitacao"
).length;

const ticketMedio =
  totalVendas > 0
    ? faturamento / totalVendas
    : 0;





// ================= PENDENTES: TOTAL =================
// Soma total das vendas pendentes

const totalPendentes = pendentes.reduce(
  (s, v) => s + (v.total || 0),
  0
);


// ================= PENDENTES: CLIENTES =================
// Quantidade de clientes com dívida pendente

const clientesPendentes = new Set(
  pendentes.map(p => p.cliente)
).size;


// ================= BLOCO: GERAR EXTRATO PDF =================
// Gera relatório completo em PDF usando jsPDF

const baixarExtrato = () => {
  const doc = new jsPDF();

  let y = 10;

  // TÍTULO
  doc.setFontSize(16);
  doc.text("Extrato Completo - MAGNUS", 10, y);

  y += 10;

  // DATA
  doc.setFontSize(10);
  doc.text(`Data: ${new Date().toLocaleString()}`, 10, y);

  y += 10;

  // ================= RESUMO FINANCEIRO =================
  doc.text(`Faturamento: R$ ${faturamento.toFixed(2)}`, 10, y);
  y += 6;

  doc.text(`Lucro: R$ ${lucro.toFixed(2)}`, 10, y);
  y += 6;

  doc.text(`Investimento: R$ ${investimento.toFixed(2)}`, 10, y);
  y += 6;

  doc.text(`Pendentes: R$ ${totalPendentes.toFixed(2)}`, 10, y);

  y += 10;

  // ================= VENDAS =================
  doc.text("Vendas:", 10, y);
  y += 6;

  vendas.slice(0, 10).forEach(v => {
    doc.text(`R$ ${v.total} - ${v.data}`, 10, y);
    y += 5;
  });

  y += 10;

  // ================= PENDENTES =================
  doc.text("Pendentes:", 10, y);
  y += 6;

  pendentes.slice(0, 10).forEach(v => {
    doc.text(`R$ ${v.total} - ${v.cliente}`, 10, y);
    y += 5;
  });

  y += 10;

  // ================= PRODUTOS =================
  doc.text("Produtos:", 10, y);
  y += 6;

  produtos.slice(0, 10).forEach(p => {
    doc.text(
      `${p.nome} | Cat: ${p.categoria || "Sem categoria"} | Estoque: ${p.estoque}`,
      10,
      y
    );
    y += 5;

    // quebra automática de página
    if (y > 280) {
      doc.addPage();
      y = 10;
    }
  });

  // ================= SALVAR =================
  doc.save(`extrato-${Date.now()}.pdf`);
};


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

      <div className={`sidebar ${menuAberto ? "open" : "closed"}`}>

  <div className="logo">
    MAGNUS
  </div>

  <button className="menu-btn" onClick={() => setTab("vendas")}>💰 Vendas</button>
  <button className="menu-btn" onClick={() => setTab("produtos")}>📦 Produtos</button>
  <button className="menu-btn" onClick={() => setTab("pendentes")}>👥 Cliente</button>
  <button className="menu-btn" onClick={() => setTab("stats")}>📊 Estatísticas</button>
  <button
  onClick={() => setTab("extrato")}
  style={{
    background:
      tab === "extrato"
        ? "#222"
        : "transparent",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    gap: 8
  }}
>
  📊 Analytics

  <span
    style={{
      fontSize: 10,
      fontWeight: "bold",
      padding: "2px 6px",
      borderRadius: 999,
      background: "#f59e0b",
      color: "#fff",
      letterSpacing: 1
    }}
  >
    BETA
  </span>
</button>
  
  <button className="menu-btn" onClick={() => setTab("despesas")}>
  💸 Despesas
</button>

<button className="menu-btn reset" onClick={() => setTab("reset")}>
  ⚠️ Reset Sistema
</button>



  <div className="bottom">
    <button
      className="menu-btn logout"
      onClick={() => {
        signOut(auth);
        localStorage.removeItem("token");
        setToken("");
      }}
    >
      🚪 Sair
    </button>

    <small>MAGNUS</small>
  </div>

</div>

      <div className="main">
        <button
  className="toggle-btn"
  onClick={() => setMenuAberto(!menuAberto)}
>
  ☰
</button>

        
        {user && <p>👤 {user.displayName}</p>}

         <div
    
  

  
  style={{
    maxWidth: 550,
    margin: "0 auto 12px auto",
    transform: "translateX(-80px)",
    padding: "3px 8px",
    borderLeft: "6px solid #ff6a00",
    background: "rgba(255,106,0,0.06)",
    borderRadius: 6,
    fontSize: 11,
    color: "#bdbdbd",
    textAlign: "center",
    whiteSpace: "nowrap"
  }}
>
  ⚠️ Sincronização automática: após inatividade do servidor, os dados podem levar até 20 segundos para atualizar.
</div>
  
 {tab === "despesas" && (

<div>

  <h2>💸 Despesas</h2>

  <button
    onClick={() => setOpenConsumo(true)}
    style={{
      background: "#f59e0b",
      padding: "10px 14px",
      border: "none",
      borderRadius: 8,
      color: "#fff",
      cursor: "pointer",
      marginBottom: 15
    }}
  >
    🧃 Consumo interno
  </button>

  {/* ================= CRIAR CATEGORIA ================= */}

  <div
    style={{
      marginBottom: 15,
      background: "#111",
      padding: 10,
      borderRadius: 10
    }}
  >

    <h4>📁 Criar categoria</h4>

    <input
      placeholder="Nome da categoria"
      value={novaCategoria}
      onChange={e => setNovaCategoria(e.target.value)}
    />

    <button onClick={criarCategoriaDespesa}>
      ➕ Criar categoria
    </button>

  </div>

  {/* ================= CARDS DE CATEGORIA ================= */}

  <div
    style={{
      display: "flex",
      gap: 10,
      flexWrap: "wrap",
      marginBottom: 15
    }}
  >

    <div
      onClick={() => setFiltroDespesaCategoria(null)}
      style={{
        padding: 10,
        borderRadius: 10,
        background: !filtroDespesaCategoria ? "#ff6a00" : "#111",
        color: "#fff",
        cursor: "pointer",
        border: "1px solid #333"
      }}
    >
      📊 Todas
    </div>

    {categoriasDespesas.map(cat => (

      <div
        key={cat.id}
        onClick={() => {
  setCategoriaDespesaSelecionada(cat.nome);
  setModalHistoricoDespesa(true);
}}
        style={{
          padding: 10,
          borderRadius: 10,
          background:
            filtroDespesaCategoria === cat.nome
              ? "#ff6a00"
              : "#111",
          color: "#fff",
          cursor: "pointer",
          border: "1px solid #333"
        }}
      >
        📁 {cat.nome}
      </div>

    ))}

  </div>

  {/* FORM */}

  <div style={{ marginBottom: 20 }}>

    <input
      placeholder="Nome da despesa"
      value={nomeDespesa}
      onChange={e => setNomeDespesa(e.target.value)}
    />

    <select
      value={categoriaDespesa}
      onChange={e => setCategoriaDespesa(e.target.value)}
      style={{
        marginLeft: 10,
        padding: 8,
        borderRadius: 8,
        background: "#1b1b1b",
        color: "#fff",
        border: "1px solid #333"
      }}
    >
      <option value="">
        📂 Selecione categoria
      </option>

      {categoriasDespesas.map(cat => (
        <option
          key={cat.id}
          value={cat.nome}
        >
          {cat.nome}
        </option>
      ))}

    </select>

    <input
      placeholder="Valor (R$)"
      value={valorDespesa}
      onChange={e => setValorDespesa(e.target.value)}
    />

    <button
      onClick={() => setConfirmarDespesa(true)}
    >
      ➕ Adicionar Despesa
    </button>

    <button
      onClick={() => setOpenHistoricoConsumo(true)}
      style={{
        background: "#111",
        color: "#fff",
        padding: 10,
        borderRadius: 8,
        border: "1px solid #333",
        cursor: "pointer",
        marginTop: 10
      }}
    >
      📦 Histórico de Consumo
    </button>

  </div>
    {/* TOTAL */}
    <div
      style={{
        background: "rgba(255,255,255,0.08)",
        padding: 15,
        borderRadius: 12,
        marginBottom: 20
      }}
    >
      <h3>💰 Total gasto</h3>
      <h2>R$ {totalDespesas.toFixed(2)}</h2>
    </div>

    {/* LISTA */}
    <div
  style={{
    maxHeight: 500,
    overflowY: "auto",
    background: "#111",
    border: "1px solid #222",
    borderRadius: 16,
    padding: 10,
    boxShadow: "0 10px 25px rgba(0,0,0,0.25)"
  }}
>
  {despesas.length === 0 ? (

    <div
      style={{
        textAlign: "center",
        padding: 30,
        color: "#777"
      }}
    >
      📭 Nenhuma despesa registrada
    </div>

  ) : (

    despesas.map(d => (

      <div
        key={d.id}
        style={{
          background: "#181818",
          border: "1px solid #262626",
          borderRadius: 12,
          padding: 14,
          marginBottom: 10,
          transition: "0.2s"
        }}
      >

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >

          <div>

            <div
              style={{
                color: "#fff",
                fontSize: 15,
                fontWeight: 600,
                marginBottom: 4
              }}
            >
              💸 {d.nome}
            </div>

            <div
              style={{
                fontSize: 11,
                color: "#888"
              }}
            >
              📅 {new Date(d.data).toLocaleDateString("pt-BR")} • 🕒 {d.hora}
            </div>

          </div>

          <div
            style={{
              color: "#ff6b6b",
              fontWeight: "bold",
              fontSize: 16
            }}
          >
            - R$ {Number(d.valor).toFixed(2)}
          </div>

        </div>

      </div>

    ))

  )}
</div>

  </div>
)}

{/* ================= MODAL HISTÓRICO DESPESAS ================= */}

{modalHistoricoDespesa && (

<div
style={{
position:"fixed",
top:0,
left:0,
width:"100%",
height:"100%",
background:"rgba(0,0,0,0.75)",
display:"flex",
justifyContent:"center",
alignItems:"center",
zIndex:9999
}}
>

<div
style={{
width:"90%",
maxWidth:500,
maxHeight:"90vh",
overflowY:"auto",
background:"#151515",
borderRadius:20,
padding:20,
border:"1px solid #333",
color:"#fff"
}}
>


{/* ================= TOPO ================= */}

<div
style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
marginBottom:20
}}
>

<h2>
📁 Histórico de despesas
</h2>


<button
onClick={()=>{

setModalHistoricoDespesa(false);
setCategoriaDespesaSelecionada(null);
setDataInicioDespesa("");
setDataFimDespesa("");

}}
style={{
background:"#ef4444",
border:"none",
color:"#fff",
padding:"8px 14px",
borderRadius:10,
cursor:"pointer",
fontSize:18
}}
>
✕
</button>


</div>



{/* ================= FILTRO ================= */}


<label
style={{
fontSize:12,
color:"#aaa"
}}
>
Data inicial
</label>


<input
type="date"
value={dataInicioDespesa}
onChange={e=>setDataInicioDespesa(e.target.value)}
style={{
width:"100%",
padding:10,
borderRadius:10,
background:"#0f0f0f",
color:"#fff",
border:"1px solid #333"
}}
/>



<label
style={{
fontSize:12,
color:"#aaa",
display:"block",
marginTop:10
}}
>
Data final
</label>


<input
type="date"
value={dataFimDespesa}
onChange={e=>setDataFimDespesa(e.target.value)}
style={{
width:"100%",
padding:10,
borderRadius:10,
background:"#0f0f0f",
color:"#fff",
border:"1px solid #333"
}}
/>



<button
onClick={()=>{
setFiltroAplicadoDespesa(true);
}}
style={{
background:"#ff6a00",
color:"#fff",
border:"none",
padding:"10px 18px",
borderRadius:10,
cursor:"pointer",
fontWeight:"bold",
marginTop:10,
width:"100%"
}}
>
🔎 Aplicar filtro
</button>




<button
onClick={()=>{

setDataInicioDespesa("");
setDataFimDespesa("");
setFiltroAplicadoDespesa(false);

}}
style={{
marginTop:10,
width:"100%",
padding:10,
borderRadius:12,
background:"#222",
color:"#fff",
border:"1px solid #444",
cursor:"pointer"
}}
>
🧹 Limpar período
</button>





{/* ================= RESUMO ================= */}


<div
style={{
background:"#181818",
borderRadius:15,
padding:18,
border:"1px solid #292929",
marginTop:20,
marginBottom:15
}}
>


<div
style={{
color:"#aaa",
fontSize:13
}}
>
Total gasto no período
</div>



<div
style={{
fontSize:28,
fontWeight:"bold",
color:"#ff6b6b"
}}
>

R$ {
despesasFiltradas
.reduce(
(s,d)=>s + Number(d.valor || 0),
0
)
.toFixed(2)
}

</div>


<div
style={{
marginTop:5,
color:"#777"
}}
>
📄 {despesasFiltradas.length} despesas encontradas
</div>


</div>





{/* ================= LISTA ================= */}


<div
style={{
maxHeight:500,
overflowY:"auto",
background:"#111",
border:"1px solid #222",
borderRadius:16,
padding:10,
boxShadow:"0 10px 25px rgba(0,0,0,0.25)"
}}
>


{
despesasFiltradas.length === 0 ? (

<div
style={{
textAlign:"center",
padding:30,
color:"#777"
}}
>
📭 Nenhuma despesa encontrada neste período
</div>

)

:

(

despesasFiltradas.map(d=>(


<div
key={d.id}
style={{
background:"#181818",
border:"1px solid #262626",
borderRadius:12,
padding:14,
marginBottom:10
}}
>


<div
style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center"
}}
>


<div>


<div
style={{
color:"#fff",
fontSize:15,
fontWeight:600,
marginBottom:4
}}
>
💸 {d.nome}
</div>



<div
style={{
fontSize:11,
color:"#888"
}}
>
📅 {d.data} • 🕒 {d.hora}
</div>


</div>




<div
style={{
color:"#ff6b6b",
fontWeight:"bold",
fontSize:16
}}
>
- R$ {Number(d.valor).toFixed(2)}
</div>



</div>


</div>


))

)

}


</div>



</div>

</div>

)}
     {tab === "vendas" && (
  <div
    style={{
      display: "flex",
      gap: 20,
      alignItems: "flex-start"
    }}
  >
    
    {/* 🔥 COLUNA ESQUERDA */}
   <div
  style={{
    flex: 1,
    background: "linear-gradient(135deg, #0a0a0f 0%, #111111 40%, #ff6a00 120%)",
    minHeight: "100vh",
    padding: 20,
    borderRadius: 12,
    color: "#fff",
    position: "relative" // 👈 ADICIONA ISSO
  }}
>
    

      <h2 style={{ marginTop: 20 }}>💰 Vendas</h2>

     <div
  onClick={() => setAjusteAberto(true)}
  style={{
    position: "absolute",
    top: 0,
    right: 20,
    background: "#111",
    padding: "2px 5px",
    borderRadius: 10,
    border: "1px solid #333",
    minWidth: 70,
    cursor: "pointer"
  }}
>

  {/* TOPO */}
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 6
    }}
  >

    <div
      style={{
        fontSize: 11,
        color: "#888",
        textTransform: "uppercase",
        letterSpacing: 1
      }}
    >
      Caixa Total
    </div>

    {/* OLHO */}
    <button
      onClick={(e) => {
        e.stopPropagation();
        setMostrarCaixa(prev => !prev);
      }}
      style={{
        background: "transparent",
        border: "none",
        color: "#fff",
        cursor: "pointer",
        fontSize: 14
      }}
    >
      {mostrarCaixa ? "👁️" : "🙈"}
    </button>

  </div>

  {/* VALOR */}
  <div
    style={{
      fontSize: 15,
      fontWeight: "bold",
      color: "#fff"
    }}
  >
    {mostrarCaixa
      ? `🔒 R$ ${caixaLiquido.toFixed(2)}`
      : "🔒 •••••••"}
  </div>

</div>

      <input
        placeholder="Cliente (Pendente - Obrigatório)"
        value={cliente}
        onChange={e => setCliente(e.target.value)}
      />
   {cliente && clientesFiltrados.length > 0 && (
  <div
    style={{
      background: "#111",
      padding: 10,
      borderRadius: 8,
      marginTop: 5
    }}
  >
    {clientesFiltrados.map(c => (
      <div
        key={c.id}
        className="item-busca"
        onClick={() => setCliente(c.nome)}
      >
        👤 {c.nome}
      </div>
    ))}
  </div>
)}
{cliente && clientesFiltrados.length === 0 && (
  <div style={{
    marginTop: 8,
    color: "#ff6a00",
    fontSize: 12
  }}>
    ⚠️ Cliente não encontrado.  
    Ele será cadastrado automaticamente ao finalizar.
  </div>
)}

  {/* ================= SELECT CUSTOM PREMIUM ================= */}

<div style={{ position: "relative", marginBottom: 10 }}>

  {/* BOTÃO */}
  <div
    onClick={() =>
      setMenuModoVenda(prev => !prev)
    }
    style={{
      background: "#111",
      border: "1px solid #333",
      padding: 12,
      borderRadius: 10,
      color: "#fff",
      cursor: "pointer",
      userSelect: "none",
      transition: "0.25s",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}
  >
    <span>
      {
        modoVenda === "normal"
          ? "💰 Venda normal"
          : modoVenda === "pendente"
          ? "⏳ Venda pendente"
          : "📝 Anotação do dia"
      }
    </span>

    <span>
      {menuModoVenda ? "▲" : "▼"}
    </span>
  </div>

  {/* DROPDOWN */}
  {menuModoVenda && (

    <div
      style={{
        position: "absolute",
        top: "105%",
        left: 0,
        width: "100%",
        background: "#111",
        border: "1px solid #333",
        borderRadius: 12,
        overflow: "hidden",
        zIndex: 999,
        boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
        animation: "fadeIn 0.2s ease"
      }}
    >

      {[
        {
          value: "normal",
          label: "💰 Venda normal"
        },
        {
          value: "pendente",
          label: "⏳ Venda pendente"
        },
        {
          value: "anotacao",
          label: "📝 Anotação do dia"
        }
      ].map(item => (

        <div
          key={item.value}
          onClick={() => {
            setModoVenda(item.value);
            setMenuModoVenda(false);
          }}
          style={{
            padding: 12,
            color: "#fff",
            cursor: "pointer",
            transition: "0.25s",
            background: "transparent"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background =
              "linear-gradient(135deg, #ff6a00, #ff8c00)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background =
              "transparent";
          }}
        >
          {item.label}
        </div>

      ))}

    </div>

  )}

</div>

{/* PAGAMENTO (só aparece em venda normal) */}
{modoVenda === "normal" && (

  <div style={{ position: "relative", marginBottom: 10 }}>

    {/* BOTÃO */}
    <div
      onClick={() =>
        setMenuPagamento(prev => !prev)
      }
      style={{
        background: "#111",
        border: "1px solid #333",
        padding: 12,
        borderRadius: 10,
        color: "#fff",
        cursor: "pointer",
        userSelect: "none",
        transition: "0.25s",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <span>
        {
          pagamento === "dinheiro"
            ? "💵 Dinheiro"
            : pagamento === "pix"
            ? "⚡ Pix"
            : "💳 Cartão"
        }
      </span>

      <span>
        {menuPagamento ? "▲" : "▼"}
      </span>
    </div>

    {/* DROPDOWN */}
    {menuPagamento && (

      <div
        style={{
          position: "absolute",
          top: "105%",
          left: 0,
          width: "100%",
          background: "#111",
          border: "1px solid #333",
          borderRadius: 12,
          overflow: "hidden",
          zIndex: 999,
          boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
          animation: "fadeIn 0.2s ease"
        }}
      >

        {[
          {
            value: "dinheiro",
            label: "💵 Dinheiro"
          },
          {
            value: "pix",
            label: "⚡ Pix"
          },
          {
            value: "cartao",
            label: "💳 Cartão"
          }
        ].map(item => (

          <div
            key={item.value}
            onClick={() => {
              setPagamento(item.value);
              setMenuPagamento(false);
            }}
            style={{
              padding: 12,
              color: "#fff",
              cursor: "pointer",
              transition: "0.25s",
              background: "transparent"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background =
                "linear-gradient(135deg, #ff6a00, #ff8c00)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background =
                "transparent";
            }}
          >
            {item.label}
          </div>

        ))}

      </div>

    )}

  </div>

)}

{/* CAMPO DE ANOTAÇÃO */}
{modoVenda === "anotacao" && (
  <textarea
    placeholder="Digite sua anotação do dia..."
    value={anotacaoTexto}
    onChange={e =>
      setAnotacaoTexto(e.target.value)
    }
    style={{
      width: "100%",
      height: 60,
      resize: "vertical",
      background: "#111",
      color: "#fff",
      border: "1px solid #333",
      padding: 12,
      borderRadius: 10,
      marginBottom: 10,
      outline: "none"
    }}
  />
)}

<input
  placeholder="Buscar produto"
  value={busca}
  onChange={e => setBusca(e.target.value)}
/>

{busca && produtosFiltrados.length > 0 && (
  <div
    style={{
      background: "#111",
      padding: 10,
      borderRadius: 8,
      marginTop: 10
    }}
  >
    {produtosFiltrados.map(p => (
      <div
        key={p.id}
        className="item-busca"
        onClick={() => addCarrinho(p)}
      >
        {p.nome} - R$ {p.precoVenda}
      </div>
    ))}
  </div>
)}

<h3>Carrinho</h3>

{carrinho.map((item, i) => (
  <div key={i}>
    {item.nome} x{item.qtd || 1}
    <button onClick={() => removerItem(item.id)}>
      ➖
    </button>
  </div>
))}

<button onClick={limparCarrinho}>
  Limpar
</button>

<button
  onClick={() => setModalDesconto(true)}
>
  💸 Desconto
</button>

{subtotal > 0 && desconto > 0 && (
  <div
    style={{
      color: "#ffb347",
      fontSize: 14,
      marginTop: 8,
      marginBottom: 5
    }}
  >
    💸 Desconto aplicado:
    R$ {desconto.toFixed(2)}
  </div>
)}

<h3>
  Total: R$ {total.toFixed(2)}
</h3>

<button
  onClick={() => setConfirmarVenda(true)}
>
  Finalizar
</button>

<div style={{
  marginTop: 10,
  background: "#0f0f0f",
  padding: 8,
  borderRadius: 8,
  border: "1px solid #222",
  maxHeight: 220,
  overflowY: "auto"
}}>
  <h3 style={{ marginBottom: 10 }}>
    📝 Anotações do Dia
  </h3>

  {anotacoes.length === 0 && (
    <p style={{ color: "#777" }}>
      Nenhuma anotação ainda
    </p>
  )}

  {anotacoes.map(a => (
    <div key={a.id} style={{
  background: "#111",
  padding: 8,
  borderRadius: 6,
  marginBottom: 6,
  border: "1px solid #222",
  fontSize: 12
}}>
      <p style={{
  marginBottom: 3,
  fontSize: 12
}}>
        <strong>{a.descricao}</strong>
      </p>

      <p style={{
  fontSize: 10,
  color: "#777",
  margin: 0
}}>
        {a.hora} • R$ {a.valor}
      </p>

      <div style={{
  display: "flex",
  gap: 4,
  marginTop: 6
}}>
        
<div style={{
  display: "flex",
  gap: 4,
  marginTop: 6
}}>
  
  <button
    onClick={() => marcarComoPago(a)}
    style={{
      fontSize: 10,
      padding: "4px 6px"
    }}
  >
    ✅ Pago
  </button>

  <button
    onClick={() => {
    setAnotacaoSelecionada(a);
    setAbrirClientePendente(true); }}
    style={{
      fontSize: 10,
      padding: "4px 6px"
    }}
  >
    ⏳ Pendente
  </button>

 <button
  onClick={() => {
    setAnotacaoExcluir(a);
    setConfirmarExclusao(true);
  }}
  style={{
    fontSize: 10,
    padding: "4px 6px"
  }}
>
  ❌ Excluir
</button>

</div>

      </div>
    </div>
  ))}
</div>

      <hr />

      <h3
  style={{
    marginTop: 20,
    marginBottom: 15,
    color: "#fff"
  }}
>
  📊 Últimos Registros
</h3>

<div
  style={{
    background: "#111",
    borderRadius: 12,
    padding: 10,
    border: "1px solid #222",
    maxHeight: 500,
    overflowY: "auto"
  }}
>

 {registrosHoje
  .slice(0, 30)
  .map(item => {

    // 💸 DESPESA
    if (item.nome) {
  return (
    <div
      key={item.id}
      style={{
        background: "#2b1212",
        padding: 12,
        borderRadius: 10,
        marginBottom: 8,
        border: "1px solid #662222"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 6
        }}
      >
        <strong style={{ color: "#ff6b6b" }}>
          - R$ {Number(item.valor).toFixed(2)}
        </strong>

        <span
          style={{
            color: "#888",
            fontSize: 12
          }}
        >
          🕒 {item.hora || "--:--"}
        </span>
      </div>

      <div
        style={{
          color: "#ddd",
          fontSize: 12,
          marginBottom: 4
        }}
      >
        💸 {item.nome}
      </div>

      <div
        style={{
          color: "#ff6b6b",
          fontSize: 12,
          fontWeight: "bold"
        }}
      >
        DESPESA
      </div>
    </div>
  );
}

    // 📦 PRODUTOS
    const produtos = (item.itens || [])
      .map(i => `${i.nome} x${i.qtd || 1}`)
      .join(", ");

    return (
      <div
        key={item.id}
        style={{
          background: "#181818",
          padding: 12,
          borderRadius: 10,
          marginBottom: 8,
          border: "1px solid #2a2a2a"
        }}
      >

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 6
          }}
        >
          <strong style={{ color: "#fff" }}>
            R$ {(item.total || 0).toFixed(2)}
          </strong>

          <span
            style={{
              color: "#888",
              fontSize: 12
            }}
          >
            🕒 {item.hora}
          </span>
        </div>

        <div
          style={{
            color: "#ccc",
            fontSize: 12,
            marginBottom: 4
          }}
        >
          📦 {produtos || item.descricao}
        </div>

        {item.modo === "pendente" && (
          <div
            style={{
              color: "#ffb347",
              fontSize: 12,
              fontWeight: "bold"
            }}
          >
            ⏳ PENDENTE • {item.cliente}
          </div>
        )}

        {item.modo === "normal" && (

          <div
            style={{
              color: "#00d26a",
              fontSize: 12,
              fontWeight: "bold"
            }}
          >
            ✅ PAGO • {item.pagamento || "Dinheiro"}
          </div>
        )}


        {item.modo === "anotacao_paga" && (
  <div
    style={{
      color: "#00d26a",
      fontSize: 12,
      fontWeight: "bold"
    }}
  >
    📝 ANOTAÇÃO PAGA
  </div>
)}


{item.modo === "pendente_pago" && (
  <div
    style={{
      color: "#00d26a",
      fontSize: 12,
      fontWeight: "bold"
    }}
  >
    ✅ PENDENTE PAGO • {item.cliente}
  </div>
)}

{(() => {
  const isCancelada = item.status === "cancelada";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

      {/* BOTÃO (só se NÃO cancelada) */}
      {item.tipo === "venda" && !isCancelada && (
        <button
  onClick={() => {
    setVendaCancelar(item);
    setConfirmarCancelamento(true);
  }}
>
  Cancelar
</button>
      )}

      {/* STATUS CANCELADA */}
      {isCancelada && (
        <div>
          <div style={{
            color: "#ff3b3b",
            fontWeight: "bold",
            fontSize: 12
          }}>
            ❌ CANCELADA
          </div>

          <div style={{
            fontSize: 11,
            color: "#ff8a8a",
            lineHeight: "14px"
          }}>
            • Produtos devolvidos ao estoque<br/>
            • Lucro recalculado<br/>
            • Faturamento atualizado<br/>
            • Removido dos mais vendidos
          </div>
        </div>
      )}

    </div>
  );
})()}

       
        {item.modo === "anotacao" && (
          <div
            style={{
              color: "#7aa2ff",
              fontSize: 12,
              fontWeight: "bold"
            }}
          >
            📝 ANOTAÇÃO
          </div>
        )}

      </div>
    );
  })}

</div>

    </div>



    {/* 🏆 COLUNA DIREITA (RANKING PREMIUM) */}
<div
  style={{
    width: 320,
    background:
      "linear-gradient(180deg, rgba(25,25,35,0.95), rgba(10,10,15,0.98))",
    backdropFilter: "blur(18px)",
    borderRadius: 24,
    padding: 22,
    color: "#fff",
    height: "fit-content",
    position: "sticky",
    top: 90,
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow:
      "0 15px 40px rgba(0,0,0,0.45)",
    overflow: "hidden"
  }}
>

  {/* GLOW */}
  <div
    style={{
      position: "absolute",
      width: 180,
      height: 180,
      background: "rgba(255,106,0,0.18)",
      filter: "blur(90px)",
      top: -50,
      right: -50,
      borderRadius: "50%"
    }}
  />

  {/* HEADER */}
  <div
    style={{
      position: "relative",
      zIndex: 2,
      marginBottom: 25
    }}
  >
    <p
      style={{
        fontSize: 12,
        color: "#888",
        letterSpacing: 2,
        textTransform: "uppercase",
        marginBottom: 8
      }}
    >
      Ranking
    </p>

    <h2
      style={{
        margin: 0,
        fontSize: 24,
        fontWeight: "bold"
      }}
    >
      🏆 Mais Vendidos
    </h2>
  </div>

  {/* LISTA */}
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 14,
      position: "relative",
      zIndex: 2
    }}
  >

    {topProdutos.length === 0 ? (

      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 16,
          padding: 20,
          textAlign: "center",
          color: "#777"
        }}
      >
        Nenhuma venda ainda
      </div>

    ) : (

      topProdutos.map((p, i) => {

        const medalhas = ["🥇", "🥈", "🥉"];

        return (

          <div
            key={p.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 16,
              borderRadius: 18,

              background:
                i === 0
                  ? "linear-gradient(135deg, rgba(255,106,0,0.22), rgba(255,140,0,0.10))"
                  : "rgba(255,255,255,0.04)",

              border:
                i === 0
                  ? "1px solid rgba(255,140,0,0.35)"
                  : "1px solid rgba(255,255,255,0.05)",

              transform:
                i === 0
                  ? "scale(1.03)"
                  : "scale(1)",

              boxShadow:
                i === 0
                  ? "0 10px 30px rgba(255,106,0,0.15)"
                  : "none",

              transition: "0.25s"
            }}
          >

            {/* ESQUERDA */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14
              }}
            >

              {/* POSIÇÃO */}
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 14,

                  background:
                    i === 0
                      ? "linear-gradient(135deg,#ff6a00,#ff9f43)"
                      : "#1f1f28",

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  fontSize: 18,
                  fontWeight: "bold",

                  boxShadow:
                    i === 0
                      ? "0 6px 18px rgba(255,106,0,0.35)"
                      : "none"
                }}
              >
                {medalhas[i] || `#${i + 1}`}
              </div>

              {/* INFO */}
              <div>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 15
                  }}
                >
                  {p.nome}
                </div>

                <div
                  style={{
                    fontSize: 11,
                    color: "#888",
                    marginTop: 2
                  }}
                >
                  Produto vendido
                </div>
              </div>

            </div>

            {/* TOTAL */}
            <div
              style={{
                fontSize: 22,
                fontWeight: "bold",
                color:
                  i === 0
                    ? "#ff9f43"
                    : "#fff"
              }}
            >
              {p.total}
            </div>

          </div>

        );
      })

    )}

  </div>

</div>


</div>
)}
 
    
        {tab === "reset" && (
  <div className="reset-page">

    <h2>⚠️ Reset do Sistema</h2>

    <p className="reset-warning">
      Essa ação irá apagar completamente todos os dados do sistema:
      <br />• Produtos
      <br />• Vendas
      <br />• Pendentes
      <br />• Clientes
    </p>

    <button
      className="reset-big-btn"
      onClick={resetarSistema}
    >
      🔥 RESETAR SISTEMA
    </button>

  </div>
)}

{tab === "produtos" && (
  <div style={{ padding: 20 }}>
    <h2 style={{ marginBottom: 20 }}>📦 Produtos</h2>

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
<select
  value={categoria}
  onChange={e => setCategoria(e.target.value)}
  style={{
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    background: "#1a1a2e",
    color: "#fff",
    border: "1px solid #a855f7",
    width: "100%"
  }}
>
  <option
    value=""
    style={{
      background: "#1a1a2e",
      color: "#fff"
    }}
  >
    Selecione uma categoria
  </option>

  {categoriasProdutos.map(cat => (
  <option
    key={cat.id}
    value={cat.nome}
  >
    {cat.nome}
  </option>
))}
</select>
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

<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 8
  }}
>
  <input
    type="checkbox"
    checked={estoqueIlimitadoTemp}
    onChange={e =>
      setEstoqueIlimitadoTemp(
        e.target.checked
      )
    }
  />

  <span>
    ♾️ Estoque ilimitado
  </span>
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


 {editando && (
  <div
    style={{
      padding: 20,
      background: "#111",
      marginBottom: 20,
      borderRadius: 12,
      display: "flex",
      flexDirection: "column",
      gap: 15
    }}
  >

    <h3 style={{ color: "#fff" }}>
      ✏️ Editar Produto
    </h3>

    {/* 🏷️ NOME */}
    <div>
      <p style={{
        color: "#aaa",
        marginBottom: 5,
        fontSize: 13
      }}>
        Nome do produto
      </p>

      <input
        placeholder="Digite o nome..."
        value={editando.nome}
        onChange={e =>
          setEditando({
            ...editando,
            nome: e.target.value
          })
        }
      />
    </div>

    {/* 💰 PREÇO COMPRA */}
    <div>
      <p style={{
        color: "#aaa",
        marginBottom: 5,
        fontSize: 13
      }}>
        Preço de compra
      </p>

      <input
        placeholder="R$ 0,00"
        value={editando.preco}
        onChange={e =>
          setEditando({
            ...editando,
            preco: e.target.value
          })
        }
      />
    </div>

    {/* 💸 PREÇO VENDA */}
    <div>
      <p style={{
        color: "#aaa",
        marginBottom: 5,
        fontSize: 13
      }}>
        Preço de venda
      </p>

      <input
        placeholder="R$ 0,00"
        value={editando.precoVenda}
        onChange={e =>
          setEditando({
            ...editando,
            precoVenda: e.target.value
          })
        }
      />
    </div>

    
{/* 📦 ESTOQUE */}
<div>
  <p
    style={{
      color: "#aaa",
      marginBottom: 5,
      fontSize: 13
    }}
  >
    Controle de estoque
  </p>

  <select
    value={editando.tipoEstoque || "normal"}
    onChange={e =>
      setEditando({
        ...editando,
        tipoEstoque: e.target.value
      })
    }
    style={{
      width: "100%",
      marginBottom: 10
    }}
  >
    <option value="normal">
      Estoque normal
    </option>

    
    <option value="ilimitado">
      ♾️ Estoque ilimitado
    </option>
  </select>

  {editando.tipoEstoque !== "ilimitado" && (
    <input
      placeholder="Quantidade"
      value={editando.estoqueTemp || ""}
      onChange={e =>
        setEditando({
          ...editando,
          estoqueTemp: e.target.value
        })
      }
    />
  )}
</div>

{/* 🔥 BOTÕES */}
<div
  style={{
    display: "flex",
    gap: 10,
    marginTop: 10
  }}
>
  <button
    onClick={() => {
      setProdutos(prev =>
        prev.map(p => {
          if (p.id !== editando.id) return p;

         let novoEstoque =
  Number(editando.estoqueTemp || 0);

         return {
  ...editando,

  estoque:
  editando.tipoEstoque === "ilimitado"
    ? 0
    : Number(editando.estoqueTemp || 0),

  estoqueIlimitado:
    editando.tipoEstoque === "ilimitado"
};
        })
      );

      setEditando(null);
    }}
  >
    💾 Salvar
  </button>

  <button
    onClick={() => setEditando(null)}
  >
    Cancelar
  </button>
</div>

</div>
)}
{/* ================= LISTA ================= */}
{subTab === "lista" && (

  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

    {/* 🔥 CRIAR CATEGORIA */}
    <div
      style={{
        background: "#111",
        padding: 15,
        borderRadius: 12,
        border: "1px solid #333"
      }}
    >
      <h3 style={{ marginBottom: 10 }}>
        ➕ Criar categoria
      </h3>

      <div
        style={{
          display: "flex",
          gap: 10
        }}
      >
        <input
          placeholder="Nome da categoria"
          value={novaCategoria}
          onChange={e => setNovaCategoria(e.target.value)}
          style={{ flex: 1 }}
        />

        <button onClick={criarCategoriaProduto}>
  Criar
</button>
      </div>
    </div>

    <div style={{ display: "flex", gap: 20 }}>

     {/* 🔥 CATEGORIAS PROFISSIONAIS */}

<div
  style={{
    width: "100%",
    display: "grid",
   gridTemplateColumns:
  "repeat(auto-fill,minmax(180px,1fr))",
    gap: 12
  }}
>
{categoriasProdutos.map(catObj => {
    const produtosCategoria =
(produtos || []).filter(
  p =>
    (p.categoria || "")
      .trim()
      .toLowerCase() ===
    (catObj.nome || "")
      .trim()
      .toLowerCase()
);

    const investido =
      produtosCategoria.reduce(
        (s, p) =>
          s +
          Number(p.preco || 0) *
          Number(p.estoque || 0),
        0
      );

    const venda =
      produtosCategoria.reduce(
        (s, p) =>
          s +
          Number(p.precoVenda || 0) *
          Number(p.estoque || 0),
        0
      );

    const lucro = venda - investido;

    return (

      <div
        key={catObj.id}
       onClick={() => {

  setCategoriaSelecionada(
    catObj.nome
  );

  setProdutoSelecionado(null);

  setModalCategoria(true);

}}
        style={{
          background:
            "linear-gradient(180deg,#1a1a2e,#111)",
          border:
            categoriaSelecionada === catObj.nome
              ? "2px solid #a855f7"
              : "1px solid #2a2a40",
          borderRadius: 16,
          padding: 14,
          cursor: "pointer",
          color: "#fff",
          transition: ".2s",
          minHeight: 95,
          boxShadow:
            "0 5px 15px rgba(0,0,0,.25)"
        }}
      >

        {/* TOPO */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12
          }}
        >
          <h3
            style={{
              margin: 0,
              color: "#a855f7",
              fontSize: 15
            }}
          >
            📦 {catObj.nome}
          </h3>

          <button
            onClick={(e) => {

              e.stopPropagation();

              const confirmar =
                window.confirm(
                  `Excluir categoria "${catObj.nome}" ?`
                );

              if (!confirmar) return;

         setCategoriasProdutos(prev =>
  prev.filter(c => c.id !== catObj?.id)
);

              setProdutos(prev =>
                prev.map(p =>
                  p.categoria === catObj.nome
                    ? {
                        ...p,
                        categoria: "Sem categoria"
                      }
                    : p
                )
              );

            }}
            style={{
              background: "#ef4444",
              border: "none",
              color: "#fff",
              borderRadius: 6,
              padding: "3px 7px",
              fontSize: 11,
              cursor: "pointer"
            }}
          >
            🗑
          </button>
        </div>

        {/* DADOS */}

        <div
          style={{
            display: "grid",
            gap: 6,
            fontSize: 13
          }}
        >
          <div>
            📦 Produtos:
            <strong>
              {" "}
              {produtosCategoria.length}
            </strong>
          </div>

          <div>
            💰 Investido:
            <strong>
              {" "}
              R$ {investido.toFixed(0)}
            </strong>
          </div>

          <div>
            🏷️ Venda:
            <strong>
              {" "}
              R$ {venda.toFixed(0)}
            </strong>
          </div>

          <div
            style={{
              color: "#22c55e",
              fontWeight: "bold"
            }}
          >
            📈 Lucro:
            {" "}
            R$ {lucro.toFixed(0)}
          </div>
        </div>

      </div>

    );

  })}
</div>

{produtoModal && (

  <div
    onClick={() =>
      setProdutoModal(null)
    }
    style={{
      position: "fixed",
      inset: 0,
      background:
        "rgba(0,0,0,.90)",
      zIndex: 10000,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: 20
    }}
  >

    <div
      onClick={e =>
        e.stopPropagation()
      }
      style={{
        width: 500,
        maxWidth: "100%",
        background:
          "linear-gradient(180deg,#1a1a2e,#111)",
        border:
          "1px solid #333",
        borderRadius: 24,
        overflow: "hidden",
        color: "#fff"
      }}
    >

      {produtoModal.imagem && (

        <img
          src={produtoModal.imagem}
          style={{
            width: "100%",
            height: 260,
            objectFit: "cover"
          }}
        />

      )}

      <div
        style={{
          padding: 20
        }}
      >

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center"
          }}
        >

          <h2
            style={{
              color: "#a855f7",
              margin: 0
            }}
          >
            {produtoModal.nome}
          </h2>

          <button
            onClick={() =>
              setProdutoModal(null)
            }
            style={{
              background:
                "#ef4444",
              border: "none",
              color: "#fff",
              padding:
                "8px 12px",
              borderRadius: 8,
              cursor: "pointer"
            }}
          >
            ✕
          </button>

        </div>

        <div
          style={{
            marginTop: 20,
            display: "grid",
            gap: 10
          }}
        >

        <div>
  📦 Estoque:
  <strong>
    {produtoModal.estoqueIlimitado
      ? " ♾️ Ilimitado"
      : ` ${produtoModal.estoque}`}
  </strong>
</div>

          <div>
            💰 Compra:
            <strong>
              {" "}
              R$
              {Number(
                produtoModal.preco
              ).toFixed(2)}
            </strong>
          </div>

          <div>
            🏷️ Venda:
            <strong>
              {" "}
              R$
              {Number(
                produtoModal.precoVenda
              ).toFixed(2)}
            </strong>
          </div>

          <div
            style={{
              color: "#22c55e",
              fontWeight: "bold"
            }}
          >
            📊 Lucro Unitário:
            {" "}
            R$
            {(
              Number(
                produtoModal.precoVenda
              ) -
              Number(
                produtoModal.preco
              )
            ).toFixed(2)}
          </div>

          <div
            style={{
              color: "#67e8f9",
              fontWeight: "bold"
            }}
          >
            📈 Lucro Total:
            {" "}
            R$
            {(
              (
                Number(
                  produtoModal.precoVenda
                ) -
                Number(
                  produtoModal.preco
                )
              ) *
              Number(
                produtoModal.estoque
              )
            ).toFixed(2)}
          </div>

        </div>

        <div
          style={{
            display: "grid",
            gap: 10,
            marginTop: 25
          }}
        >

          <button
            onClick={() => {
              setEditando(
                produtoModal
              );
              setProdutoModal(
                null
              );
            }}
          >
            ✏️ Editar Produto
          </button>

         
          <button
            style={{
              background:
                "#ef4444"
            }}
          >
            🗑 Excluir Produto
          </button>

        </div>

      </div>

    </div>

  </div>

)}

      {/* 🔥 DETALHE PRODUTO */}
      <div style={{ flex: 1 }}>

        {produtoSelecionado ? (

          <div>

            <h3>
              {produtoSelecionado.nome}
            </h3>

            {produtoSelecionado.imagem && (
              <img
                src={produtoSelecionado.imagem}
                style={{
                  width: 200,
                  borderRadius: 10
                }}
              />
            )}

            <p>
              💰 Compra:
              R$ {produtoSelecionado.preco}
            </p>

            <p>
              💸 Venda:
              R$ {produtoSelecionado.precoVenda}
            </p>

            <p>
              📦 Estoque:
              {produtoSelecionado.estoque}
            </p>

            <p>
              📊 Lucro unit:
              R$ {(
                produtoSelecionado.precoVenda -
                produtoSelecionado.preco
              ).toFixed(2)}
            </p>

            <p>
              📈 Lucro total:
              R$ {(
                (
                  produtoSelecionado.precoVenda -
                  produtoSelecionado.preco
                ) *
                produtoSelecionado.estoque
              ).toFixed(2)}
            </p>

          </div>

        ) : (

          <p>Selecione um produto</p>

        )}

      </div>

    </div>

    {/* 🔥 ESTATÍSTICAS */}
   <div className="stats-grid">

  <div className="stat-card">
    <span className="stat-label">
      💰 Total Investido
    </span>

    <strong className="stat-value">
      R$ {totalInvestido.toFixed(2)}
    </strong>
  </div>

  <div className="stat-card">
    <span className="stat-label">
      🏷️ Valor de Venda
    </span>

    <strong className="stat-value">
      R$ {valorVenda.toFixed(2)}
    </strong>
  </div>

 <div className="stat-card">
    <span className="stat-label">
      📈 Lucro Estimado
    </span>

    <strong className="stat-value lucro">
      R$ {lucroEstimado.toFixed(2)}
    </strong>
  </div>

       <div className="stat-card">
  <span className="stat-label">
    📊 Margem Média de Lucro
  </span>

  <strong className="stat-value margem">
    {margemMediaEstoque.toFixed(1)}%
  </strong>
</div>

  

    </div>

  </div>

)}
{modalCategoria && (

  <div
    onClick={() =>
      setModalCategoria(false)
    }
    style={{
      position: "fixed",
      inset: 0,
      background:
        "rgba(0,0,0,.85)",
      zIndex: 9999,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: 20
    }}
  >

    <div
      onClick={e =>
        e.stopPropagation()
      }
      style={{
        width: "95%",
        maxWidth: 1400,
        height: "90vh",
        overflowY: "auto",

        background:
          "linear-gradient(180deg,#1a1a2e,#111)",

        border:
          "1px solid #333",

        borderRadius: 24,

        padding: 25,

        color: "#fff"
      }}
    >

      {/* CABEÇALHO */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: 25
        }}
      >

        <h2
          style={{
            margin: 0,
            color: "#a855f7"
          }}
        >
          📦 {categoriaSelecionada}
        </h2>

        <button
          onClick={() =>
            setModalCategoria(false)
          }
          style={{
            background:
              "#ef4444",
            border: "none",
            color: "#fff",
            padding:
              "8px 14px",
            borderRadius: 10,
            cursor: "pointer"
          }}
        >
          ✕
        </button>

      </div>

      {/* ESTATÍSTICAS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: 15,
          marginBottom: 25
        }}
      >

        <div
          style={{
            background:"#181825",
            padding:15,
            borderRadius:15
          }}
        >
          💰 Investido
          <h3>
            R$
            {produtos
              .filter(
                p =>
                  p.categoria ===
                  categoriaSelecionada
              )
              .reduce(
                (s,p)=>
                  s +
                  Number(p.preco||0) *
                  Number(p.estoque||0),
                0
              )
              .toFixed(2)}
          </h3>
        </div>

        <div
          style={{
            background:"#181825",
            padding:15,
            borderRadius:15
          }}
        >
          🏷️ Venda
          <h3>
            R$
            {produtos
              .filter(
                p =>
                  p.categoria ===
                  categoriaSelecionada
              )
              .reduce(
                (s,p)=>
                  s +
                  Number(
                    p.precoVenda||0
                  ) *
                  Number(
                    p.estoque||0
                  ),
                0
              )
              .toFixed(2)}
          </h3>
        </div>

        <div
          style={{
            background:"#181825",
            padding:15,
            borderRadius:15
          }}
        >
          📦 Produtos
          <h3>
            {
              produtos.filter(
                p =>
                  p.categoria ===
                  categoriaSelecionada
              ).length
            }
          </h3>
        </div>

<div
  style={{
    background:"#181825",
    padding:15,
    borderRadius:15
  }}
>
  📈 Lucro Total

  <h3>
    R$
    {
      produtos
        .filter(
          p =>
            p.categoria ===
            categoriaSelecionada
        )
        .reduce(
          (s,p) =>
            s +
            (
              (
                Number(p.precoVenda || 0) -
                Number(p.preco || 0)
              ) *
              Number(p.estoque || 0)
            ),
          0
        )
        .toFixed(2)
    }
  </h3>
</div>

      </div>



         {/* PRODUTOS */}

      <div
        style={{
          display:"grid",
          gridTemplateColumns:
            "repeat(auto-fill,minmax(230px,1fr))",
          gap:15
        }}
      >

        {produtos
          .filter(
            p =>
              p.categoria ===
              categoriaSelecionada
          )
          .map(p => (

           <div
  key={p.id}
  onClick={() => setProdutoModal(p)}
  style={{
    background:"#181825",
    border:"1px solid #333",
    borderRadius:18,
    padding:15,
    cursor:"pointer",
    transition:".2s"
  }}
>

              {p.imagem && (
                <img
                  src={p.imagem}
                  style={{
                    width:"100%",
                    height:140,
                    objectFit:"cover",
                    borderRadius:12,
                    marginBottom:10
                  }}
                />
              )}

              <h4>
                {p.nome}
              </h4>

             <div>
  📦 Estoque:
  {p.estoqueIlimitado
    ? " ♾️ Ilimitado"
    : ` ${p.estoque}`}
</div>

              <div>
                💰 Compra:
                R$ {p.preco}
              </div>

              <div>
                🏷️ Venda:
                R$ {p.precoVenda}
              </div>

              <div
  style={{
    color: "#22c55e",
    marginTop: 6
  }}
>
  📊 Lucro Unitário:
  R$ {(
    Number(p.precoVenda || 0) -
    Number(p.preco || 0)
  ).toFixed(2)}
</div>

<div
  style={{
    color: "#67e8f9",
    fontWeight: "bold",
    marginTop: 4
  }}
>
  📈 Lucro Total:
  R$ {(
    (
      Number(p.precoVenda || 0) -
      Number(p.preco || 0)
    ) *
    Number(p.estoque || 0)
  ).toFixed(2)}
</div>

            </div>

          ))}

      </div>

    </div>

  </div>

)}

</div>
)}

  
{tab === "extrato" && (
  <div style={{ padding: 20 }}>
<div
  style={{
    width: "100%",
    padding: 40,
    boxSizing: "border-box",
    borderRadius: 24,
    background: "linear-gradient(180deg,#18181b,#0f0f12)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
    textAlign: "center",
    color: "#fff"
  }}
>

      <div
        style={{
          fontSize: 70,
          marginBottom: 20
        }}
      >
        📊
      </div>

      <h2
        style={{
          margin: 0,
          marginBottom: 15,
          fontSize: 34,
          fontWeight: "bold"
        }}
      >
        Analytics
      </h2>

      <p
        style={{
          color: "#888",
          fontSize: 13,
          letterSpacing: 2,
          textTransform: "uppercase",
          marginBottom: 30
        }}
      >
        Módulo Avançado de Inteligência de Dados
      </p>

      <div
        style={{
          maxWidth: 650,
          margin: "0 auto",
          lineHeight: 1.8,
          color: "#ccc",
          fontSize: 16
        }}
      >
        Este sistema encontra-se atualmente em
        <strong style={{ color: "#ff9f43" }}>
          {" "}versão beta
        </strong>.
        <br /><br />

        O módulo de Analytics ainda está em desenvolvimento e será
        disponibilizado em futuras atualizações.

        <br /><br />

        Em breve estarão disponíveis recursos avançados como:

        <br /><br />

        📈 Gráficos inteligentes de vendas<br />
        💰 Análise completa de faturamento e lucro<br />
        📦 Controle avançado de estoque<br />
        👥 Relatórios de clientes e pendências<br />
        🏆 Ranking de produtos e desempenho<br />
        🚀 Indicadores estratégicos em tempo real

      </div>

      <div
        style={{
          marginTop: 35
        }}
      >
        <span
          style={{
            background:
              "linear-gradient(135deg,#ff6a00,#ff9f43)",
            padding: "12px 24px",
            borderRadius: 999,
            fontWeight: "bold",
            color: "#fff",
            boxShadow:
              "0 10px 25px rgba(255,106,0,0.25)"
          }}
        >
          🚀 Em Desenvolvimento
        </span>
      </div>

    </div>

  </div>
)}

{tab === "pendentes" && (
  <div style={{ padding: 20 }}>
    <h2 style={{ marginBottom: 20 }}>👥 Clientes</h2>

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
<div
  style={{
    maxHeight: "600px",
    overflowY: "auto",
    paddingRight: 8,
    borderRadius: 12,
    border: "1px solid #333",
    background: "#111",
    padding: 10
  }}
>
  {clientes.map(c => {
    const vendasCliente = pendentes.filter(
      p => p.cliente === c.nome
    );

    const totalCliente = vendasCliente.reduce(
      (soma, v) => soma + v.total,
      0
    );

    const primeiraVenda = vendasCliente.length
      ? vendasCliente.reduce((maisAntiga, atual) => {
          return new Date(atual.data) < new Date(maisAntiga.data)
            ? atual
            : maisAntiga;
        })
      : null;

    return (
      <div
        key={c.id}
        style={{
          border: "1px solid #333",
          padding: 10,
          marginBottom: 10,
          borderRadius: 8,
          background: "#181818"
        }}
      >
        <h3
          onClick={() =>
            setClienteSelecionado(
              clienteSelecionado === c.nome
                ? null
                : c.nome
            )
          }
          style={{
            cursor: "pointer",
            marginBottom: 8
          }}
        >
          👤 {c.nome}
        </h3>

        <p>
          💰 Total: R$ {totalCliente.toFixed(2)}
        </p>

        <p
          style={{
            color: "#facc15",
            fontSize: 12,
            marginTop: 4
          }}
        >
          📅 Primeira pendência:
          {primeiraVenda
            ? ` ${primeiraVenda.data}`
            : " Nenhuma"}
        </p>

        <div
          style={{
            display: "flex",
            gap: 8,
            marginTop: 8,
            marginBottom: 8
          }}
        >
          <button
            onClick={() => {
              setClienteQuitar(c);
              setValorQuitacao("");
              setModalQuitar(true);
            }}
          >
            ✅ Quitar
          </button>

          <button
  onClick={() => {
    setClienteQuitarTotal(c);
    setModalQuitarTotal(true);
  }}
>
  💰 Quitar Total
</button>

       

<button
  onClick={() => {
    setClienteHistorico(c);
    setModalHistorico(true);
  }}
>
  📋 Histórico
</button>

          <button
            onClick={() => {
              setClienteExcluir(c);
              setConfirmarExcluirCliente(true);
            }}
          >
            ❌ Excluir cliente
          </button>

         <button
  onClick={() => {
    setClienteReajuste(c);
    setNovoValorCliente(totalCliente);
    setModalReajuste(true);
  }}
>
  🔧 Reajustar Valor
</button>
        </div>



        {clienteSelecionado === c.nome && (
          <div
            style={{
              marginTop: 10,
              padding: 10,
              background: "#0f0f0f",
              borderRadius: 8,
              border: "1px solid #222"
            }}
          >
            {vendasCliente.length === 0 ? (
              <p
                style={{
                  color: "#777",
                  margin: 0
                }}
              >
                Nenhum pendente
              </p>
            ) : (
              vendasCliente.map(v => (
                <div
                  key={v.id}
                  style={{
                    padding: "6px 0",
                    borderBottom: "1px solid #222"
                  }}
                >
                  🧾 R$ {v.total.toFixed(2)} - {v.hora}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  })}
</div>
    {/* TOTAL GERAL */}
    <h3>
      💵 Total geral: R${" "}
      {pendentes
        .reduce((soma, v) => soma + v.total, 0)
        .toFixed(2)}
    </h3>
  </div>
)}

{tab === "stats" && (
  <div style={{ padding: 20 }}>
    <h2 style={{ marginBottom: 20 }}>📊 Estatísticas</h2>

    {/* FILTRO */}
    <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
      {["hoje","7d","14d","1m","3m","1y"].map(p => (
        <button
          key={p}
          onClick={() => setPeriodo(p)}
          style={{
            padding: "8px 12px",
            background: periodo === p ? "#a855f7" : "#222",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer"
          }}
        >
          {p}
        </button>
      ))}
    </div>

    {/* CARDS */}
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: 20
    }}>

      <div style={cardStyle}>
  <div
    style={{
      width: 50,
      height: 50,
      borderRadius: 14,
      background:
        "linear-gradient(135deg,#ff6a00,#ff9f43)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 24,
      marginBottom: 15
    }}
  >
    💰
  </div>

  <p
    style={{
      color: "#888",
      marginBottom: 8,
      fontSize: 13
    }}
  >
    FATURAMENTO
  </p>

  <h2
    style={{
      margin: 0,
      color: "#fff",
      fontSize: 28
    }}
  >
    R$ {faturamento.toFixed(2)}
  </h2>
</div>

     

    <div style={cardStyle}>
  <div
    style={{
      width: 50,
      height: 50,
      borderRadius: 14,
      background:
        "linear-gradient(135deg,#22c55e,#16a34a)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 24,
      marginBottom: 15
    }}
  >
    📈
  </div>

  <p
    style={{
      color: "#888",
      marginBottom: 8,
      fontSize: 13
    }}
  >
    LUCRO
  </p>

  <h2
    style={{
      margin: 0,
      color: "#22c55e",
      fontSize: 28
    }}
  >
    R$ {lucro.toFixed(2)}
  </h2>
</div>

   

     <div style={cardStyle}>
  <div
    style={{
      width: 50,
      height: 50,
      borderRadius: 14,
      background:
        "linear-gradient(135deg,#ef4444,#dc2626)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 24,
      marginBottom: 15
    }}
  >
    💵
  </div>

  <p
    style={{
      color: "#888",
      marginBottom: 8,
      fontSize: 13
    }}
  >
    DESPESAS
  </p>

  <h2
    style={{
      margin: 0,
      color: "#f87171",
      fontSize: 28
    }}
  >
    R$ {Number(despesasTotais || 0).toFixed(2)}
  </h2>
</div>

<div style={cardStyle}>
  <p>📈 Margem Média</p>
  <h2>
    {margemLucro.toFixed(1)}%
  </h2>
</div>

<div style={cardStyle}>
  <p>🧾 Total de Vendas</p>

  <h2>
    {totalVendas}
  </h2>
</div>

</div>

{/* ================= ESTOQUE ================= */}

<h3
  style={{
    marginTop: 35,
    marginBottom: 20,
    color: "#fff",
    fontSize: 22
  }}
>
  📦 Estatísticas gerais do estoque
</h3>

<div
  style={{
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 20,
    alignItems: "stretch"
  }}
>

  {/* 📦 ESTOQUE TOTAL */}
  <div
    style={{
      ...cardStyle,
      height: "100%"
    }}
  >

    <div
      style={{
        width: 50,
        height: 50,
        borderRadius: 14,
        background:
          "linear-gradient(135deg,#a855f7,#9333ea)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 24,
        marginBottom: 15
      }}
    >
      📦
    </div>

    <p
      style={{
        color: "#888",
        marginBottom: 8,
        fontSize: 13
      }}
    >
      ESTOQUE TOTAL
    </p>

    <h2
      style={{
        margin: 0,
        color: "#c084fc",
        fontSize: 28
      }}
    >
      R$ {investimento.toFixed(2)}
    </h2>

  </div>

  {/* 📈 LUCRO POTENCIAL */}
  <div
    style={{
      ...cardStyle,
      height: "100%"
    }}
  >

    <div
      style={{
        width: 50,
        height: 50,
        borderRadius: 14,
        background:
          "linear-gradient(135deg,#06b6d4,#3b82f6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 24,
        marginBottom: 15
      }}
    >
      📈
    </div>

    <p
      style={{
        color: "#888",
        marginBottom: 8,
        fontSize: 13
      }}
    >
      LUCRO POTENCIAL DO ESTOQUE
    </p>

    <h2
      style={{
        margin: 0,
        color: "#67e8f9",
        fontSize: 28
      }}
    >
      R$ {lucroEstoque.toFixed(2)}
    </h2>

  </div>

</div>

<hr style={{ margin: "30px 0" }} />

{/* ================= PENDÊNCIAS ================= */}

<div
  style={{
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 20
  }}
>

  <div style={cardStyle}>
    <p>📌 Total pendente</p>

    <h2>
      R$ {totalPendentes.toFixed(2)}
    </h2>
  </div>

  <div style={cardStyle}>
    <p>👥 Clientes devendo</p>

    <h2>
      {clientesPendentes}
    </h2>
  </div>

</div>

{/* FECHAMENTO DA ABA ESTATÍSTICAS */}
</div>
)}

{/* ================= MODAL AJUSTE ================= */}
{/* ================= MODAL AJUSTE ================= */}

{ajusteAberto && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 999
    }}
  >
    <div
      style={{
        background: "#111",
        padding: 20,
        borderRadius: 12,
        width: 300,
        color: "#fff",
        border: "1px solid #333"
      }}
    >
      <h3>🔒 Ajuste de Caixa</h3>

      <p style={{ fontSize: 12, opacity: 0.8 }}>
        Esse ajuste irá modificar o valor total do seu caixa. Tem certeza?
      </p>

      <input
        placeholder="Novo valor do caixa"
        value={valorAjuste}
        onChange={e => setValorAjuste(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          marginTop: 10,
          borderRadius: 8,
          border: "1px solid #333",
          background: "#000",
          color: "#fff"
        }}
      />

      <div style={{ display: "flex", gap: 10, marginTop: 15 }}>
        
        <button
          onClick={() => {
            const confirmar = window.confirm(
              "Tem certeza que deseja alterar o valor do caixa?"
            );

            if (!confirmar) return;
const novoValor = Number(valorAjuste) || 0;

const diferenca =
  novoValor - (caixa - totalDespesas);

setAjusteCaixa(diferenca);

setValorAjuste("");
setAjusteAberto(false);
          }}
          style={{
            flex: 1,
            background: "#22c55e",
            border: "none",
            padding: 10,
            borderRadius: 8,
            cursor: "pointer",
            color: "#fff"
          }}
        >
          Confirmar
        </button>

        <button
          onClick={() => setAjusteAberto(false)}
          style={{
            flex: 1,
            background: "#ef4444",
            border: "none",
            padding: 10,
            borderRadius: 8,
            cursor: "pointer",
            color: "#fff"
          }}
        >
          Cancelar
        </button>

      </div>
    </div>
  </div>
)}

{abrirClientePendente && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 999
    }}
  >
    <div
      style={{
        background: "#111",
        padding: 20,
        borderRadius: 12,
        width: 300,
        border: "1px solid #333"
      }}
    >
      <h3>Selecionar cliente</h3>

      <input
  type="text"
  placeholder="Nome do cliente"
  value={clientePendente}
  onChange={e => setClientePendente(e.target.value)}
  style={{
    width: "100%",
    padding: 10,
    marginTop: 10,
    background: "#000",
    color: "#fff",
    border: "1px solid #333",
    borderRadius: 8
  }}
/>

{/* 🔥 SUGESTÕES */}
{clientePendente && (
  <div
    style={{
      background: "#111",
      border: "1px solid #333",
      borderRadius: 8,
      marginTop: 5,
      maxHeight: 120,
      overflowY: "auto"
    }}
  >
    {clientes
      .filter(c =>
        c.nome
          .toLowerCase()
          .includes(clientePendente.toLowerCase())
      )
      .map(c => (
        <div
          key={c.id}
          onClick={() => setClientePendente(c.nome)}
          style={{
            padding: 8,
            cursor: "pointer",
            borderBottom: "1px solid #222"
          }}
        >
          {c.nome}
        </div>
      ))}
  </div>
)}

{/* 🔥 AVISO */}
{clientePendente.trim() !== "" &&
 !clientes.some(
   c =>
     c.nome.trim().toLowerCase() ===
     clientePendente.trim().toLowerCase()
 ) && (
  <p
    style={{
      fontSize: 12,
      color: "#facc15",
      marginTop: 8
    }}
  >
    ⚠️ Esse cliente não existe no sistema.
    Ele será adicionado automaticamente.
  </p>
)}

      <div style={{
        display: "flex",
        gap: 10,
        marginTop: 15
      }}>
        
        <button
  onClick={() => {

    const existe = clientes.some(
      c =>
        c.nome.toLowerCase() ===
        clientePendente.toLowerCase()
    );

    if (!existe) {
      setClientes(prev => [
        ...prev,
        {
          id: Date.now(),
          nome: clientePendente
        }
      ]);
    }

    marcarComoPendente({
      ...anotacaoSelecionada,
      cliente: clientePendente
    });

    setAbrirClientePendente(false);
    setClientePendente("");
    setAnotacaoSelecionada(null);

  }}
  style={{
    flex: 1
  }}
>
  Confirmar
</button>

        <button
          onClick={() => {
            setAbrirClientePendente(false);
            setClientePendente("");
            setAnotacaoSelecionada(null);
          }}
          style={{
            flex: 1
          }}
        >
          Cancelar
        </button>

      </div>
    </div>
  </div>
)}

{confirmarExclusao && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.75)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999
    }}
  >
    <div
      style={{
        width: 340,
        background: "#111",
        border: "1px solid #333",
        borderRadius: 14,
        padding: 20,
        color: "#fff",
        boxShadow: "0 0 25px rgba(0,0,0,0.5)"
      }}
    >
      <h3 style={{
        marginBottom: 15,
        color: "#ef4444"
      }}>
        ⚠️ Confirmar exclusão
      </h3>

      <p style={{
        fontSize: 14,
        lineHeight: 1.5,
        color: "#ccc"
      }}>
        O produto foi retirado do estoque.
        <br /><br />
        Confira por favor antes de excluir esta anotação.
      </p>

      <div style={{
        display: "flex",
        gap: 10,
        marginTop: 20
      }}>
        
        <button
          onClick={() => {

            excluirAnotacao(anotacaoExcluir.id);

            setConfirmarExclusao(false);
            setAnotacaoExcluir(null);

          }}
          style={{
            flex: 1,
            background: "#ef4444",
            border: "none",
            padding: 10,
            borderRadius: 8,
            color: "#fff",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Excluir
        </button>

        <button
          onClick={() => {
            setConfirmarExclusao(false);
            setAnotacaoExcluir(null);
          }}
          style={{
            flex: 1,
            background: "#222",
            border: "1px solid #444",
            padding: 10,
            borderRadius: 8,
            color: "#fff",
            cursor: "pointer"
          }}
        >
          Cancelar
        </button>

      </div>
    </div>
  </div>
)}
{modalQuitar && clienteQuitar && (

  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999
    }}
  >

    <div
      style={{
        background: "#111",
        padding: 20,
        borderRadius: 12,
        width: 320,
        color: "#fff",
        border: "1px solid #333"
      }}
    >

      <h3>
        💰 Quitar Cliente
      </h3>

      <p>
        👤 {clienteQuitar.nome}
      </p>

      <p>
        Dívida total: R$ {
          pendentes
            .filter(p =>
              p.cliente === clienteQuitar.nome
            )
            .reduce((s, v) => s + v.total, 0)
            .toFixed(2)
        }
      </p>

      <input
        placeholder="Valor pago"
        value={valorQuitacao}
        onChange={e =>
          setValorQuitacao(e.target.value)
        }
        style={{
          width: "100%",
          padding: 10,
          marginTop: 10,
          background: "#000",
          color: "#fff",
          border: "1px solid #333",
          borderRadius: 8
        }}
      />

      <div
        style={{
          display: "flex",
          gap: 10,
          marginTop: 20
        }}
      >

        <button
          onClick={() => {

  const valorPago =
  resumoQuitacao?.valorPago ||
  Number(valorQuitacao.replace(",", "."));
  console.log("clienteQuitar", clienteQuitar);
console.log("valorPago", valorPago);

  const vendasCliente = pendentes.filter(
    p => p.cliente === clienteQuitar.nome
  );

  const totalDivida = vendasCliente.reduce(
    (soma, v) => soma + (v.total || 0),
    0
  );

 const lucroEstimado =
  valorPago * 0.35;

  setResumoQuitacao({
    totalDivida,
    valorPago,
    lucroEstimado
  });

  setConfirmarQuitacao(true);
}}
        >
          Confirmar
        </button>

        <button
          onClick={() => {
            setModalQuitar(false);
            setClienteQuitar(null);
            setValorQuitacao("");
          }}
          style={{
            flex: 1,
            background: "#ef4444",
            border: "none",
            padding: 10,
            borderRadius: 8,
            color: "#fff",
            cursor: "pointer"
          }}
        >
          Cancelar
        </button>

      </div>

    </div>

  </div>

)}

{/* 🔥 MODAL CONFIRMAR EXCLUSÃO CLIENTE */}
{confirmarExcluirCliente && (

  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.75)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
      backdropFilter: "blur(4px)"
    }}
  >

    <div
      style={{
        width: 380,
        background:
          "linear-gradient(180deg,#161616,#0f0f0f)",
        border: "1px solid #2a2a2a",
        borderRadius: 18,
        padding: 24,
        color: "#fff",
        boxShadow:
          "0 20px 60px rgba(0,0,0,0.6)"
      }}
    >

      {/* HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 18
        }}
      >

        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            background:
              "linear-gradient(135deg,#ef4444,#dc2626)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            boxShadow:
              "0 10px 25px rgba(239,68,68,0.35)"
          }}
        >
          ⚠️
        </div>

        <div>
          <h3 style={{
            margin: 0,
            fontSize: 20
          }}>
            Excluir cliente
          </h3>

          <p style={{
            margin: 0,
            fontSize: 12,
            color: "#888"
          }}>
            Essa ação é irreversível
          </p>
        </div>

      </div>

      {/* TEXTO */}
      <div
        style={{
          background: "#111",
          border: "1px solid #222",
          borderRadius: 12,
          padding: 14,
          marginBottom: 20,
          lineHeight: 1.6
        }}
      >

        <p style={{
          marginTop: 0,
          fontSize: 14,
          color: "#ddd"
        }}>
          Tem certeza que deseja excluir o cliente:
        </p>

        <strong style={{
          fontSize: 18,
          color: "#fff"
        }}>
          👤 {clienteExcluir?.nome}
        </strong>

        <div style={{
          marginTop: 14,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          fontSize: 13
        }}>

          <div style={{ color: "#f87171" }}>
            ❌ Todos os pendentes serão apagados
          </div>

          <div style={{ color: "#facc15" }}>
            💰 O valor NÃO irá para o caixa
          </div>

          <div style={{ color: "#fb7185" }}>
            📦 Os produtos NÃO voltarão ao estoque
          </div>

        </div>

      </div>

      {/* BOTÕES */}
      <div
        style={{
          display: "flex",
          gap: 12
        }}
      >

        <button
          onClick={() => {

            setPendentes(prev =>
              prev.filter(
                p =>
                  p.cliente !==
                  clienteExcluir.nome
              )
            );

            setClientes(prev =>
              prev.filter(
                x =>
                  x.id !==
                  clienteExcluir.id
              )
            );

            if (
              clienteSelecionado ===
              clienteExcluir.nome
            ) {
              setClienteSelecionado(null);
            }

            setConfirmarExcluirCliente(false);
            setClienteExcluir(null);

          }}
          style={{
            flex: 1,
            background:
              "linear-gradient(135deg,#ef4444,#dc2626)",
            border: "none",
            padding: 14,
            borderRadius: 12,
            color: "#fff",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: 14,
            boxShadow:
              "0 10px 25px rgba(239,68,68,0.25)"
          }}
        >
          🗑 Excluir cliente
        </button>

        <button
          onClick={() => {
            setConfirmarExcluirCliente(false);
            setClienteExcluir(null);
          }}
          style={{
            flex: 1,
            background: "#1b1b1b",
            border: "1px solid #333",
            padding: 14,
            borderRadius: 12,
            color: "#fff",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: 14
          }}
        >
          Cancelar
        </button>

      </div>

    </div>

  </div>

)}

{confirmarVenda && (

  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.75)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      backdropFilter: "blur(5px)"
    }}
  >

    <div
      style={{
        width: 420,
        background: "#111",
        borderRadius: 20,
        padding: 25,
        border: "1px solid #333",
        boxShadow:
          "0 20px 60px rgba(0,0,0,0.6)",
        color: "#fff"
      }}
    >

      <h2
        style={{
          marginTop: 0,
          marginBottom: 15
        }}
      >
        ⚠️ Confirmar operação
      </h2>

      <p
        style={{
          color: "#bbb",
          lineHeight: 1.6
        }}
      >
        Esta operação irá baixar os produtos do estoque.
      </p>

      <div
        style={{
          marginTop: 15,
          padding: 12,
          background: "#181818",
          borderRadius: 10
        }}
      >
        <strong>
          Total:
        </strong>{" "}
        R$ {total.toFixed(2)}
      </div>

      <div
        style={{
          marginTop: 10,
          padding: 12,
          background: "#181818",
          borderRadius: 10
        }}
      >
        <strong>
          Tipo:
        </strong>{" "}
        {modoVenda === "normal"
          ? "💰 Venda Normal"
          : modoVenda === "pendente"
          ? "⏳ Venda Pendente"
          : "📝 Anotação"}
      </div>

      <div
        style={{
          display: "flex",
          gap: 10,
          marginTop: 25
        }}
      >

        <button
          onClick={() =>
            setConfirmarVenda(false)
          }
          style={{
            flex: 1
          }}
        >
          Cancelar
        </button>

        <button
          onClick={() => {
            setConfirmarVenda(false);
            finalizar();
          }}
          style={{
            flex: 1,
            background:
              "linear-gradient(135deg,#ff6a00,#ff9f43)"
          }}
        >
          Confirmar
        </button>

      </div>

    </div>

  </div>

)}

{confirmarDespesa && (

  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.75)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      backdropFilter: "blur(5px)"
    }}
  >

    <div
      style={{
        width: 420,
        background: "#111",
        borderRadius: 20,
        padding: 25,
        border: "1px solid #333",
        boxShadow:
          "0 20px 60px rgba(0,0,0,0.6)",
        color: "#fff"
      }}
    >

      <h2
        style={{
          marginTop: 0,
          marginBottom: 15,
          color: "#ef4444"
        }}
      >
        ⚠️ Confirmar despesa
      </h2>

      <p
        style={{
          color: "#bbb",
          lineHeight: 1.6
        }}
      >
        Esta despesa será registrada no sistema e
        descontada dos resultados financeiros.
      </p>

      <div
        style={{
          marginTop: 15,
          padding: 12,
          background: "#181818",
          borderRadius: 10
        }}
      >
        <strong>Descrição:</strong>
        <br />
        {nomeDespesa || "-"}
      </div>

      <div
        style={{
          marginTop: 10,
          padding: 12,
          background: "#181818",
          borderRadius: 10
        }}
      >
        <strong>Valor:</strong>
        <br />
        R$ {Number(valorDespesa || 0).toFixed(2)}
      </div>

      <div
        style={{
          marginTop: 10,
          padding: 12,
          background: "#2b1212",
          borderRadius: 10,
          border: "1px solid #662222",
          color: "#ffb4b4"
        }}
      >
        💸 Esta despesa irá impactar o caixa e os
        relatórios financeiros do sistema.
      </div>

      <div
        style={{
          display: "flex",
          gap: 10,
          marginTop: 25
        }}
      >

        <button
          onClick={() =>
            setConfirmarDespesa(false)
          }
          style={{
            flex: 1
          }}
        >
          Cancelar
        </button>

        <button
          onClick={() => {

            adicionarDespesa();

            setConfirmarDespesa(false);

          }}
          style={{
            flex: 1,
            background:
              "linear-gradient(135deg,#ef4444,#dc2626)",
            color: "#fff"
          }}
        >
          Confirmar despesa
        </button>

      </div>

    </div>

  </div>

)}
{modalHistorico && clienteHistorico && (

  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.75)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
      backdropFilter: "blur(4px)"
    }}
  >

    <div
      style={{
        width: 650,
        maxHeight: "80vh",
        background: "#111",
        borderRadius: 16,
        padding: 20,
        color: "#fff",
        border: "1px solid #333",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 20px 50px rgba(0,0,0,0.5)"
      }}
    >

      <h2
        style={{
          marginTop: 0,
          marginBottom: 15,
          color: "#fff"
        }}
      >
        📋 Histórico de {clienteHistorico.nome}
      </h2>

      <div
        style={{
          overflowY: "auto",
          maxHeight: "55vh",
          paddingRight: 10
        }}
      >

  {historicoClientes
  .filter(
    v =>
      v.cliente === clienteHistorico.nome
  )
          .sort(
            (a, b) =>
              (b.timestamp || 0) -
              (a.timestamp || 0)
          )
          .map(venda => (

            <div
              key={venda.id}
              style={{
                background: "#181818",
                border: "1px solid #333",
                borderRadius: 12,
                padding: 12,
                marginBottom: 12
              }}
            >

              <div
                style={{
                  marginBottom: 10,
                  color: "#facc15",
                  fontSize: 13,
                  fontWeight: "bold"
                }}
              >
                📅 {venda.data} • 🕒 {venda.hora}
              </div>

{venda.origem === "quitacao" && (
  <div
    style={{
      color: "#facc15",
      fontWeight: "bold",
      marginBottom: 8
    }}
  >
    👤 Cliente: {venda.cliente}

    <br />

    {venda.modo === "pendente_pago_total"
      ? "✅ Pagamento Total"
      : "💰 Pagamento Parcial"}
  </div>
)}

              {venda.itens?.map((item, index) => (

                <div
                  key={index}
                  style={{
                    padding: "8px 0",
                    borderBottom:
                      "1px solid #2a2a2a"
                  }}
                >

                  <div>
                    📦 {item.nome}
                  </div>

                  <div
                    style={{
                      color: "#aaa",
                      fontSize: 13
                    }}
                  >
                    Quantidade: {item.qtd || 1}
                  </div>

                  <div
                    style={{
                      color: "#22c55e",
                      fontSize: 13,
                      fontWeight: "bold"
                    }}
                  >
                    R$ {(
                      (item.precoVenda ||
                        item.preco ||
                        0) *
                      (item.qtd || 1)
                    ).toFixed(2)}
                  </div>

                </div>

              ))}

              <div
  style={{
    marginTop: 10,
    fontWeight: "bold",
    color: "#67e8f9",
    fontSize: 15
  }}
>

  {venda.origem === "quitacao" && (
    <div
      style={{
        color: "#facc15",
        marginBottom: 6
      }}
    >
      {venda.modo === "pendente_pago_total"
        ? "✅ Pagamento Total"
        : "💰 Pagamento Parcial"}
    </div>
  )}

  {venda.modo === "pendente_pago_total"
    ? "Pagamento total: R$ "
    : venda.origem === "quitacao"
    ? "Pagamento parcial: R$ "
    : "Total da venda: R$ "}

  {Number(venda.total || 0).toFixed(2)}

</div>

            </div>

          ))}

      </div>

      <div
        style={{
          marginTop: 20,
          borderTop: "1px solid #2a2a2a",
          paddingTop: 16
        }}
      >

        <div
          style={{
            background: "#171717",
            border: "1px solid #2d2d2d",
            borderLeft: "4px solid #facc15",
            borderRadius: 12,
            padding: 12,
            marginBottom: 16,
            fontSize: 12,
            color: "#a1a1aa",
            lineHeight: 1.6
          }}
        >
          <div
            style={{
              color: "#facc15",
              fontWeight: "bold",
              marginBottom: 4
            }}
          >
            💡 Dica de Administração
          </div>

          É recomendado limpar o histórico após a quitação total do cliente,
          mantendo os registros organizados e facilitando futuras consultas.
        </div>

        <div
          style={{
            display: "flex",
            gap: 12
          }}
        >

   <button
  onClick={() => {

    if (
      window.confirm(
        `Deseja apagar todo o histórico de ${clienteHistorico.nome}?`
      )
    ) {

      const novoHistorico =
        historicoClientes.filter(
          venda =>
            venda.cliente !==
            clienteHistorico.nome
        );

      setHistoricoClientes(
        novoHistorico
      );

      localStorage.setItem(
        "historicoClientes",
        JSON.stringify(
          novoHistorico
        )
      );

    }

  }}
  style={{
    flex: 1,
    background:
      "linear-gradient(135deg,#991b1b,#dc2626)",
    border: "1px solid #ef4444",
    padding: "14px",
    borderRadius: 12,
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    cursor: "pointer",
    boxShadow:
      "0 4px 15px rgba(220,38,38,0.25)"
  }}
>
  🗑️ Limpar Histórico
</button>
          <button
            onClick={() => {
              setModalHistorico(false);
              setClienteHistorico(null);
            }}
            style={{
              flex: 1,
              background:
                "linear-gradient(135deg,#1f2937,#111827)",
              border: "1px solid #374151",
              padding: "14px",
              borderRadius: 12,
              color: "#fff",
              fontWeight: "bold",
              fontSize: 14,
              cursor: "pointer"
            }}
          >
            Fechar
          </button>

        </div>

      </div>

    </div>

  </div>

)}

{confirmarCancelamento && vendaCancelar && (

  <div className="modal-overlay">

    <div className="modal-box">

      <h2>⚠️ Cancelar Venda</h2>

      <p>
        Deseja realmente cancelar esta venda?
      </p>

      <div
        style={{
          background: "#111",
          padding: 12,
          borderRadius: 10,
          marginTop: 10,
          marginBottom: 15
        }}
      >
        💰 Valor: R$ {Number(vendaCancelar.total).toFixed(2)}
      </div>

      <p
        style={{
          color: "#ff6b6b",
          fontSize: 13
        }}
      >
        Os produtos retornarão ao estoque e o
        faturamento será recalculado.
      </p>

      <div
        style={{
          display: "flex",
          gap: 10,
          marginTop: 20
        }}
      >
        <button
          onClick={() => {
            cancelarVenda(vendaCancelar.id);
            setConfirmarCancelamento(false);
            setVendaCancelar(null);
          }}
        >
          ✅ Confirmar
        </button>

        <button
          onClick={() => {
            setConfirmarCancelamento(false);
            setVendaCancelar(null);
          }}
        >
          ❌ Fechar
        </button>

      </div>

    </div>

  </div>

)}

{confirmarQuitacao && resumoQuitacao && (

  <div className="modal-overlay">

    <div className="modal-box">

      <h2>💰 Confirmar Quitação</h2>

      <div
        style={{
          background:"#111",
          padding:15,
          borderRadius:12,
          marginTop:15
        }}
      >

        <p>
          👤 Cliente:
          <strong> {clienteQuitar?.nome}</strong>
        </p>

        <p>
          📦 Dívida:
          <strong>
            R$ {resumoQuitacao.totalDivida.toFixed(2)}
          </strong>
        </p>

        <p>
          💵 Pagamento:
          <strong>
            R$ {resumoQuitacao.valorPago.toFixed(2)}
          </strong>
        </p>

        <p>
          📈 Lucro estimado:
          <strong style={{ color:"#00d26a" }}>
            R$ {resumoQuitacao.lucroEstimado.toFixed(2)}
          </strong>
        </p>

      </div>

      <div
        style={{
          display:"flex",
          gap:10,
          marginTop:20
        }}
      >

        <button
          onClick={() => {

            quitarCliente();

            setConfirmarQuitacao(false);
            setResumoQuitacao(null);

          }}
        >
          ✅ Confirmar
        </button>

        <button
          onClick={() => {

            setConfirmarQuitacao(false);
            setResumoQuitacao(null);

          }}
        >
          ❌ Cancelar
        </button>

        

      </div>

    </div>

  </div>

)}


{modalDesconto && (

  <div className="modal-overlay">

    <div className="modal-box">

      <h2>💸 Aplicar Desconto</h2>

      <input
        placeholder="Valor do desconto"
        value={valorDesconto}
        onChange={e =>
          setValorDesconto(e.target.value)
        }
      />

      {Number(valorDesconto || 0) > 0 && (

        <div
          style={{
            marginTop: 12,
            padding: 12,
            background: "#111",
            border: "1px solid #333",
            borderRadius: 10,
            color: "#fff"
          }}
        >

          <div>
            📊 Lucro da venda:
            <strong style={{ color: "#00d26a" }}>
              {" "}
              R$ {Number(lucroCarrinho).toFixed(2)}
            </strong>
          </div>

          <div style={{ marginTop: 8 }}>
            💸 Desconto:
            <strong style={{ color: "#ffb347" }}>
              {" "}
              R$ {Number(valorDesconto || 0).toFixed(2)}
            </strong>
          </div>

          <div style={{ marginTop: 8 }}>
            🔥 Lucro com desconto:
            <strong style={{ color: "#ff4d4d" }}>
              {" "}
              R$ {(
                Number(lucroCarrinho) -
                Number(valorDesconto || 0)
              ).toFixed(2)}
            </strong>
          </div>

        </div>

      )}

      <div
        style={{
          display: "flex",
          gap: 10,
          marginTop: 20
        }}
      >

        <button
          onClick={() => {

            const valor = Number(
              valorDesconto.replace(",", ".")
            );

            if (isNaN(valor) || valor < 0)
              return;

            setDesconto(valor);

            setModalDesconto(false);
            setValorDesconto("");

          }}
        >
          ✅ Aplicar
        </button>
     
        <button
          onClick={() => {
            setModalDesconto(false);
            setValorDesconto("");
          }}
        >
          ❌ Fechar
        </button>

      </div>

    </div>

  </div>

)}

{modalQuitarTotal && clienteQuitarTotal && (

<div
  style={{
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999
  }}
>

<div
  style={{
    width: 700,
    maxHeight: "80vh",
    overflowY: "auto",
    background: "#111",
    padding: 20,
    borderRadius: 16,
    color: "#fff",
    border: "1px solid #333"
  }}
>

{(() => {

console.log("CLIENTE", clienteQuitarTotal?.nome);

console.log(
  "TEM QUITAÇÃO PARCIAL",
  vendas.some(
    v =>
      v.cliente === clienteQuitarTotal?.nome &&
      v.modo === "pendente_pago" &&
      v.origem === "quitacao"
  )
);

console.log(
  "TEM PENDÊNCIAS",
  pendentes.some(
    p =>
      p.cliente === clienteQuitarTotal?.nome
  )
);

const possuiQuitacaoParcial =
  clienteQuitarTotal?.possuiQuitacaoParcial === true &&
  pendentes.some(
    p =>
      p.cliente === clienteQuitarTotal.nome
  );

  const vendasClienteQuitacao = pendentes.filter(
  p => p.cliente === clienteQuitarTotal.nome
);

const totalDividaQuitacao =
  vendasClienteQuitacao.reduce(
    (soma, venda) =>
      soma + Number(venda.total || 0),
    0
  );

const lucroTotalQuitacao =
  vendasClienteQuitacao.reduce(
    (soma, venda) =>
      soma +
      (venda.itens || []).reduce(
        (lucro, item) =>
          lucro +
          (
            Number(item.precoVenda || 0) -
            Number(item.preco || 0)
          ) *
          Number(item.qtd || 1),
        0
      ),
    0
  );

return (
<>

<h2>
  💰 Quitação Total
</h2>

<h3>
  👤 {clienteQuitarTotal.nome}
</h3>

<hr />

{possuiQuitacaoParcial && (

<div
  style={{
    background: "#3b2f00",
    border: "1px solid #facc15",
    color: "#fde68a",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    lineHeight: 1.6
  }}
>
  ⚠️ <strong>Quitação Total Indisponível</strong>

  <div style={{ marginTop: 8 }}>
    Este cliente já realizou um pagamento parcial desde a
    primeira pendência.
  </div>

  <div style={{ marginTop: 8 }}>
    Para manter a consistência dos relatórios financeiros,
    o modo de quitação total foi bloqueado para este cliente.
  </div>

  <div style={{ marginTop: 8 }}>
    Utilize apenas as quitações parciais até que toda a
    dívida seja liquidada.
  </div>

</div>

)}

{pendentes
  .filter(
    p =>
      p.cliente ===
      clienteQuitarTotal.nome
  )
  .map(venda => (

<div
  key={venda.id}
  style={{
    background: "#181818",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10
  }}
>
  
<div>
  📅 {venda.data}
</div>

<div>
  🕒 {venda.hora}
</div>

<div>
  💰 R$ {Number(venda.total || 0).toFixed(2)}
</div>

{venda.itens?.map((item, i) => (
<div key={i}>
  📦 {item.nome} x{item.qtd}
</div>
))}

</div>

))}

<hr />

<h3>
  💵 Dívida Total:
  R$ {totalDividaQuitacao.toFixed(2)}
</h3>

<h3
  style={{
    color: "#22c55e"
  }}
>
  📈 Lucro Total:
  R$ {lucroTotalQuitacao.toFixed(2)}
</h3>

<div
  style={{
    display: "flex",
    gap: 10,
    marginTop: 20
  }}
>

<button

  disabled={possuiQuitacaoParcial}

  onClick={() => {

    if (possuiQuitacaoParcial) return;

    quitarClienteTotal(
      clienteQuitarTotal.nome
    );

    setModalQuitarTotal(false);
    setClienteQuitarTotal(null);
  }}

  style={{
    flex: 1,
    background: possuiQuitacaoParcial
      ? "#facc15"
      : "#22c55e",
    color: possuiQuitacaoParcial
      ? "#000"
      : "#fff",
    opacity: possuiQuitacaoParcial
      ? 0.8
      : 1,
    cursor: possuiQuitacaoParcial
      ? "not-allowed"
      : "pointer",
    fontWeight: "bold"
  }}
>
  {possuiQuitacaoParcial
    ? "⚠️ Quitação Total Bloqueada"
    : "✅ Confirmar Quitação"}
</button>

<button
  onClick={() => {
    setModalQuitarTotal(false);
    setClienteQuitarTotal(null);
  }}
  style={{
    flex: 1
  }}
>
  Cancelar
</button>

</div>

</>
);

})()}

</div>
</div>

)}

{modalReajuste && clienteReajuste && (

<div className="modal-overlay">

  <div className="modal-box">

    <h2>🔧 Reajuste Administrativo</h2>

    <div
      style={{
        background:"#111",
        padding:15,
        borderRadius:12,
        marginTop:10
      }}
    >
      <p>
        👤 Cliente:
        <strong> {clienteReajuste.nome}</strong>
      </p>

      <p>
        Valor atual:
        <strong>
          R$ {
            pendentes
              .filter(
                p => p.cliente === clienteReajuste.nome
              )
              .reduce(
                (s,v) => s + (v.total || 0),
                0
              )
              .toFixed(2)
          }
        </strong>
      </p>
    </div>

    <input
      placeholder="Novo valor"
      value={novoValorCliente}
      onChange={e =>
        setNovoValorCliente(e.target.value)
      }
      style={{
        width:"100%",
        marginTop:15
      }}
    />

    <div
      style={{
        background:"#3b2f00",
        border:"1px solid #facc15",
        color:"#fde68a",
        padding:12,
        borderRadius:10,
        marginTop:15,
        fontSize:13,
        lineHeight:1.6
      }}
    >
      ⚠️ Esta opção é destinada apenas para
      reajustes administrativos.

      <br /><br />

      Ela NÃO impactará:
      <br />
      • Caixa
      <br />
      • Lucro
      <br />
      • Faturamento
      <br />
      • Estatísticas
      <br />
      • Histórico financeiro

      <br /><br />

      Deseja continuar?
    </div>

    <div
      style={{
        display:"flex",
        gap:10,
        marginTop:20
      }}
    >
<button
  onClick={() => {

    const novoValor =
      Number(
        novoValorCliente.replace(",", ".")
      ) || 0;

    if (!vendasCliente.length) {

      setPendentes(prev => [
        ...prev,
        {
          id: Date.now(),
          cliente: clienteReajuste.nome,
          total: novoValor,
          data: new Date().toLocaleDateString(),
          hora: new Date().toLocaleTimeString(),
          itens: [],
          origem: "reajuste"
        }
      ]);

      setClientes(prev =>
        prev.map(c =>
          c.nome === clienteReajuste.nome
            ? {
                ...c,
                possuiQuitacaoParcial: true
              }
            : c
        )
      );

      setModalReajuste(false);
      setClienteReajuste(null);
      setNovoValorCliente("");

      return;
    }

    const totalAtual = vendasCliente.reduce(
      (s, v) => s + Number(v.total || 0),
      0
    );

    setPendentes(prev =>
      prev.map(p => {

        if (p.cliente !== clienteReajuste.nome)
          return p;

        const proporcao =
          totalAtual > 0
            ? Number(p.total || 0) / totalAtual
            : 0;

        return {
          ...p,
          total: Number(
            (novoValor * proporcao).toFixed(2)
          )
        };

      })
    );

    setClientes(prev =>
      prev.map(c =>
        c.nome === clienteReajuste.nome
          ? {
              ...c,
              possuiQuitacaoParcial: true
            }
          : c
      )
    );

    setModalReajuste(false);
    setClienteReajuste(null);
    setNovoValorCliente("");

  }}
>
  Confirmar Reajuste
</button>

      <button
        onClick={() => {
          setModalReajuste(false);
          setClienteReajuste(null);
        }}
      >
        Cancelar
      </button>

    </div>

  </div>

</div>

)}

{openConsumo && (
  <div
    onClick={() => setOpenConsumo(false)}
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        background: "#111",
        padding: 20,
        borderRadius: 12,
        width: 500,
        color: "#fff",
        maxHeight: "90vh",
        overflowY: "auto"
      }}
    >
      <h3>🧃 Consumo Interno</h3>

      {/* ALERTA */}
      <div
        style={{
          background: "#2a1a00",
          padding: 10,
          borderRadius: 8,
          fontSize: 12,
          marginBottom: 15,
          color: "#ffcf70"
        }}
      >
        ⚠️ Consumo baseado no PREÇO DE CUSTO
      </div>

      {/* ABAS */}
      <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
        <button
          onClick={() => setOpenHistoricoConsumo(false)}
          style={{
            flex: 1,
            padding: 10,
            background: !openHistoricoConsumo ? "#ff6a00" : "#222",
            color: "#fff",
            border: "none",
            borderRadius: 8
          }}
        >
          🛒 Novo
        </button>

        <button
          onClick={() => setOpenHistoricoConsumo(true)}
          style={{
            flex: 1,
            padding: 10,
            background: openHistoricoConsumo ? "#ff6a00" : "#222",
            color: "#fff",
            border: "none",
            borderRadius: 8
          }}
        >
          📜 Histórico
        </button>
      </div>

      {/* CONTEÚDO */}
      {!openHistoricoConsumo ? (
        <>
          {/* 🔍 BUSCA (MESMA LÓGICA DO ANTIGO) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#1a1a1a",
              borderRadius: 8,
              padding: "8px 10px",
              marginBottom: 10
            }}
          >
            <span>🔍</span>
            <input
              placeholder="Buscar produto"
              value={buscaConsumo}
              onChange={(e) => setBuscaConsumo(e.target.value)}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#fff",
                marginLeft: 8
              }}
            />
          </div>

          {/* ⚠️ AQUI É O PONTO CRÍTICO (mantido igual ao antigo) */}
          {buscaConsumo && produtosConsumoFiltrados?.length > 0 && (
            <div
              style={{
                background: "#1a1a1a",
                borderRadius: 8,
                padding: 10,
                marginBottom: 15,
                maxHeight: 200,
                overflowY: "auto"
              }}
            >
              {produtosConsumoFiltrados.map((p) => (
                <div
                  key={p.id}
                  onClick={() => addConsumo(p)}
                  style={{
                    padding: 8,
                    cursor: "pointer",
                    borderBottom: "1px solid #222"
                  }}
                >
                  {p.nome} - R$ {Number(p.preco || 0).toFixed(2)}
                </div>
              ))}
            </div>
          )}

          {/* CARRINHO */}
          <h4>📦 Carrinho</h4>

          {carrinhoConsumo.length === 0 && (
            <div style={{ color: "#777" }}>
              Nenhum item adicionado
            </div>
          )}

          {carrinhoConsumo.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                background: "#1a1a1a",
                padding: 10,
                borderRadius: 8,
                marginBottom: 6
              }}
            >
              <div>
                {item.nome}
                <br />
                <small>
                  R$ {Number(item.preco || 0).toFixed(2)}
                </small>
              </div>

              <div>
                x{item.qtd}
                <button onClick={() => removerConsumo(item.id)}>
                  ➖
                </button>
              </div>
            </div>
          ))}

          <h3 style={{ color: "#22c55e" }}>
            R$ {totalConsumo.toFixed(2)}
          </h3>

          {/* BOTÕES */}
          <div style={{ display: "flex", gap: 10 }}>

<button
  onClick={async () => {
    console.log("CLICK OK");

    try {
      if (!carrinhoConsumo || carrinhoConsumo.length === 0) {
        console.log("Carrinho vazio");
        return;
      }

      console.log("CARRINHO:", carrinhoConsumo);

      // 🔥 ENVIO PARA BACKEND (PRODUÇÃO)
      const res = await fetch("https://caixa-ape-da-milla.onrender.com/consumo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          itens: carrinhoConsumo,
          descricao: "Consumo interno"
        })
      });

      console.log("STATUS:", res.status);

      const data = await res.json();
      console.log("RESPOSTA:", data);

      if (!res.ok) {
        console.log("ERRO NO BACKEND");
        return;
      }

      // 🔥 ATUALIZA DIRETO O ESTADO (SEM FETCH EXTRA)
      if (data?.consumo) {
        setConsumos((prev) => [data.consumo, ...prev]);
      }

setProdutos(prev =>
  prev.map(produto => {

    const item = carrinhoConsumo.find(
      i => i.id === produto.id
    );

    if (!item) return produto;

    // estoque ilimitado não altera
    if (produto.estoqueIlimitado) {
      return produto;
    }

    return {
      ...produto,
      estoque: Math.max(
        0,
        Number(produto.estoque || 0) - Number(item.qtd || 1)
      )
    };

  })
);

      setCarrinhoConsumo([]);
      setBuscaConsumo("");
      setOpenConsumo(false);

    } catch (err) {
      console.error("ERRO GERAL:", err);
    }
  }}
  style={{
    flex: 1,
    background: "#16a34a",
    color: "#fff",
    border: "none",
    padding: 12,
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: "bold"
  }}
>
  ✅ Confirmar Consumo
</button>

            <button
              onClick={() => {
                setCarrinhoConsumo([]);
                setBuscaConsumo("");
                setOpenConsumo(false);
              }}
            >
              ❌ Fechar
            </button>
          </div>
        </>
      ) : (
        <>
          <h3>📜 Histórico</h3>

          {consumos?.map((c) => (
            <div key={c.id}>
              {c.itens?.map((i, idx) => (
                <div key={idx}>
                  {i.nome} x{i.qtd}
                </div>
              ))}
            </div>
          ))}
        </>
      )}
    </div>
  </div>
)}
  </div>
  </div>
);
}
  