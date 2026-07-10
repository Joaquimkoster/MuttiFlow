import { Link } from 'react-router-dom'
import { FiCheckCircle } from 'react-icons/fi'

export default function PedidoFinalizado() {
  return (
    <section className="container success-page">
      <div className="success-card">
        <span className="success-icon"><FiCheckCircle /></span>
      
        <h1>Recebemos seu pedido com sucesso.</h1>
        <div className="hero-actions center">
          <Link className="button primary" to="/contato">Acompanhar pedido</Link>
          <Link className="button secondary" to="/cardapio">Voltar ao cardápio</Link>
        </div>
      </div>
    </section>
  )
}
