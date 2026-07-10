import { Navigate } from 'react-router-dom'
import { Field, OrderSummary, SectionHeader } from '../components/ui'
import { useCart } from '../hooks/useCart'

export default function Checkout() {
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

  if (isLoading) {
    return <p>Carregando dados dos pedidos...</p>
  }

  if (!isLoading && items.length === 0) {
    return <Navigate to="/cardapio" replace />
  }


  return (
    <section className="container checkout-layout">
      <div>
        <SectionHeader
          title="Dados para entrega"
          text="Formulário objetivo, estados consistentes e resumo fixo em telas maiores."
        />
        <form className="surface checkout-form">
          <div className="form-grid">
            <Field label="Nome">
              <input
                name="nome"
                value={deliveryData.nome}
                onChange={handleDeliveryChange}
                placeholder="Seu nome completo"
              />
            </Field>
            <Field label="WhatsApp">
              <input
                name="whatsapp"
                value={deliveryData.whatsapp}
                onChange={handleDeliveryChange}
                placeholder="(00) 00000-0000"
              />
            </Field>
            <Field label="Email">
              <input
                name="email"
                type="email"
                value={deliveryData.email}
                onChange={handleDeliveryChange}
                placeholder="voce@email.com"
              />
            </Field>
            <Field label="Forma de pagamento">
              <select
                name="pagamento"
                value={deliveryData.pagamento}
                onChange={handleDeliveryChange}
              >
                <option value="" disabled>Selecione</option>
                <option value="Pix">Pix</option>
                <option value="Cartão na entrega">Cartão na entrega</option>
                <option value="Dinheiro">Dinheiro</option>
              </select>
            </Field>
            <Field label="Endereço completo">
              <input
                name="endereco"
                value={deliveryData.endereco}
                onChange={handleDeliveryChange}
                placeholder="Rua, número, bairro, cidade"
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
            <Field label="Data de entrega">
              <input
                name="dataEntrega"
                type="date"
                value={deliveryData.dataEntrega}
                onChange={handleDeliveryChange}
              />
            </Field>
            <Field label="Horário">
              <select
                name="horario"
                value={deliveryData.horario}
                onChange={handleDeliveryChange}
              >
                <option value="" disabled>Escolha</option>
                <option value="11:00 - 12:00">11:00 - 12:00</option>
                <option value="12:00 - 13:00">12:00 - 13:00</option>
                <option value="19:00 - 20:00">19:00 - 20:00</option>
              </select>
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
        </form>
      </div>
      <OrderSummary items={items} coupon={couponDiscount} cta="Revisar pedido" to="/confirmacao" />
    </section>
  )
}
