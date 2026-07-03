import { Link } from 'react-router-dom'
import {
  FiChevronRight,
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiStar,
  FiTrash2,
} from 'react-icons/fi'
import { formatCurrency } from '../data/menuData'

export function PageHero({ eyebrow, title, text, children, image }) {
  return (
    <section className="page-hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{text}</p>
          {children && <div className="hero-actions">{children}</div>}
        </div>
        {image && (
          <div className="hero-media">
            <img src={image} alt="" />
            <div className="hero-stat">
              <strong>4.9</strong>
              <span>avaliação média</span>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export function SectionHeader({ eyebrow, title, text, action }) {
  return (
    <div className="section-header">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
        {text && <p>{text}</p>}
      </div>
      {action}
    </div>
  )
}

export function ProductCard({ product, compact = false }) {
  return (
    <article className={`product-card ${compact ? 'compact' : ''}`}>
      <Link to={`/produto/${product.id}`} className="product-image">
        <img src={product.image} alt={product.name} />
        <span className="badge">{product.badge}</span>
      </Link>
      <div className="product-content">
        <div>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
        </div>
        <div className="product-meta">
          <span><FiStar /> {product.rating}</span>
          <span>{product.serves}</span>
        </div>
        <div className="product-footer">
          <strong className="price">{formatCurrency(product.price)}</strong>
          <Link className="button primary small" to={`/produto/${product.id}`}>
            <FiShoppingBag /> Pedir
          </Link>
        </div>
      </div>
    </article>
  )
}

export function CategoryChips({ categories, activeCategory, onSelect }) {
  return (
    <div className="chips-row" role="list">
      {categories.map((category) => {
        const Icon = category.icon
        const active = activeCategory === category.id
        return (
          <button
            key={category.id}
            className={`chip ${active ? 'active' : ''}`}
            type="button"
            onClick={() => onSelect?.(category.id)}
          >
            <Icon /> {category.label}
          </button>
        )
      })}
    </div>
  )
}

export function QuantityStepper({ value = 1 }) {
  return (
    <div className="qty-stepper" aria-label="Quantidade">
      <button type="button" aria-label="Diminuir"><FiMinus /></button>
      <span>{value}</span>
      <button type="button" aria-label="Aumentar"><FiPlus /></button>
    </div>
  )
}

export function CartLine({ item }) {
  return (
    <div className="cart-line">
      <img src={item.image} alt={item.name} />
      <div>
        <h3>{item.name}</h3>
        <p>{item.serves}</p>
        <strong className="price">{formatCurrency(item.price)}</strong>
      </div>
      <QuantityStepper value={item.quantity} />
      <button className="icon-button danger" type="button" aria-label="Remover item">
        <FiTrash2 />
      </button>
    </div>
  )
}

export function OrderSummary({ items, delivery = 12, coupon = 15, cta = 'Continuar', to = '/checkout' }) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal + delivery - coupon

  return (
    <aside className="summary-card">
      <h2>Resumo do pedido</h2>
      <div className="summary-list">
        <span>Subtotal</span>
        <strong>{formatCurrency(subtotal)}</strong>
        <span>Frete</span>
        <strong>{formatCurrency(delivery)}</strong>
        <span>Cupom</span>
        <strong className="success">-{formatCurrency(coupon)}</strong>
      </div>
      <div className="summary-total">
        <span>Total</span>
        <strong>{formatCurrency(total)}</strong>
      </div>
      <Link className="button primary full" to={to}>
        {cta} <FiChevronRight />
      </Link>
    </aside>
  )
}

export function Field({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  )
}

export function DesignSystemShowcase() {
  return (
    <section className="container ds-section">
      <SectionHeader
        eyebrow="Design System"
        title="Componentes prontos para produção"
        text="Botões, inputs, cards e estados seguem a mesma escala visual do MuttiFlow."
      />
      <div className="ds-grid">
        <div className="surface">
          <h3>Botões e badges</h3>
          <div className="inline-stack">
            <button className="button primary" type="button">Primário</button>
            <button className="button secondary" type="button">Secundário</button>
            <span className="badge success">Sucesso</span>
            <span className="badge warning">Aviso</span>
          </div>
        </div>
        <div className="surface">
          <h3>Inputs e selects</h3>
          <div className="form-grid one">
            <input placeholder="Nome completo" />
            <select defaultValue="">
              <option value="" disabled>Forma de pagamento</option>
              <option>Pix</option>
              <option>Cartão</option>
            </select>
          </div>
        </div>
        <div className="surface">
          <h3>Modal, toast e loader</h3>
          <div className="mock-modal">
            <span className="loader" />
            <p>Pedido sincronizado com o painel.</p>
          </div>
          <div className="toast success">Pedido salvo com sucesso</div>
        </div>
        <div className="surface">
          <h3>Tabela, skeleton e paginação</h3>
          <table>
            <tbody>
              <tr><td>#1024</td><td>Pix</td><td><span className="badge success">Pago</span></td></tr>
              <tr><td>#1025</td><td>Entrega</td><td><span className="badge warning">Pendente</span></td></tr>
            </tbody>
          </table>
          <div className="skeleton-row"><span /><span /><span /></div>
          <div className="pagination"><button>1</button><button>2</button><button>3</button></div>
        </div>
      </div>
    </section>
  )
}
