import { SectionHeader } from '../components/ui'

export default function Sobre() {
  return (
    <>
      <section className="container story-grid section-block">
        <div>
          <SectionHeader
            eyebrow="História"
            title="Da cozinha de família para um cardápio profissional"
            text="O projeto nasceu para organizar pedidos, preservar receitas e oferecer uma jornada digital compatível com marcas premium."
          />
          <p className="body-copy">
            Cada prato é pensado para chegar bonito, quente e fácil de compartilhar. O visual do cliente conversa com o painel administrativo, criando uma experiência única da operação até a mesa.
          </p>
        </div>
        <div className="photo-mosaic">
          <img src="https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=800&q=80" alt="Equipe preparando massas" />
          <img src="https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=800&q=80" alt="Cozinha organizada" />
          <img src="https://images.unsplash.com/photo-1528712306091-ed0763094c98?auto=format&fit=crop&w=800&q=80" alt="Mesa posta" />
        </div>
      </section>

      <section className="team-band">
        <div className="container section-block">
          <SectionHeader eyebrow="Equipe" title="Pessoas por trás da operação" />
          <div className="team-grid">
            {['Clara Mutti', 'André Souza', 'Lia Martins'].map((name) => (
              <article className="team-card" key={name}>
                <span className="avatar large">{name.charAt(0)}</span>
                <h3>{name}</h3>
                <p>Cozinha, atendimento e experiência do cliente.</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
