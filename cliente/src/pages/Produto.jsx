import { Link, useParams } from 'react-router-dom'
import { FiCheck, FiShoppingBag } from 'react-icons/fi'
import { products } from '../data/menuData'
import { ProductCard, QuantityStepper, SectionHeader } from '../components/ui'
import { formatCurrency } from '../data/menuData'

export default function Produto() {
  const { id } = useParams()
  const product = products.find((item) => item.id === id) ?? products[0]
  const related = products.filter((item) => item.id !== product.id).slice(0, 3)

  return (
    <section className="container product-page">
      <div className="product-detail-grid">
        <div className="gallery">
          <img className="main-photo" src={product.image} alt={product.name} />
          <div className="thumb-row">
            {[product.image, ...related.map((item) => item.image)].slice(0, 4).map((image) => (
              <img key={image} src={image} alt="" />
            ))}
          </div>
        </div>

        <article className="detail-panel">
          <span className="badge">{product.badge}</span>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <strong className="price big">{formatCurrency(product.price)}</strong>

          <div className="info-grid">
            <div><span>Peso</span><strong>{product.weight}</strong></div>
            <div><span>Porção</span><strong>{product.serves}</strong></div>
          </div>

          <div className="ingredients">
            <h2>Ingredientes</h2>
            {product.ingredients.map((ingredient) => (
              <span key={ingredient}><FiCheck /> {ingredient}</span>
            ))}
          </div>

          <div className="buy-row">
            <QuantityStepper value={1} />
            <Link className="button primary" to="/carrinho">
              <FiShoppingBag /> Adicionar ao carrinho
            </Link>
          </div>
        </article>
      </div>

      <section className="section-block">
        <SectionHeader title="Também combina com" />
        <div className="product-grid">
          {related.map((item) => <ProductCard key={item.id} product={item} compact />)}
        </div>
      </section>
    </section>
  )
}
