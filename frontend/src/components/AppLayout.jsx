import { useLocation, useNavigate } from "react-router-dom";

const menuItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Pedidos", path: "/pedidos" },
  { label: "Eventos", path: "/eventos" },
  { label: "Estoque", path: "/estoque" },
  { label: "Planilha", path: "/planilha" },
];

export default function AppLayout({ title, action, children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("muttiflow_token");
    localStorage.removeItem("muttiflow_usuario");
    navigate("/");
  };

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <h2 className="app-logo">MuttiFlow</h2>

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
              {item.label}
            </button>
          ))}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="nav-button nav-button-danger"
        >
          Sair
        </button>
      </aside>

      <main className="app-main">
        <header className="page-header">
          <h1>{title}</h1>
          {action}
        </header>

        {children}
      </main>
    </div>
  );
}
