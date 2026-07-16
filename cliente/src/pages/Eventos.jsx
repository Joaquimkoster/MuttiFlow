import { useState } from 'react'
import { FiCalendar, FiCheckCircle, FiMessageCircle } from 'react-icons/fi'
import { SectionHeader } from '../components/ui'
import { createEvent } from '../services/eventApi'

const tipos = [
  'Aniversário',
  'Casamento',
  'Confraternização',
  'Corporativo',
  'Chá de bebê',
  'Outro',
]

function parseCurrency(value) {
  const cleaned = String(value).replace(/[^\d,.-]/g, '')
  const normalized = cleaned.includes(',')
    ? cleaned.replace(/\./g, '').replace(',', '.')
    : cleaned
  return Number(normalized)
}

function formatCurrency(value) {
  const number = parseCurrency(value)
  if (!Number.isFinite(number) || number < 0) return value

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(number)
}

export default function Eventos() {
  const [form, setForm] = useState({
    cliente: '',
    telefone: '',
    tipo: '',
    data: '',
    hora: '',
    endereco: '',
    convidados: '',
    valor: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  function handleCurrencyChange(event) {
    const digits = event.target.value.replace(/\D/g, '')
    const value = digits === '' ? '' : formatCurrency(Number(digits) / 100)
    setForm({ ...form, valor: value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setMessage({ type: '', text: '' })

    try {
      await createEvent({
        ...form,
        valor: form.valor === '' ? '' : parseCurrency(form.valor),
      })
      setMessage({ type: 'success', text: 'Solicitação enviada para análise. Nossa equipe entrará em contato após aceitar o evento.' })
      setForm({ cliente: '', telefone: '', tipo: '', data: '', hora: '', endereco: '', convidados: '', valor: '' })
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="container section-block">
      <SectionHeader
        eyebrow="Momentos especiais"
        title="Leve a MuttiFlow para seu evento"
        text="Conte um pouco sobre a ocasião. Nossa equipe prepara uma proposta personalizada e entra em contato para confirmar os detalhes."
      />

      <div className="event-page">
        <form
          className="surface event-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label>Cliente</label>

            <input
              type="text"
              name="cliente"
              value={form.cliente}
              onChange={handleChange}
              placeholder="Nome completo"
              required
            />
          </div>

          <div className="form-group">
            <label>Telefone / WhatsApp</label>

            <input
              type="tel"
              name="telefone"
              value={form.telefone}
              onChange={handleChange}
              placeholder="(00) 00000-0000"
              autoComplete="tel"
              required
            />
          </div>

          <div className="form-group">
            <label>Tipo de evento</label>

            <select
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
              required
            >
              <option value="">Selecione</option>

              {tipos.map((tipo) => (
                <option key={tipo}>{tipo}</option>
              ))}
            </select>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>Data</label>

              <input
                type="date"
                name="data"
                min={new Date().toISOString().slice(0, 10)}
                value={form.data}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Hora</label>

              <input
                type="time"
                name="hora"
                value={form.hora}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Endereço</label>

            <input
              type="text"
              name="endereco"
              value={form.endereco}
              onChange={handleChange}
              placeholder="Local do evento"
              required
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>Convidados</label>

              <input
                type="number"
                className="number-input"
                name="convidados"
                value={form.convidados}
                onChange={handleChange}
                min="1"
                placeholder="Digite a quantidade"
                required
              />
            </div>

            <div className="form-group">
              <label>Valor estimado</label>

              <input
                type="text"
                name="valor"
                value={form.valor}
                onChange={handleCurrencyChange}
                inputMode="decimal"
                placeholder="R$ 0,00"
              />
            </div>
          </div>

          {message.text && <p className={`form-message ${message.type}`}>{message.text}</p>}
          <button className="btn-primary" disabled={submitting}>
            {submitting ? 'Enviando...' : 'Solicitar Evento'}
          </button>
        </form>

        <aside className="surface event-info-panel">
          <h2>Você envia os detalhes. A gente cuida do restante.</h2>
          <div className="event-info-steps">
            <div>
              <FiMessageCircle />
              <span><strong>Envie sua solicitação</strong><small>Conte a data, o local e o número de convidados.</small></span>
            </div>
            <div>
              <FiCalendar />
              <span><strong>Analisamos a disponibilidade</strong><small>Nossa equipe verifica a agenda e os detalhes do evento.</small></span>
            </div>
            <div>
              <FiCheckCircle />
              <span><strong>Confirmamos com você</strong><small>Após a aprovação, entramos em contato para combinar os próximos passos.</small></span>
            </div>
          </div>
          <p>A solicitação não garante a reserva até a confirmação da nossa equipe.</p>
        </aside>
      </div>
    </section>
  )
}
