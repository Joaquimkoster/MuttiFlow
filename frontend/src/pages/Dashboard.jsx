import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f1f5f9",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "250px",
          backgroundColor: "#0f172a",
          color: "white",
          padding: "25px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2
          style={{
            color: "#60a5fa",
            marginBottom: "40px",
          }}
        >
          MuttiFlow
        </h2>

        <button style={menuStyle}>📊 Dashboard</button>
        <button style={menuStyle}>📦 Pedidos</button>
        <button style={menuStyle}>👥 Clientes</button>
        <button style={menuStyle}>📦 Estoque</button>
        <button style={menuStyle}>🚚 Entregas</button>

        <div style={{ flex: 1 }} />

        <button
          onClick={handleLogout}
          style={{
            ...menuStyle,
            backgroundColor: "#dc2626",
          }}
        >
          Sair
        </button>
      </div>

      {/* Conteúdo Principal */}
      <div
        style={{
          flex: 1,
          padding: "30px",
        }}
      >
        <h1
          style={{
            color: "#0f172a",
            marginBottom: "30px",
          }}
        >
          Dashboard
        </h1>

        {/* Cards */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
            marginBottom: "30px",
          }}
        >
          <div style={cardStyle}>
            <h3>Pedidos Hoje</h3>
            <h1>15</h1>
          </div>

          <div style={cardStyle}>
            <h3>Clientes</h3>
            <h1>42</h1>
          </div>

          <div style={cardStyle}>
            <h3>Estoque Baixo</h3>
            <h1>3</h1>
          </div>

          <div style={cardStyle}>
            <h3>Entregas Hoje</h3>
            <h1>7</h1>
          </div>
        </div>

        {/* Tabela de pedidos */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          }}
        >
          <h2>Últimos Pedidos</h2>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "20px",
            }}
          >
            <thead>
              <tr>
                <th style={tableHeader}>Cliente</th>
                <th style={tableHeader}>Produto</th>
                <th style={tableHeader}>Entrega</th>
                <th style={tableHeader}>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td style={tableCell}>Maria</td>
                <td style={tableCell}>Bolo de Chocolate</td>
                <td style={tableCell}>20/06/2026</td>
                <td style={tableCell}>Preparando</td>
              </tr>

              <tr>
                <td style={tableCell}>João</td>
                <td style={tableCell}>Torta de Limão</td>
                <td style={tableCell}>21/06/2026</td>
                <td style={tableCell}>Entregue</td>
              </tr>

              <tr>
                <td style={tableCell}>Ana</td>
                <td style={tableCell}>Cupcakes</td>
                <td style={tableCell}>22/06/2026</td>
                <td style={tableCell}>Agendado</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const menuStyle = {
  backgroundColor: "#1e293b",
  color: "white",
  border: "none",
  padding: "12px",
  marginBottom: "10px",
  borderRadius: "8px",
  cursor: "pointer",
  textAlign: "left",
};

const cardStyle = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "12px",
  minWidth: "220px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
};

const tableHeader = {
  textAlign: "left",
  padding: "12px",
  borderBottom: "1px solid #e5e7eb",
};

const tableCell = {
  padding: "12px",
  borderBottom: "1px solid #e5e7eb",
};