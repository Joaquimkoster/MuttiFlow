import { useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Field, OrderSummary, SectionHeader } from '../components/ui'
import { useCart } from '../hooks/useCart'

export default function Checkout() {
  const navigate = useNavigate()
  const formRef = useRef(null)
  const [formError, setFormError] = useState('')
  const today = new Date()
  const minimumDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('-')
  const {
    couponDiscount,
    deliveryData,
    isLoading,
    items,
    setDeliveryData,
  } = useCart()

  function handleDeliveryChange(event) {
    const { name, value } = event.target

    setDeliveryData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
  }

  function reviewOrder() {
    if (!formRef.current?.reportValidity()) {
      setFormError('Preencha os campos obrigatórios antes de continuar.')
      return
    }

    setFormError('')
    navigate('/confirmacao')
  }

  if (isLoading) {
    return <p>Carregando dados dos pedidos...</p>
  }

  if (!isLoading && items.length === 0) {
    return <Navigate to="/cardapio" replace />
  }


  return (
    <section className="container checkout-page">
      <SectionHeader
        eyebrow="Quase lá"
        title="Dados para entrega"
        text="Conte onde e quando devemos entregar. Seus dados serão usados somente para este pedido."
      />
      <div className="checkout-layout">
        <div>
        <form ref={formRef} className="surface checkout-form" onSubmit={(event) => { event.preventDefault(); reviewOrder() }}>
          <div className="form-grid">
            <Field label="Nome">
              <input
                name="nome"
                value={deliveryData.nome}
                onChange={handleDeliveryChange}
                placeholder="Seu nome completo"
                required
              />
            </Field>
            <Field label="WhatsApp">
              <input
                name="whatsapp"
                value={deliveryData.whatsapp}
                onChange={handleDeliveryChange}
                placeholder="(00) 00000-0000"
                required
              />
            </Field>
            <Field label="Forma de pagamento">
              <input
                name="pagamento"
                value="Pix"
                readOnly
              />
            </Field>
            <Field label="Endereço completo">
              <input
                name="endereco"
                value={deliveryData.endereco}
                onChange={handleDeliveryChange}
                placeholder="Rua, número, bairro, cidade"
                required
              />
            </Field>
            <Field label="Complemento">
              <input
                name="complemento"
                value={deliveryData.complemento}
                onChange={handleDeliveryChange}
                placeholder="Apartamento, bloco ou referência"
              />
            </Field>
            <Field label="Cidade">
              <input
                name="cidade"
                value={deliveryData.cidade}
                onChange={handleDeliveryChange}
                placeholder="Sua cidade"
                required
              />
            </Field>
            <Field label="Bairro">
              <input
                name="bairro"
                value={deliveryData.bairro}
                onChange={handleDeliveryChange}
                placeholder="Seu bairro"
                required
              />
            </Field>
            <Field label="Escolha o dia da entrega">
              <input
                name="dataEntrega"
                type="date"
                min={minimumDate}
                value={deliveryData.dataEntrega}
                onChange={handleDeliveryChange}
                required
              />
            </Field>
            <Field label="Escolha o horário">
              <input
                name="horario"
                type="time"
                value={deliveryData.horario}
                onChange={handleDeliveryChange}
                required
              />
            </Field>
          </div>
          <Field label="Observações">
            <textarea
              name="observacoes"
              value={deliveryData.observacoes}
              onChange={handleDeliveryChange}
              placeholder="Ex: sem cebola, entregar na portaria..."
            />
          </Field>
          {formError && <p className="form-error">{formError}</p>}
        </form>
        </div>
        <OrderSummary items={items} coupon={couponDiscount} cta="Revisar pedido" onAction={reviewOrder} />
      </div>
    </section>
  )
}
