import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiRefreshCw, FiTag, FiTrash2 } from 'react-icons/fi'
import {
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from '../services/cartApi'
import { CartLine, Field, OrderSummary, SectionHeader } from '../components/ui'

export default function Carrinho() {
  const [cart, setCart] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState('')
  const [couponCode, setCouponCode] = useState('')
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [couponMessage, setCouponMessage] = useState('')

  const items = useMemo(() => {
    return (cart?.itens ?? []).map((item) => ({
      id: item.id,
      productId: item.produto_id,
      name: item.name,
      image: item.image,
      serves: item.serves ?? 'Produto MuttiFlow',
      price: Number(item.price),
      quantity: Number(item.quantidade),
    }))
  }, [cart])

  async function handleApplyCoupon() {
    if (couponCode.trim().toUpperCase() === 'MUTTI15') {
      setCouponDiscount(10)
      setCouponMessage('Cupom aplicado com sucesso')
      return
    }

    setCouponDiscount(0)
    setCouponMessage('Cupom inválido')
  }

  async function loadCart() {
    try {
      setError('')
      const data = await getCart()
      setCart(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCart()
  }, [])

  async function changeQuantity(item, quantity) {
    if (quantity < 1) {
      return
    }

    try {
      setIsUpdating(true)
      setError('')
      const data = await updateCartItem(item.id, quantity)
      setCart(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsUpdating(false)
    }
  }

  async function removeItem(itemId) {
    try {
      setIsUpdating(true)
      setError('')
      const data = await removeCartItem(itemId)
      setCart(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsUpdating(false)
    }
  }

  async function handleClearCart() {
    try {
      setIsUpdating(true)
      setError('')
      await clearCart()
      await loadCart()
    } catch (err) {
      setError(err.message)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <section className="container checkout-layout">
      <div>
        <SectionHeader
          title="Revise seus produtos"
          text="Ajuste quantidades, remova itens e aplique um cupom antes de continuar."
          action={
            items.length > 0 && (
              <button className="button secondary small" type="button" onClick={handleClearCart} disabled={isUpdating}>
                <FiTrash2 /> Limpar
              </button>
            )
          }
        />

        {error && (
          <div className="surface state-card error-state">
            <p>{error}</p>
            <button className="button secondary small" type="button" onClick={loadCart}>
              <FiRefreshCw /> Tentar novamente
            </button>
          </div>
        )}

        <div className="surface cart-list">
          {isLoading && <p className="cart-state">Carregando carrinho...</p>}

          {!isLoading && items.length === 0 && (
            <div className="cart-state">
              <strong>Seu carrinho está vazio.</strong>
              <p>Escolha um prato no cardápio para começar seu pedido.</p>
              <Link className="button primary small" to="/cardapio">Ver cardápio</Link>
            </div>
          )}

          {items.map((item) => (
            <CartLine
              key={item.id}
              item={item}
              disabled={isUpdating}
              onDecrease={() => changeQuantity(item, item.quantity - 1)}
              onIncrease={() => changeQuantity(item, item.quantity + 1)}
              onRemove={() => removeItem(item.id)}
            />
          ))}
        </div>

        <div className="surface coupon-card">
          <Field label="Cupom de desconto">
            <div className="input-with-button">
              <input
                value={couponCode}
                onChange={(event) => setCouponCode(event.target.value)}
              />
              <button className="button secondary" type="button" onClick={handleApplyCoupon}>
                <FiTag /> Aplicar
              </button>
            </div>
          </Field>
          {couponMessage && (
            <p className={couponDiscount > 0 ? 'coupon-success' : 'form-error'}>
              {couponMessage}
            </p>
          )}
          <Link className="text-link" to="/cardapio">Continuar comprando</Link>
        </div>
      </div>
      <OrderSummary items={items} coupon={couponDiscount} />
    </section>
  )
}
