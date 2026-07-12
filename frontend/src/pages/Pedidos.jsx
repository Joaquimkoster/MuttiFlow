import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import api from "../services/api";

const statuses = ["Agendado", "Confirmado", "Preparando", "Pronto", "Saiu para entrega", "Entregue", "Cancelado"];

export default function Pedidos() {
  const [pesquisa, setPesquisa] = useState("");
  const [status, setStatus] = useState("");
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
      setErro("Não foi possível carregar os pedidos.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(carregarPedidos, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  const pedidosFiltrados = pedidos.filter((pedido) => {
    const termo = pesquisa.toLowerCase();
    const campos = [pedido.cliente_nome, pedido.produtos, pedido.whatsapp, pedido.email, pedido.endereco, pedido.bairro, pedido.cidade];
    return campos.some((campo) => String(campo || "").toLowerCase().includes(termo))
      && (!status || pedido.status === status);
  });

  async function alterarStatus(pedido, novoStatus) {
    const anterior = pedido.status;
    setPedidos((atuais) => atuais.map((item) => item.id === pedido.id ? { ...item, status: novoStatus } : item));
    try {
      await api.patch(`/pedidos/${pedido.id}/status`, { status: novoStatus });
    } catch (error) {
      setPedidos((atuais) => atuais.map((item) => item.id === pedido.id ? { ...item, status: anterior } : item));
      setErro(error.response?.data?.erro || "Não foi possível alterar o status.");
    }
  }

  async function excluir(pedido) {
    if (!window.confirm(`Excluir o pedido de ${pedido.cliente_nome}?`)) return;
    try {
      await api.delete(`/pedidos/${pedido.id}`);
      setPedidos((atuais) => atuais.filter((item) => item.id !== pedido.id));
    } catch (error) {
      setErro(error.response?.data?.erro || "Não foi possível excluir o pedido.");
    }
  }

  async function alterarPagamento(pedido, pagamentoStatus) {
    const anterior = pedido.pagamento_status;
    setPedidos((atuais) => atuais.map((item) => item.id === pedido.id ? { ...item, pagamento_status: pagamentoStatus } : item));
    try {
      await api.patch(`/pedidos/${pedido.id}/pagamento`, { pagamento_status: pagamentoStatus });
    } catch (error) {
      setPedidos((atuais) => atuais.map((item) => item.id === pedido.id ? { ...item, pagamento_status: anterior } : item));
      setErro(error.response?.data?.erro || "Não foi possível alterar o pagamento.");
    }
  }

  return (
    <AppLayout title="Pedidos" action={<button type="button" className="button" onClick={carregarPedidos}>Atualizar</button>}>
      {erro && <p className="message message-error" role="alert">{erro}</p>}
      <div className="filters">
        <input className="input" type="search" placeholder="Pesquisar cliente ou produto..." value={pesquisa} onChange={(event) => setPesquisa(event.target.value)} />
        <select className="select" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">Todos os status</option>
          {statuses.map((nome) => <option key={nome}>{nome}</option>)}
        </select>
      </div>

      <section className="card table-card">
        <table className="data-table">
          <thead><tr><th>Cliente</th><th>Produtos</th><th>Total</th><th>Pagamento</th><th>Entrega</th><th>Endereço da entrega</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>
            {pedidosFiltrados.map((pedido) => (
              <tr key={pedido.id}>
                <td><div className="table-primary">{pedido.cliente_nome}</div><div className="table-secondary">{pedido.whatsapp}</div>{pedido.email && <div className="table-secondary">{pedido.email}</div>}</td>
                <td>{pedido.produtos}</td>
                <td>{Number(pedido.total).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
                <td><div className="table-secondary">{pedido.forma_pagamento}</div><select className="select status-select" value={pedido.pagamento_status || "Pendente"} onChange={(event) => alterarPagamento(pedido, event.target.value)}><option>Pendente</option><option>Pago</option></select></td>
                <td><div className="table-primary">{new Date(`${pedido.data_entrega.slice(0, 10)}T12:00:00`).toLocaleDateString("pt-BR")}</div><div className="table-secondary">{pedido.horario}</div></td>
                <td><div className="delivery-address">{pedido.endereco}</div>{pedido.complemento && <div className="table-secondary">{pedido.complemento}</div>}<div className="table-secondary">{[pedido.bairro, pedido.cidade].filter(Boolean).join(" - ") || "Bairro e cidade não informados"}</div></td>
                <td><select className="select status-select" value={pedido.status} onChange={(event) => alterarStatus(pedido, event.target.value)}>{statuses.map((nome) => <option key={nome}>{nome}</option>)}</select></td>
                <td><button type="button" className="button button-small button-danger" onClick={() => excluir(pedido)}>Excluir</button></td>
              </tr>
            ))}
            {carregando && <tr><td colSpan="8">Carregando pedidos...</td></tr>}
            {!carregando && pedidosFiltrados.length === 0 && <tr><td colSpan="8">Nenhum pedido encontrado.</td></tr>}
          </tbody>
        </table>
      </section>
    </AppLayout>
  );
}
