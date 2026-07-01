import { useState } from "react";
import AppLayout from "../components/AppLayout";

const eventos = [
  {
    id: 1,
    nome: "Casamento Silva",
    cliente: "Maria Silva",
    tipo: "Casamento",
    data: "20/07/2026",
    horario: "18:00",
    endereco: "Rua das Flores, 120",
    convidados: 150,
    valor: "R$ 4.500,00",
    status: "Confirmado",
  },
  {
    id: 2,
    nome: "Aniversário João",
    cliente: "João Santos",
    tipo: "Aniversário",
    data: "25/07/2026",
    horario: "14:00",
    endereco: "Av. Central, 500",
    convidados: 60,
    valor: "R$ 1.200,00",
    status: "Preparando",
  },
  {
    id: 3,
    nome: "Evento Corporativo",
    cliente: "Empresa XPTO",
    tipo: "Corporativo",
    data: "30/07/2026",
    horario: "09:00",
    endereco: "Centro de Convenções",
    convidados: 300,
    valor: "R$ 8.000,00",
    status: "Agendado",
  },
];

export default function Eventos() {
  const [pesquisa, setPesquisa] = useState("");

  const eventosFiltrados = eventos.filter((evento) =>
    evento.cliente.toLowerCase().includes(pesquisa.toLowerCase()),
  );

  return (
    <AppLayout
      title="Eventos"
      action={
        <button type="button" className="button">
          + Novo Evento
        </button>
      }
    >
      <div className="filters">
        <input
          className="input"
          type="text"
          placeholder="Pesquisar cliente..."
          value={pesquisa}
          onChange={(event) => setPesquisa(event.target.value)}
        />

        <select className="select">
          <option>Todos</option>
          <option>Agendado</option>
          <option>Preparando</option>
          <option>Confirmado</option>
          <option>Finalizado</option>
        </select>
      </div>

      <section className="card table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Evento</th>
              <th>Cliente</th>
              <th>Tipo</th>
              <th>Data</th>
              <th>Hora</th>
              <th>Endereço</th>
              <th>Convidados</th>
              <th>Valor</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {eventosFiltrados.map((evento) => (
              <tr key={evento.id}>
                <td>{evento.nome}</td>
                <td>{evento.cliente}</td>
                <td>{evento.tipo}</td>
                <td>{evento.data}</td>
                <td>{evento.horario}</td>
                <td>{evento.endereco}</td>
                <td>{evento.convidados}</td>
                <td>{evento.valor}</td>
                <td>{evento.status}</td>
                <td>
                  <div className="row-actions">
                    <button type="button" className="button button-small">
                      Editar
                    </button>
                    <button
                      type="button"
                      className="button button-small button-danger"
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </AppLayout>
  );
}
