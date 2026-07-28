import { Link, useLocation } from 'react-router-dom'
import { FiCheckCircle } from 'react-icons/fi'

export default function PedidoFinalizado() {
  const { state } = useLocation()

  return (
    <section className="container success-page">
      <div className="success-card">
        <span className="success-icon"><FiCheckCircle /></span>
      
        <h1>Recebemos seu pedido com sucesso.</h1>
        {state?.codigoPublico && <p>Pedido <strong>{state.codigoPublico}</strong> registrado. Guarde este código para acompanhamento.</p>}
        {state?.aguardandoPagamento && <p>Seu pedido agora aguarda a confirmação do Pix pela loja.</p>}
        {state?.pagamentoNaHora && <p>{state.retirada ? 'Pague com cartão quando retirar seu pedido.' : 'Pague com cartão no momento da entrega.'}</p>}
        <div className="hero-actions center">
          {state?.codigoPublico ? <Link className="button primary" to={`/pedido/${state.codigoPublico}`}>Acompanhar pedido</Link> : <Link className="button primary" to="/contato">Falar com a loja</Link>}
          <Link className="button secondary" to="/cardapio">Voltar ao cardápio</Link>
        </div>
      </div>
    </section>
  )
}
