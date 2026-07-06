import { Link } from 'react-router-dom'
import { FiCheckCircle, FiClock, FiNavigation } from 'react-icons/fi'

export default function PedidoFinalizado() {
  return (
    <section className="container success-page">
      <div className="success-card">
        <span className="success-icon"><FiCheckCircle /></span>
      
        <h1>Recebemos seu pedido com sucesso.</h1>
        <p>O número do pedido é <strong>#MF-2048</strong>. A equipe já recebeu os dados e iniciará a preparação.</p>
        <div className="success-metrics">
          <div><FiClock /><span>Tempo estimado</span><strong>45-60 min</strong></div>
          <div><FiNavigation /><span>Status</span><strong>Em preparo</strong></div>
        </div>
        <div className="hero-actions center">
          <Link className="button primary" to="/contato">Acompanhar pedido</Link>
          <Link className="button secondary" to="/cardapio">Voltar ao cardápio</Link>
        </div>
      </div>
    </section>
  )
}
