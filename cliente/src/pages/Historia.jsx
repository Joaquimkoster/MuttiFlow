import { SectionHeader } from '../components/ui'

export default function Sobre() {
  return (
    <>
      <section className="container story-grid section-block">
        <div>
          <SectionHeader
            eyebrow="Nossa história"
            title="Da cozinha de família para a sua mesa"
            text="A MuttiFlow nasceu do desejo de preservar receitas, criar encontros e transformar o cuidado da comida caseira em uma experiência completa."
          />
          <p className="body-copy">
            Cada prato é preparado para chegar bonito, saboroso e fácil de compartilhar. Do molho feito sem pressa à embalagem, cada escolha carrega o mesmo cuidado que teríamos ao servir nossa própria família.
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
          <SectionHeader eyebrow="Nossa equipe" title="Pessoas por trás de cada pedido" />
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
