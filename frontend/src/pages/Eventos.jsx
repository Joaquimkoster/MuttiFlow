import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Eventos() {
  const navigate = useNavigate();

  const [pesquisa, setPesquisa] = useState("");

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

  const eventosFiltrados = eventos.filter((evento) =>
    evento.cliente.toLowerCase().includes(pesquisa.toLowerCase()),
  );

  return (
    <div style={containerStyle}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <h2 style={logoStyle}>MuttiFlow</h2>

        <button onClick={() => navigate("/dashboard")} style={menuStyle}>
          Dashboard
        </button>

        <button onClick={() => navigate("/pedidos")} style={menuStyle}>
          Pedidos
        </button>

        <button style={menuStyle}>Eventos</button>

        <button onClick={() => navigate("/estoque")} style={menuStyle}>
          Estoque
        </button>

        <button onClick={() => navigate("/planilha")} style={menuStyle}>
          Planilha
        </button>

        <div style={{ flex: 1 }} />

        <button
          onClick={() => navigate("/")}
          style={{
            ...menuStyle,
            backgroundColor: "#dc2626",
          }}
        >
          Sair
        </button>
      </div>

      {/* Conteúdo */}
      <div style={contentStyle}>
        <div style={topBarStyle}>
          <h1>Eventos</h1>

          <button style={novoEventoStyle}>+ Novo Evento</button>
        </div>

        <div style={filtrosStyle}>
          <input
            type="text"
            placeholder="Pesquisar cliente..."
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            style={inputStyle}
          />

          <select style={selectStyle}>
            <option>Todos</option>
            <option>Agendado</option>
            <option>Preparando</option>
            <option>Confirmado</option>
            <option>Finalizado</option>
          </select>
        </div>

        <div style={cardStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={tableHeader}>Evento</th>
                <th style={tableHeader}>Cliente</th>
                <th style={tableHeader}>Tipo</th>
                <th style={tableHeader}>Data</th>
                <th style={tableHeader}>Hora</th>
                <th style={tableHeader}>Endereço</th>
                <th style={tableHeader}>Convidados</th>
                <th style={tableHeader}>Valor</th>
                <th style={tableHeader}>Status</th>
                <th style={tableHeader}>Ações</th>
              </tr>
            </thead>

            <tbody>
              {eventosFiltrados.map((evento) => (
                <tr key={evento.id}>
                  <td style={tableCell}>{evento.nome}</td>
                  <td style={tableCell}>{evento.cliente}</td>
                  <td style={tableCell}>{evento.tipo}</td>
                  <td style={tableCell}>{evento.data}</td>
                  <td style={tableCell}>{evento.horario}</td>
                  <td style={tableCell}>{evento.endereco}</td>
                  <td style={tableCell}>{evento.convidados}</td>
                  <td style={tableCell}>{evento.valor}</td>
                  <td style={tableCell}>{evento.status}</td>

                  <td style={tableCell}>
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                      }}
                    >
                      <button style={editarBtn}>Editar</button>

                      <button style={excluirBtn}>Excluir</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

const topBarStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
};

const novoEventoStyle = {
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  padding: "12px 20px",
  borderRadius: "8px",
  cursor: "pointer",
};

const filtrosStyle = {
  display: "flex",
  gap: "15px",
  marginBottom: "20px",
};

const inputStyle = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  width: "250px",
};

const selectStyle = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
};

const cardStyle = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
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

const editarBtn = {
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  marginRight: "8px",
  cursor: "pointer",
};

const excluirBtn = {
  backgroundColor: "#dc2626",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
};
