import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import api from "../services/api";

const statuses = ["Aguardando", "Aceito", "Recusado", "Preparando", "Finalizado", "Cancelado"];

const statusClass = {
  Aguardando: "event-status-waiting",
  Aceito: "event-status-accepted",
  Recusado: "event-status-rejected",
  Preparando: "event-status-progress",
  Finalizado: "event-status-finished",
  Cancelado: "event-status-rejected",
};

export default function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [status, setStatus] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  async function carregarEventos() {
    setCarregando(true);
    try {
      setErro("");
      const { data } = await api.get("/eventos");
      setEventos(data);
    } catch {
      setErro("Não foi possível carregar os eventos.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(carregarEventos, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  const eventosFiltrados = eventos.filter((evento) => {
    const busca = pesquisa.toLowerCase();
    return (evento.cliente.toLowerCase().includes(busca)
      || evento.tipo.toLowerCase().includes(busca)
      || String(evento.telefone || "").includes(busca))
      && (!status || evento.status === status);
  });

  async function alterarStatus(evento, novoStatus) {
    const anterior = evento.status;
    setEventos((atuais) => atuais.map((item) => item.id === evento.id ? { ...item, status: novoStatus } : item));
    try {
      await api.patch(`/eventos/${evento.id}/status`, { status: novoStatus });
    } catch (error) {
      setEventos((atuais) => atuais.map((item) => item.id === evento.id ? { ...item, status: anterior } : item));
      setErro(error.response?.data?.erro || "Não foi possível alterar o status.");
    }
  }

  async function excluir(evento) {
    if (!window.confirm(`Excluir a solicitação de ${evento.cliente}?`)) return;
    try {
      await api.delete(`/eventos/${evento.id}`);
      setEventos((atuais) => atuais.filter((item) => item.id !== evento.id));
    } catch (error) {
      setErro(error.response?.data?.erro || "Não foi possível excluir o evento.");
    }
  }

  return (
    <AppLayout title="Eventos" action={<button type="button" className="button dashboard-refresh" onClick={carregarEventos} disabled={carregando}><span aria-hidden="true">↻</span>{carregando ? "Atualizando..." : "Atualizar dados"}</button>}>
      {erro && <p className="message message-error" role="alert">{erro}</p>}
      <div className="filters">
        <input className="input" type="search" placeholder="Pesquisar cliente ou tipo..." value={pesquisa} onChange={(event) => setPesquisa(event.target.value)} />
        <select className="select" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">Todos os status</option>
          {statuses.map((nome) => <option key={nome}>{nome}</option>)}
        </select>
      </div>

      <section className="card table-card">
        <table className="data-table">
          <thead><tr><th>Cliente</th><th>Tipo</th><th>Data</th><th>Hora</th><th>Endereço</th><th>Convidados</th><th>Valor estimado</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>
            {eventosFiltrados.map((evento) => (
              <tr key={evento.id}>
                <td><div className="table-primary">{evento.cliente}</div><div className="table-secondary">{evento.telefone || "Telefone não informado"}</div></td><td>{evento.tipo}</td>
                <td>{new Date(`${evento.data.slice(0, 10)}T12:00:00`).toLocaleDateString("pt-BR")}</td>
                <td>{evento.horario.slice(0, 5)}</td><td>{evento.endereco}</td><td>{evento.convidados}</td>
                <td>{evento.valor == null ? "A definir" : Number(evento.valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
                <td>
                  {evento.status === "Aguardando" ? (
                    <span className={`event-status ${statusClass[evento.status]}`}>{evento.status}</span>
                  ) : (
                    <select className="select status-select" value={evento.status} onChange={(event) => alterarStatus(evento, event.target.value)}>{statuses.map((nome) => <option key={nome}>{nome}</option>)}</select>
                  )}
                </td>
                <td>
                  <div className="event-actions">
                    {evento.status === "Aguardando" && (
                      <>
                        <button type="button" className="button button-small button-success" onClick={() => alterarStatus(evento, "Aceito")}>Aceitar</button>
                        <button type="button" className="button button-small button-reject" onClick={() => alterarStatus(evento, "Recusado")}>Recusar</button>
                      </>
                    )}
                    {evento.status !== "Aguardando" && <button type="button" className="button button-small button-danger" onClick={() => excluir(evento)}>Excluir</button>}
                  </div>
                </td>
              </tr>
            ))}
            {!carregando && eventosFiltrados.length === 0 && <tr><td colSpan="9">Nenhuma solicitação de evento encontrada.</td></tr>}
            {carregando && <tr><td colSpan="9">Carregando eventos...</td></tr>}
          </tbody>
        </table>
      </section>
    </AppLayout>
  );
}
