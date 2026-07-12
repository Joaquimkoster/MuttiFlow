import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import api from "../services/api";

function escaparCsv(valor) {
  return `"${String(valor ?? "").replaceAll('"', '""')}"`;
}

export default function Planilha() {
  const [pedidos, setPedidos] = useState([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  async function carregarPedidos() {
    setCarregando(true);
    try {
      setErro("");
      const { data } = await api.get("/pedidos");
      setPedidos(data);
    } catch {
      setErro("Não foi possível carregar o relatório de pedidos.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(carregarPedidos, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  function exportarCsv() {
    const cabecalho = ["Pedido", "Cliente", "WhatsApp", "E-mail", "Produtos", "Total", "Pagamento", "Situação pagamento", "Entrega", "Horário", "Endereço", "Bairro", "Cidade", "Status"];
    const linhas = pedidos.map((pedido) => [pedido.id, pedido.cliente_nome, pedido.whatsapp, pedido.email, pedido.produtos, pedido.total, pedido.forma_pagamento, pedido.pagamento_status, pedido.data_entrega.slice(0, 10), pedido.horario, pedido.endereco, pedido.bairro, pedido.cidade, pedido.status]);
    const csv = [cabecalho, ...linhas].map((linha) => linha.map(escaparCsv).join(";")).join("\n");
    const arquivo = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(arquivo);
    const link = document.createElement("a");
    link.href = url;
    link.download = `pedidos-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AppLayout title="Relatórios" action={<button type="button" className="button" onClick={exportarCsv} disabled={!pedidos.length}>Exportar CSV</button>}>
      {erro && <p className="message message-error" role="alert">{erro}</p>}
      <div className="report-summary">
        <article><span>Pedidos no relatório</span><strong>{pedidos.length}</strong></article>
        <article><span>Faturamento total</span><strong>{pedidos.reduce((total, pedido) => total + Number(pedido.total), 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong></article>
        <article><span>Pagamentos pendentes</span><strong>{pedidos.filter((pedido) => pedido.pagamento_status !== "Pago").length}</strong></article>
      </div>
      <section className="card table-card">
        <h2>Pedidos registrados</h2>
        <table className="data-table">
          <thead><tr><th>#</th><th>Cliente</th><th>Produtos</th><th>Total</th><th>Pagamento</th><th>Entrega</th><th>Local</th><th>Status</th></tr></thead>
          <tbody>
            {pedidos.map((pedido) => <tr key={pedido.id}><td>{pedido.id}</td><td>{pedido.cliente_nome}</td><td>{pedido.produtos}</td><td>{Number(pedido.total).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td><td>{pedido.pagamento_status || "Pendente"}</td><td>{new Date(`${pedido.data_entrega.slice(0, 10)}T12:00:00`).toLocaleDateString("pt-BR")}</td><td>{[pedido.bairro, pedido.cidade].filter(Boolean).join(" - ") || "Não informado"}</td><td>{pedido.status}</td></tr>)}
            {carregando && <tr><td colSpan="8">Carregando relatório...</td></tr>}
            {!carregando && pedidos.length === 0 && <tr><td colSpan="8">Nenhum pedido registrado.</td></tr>}
          </tbody>
        </table>
      </section>
    </AppLayout>
  );
}
