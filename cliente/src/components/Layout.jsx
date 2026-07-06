import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import {
  FiFacebook,
  FiInstagram,
  FiMapPin,
  FiMenu,
  FiPhone,
  FiShoppingBag,
  FiX,
} from 'react-icons/fi'

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Cardápio', path: '/cardapio' },
  { label: 'Eventos', path: '/eventos' },
  { label: 'História', path: '/historia' },
  { label: 'Contato', path: '/contato' },
]

export function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="client-app">
      <header className="site-header">
        <div className="container nav-shell">
          <Link className="brand" to="/" onClick={() => setIsOpen(false)}>
            <span className="brand-mark">M</span>
            <span>
              <strong>MuttiFlow</strong>
              <small>Cliente</small>
            </span>
          </Link>

          <nav className="desktop-nav" aria-label="Menu principal">
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="nav-actions">
            <Link className="icon-button cart-shortcut" to="/carrinho" aria-label="Abrir carrinho">
              <FiShoppingBag />
              <span>3</span>
            </Link>
            <button
              className="icon-button mobile-toggle"
              type="button"
              aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
              onClick={() => setIsOpen((value) => !value)}
            >
              {isOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {isOpen && (
          <nav className="mobile-menu" aria-label="Menu mobile">
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} onClick={() => setIsOpen(false)}>
                {item.label}
              </NavLink>
            ))}
            <Link className="button primary full" to="/cardapio" onClick={() => setIsOpen(false)}>
              Ver Cardápio
            </Link>
          </nav>
        )}
      </header>

      <main>{children}</main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <Link className="brand footer-brand" to="/">
              <span className="brand-mark">M</span>
              <span>
                <strong>MuttiFlow</strong>
              </span>
            </Link>
            <p>Uma experiência de pedidos elegante, rápida e conectada ao painel administrativo.</p>
          </div>
          <div>
            <h3>Navegação</h3>
            <a href="/cardapio">Cardápio</a>
            <a href="/checkout">Checkout</a>
            <a href="/historia">História</a>
          </div>
          <div>
            <h3>Contato</h3>
            <a href="https://wa.me/5500000000000"><FiPhone /> WhatsApp</a>
            <a href="https://instagram.com"><FiInstagram /> Instagram</a>
            <a href="https://facebook.com"><FiFacebook /> Facebook</a>
          </div>
          <div>
            <h3>Endereço</h3>
            <p><FiMapPin /> Rua das Oliveiras, 128 - Centro</p>
            <p>Terça a domingo, 10h às 22h</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
