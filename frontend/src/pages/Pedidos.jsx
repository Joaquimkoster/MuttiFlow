import { useNavigate } from "react-router-dom";

export default function Pedidos() {
  const navigate = useNavigate();

  return (
    <div style={containerStyle}>
      <div style={sidebarStyle}>
        <h2 style={logoStyle}>MuttiFlow</h2>

        <button onClick={() => navigate("/dashboard")} style={menuStyle}>
          📊 Dashboard
        </button>

        <button style={menuStyle}>
          📦 Pedidos
        </button>

        <button onClick={() => navigate("/clientes")} style={menuStyle}>
          👥 Clientes
        </button>

        <button onClick={() => navigate("/estoque")} style={menuStyle}>
          📦 Estoque
        </button>

        <button onClick={() => navigate("/entregas")} style={menuStyle}>
          🚚 Entregas
        </button>

        <div style={{ flex: 1 }} />

        <button
          onClick={() => navigate("/")}
          style={{ ...menuStyle, backgroundColor: "#dc2626" }}
        >
          🚪 Sair
        </button>
      </div>

      <div style={contentStyle}>
        <h1>📦 Pedidos</h1>

        <div style={cardStyle}>
          <h3>Pedidos Ativos</h3>
          <p>15 pedidos em andamento.</p>
        </div>
      </div>
    </div>
  );
}

const containerStyle = {
  display: "flex",
  minHeight: "100vh",
  backgroundColor: "#f1f5f9",
};

const sidebarStyle = {
  width: "250px",
  backgroundColor: "#0f172a",
  color: "white",
  padding: "25px",
  display: "flex",
  flexDirection: "column",
};

const logoStyle = {
  color: "#60a5fa",
  marginBottom: "40px",
};

const menuStyle = {
  backgroundColor: "#1e293b",
  color: "white",
  border: "none",
  padding: "12px",
  marginBottom: "10px",
  borderRadius: "8px",
  cursor: "pointer",
  textAlign: "left",
  width: "100%",
};

const contentStyle = {
  flex: 1,
  padding: "30px",
};

const cardStyle = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "12px",
};