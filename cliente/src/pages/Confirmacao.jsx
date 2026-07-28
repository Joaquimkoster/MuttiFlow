import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useRef, useState } from 'react'
import { CartLine, OrderSummary, SectionHeader } from '../components/ui'
import { useCart } from '../hooks/useCart'

export default function Confirmacao() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [submitError,  setSubmitError] = useState('')
  const submittingRef = useRef(false)
  const idempotencyKeyRef = useRef(null)
  const {
    couponDiscount,
    deliveryData,
    deliveryRegion,
    isLoading,
    items,
    removeItem,
    submitOrder,
    updateItem,
  } = useCart()

  async function changeQuantity(item, quantity) {
    if (quantity < 1) return

    try {
      setIsUpdating(true)
      setSubmitError('')
      await updateItem(item.id, quantity)
    } catch (error) {
      setSubmitError(error.message)
    } finally {
      setIsUpdating(false)
    }
  }

  async function removeCartItem(itemId) {
    try {
      setIsUpdating(true)
      setSubmitError('')
      await removeItem(itemId)
    } catch (error) {
      setSubmitError(error.message)
    } finally {
      setIsUpdating(false)
    }
  }

  async function handleSubmit() {
  if (submittingRef.current) return
  submittingRef.current = true
  if (!idempotencyKeyRef.current) {
    idempotencyKeyRef.current = globalThis.crypto?.randomUUID?.() || `pedido-${Date.now()}-${Math.random().toString(36).slice(2)}`
  }
  try {
    setSubmitting(true);
    setSubmitError('');

    const pedido = await submitOrder(idempotencyKeyRef.current);

    if (deliveryData.pagamento === 'Pix') {
      navigate(`/pagamento-pix/${pedido.id}`, {
        state: { pedidoId: pedido.id, total: Number(pedido.total), codigoPublico: pedido.codigo_publico },
      });
    } else {
      navigate('/pedido-finalizado', {
        replace: true,
        state: { pedidoId: pedido.id, codigoPublico: pedido.codigo_publico, pagamentoNaHora: true, retirada: deliveryRegion === 'retirada' },
      });
    }
  } catch (error) {
    setSubmitError(error.message);
    setSubmitting(false);
    submittingRef.current = false
  }
}

  if (isLoading) {
    return <p>Carregando dados do pedido...</p>
  }

  if (items.length === 0 && !submitting) {
    return <Navigate to="/cardapio" replace />
  }

  const camposObrigatorios = ['nome', 'whatsapp', 'pagamento', 'dataEntrega', 'horario']
  if (deliveryRegion !== 'retirada') camposObrigatorios.push('endereco', 'cidade', 'bairro')
  if (camposObrigatorios.some((campo) => !String(deliveryData[campo] || '').trim())) {
    return <Navigate to="/checkout" replace />
  }

  if (!deliveryRegion) {
    return <Navigate to="/carrinho" replace />
  }

  return (
    <section className="container checkout-page">
      <SectionHeader
        eyebrow="Última etapa"
        title="Revise seu pedido"
        text="Confira os itens e os dados de entrega antes de confirmar."
      />

      <div className="checkout-layout">
        <div>
          <div className="surface confirmation-card">
            <h2>Dados do cliente</h2>
            <dl>
              <div><dt>Nome</dt><dd>{deliveryData.nome || 'Não informado'}</dd></div>
              <div><dt>WhatsApp</dt><dd>{deliveryData.whatsapp || 'Não informado'}</dd></div>
              <div><dt>Pagamento</dt><dd>{deliveryData.pagamento}</dd></div>
              <div><dt>Recebimento</dt><dd>{deliveryRegion === 'retirada' ? 'Retirada no local' : 'Entrega'}</dd></div>
              {deliveryRegion !== 'retirada' && <div><dt>Endereço</dt><dd>{deliveryData.endereco || 'Não informado'}</dd></div>}
              <div><dt>Complemento</dt><dd>{deliveryData.complemento || 'Não informado'}</dd></div>
              <div><dt>Cidade</dt><dd>{deliveryData.cidade || 'Não informada'}</dd></div>
              <div><dt>Bairro</dt><dd>{deliveryData.bairro || 'Não informado'}</dd></div>
              <div><dt>Entrega/retirada</dt><dd>{deliveryRegion === 'retirada' ? 'Retirada no local — sem frete' : deliveryRegion === 'paulinia' ? 'Paulínia — R$ 7,00' : 'Campinas/outras — via Uber, valor a confirmar'}</dd></div>
              <div><dt>Data de entrega</dt><dd>{deliveryData.dataEntrega || 'Não informado'}</dd></div>
              <div><dt>Horário</dt><dd>{deliveryData.horario || 'Não informado'}</dd></div>
              <div><dt>Observações</dt><dd>{deliveryData.observacoes || 'Nenhuma'}</dd></div>
            </dl>
          </div>
          <div className="surface cart-list">
            {items.map((item) => (
              <CartLine
                key={item.id}
                item={item}
                disabled={isUpdating || submitting}
                onDecrease={() => changeQuantity(item, item.quantity - 1)}
                onIncrease={() => changeQuantity(item, item.quantity + 1)}
                onRemove={() => removeCartItem(item.id)}
              />
            ))}
          </div>
          <div className="confirmation-actions">
            <Link className="button secondary" to="/checkout">Voltar</Link>
            <Link className="button secondary" to="/cardapio">Continuar comprando</Link>
          </div>
        </div>
        <OrderSummary
          items={items}
          coupon={couponDiscount}
          delivery={deliveryRegion === 'paulinia' ? 7 : 0}
          deliveryLabel={deliveryRegion === 'retirada' ? 'Retirada no local' : deliveryRegion === 'outras' ? 'Via Uber (a confirmar)' : undefined}
          cta={submitting ? 'Confirmando pedido...' : deliveryData.pagamento === 'Pix' ? 'Confirmar e pagar com Pix' : 'Confirmar pedido'}
          onAction={handleSubmit}
          disabled={submitting || isUpdating}
        />
      </div>
      {submitError && <p className="form-error confirmation-submit-error">{submitError}</p>}
    </section>
  )
}
