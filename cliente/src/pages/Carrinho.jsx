import { Link } from 'react-router-dom'
import { FiTag } from 'react-icons/fi'
import { cartItems } from '../data/menuData'
import { CartLine, Field, OrderSummary, SectionHeader } from '../components/ui'

export default function Carrinho() {
  return (
    <section className="container checkout-layout">
      <div>
        <div className="breadcrumb">Home / Carrinho</div>
        <SectionHeader
          eyebrow="Carrinho"
          title="Revise seus produtos"
          text="Ajuste quantidades, remova itens e aplique um cupom antes de continuar."
        />
        <div className="surface cart-list">
          {cartItems.map((item) => <CartLine key={item.id} item={item} />)}
        </div>
        <div className="surface coupon-card">
          <Field label="Cupom de desconto">
            <div className="input-with-button">
              <input placeholder="MUTTI15" />
              <button className="button secondary" type="button"><FiTag /> Aplicar</button>
            </div>
          </Field>
          <Link className="text-link" to="/cardapio">Continuar comprando</Link>
        </div>
      </div>
      <OrderSummary items={cartItems} />
    </section>
  )
}
