import { Link } from 'react-router-dom'
import { cartItems } from '../data/menuData'
import { CartLine, OrderSummary, SectionHeader } from '../components/ui'

export default function Confirmacao() {
  return (
    <section className="container checkout-layout">
      <div>
        <div className="breadcrumb">Home / Checkout / Confirmação</div>
        <SectionHeader
          eyebrow="Confirmação"
          title="Confira os dados antes de enviar"
          text="Uma última revisão clara reduz erros e aumenta confiança no pedido."
        />
        <div className="surface confirmation-card">
          <h2>Dados do cliente</h2>
          <dl>
            <div><dt>Nome</dt><dd>Marina Lopes</dd></div>
            <div><dt>WhatsApp</dt><dd>(11) 99999-0000</dd></div>
            <div><dt>Entrega</dt><dd>Rua das Oliveiras, 128 - 19:00</dd></div>
            <div><dt>Pagamento</dt><dd>Pix</dd></div>
          </dl>
        </div>
        <div className="surface cart-list">
          {cartItems.map((item) => <CartLine key={item.id} item={item} />)}
        </div>
        <Link className="button secondary" to="/checkout">Voltar</Link>
      </div>
      <OrderSummary items={cartItems} cta="Confirmar Pedido" to="/pedido-finalizado" />
    </section>
  )
}
