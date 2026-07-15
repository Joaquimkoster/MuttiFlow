import { FiArrowUpRight, FiClock, FiInstagram, FiMapPin, FiPhone } from 'react-icons/fi'
import { SectionHeader } from '../components/ui'

export default function Contato() {
  return (
    <section className="container contact-page section-block">
      <SectionHeader
        eyebrow="Fale com a gente"
        title="Estamos por perto"
        text="Tire dúvidas, acompanhe seu pedido ou venha conhecer mais do nosso trabalho."
      />

      <div className="contact-grid">
        <div className="contact-methods" aria-label="Canais de atendimento">
          <a className="surface contact-method" href="https://wa.me/5519987799094">
            <FiPhone />
            <span>WhatsApp</span>
            <strong>(19) 98779-9094</strong>
          </a>
          <a className="surface contact-method" href="https://www.instagram.com/die_mutticozinhaartesanal?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==">
            <FiInstagram />
            <span>Instagram</span>
            <strong>@die_mutticozinhaartesanal</strong>
          </a>

          <div className="surface contact-method">
            <FiClock />
            <span>Funcionamento</span>
            <strong>Terça a domingo, 10h às 22h</strong>
          </div>
        </div>

        <a
          className="map-card"
          href="https://www.google.com/maps/search/?api=1&query=Rua+Vicente+Celestino+Jardim+Pari+Paul%C3%ADnia"
          target="_blank"
          rel="noreferrer"
          aria-label="Abrir endereço no Google Maps"
        >
          <div>
            <FiMapPin />
            <small>Onde estamos</small>
            <strong>Rua Vicente Celestino</strong>
            <span>Jardim Pari, Paulínia</span>
            <span className="map-action">Abrir no Google Maps <FiArrowUpRight /></span>
          </div>
        </a>
      </div>
    </section>
  )
}
