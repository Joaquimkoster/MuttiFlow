import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiRefreshCw, FiTag, FiTrash2 } from 'react-icons/fi'
import { CartLine, Field, OrderSummary, SectionHeader } from '../components/ui'
import { useCart } from '../hooks/useCart'

export default function Carrinho() {
  const [isUpdating, setIsUpdating] = useState(false)
  const {
    applyCoupon,
    couponCode,
    couponDiscount,
    couponMessage,
    emptyCart,
    error,
    isLoading,
    items,
    loadCart,
    removeItem: removeCartLine,
    setCouponCode,
    setError,
    updateItem,
  } = useCart()

  async function changeQuantity(item, quantity) {
    if (quantity < 1) {
      return
    }

    try {
      setIsUpdating(true)
      setError('')
      await updateItem(item.id, quantity)
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
      await removeCartLine(itemId)
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
      await emptyCart()
    } catch (err) {
      setError(err.message)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <section className="container checkout-page">
      <SectionHeader
        eyebrow="Seu pedido"
        title="Carrinho"
        text="Confira os pratos escolhidos e ajuste as quantidades antes de continuar."
        action={
          items.length > 0 && (
            <button className="button secondary small" type="button" onClick={handleClearCart} disabled={isUpdating}>
              <FiTrash2 /> Limpar
            </button>
          )
        }
      />

      <div className="checkout-layout">
        <div>

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
              <button className="button secondary" type="button" onClick={applyCoupon}>
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
      </div>
    </section>
  )
}
