import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import {
  FiMenu,
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
          <Link className="brand" to="/cardapio" onClick={() => setIsOpen(false)}>
            <span className="brand-mark">M</span>
            <span>
              <strong>Diê Mutti</strong>
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

    </div>
  )
}
