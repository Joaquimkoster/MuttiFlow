import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import {
  FiClock,
  FiInstagram,
  FiMenu,
  FiPhone,
  FiShoppingBag,
  FiX,
} from 'react-icons/fi'
import { useCart } from '../hooks/useCart'

const navItems = [
  { label: 'Cardápio', path: '/cardapio' },
  { label: 'Eventos', path: '/eventos' },
  { label: 'História', path: '/historia' },
  { label: 'Contato', path: '/contato' },
]

export function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const { itemCount } = useCart()

  return (
    <div className="client-app">
      <header className="site-header">
        <div className="container nav-shell">
          <Link className="brand" to="/" onClick={() => setIsOpen(false)}>
            <span className="brand-mark">M</span>
            <span>
              <strong>MuttiFlow</strong>
              <small>Cozinha artesanal</small>
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
              {itemCount > 0 && <span>{itemCount}</span>}
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
            <Link className="mobile-cart-link" to="/carrinho" onClick={() => setIsOpen(false)}>
              <FiShoppingBag /> Carrinho {itemCount > 0 && `(${itemCount})`}
            </Link>
          </nav>
        )}
      </header>

      <main>{children}</main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-intro">
            <Link className="brand footer-brand" to="/">
              <span className="brand-mark">M</span>
              <span><strong>MuttiFlow</strong><small>Cozinha artesanal</small></span>
            </Link>
            <p>Receitas feitas com tempo, ingredientes selecionados e cuidado em cada entrega.</p>
          </div>
          <div>
            <h3>Explore</h3>
            <Link to="/cardapio">Cardápio</Link>
            <Link to="/eventos">Eventos</Link>
            <Link to="/historia">Nossa história</Link>
          </div>
          <div>
            <h3>Atendimento</h3>
            <a href="https://wa.me/5500000000000"><FiPhone /> (00) 00000-0000</a>
            <a href="https://instagram.com"><FiInstagram /> @muttiflow</a>
            <span><FiClock /> Terça a domingo, 10h–22h</span>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} MuttiFlow</span>
          <span>Feito para reunir pessoas à mesa.</span>
        </div>
      </footer>
    </div>
  )
}
