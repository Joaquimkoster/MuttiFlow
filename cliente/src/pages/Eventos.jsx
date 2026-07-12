import { useState } from 'react'
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

export default function Eventos() {
  const [form, setForm] = useState({
    cliente: '',
    tipo: '',
    data: '',
    hora: '',
    endereco: '',
    convidados: '',
    valor: '',
    status: 'Aguardando',
  })
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setMessage({ type: '', text: '' })

    try {
      await createEvent(form)
      setMessage({ type: 'success', text: 'Solicitação enviada. Nossa equipe entrará em contato.' })
      setForm({ cliente: '', tipo: '', data: '', hora: '', endereco: '', convidados: '', valor: '', status: 'Aguardando' })
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="container section-block">
      <SectionHeader
        title="Agende seu evento"
        text="Preencha as informações abaixo e nossa equipe entrará em contato para confirmar a disponibilidade."
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
                name="convidados"
                value={form.convidados}
                onChange={handleChange}
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label>Valor estimado</label>

              <input
                type="number"
                name="valor"
                value={form.valor}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Status</label>

            <input
              value={form.status}
              readOnly
            />
          </div>

          {message.text && <p className={`form-message ${message.type}`}>{message.text}</p>}
          <button className="btn-primary" disabled={submitting}>
            {submitting ? 'Enviando...' : 'Solicitar Evento'}
          </button>
        </form>

        <aside className="surface summary-card">
          <h3>Resumo do Evento</h3>

          <ul className="summary-list">
            <li>
              <strong>Cliente</strong>
              <span>{form.cliente || '-'}</span>
            </li>

            <li>
              <strong>Tipo</strong>
              <span>{form.tipo || '-'}</span>
            </li>

            <li>
              <strong>Data</strong>
              <span>{form.data ? new Date(form.data).toLocaleDateString('pt-BR') : '-'}</span>
            </li>

            <li>
              <strong>Hora</strong>
              <span>{form.hora || '-'}</span>
            </li>

            <li>
              <strong>Endereço</strong>
              <span>{form.endereco || '-'}</span>
            </li>

            <li>
              <strong>Convidados</strong>
              <span>{form.convidados || '-'}</span>
            </li>

            <li>
              <strong>Valor estimado</strong>
              <span>{form.valor ? `R$ ${form.valor}` : '-'}</span>
            </li>
          </ul>
        </aside>
      </div>
    </section>
  )
}
