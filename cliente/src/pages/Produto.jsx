import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { FiCheck, FiShoppingBag } from 'react-icons/fi'
import { products } from '../data/menuData'
import { ProductCard, QuantityStepper, SectionHeader } from '../components/ui'
import { formatCurrency } from '../data/menuData'
import { useCart } from '../hooks/useCart'

export default function Produto() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState('')
  const product = products.find((item) => item.id === id)
  const related = useMemo(() => {
    if (!product) return []

    const available = products.filter((item) => item.id !== product.id)
    for (let index = available.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1))
      const currentItem = available[index]
      available[index] = available[randomIndex]
      available[randomIndex] = currentItem
    }

    return available.slice(0, 3)
  }, [product])
  async function handleAddToCart() {
    try {
      setIsAdding(true)
      setError('')
      await addItem(product.backendId, quantity)
      navigate('/carrinho')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsAdding(false)
    }
  }

  if (!product) {
    return <Navigate to="/cardapio" replace />
  }

  return (
    <section className="container product-page">
      <div className="product-detail-grid">
        <div className="gallery">
          <img
            className="main-photo"
            src={product.image}
            alt={product.name}
            style={{ objectPosition: product.imagePosition }}
            onError={(event) => {
              event.currentTarget.onerror = null
              event.currentTarget.src = product.fallbackImage
            }}
          />
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
            <QuantityStepper
              value={quantity}
              disabled={isAdding}
              onDecrease={() => setQuantity((value) => Math.max(1, value - 1))}
              onIncrease={() => setQuantity((value) => value + 1)}
            />
            <button className="button primary" type="button" onClick={handleAddToCart} disabled={isAdding}>
              <FiShoppingBag /> {isAdding ? 'Adicionando...' : 'Adicionar ao carrinho'}
            </button>
          </div>

          {error && <p className="form-error">{error}</p>}
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
