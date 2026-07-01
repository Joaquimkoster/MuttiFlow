import AppLayout from "../components/AppLayout";

const metricas = [
  { label: "Pedidos Hoje", valor: "15" },
  { label: "Clientes", valor: "42" },
  { label: "Estoque Baixo", valor: "3" },
  { label: "Planilhas Hoje", valor: "7" },
];

const ultimosPedidos = [
  {
    cliente: "Maria",
    produto: "Bolo de Chocolate",
    entrega: "20/06/2026",
    status: "Preparando",
  },
  {
    cliente: "João",
    produto: "Torta de Limão",
    entrega: "21/06/2026",
    status: "Entregue",
  },
  {
    cliente: "Ana",
    produto: "Cupcakes",
    entrega: "22/06/2026",
    status: "Agendado",
  },
];

export default function Dashboard() {
  return (
    <AppLayout title="Dashboard">
      <section className="stats-grid">
        {metricas.map((metrica) => (
          <article className="card stat-card" key={metrica.label}>
            <h3>{metrica.label}</h3>
            <strong>{metrica.valor}</strong>
          </article>
        ))}
      </section>

      <section className="card table-card">
        <h2>Últimos Pedidos</h2>

        <table className="data-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Produto</th>
              <th>Entrega</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {ultimosPedidos.map((pedido) => (
              <tr key={`${pedido.cliente}-${pedido.produto}`}>
                <td>{pedido.cliente}</td>
                <td>{pedido.produto}</td>
                <td>{pedido.entrega}</td>
                <td>{pedido.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </AppLayout>
  );
}
