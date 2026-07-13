import { Link, useLocation } from 'react-router-dom'
import { FiCheckCircle } from 'react-icons/fi'

export default function PedidoFinalizado() {
  const { state } = useLocation()

  return (
    <section className="container success-page">
      <div className="success-card">
        <span className="success-icon"><FiCheckCircle /></span>
      
        <h1>Recebemos seu pedido com sucesso.</h1>
        {state?.pedidoId && <p>Pedido <strong>#{state.pedidoId}</strong> registrado. Guarde este número para acompanhamento.</p>}
        {state?.aguardandoPagamento && <p>Seu pedido agora aguarda a confirmação do Pix pela loja.</p>}
        <div className="hero-actions center">
          <Link className="button primary" to="/contato">Acompanhar pedido</Link>
          <Link className="button secondary" to="/cardapio">Voltar ao cardápio</Link>
        </div>
      </div>
    </section>
  )
}
