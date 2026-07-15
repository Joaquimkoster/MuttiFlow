import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { CartLine, OrderSummary, SectionHeader } from '../components/ui'
import { useCart } from '../hooks/useCart'

export default function Confirmacao() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [submitError,  setSubmitError] = useState('')
  const {
    couponDiscount,
    deliveryData,
    isLoading,
    items,
    submitOrder,
  } = useCart()

  async function handleSubmit() {
  try {
    setSubmitting(true);
    setSubmitError('');

    const pedido = await submitOrder();

    navigate(`/pagamento-pix/${pedido.id}`, {
      state: {
        pedidoId: pedido.id,
        total: Number(pedido.total),
      },
    });
  } catch (error) {
    setSubmitError(error.message);
    setSubmitting(false);
  }
}

  if (isLoading) {
    return <p>Carregando dados do pedido...</p>
  }

  if (items.length === 0 && !submitting) {
    return <Navigate to="/cardapio" replace />
  }

  const camposObrigatorios = ['nome', 'whatsapp', 'endereco', 'cidade', 'bairro', 'dataEntrega', 'horario']
  if (camposObrigatorios.some((campo) => !String(deliveryData[campo] || '').trim())) {
    return <Navigate to="/checkout" replace />
  }

  return (
    <section className="container checkout-layout">
      <div>
        <SectionHeader
          eyebrow="Última etapa"
          title="Revise seu pedido"
          text="Confira os itens e os dados de entrega antes de confirmar."
        />
        <div className="surface confirmation-card">
          <h2>Dados do cliente</h2>
          <dl>
            <div><dt>Nome</dt><dd>{deliveryData.nome || 'Não informado'}</dd></div>
            <div><dt>WhatsApp</dt><dd>{deliveryData.whatsapp || 'Não informado'}</dd></div>
            <div><dt>Pagamento</dt><dd>Pix</dd></div>
            <div><dt>Endereço</dt><dd>{deliveryData.endereco || 'Não informado'}</dd></div>
            <div><dt>Complemento</dt><dd>{deliveryData.complemento || 'Não informado'}</dd></div>
            <div><dt>Cidade</dt><dd>{deliveryData.cidade || 'Não informada'}</dd></div>
            <div><dt>Bairro</dt><dd>{deliveryData.bairro || 'Não informado'}</dd></div>
            <div><dt>Data de entrega</dt><dd>{deliveryData.dataEntrega || 'Não informado'}</dd></div>
            <div><dt>Horário</dt><dd>{deliveryData.horario || 'Não informado'}</dd></div>
            <div><dt>Observações</dt><dd>{deliveryData.observacoes || 'Nenhuma'}</dd></div>
          </dl>
        </div>
        <div className="surface cart-list">
          {items.map((item) => (
            <CartLine key={item.id} item={item} disabled />
          ))}
        </div>
        <Link className="button secondary" to="/checkout">Voltar</Link>
      </div>
      <OrderSummary
        items={items}
        coupon={couponDiscount}
        cta="Confirmar e pagar com Pix"
        onAction={handleSubmit}
        disabled={submitting}
      />
      {submitError && <p className="form-error">{submitError}</p>}
    </section>
  )
}
