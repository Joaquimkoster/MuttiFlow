import { useLocation, useNavigate } from "react-router-dom";

const menuItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Pedidos", path: "/pedidos" },
  { label: "Eventos", path: "/eventos" },
  { label: "Estoque", path: "/estoque" },
  { label: "Relatórios", path: "/planilha" },
];

const pageDescriptions = {
  Dashboard: "Visão geral da operação",
  Pedidos: "Acompanhe produção e entregas",
  Eventos: "Solicitações e agenda de eventos",
  Estoque: "Controle de insumos e embalagens",
  Relatórios: "Dados consolidados e exportação",
};

export default function AppLayout({ title, action, children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const usuario = (() => {
    try {
      return JSON.parse(localStorage.getItem("muttiflow_usuario")) || {};
    } catch {
      return {};
    }
  })();
  const nomeUsuario = usuario.nome || "Administrador";
  const iniciais = nomeUsuario.split(" ").slice(0, 2).map((parte) => parte[0]).join("").toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("muttiflow_token");
    localStorage.removeItem("muttiflow_usuario");
    navigate("/");
  };

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="app-brand">
          <span className="brand-mark">M</span>
          <div><h2 className="app-logo">MuttiFlow</h2><span>Painel de gestão</span></div>
        </div>

        <nav className="app-nav">
          {menuItems.map((item) => (
            <button
              key={item.path}
              type="button"
              onClick={() => navigate(item.path)}
              className={`nav-button ${
                location.pathname === item.path ? "is-active" : ""
              }`}
            >
              <span className="nav-indicator" aria-hidden="true" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-account">
          <span className="account-avatar">{iniciais}</span>
          <span className="account-copy"><strong>{nomeUsuario}</strong><small>{usuario.email || "Equipe MuttiFlow"}</small></span>
          <button type="button" onClick={handleLogout} className="logout-button" title="Sair" aria-label="Sair">&#8594;</button>
        </div>
      </aside>

      <main className="app-main">
        <header className="page-header">
          <div><span className="page-eyebrow">MuttiFlow / {title}</span><h1>{title}</h1><p>{pageDescriptions[title]}</p></div>
          {action}
        </header>

        {children}
      </main>
    </div>
  );
}
