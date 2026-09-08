import { useLocation, useNavigate } from "react-router-dom";
import logoDieMutti from "../assets/die-mutti-logo.png";

const menuItems = [
  { label: "Dashboard", path: "/dashboard", icon: "dashboard" },
  { label: "Pedidos", path: "/pedidos", icon: "orders" },
  { label: "Eventos", path: "/eventos", icon: "calendar" },
];

const icons = {
  dashboard: <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
  orders: <><path d="M6 3h12l2 4-2 4H6L4 7l2-4Z"/><path d="M6 11v10h12V11M9 15h6"/></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></>,
};

function Icon({ name }) {
  return <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[name]}</svg>;
}

const pageDescriptions = {
  Dashboard: "Visão geral da operação",
  Pedidos: "Acompanhe produção e entregas",
  Eventos: "Solicitações e agenda de eventos",
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
          <img className="brand-logo" src={logoDieMutti} alt="Die Mutti — Cozinha Artesanal" />
          <div><h2 className="app-logo">Die Mutti</h2><span>Gestão da cozinha</span></div>
        </div>

        <span className="nav-section-label">Menu principal</span>
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
              <Icon name={item.icon} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-account">
          <span className="account-avatar">{iniciais}</span>
          <span className="account-copy"><strong>{nomeUsuario}</strong><small>{usuario.email || "Equipe Die Mutti"}</small></span>
          <button type="button" onClick={handleLogout} className="logout-button" title="Sair" aria-label="Sair">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M10 17l5-5-5-5M15 12H3M15 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4"/></svg>
          </button>
        </div>
      </aside>

      <main className="app-main">
        <header className="page-header">
          <div><h1>{title}</h1><p>{pageDescriptions[title]}</p></div>
          {action}
        </header>

        {children}
      </main>
    </div>
  );
}
