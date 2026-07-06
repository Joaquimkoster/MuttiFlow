import { cartItems } from '../data/menuData'
import { Field, OrderSummary, SectionHeader } from '../components/ui'

export default function Checkout() {
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
              <input placeholder="Seu nome completo" />
            </Field>
            <Field label="WhatsApp">
              <input placeholder="(00) 00000-0000" />
            </Field>
            <Field label="Email">
              <input type="email" placeholder="voce@email.com" />
            </Field>
            <Field label="Forma de pagamento">
              <select defaultValue="">
                <option value="" disabled>Selecione</option>
                <option>Pix</option>
                <option>Cartão na entrega</option>
                <option>Dinheiro</option>
              </select>
            </Field>
            <Field label="Endereço completo">
              <input placeholder="Rua, número, bairro, cidade" />
            </Field>
            <Field label="Complemento">
              <input placeholder="Apartamento, bloco ou referência" />
            </Field>
            <Field label="Data de entrega">
              <input type="date" />
            </Field>
            <Field label="Horário">
              <select defaultValue="">
                <option value="" disabled>Escolha</option>
                <option>11:00 - 12:00</option>
                <option>12:00 - 13:00</option>
                <option>19:00 - 20:00</option>
              </select>
            </Field>
          </div>
          <Field label="Observações">
            <textarea placeholder="Ex: sem cebola, entregar na portaria..." />
          </Field>
        </form>
      </div>
      <OrderSummary items={cartItems} cta="Revisar pedido" to="/confirmacao" />
    </section>
  )
}
