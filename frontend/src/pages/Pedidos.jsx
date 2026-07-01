import { useState } from "react";
import AppLayout from "../components/AppLayout";

const pedidos = [
  {
    id: 1,
    cliente: "Maria",
    endereco: "Rua das Flores, 123",
    produto: "Bolo de Chocolate",
    preco: 120.0,
    entrega: "20/06/2026",
    status: "Preparando",
  },
  {
    id: 2,
    cliente: "João",
    endereco: "Av. Brasil, 450",
    produto: "Torta de Limão",
    preco: 75.5,
    entrega: "21/06/2026",
    status: "Entregue",
  },
  {
    id: 3,
    cliente: "Ana",
    endereco: "Rua São José, 78",
    produto: "Cupcakes",
    preco: 60.0,
    entrega: "22/06/2026",
    status: "Agendado",
  },
];

export default function Pedidos() {
  const [pesquisa, setPesquisa] = useState("");

  const pedidosFiltrados = pedidos.filter((pedido) =>
    pedido.cliente.toLowerCase().includes(pesquisa.toLowerCase()),
  );

  return (
    <AppLayout
      title="Pedidos"
      action={
        <button type="button" className="button">
          + Novo Pedido
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
          <option>Pronto</option>
          <option>Entregue</option>
        </select>
      </div>

      <section className="card table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Endereço</th>
              <th>Produto</th>
              <th>Preço</th>
              <th>Entrega</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pedidosFiltrados.map((pedido) => (
              <tr key={pedido.id}>
                <td>{pedido.cliente}</td>
                <td>{pedido.endereco}</td>
                <td>{pedido.produto}</td>
                <td>R$ {pedido.preco.toFixed(2)}</td>
                <td>{pedido.entrega}</td>
                <td>{pedido.status}</td>
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
