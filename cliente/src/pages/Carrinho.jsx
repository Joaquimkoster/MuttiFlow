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
    deliveryRegion,
    emptyCart,
    error,
    isLoading,
    items,
    loadCart,
    removeItem: removeCartLine,
    setCouponCode,
    setDeliveryRegion,
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

        <div className="surface delivery-card">
          <h2>Entrega ou retirada</h2>
          <p>Selecione como deseja receber o pedido:</p>
          <div className="delivery-options">
            <label className={deliveryRegion === 'retirada' ? 'delivery-option selected' : 'delivery-option'}>
              <input
                type="radio"
                name="deliveryRegion"
                value="retirada"
                checked={deliveryRegion === 'retirada'}
                onChange={(event) => setDeliveryRegion(event.target.value)}
              />
              <span><strong>Retirar no local</strong><small>Sem taxa de entrega; combine a retirada pelo WhatsApp</small></span>
            </label>
            <label className={deliveryRegion === 'paulinia' ? 'delivery-option selected' : 'delivery-option'}>
              <input
                type="radio"
                name="deliveryRegion"
                value="paulinia"
                checked={deliveryRegion === 'paulinia'}
                onChange={(event) => setDeliveryRegion(event.target.value)}
              />
              <span><strong>Paulínia</strong><small>Frete fixo de R$ 7,00</small></span>
            </label>
            <label className={deliveryRegion === 'outras' ? 'delivery-option selected' : 'delivery-option'}>
              <input
                type="radio"
                name="deliveryRegion"
                value="outras"
                checked={deliveryRegion === 'outras'}
                onChange={(event) => setDeliveryRegion(event.target.value)}
              />
              <span><strong>Campinas e outras regiões</strong><small>Entrega via Uber; o valor do frete será informado pelo WhatsApp</small></span>
            </label>
          </div>
        </div>
        <div className="surface order-rules-card">
          <h2>Antes de finalizar</h2>
          <ul>
            <li><strong>Dias disponíveis:</strong> terça a sexta, conforme o dia indicado em cada produto.</li>
            <li><strong>Prazo mínimo:</strong> faça o pedido com pelo menos 24 horas de antecedência.</li>
            <li><strong>Entrega:</strong> Paulínia por R$ 7,00; outras regiões via Uber com valor confirmado pelo WhatsApp; retirada sem taxa.</li>
            <li><strong>Pagamento:</strong> Pix antecipado ou cartão no recebimento/retirada.</li>
            <li><strong>Cancelamento:</strong> solicite pelo WhatsApp com no mínimo 24 horas de antecedência.</li>
            <li><strong>Alergênicos:</strong> os produtos podem conter glúten, leite, ovos, castanhas e outros alergênicos. Consulte a loja em caso de restrição.</li>
            <li><strong>Disponibilidade:</strong> produtos inativos ou sem estoque não serão confirmados pelo sistema.</li>
          </ul>
        </div>
        </div>
        <OrderSummary
          items={items}
          coupon={couponDiscount}
          delivery={deliveryRegion === 'paulinia' ? 7 : 0}
          deliveryLabel={deliveryRegion === 'retirada' ? 'Retirada no local' : deliveryRegion === 'outras' ? 'Via Uber (a confirmar)' : deliveryRegion ? undefined : 'Selecione entrega ou retirada'}
          disabled={!deliveryRegion || items.length === 0}
        />
      </div>
    </section>
  )
}
