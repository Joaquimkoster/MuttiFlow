import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FiCalendar, FiClock, FiPackage, FiTruck } from 'react-icons/fi'
import { getPublicOrder } from '../services/cartApi'

export default function AcompanharPedido() {
  const { codigo } = useParams()
  const [pedido, setPedido] = useState(null)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    let ativo = true
    getPublicOrder(codigo)
      .then((dados) => { if (ativo) setPedido(dados) })
      .catch((error) => { if (ativo) setErro(error.message) })
      .finally(() => { if (ativo) setCarregando(false) })
    return () => { ativo = false }
  }, [codigo])

  if (carregando) return <section className="container tracking-page"><div className="surface tracking-card">Buscando pedido...</div></section>

  if (erro) return <section className="container tracking-page"><div className="surface tracking-card"><h1>Não encontramos esse pedido</h1><p>{erro}</p><Link className="button secondary" to="/contato">Falar com a loja</Link></div></section>

  return (
    <section className="container tracking-page">
      <div className="surface tracking-card">
        <span className="tracking-eyebrow">Acompanhamento</span>
        <h1>{pedido.codigo}</h1>
        <div className="tracking-status"><FiPackage /><span><small>Status atual</small><strong>{pedido.status}</strong></span></div>
        <div className="tracking-details">
          <div><FiCalendar /><span><small>Data</small><strong>{new Date(`${pedido.data.slice(0, 10)}T12:00:00`).toLocaleDateString('pt-BR')}</strong></span></div>
          <div><FiClock /><span><small>Horário</small><strong>{String(pedido.horario).slice(0, 5)}h</strong></span></div>
          <div><FiTruck /><span><small>Recebimento</small><strong>{pedido.tipo_entrega}</strong></span></div>
        </div>
        <div className="tracking-items"><h2>Resumo dos itens</h2>{pedido.itens.map((item, indice) => <div key={`${item.nome}-${indice}`}><span>{item.nome}</span><strong>{item.quantidade}×</strong></div>)}</div>
        <p className="tracking-privacy">Por segurança, esta página não exibe nome, telefone, endereço ou informações de pagamento.</p>
      </div>
    </section>
  )
}
