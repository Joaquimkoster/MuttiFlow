import { useState } from 'react'
import { SectionHeader } from '../components/ui'

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

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  function handleSubmit(e) {
    e.preventDefault()

    if (!form.cliente || !form.tipo || !form.data || !form.hora || !form.endereco || !form.convidados) {
      alert('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    console.log(form)
    alert('Solicitação enviada com sucesso! Nossa equipe entrará em contato em breve.')

    setForm({
      cliente: '',
      tipo: '',
      data: '',
      hora: '',
      endereco: '',
      convidados: '',
      valor: '',
      status: 'Aguardando',
    })
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
            />
          </div>

          <div className="form-group">
            <label>Tipo de evento</label>

            <select
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
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
              />
            </div>

            <div className="form-group">
              <label>Hora</label>

              <input
                type="time"
                name="hora"
                value={form.hora}
                onChange={handleChange}
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
              />
            </div>

            <div className="form-group">
              <label>Valor estimado</label>

              <input
                type="number"
                name="valor"
                value={form.valor}
                onChange={handleChange}
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

          <button className="btn-primary">
            Solicitar Evento
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