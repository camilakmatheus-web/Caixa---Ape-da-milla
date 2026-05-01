import { useState, useEffect } from "react";

export default function App() {
  const [status, setStatus] = useState("Carregando...");
  const [dados, setDados] = useState(null);

  const API = "https://caixa-ape-da-milla.onrender.com";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API}/dados`);
        const data = await res.json();

        setDados(data);
        setStatus("Conectado com backend 🚀");
      } catch (err) {
        console.log(err);
        setStatus("Erro ao conectar ❌");
      }
    };

    fetchData();
  }, []);

  if (!dados) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Apé da Milla</h1>
        <p>{status}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Apé da Milla</h1>

      <p>{status}</p>

      <h2>Produtos</h2>
      <pre>{JSON.stringify(dados.produtos, null, 2)}</pre>

      <h2>Vendas</h2>
      <pre>{JSON.stringify(dados.vendas, null, 2)}</pre>

      <h2>Pendentes</h2>
      <pre>{JSON.stringify(dados.pendentes, null, 2)}</pre>
    </div>
  );
}