import { FiClock, FiFacebook, FiInstagram, FiMapPin, FiPhone } from 'react-icons/fi'
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
        <div className="contact-methods">
          <a className="surface contact-method" href="https://wa.me/5500000000000">
            <FiPhone />
            <span>WhatsApp</span>
            <strong>(00) 00000-0000</strong>
          </a>
          <a className="surface contact-method" href="https://instagram.com">
            <FiInstagram />
            <span>Instagram</span>
            <strong>@muttiflow</strong>
          </a>
          <a className="surface contact-method" href="https://facebook.com">
            <FiFacebook />
            <span>Facebook</span>
            <strong>/muttiflow</strong>
          </a>
          <div className="surface contact-method">
            <FiClock />
            <span>Funcionamento</span>
            <strong>Terça a domingo, 10h às 22h</strong>
          </div>
        </div>

        <div className="map-card" aria-label="Google Maps">
          <div>
            <FiMapPin />
            <strong>Google Maps</strong>
            <span>Rua das Oliveiras, 128 - Centro</span>
          </div>
        </div>
      </div>
    </section>
  )
}
