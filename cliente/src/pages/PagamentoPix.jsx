import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { FiCheck, FiClock, FiCopy, FiSmartphone } from 'react-icons/fi'
import { getPixPayment } from '../services/cartApi'
import { formatCurrency } from '../data/menuData'

export default function PagamentoPix() {
  const { pedidoId } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const [pagamento, setPagamento] = useState(null)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [copiado, setCopiado] = useState(false)

  useEffect(() => {
    let ativo = true

    getPixPayment(pedidoId)
      .then((dados) => {
        if (ativo) setPagamento(dados)
      })
      .catch((error) => {
        if (ativo) setErro(error.message)
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => { ativo = false }
  }, [pedidoId])

  async function copiarCodigo() {
    try {
      await navigator.clipboard.writeText(pagamento.codigo)
      setCopiado(true)
      window.setTimeout(() => setCopiado(false), 2500)
    } catch {
      setErro('Não foi possível copiar automaticamente. Selecione e copie o código abaixo.')
    }
  }

  function concluir() {
    navigate('/pedido-finalizado', {
      replace: true,
      state: { pedidoId: pagamento?.pedidoId || pedidoId, codigoPublico: pagamento?.codigoPublico || state?.codigoPublico, aguardandoPagamento: true },
    })
  }

  if (carregando) {
    return <section className="container pix-page"><div className="pix-loading">Gerando seu Pix...</div></section>
  }

  return (
    <section className="container pix-page">
      <div className="pix-card">
        <div className="pix-heading">
          <span className="pix-mark">PIX</span>
          <div>
            <h1>Pague seu pedido com Pix</h1>
            <p>Pedido #{pedidoId}. Abra o aplicativo do seu banco e use a opção Pix Copia e Cola.</p>
          </div>
        </div>

        {erro && !pagamento && (
          <div className="pix-error" role="alert">
            <strong>Não foi possível gerar o Pix.</strong>
            <p>{erro}</p>
            <button className="button secondary" type="button" onClick={() => navigate('/contato')}>Falar com a loja</button>
          </div>
        )}

        {pagamento && (
          <>
            <div className="pix-amount">
              <span>Valor do pedido</span>
              <strong>{formatCurrency(pagamento.valor ?? state?.total ?? 0)}</strong>
              <small><FiClock /> Pagamento aguardando confirmação</small>
            </div>

            <ol className="pix-steps">
              <li><span>1</span><p>Abra o aplicativo do seu banco.</p></li>
              <li><span>2</span><p>Escolha <strong>Pix Copia e Cola</strong>.</p></li>
              <li><span>3</span><p>Cole o código e confirme o valor.</p></li>
            </ol>

            <div className="pix-code-box">
              <label htmlFor="pix-code">Código Pix Copia e Cola</label>
              <textarea id="pix-code" value={pagamento.codigo} readOnly />
              <button className="button primary full" type="button" onClick={copiarCodigo}>
                {copiado ? <><FiCheck /> Código copiado</> : <><FiCopy /> Copiar código Pix</>}
              </button>
            </div>

            <div className="pix-key"><FiSmartphone /><span><small>Chave Pix</small><strong>{pagamento.chave}</strong></span></div>

            {erro && <p className="form-error" role="alert">{erro}</p>}

            <button className="button secondary full" type="button" onClick={concluir}>
              Já fiz o Pix
            </button>
            <p className="pix-note">A loja confirmará o recebimento do pagamento antes de preparar o pedido.</p>
          </>
        )}
      </div>
    </section>
  )
}
