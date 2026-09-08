import { SectionHeader } from '../components/ui'
import { FiArrowUpRight, FiGlobe, FiInstagram } from 'react-icons/fi'
import joaquimFoto from '../assets/joaquim-koster.jpeg'
import josianeFoto from '../assets/josiane-koster.jpeg'
import historiaReceitas from '../assets/historia-9301.jpg'
import historiaPaes from '../assets/historia-4877.jpg'
import historiaMassas from '../assets/historia-2746.jpg'

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
          <img src={historiaReceitas} alt="Conferência de receitas na cozinha da Diê Mutti" />
          <img src={historiaPaes} alt="Preparo de pães artesanais antes de assar" />
          <img src={historiaMassas} alt="Corte artesanal de massa com sementes na bancada" />
        </div>
      </section>

      <section className="team-band">
        <div className="container section-block">
          <SectionHeader eyebrow="Nossa equipe" title="Pessoas por trás de cada pedido" />
          <div className="team-grid">
            {[
              {
                name: 'Josiane Köster',
                photo: josianeFoto,
                cropScreenshot: true,
                role: 'Chefe de cozinha, responsável pelas receitas e pela produção artesanal.',
              },
              {
                name: 'Koster-Tech',
                photo: joaquimFoto,
                role: 'Desenvolvimento de software, inteligência artificial, dados e gêmeos digitais.',
                links: [
                  { label: 'Projetos e contato', href: 'https://www.koster-tech.com/', icon: FiGlobe },
                  { label: '@koster.tech', href: 'https://www.instagram.com/koster.tech/', icon: FiInstagram },
                ],
              },
            ].map((member) => (
              <article className="team-card" key={member.name}>
                {member.cropScreenshot ? (
                  <span
                    className="avatar large team-avatar-cropped"
                    role="img"
                    aria-label={member.name}
                    style={{ backgroundImage: `url(${member.photo})` }}
                  />
                ) : member.photo ? (
                  <span className="avatar large team-avatar">
                    <img src={member.photo} alt={member.name} />
                  </span>
                ) : (
                  <span className="avatar large">{member.name.charAt(0)}</span>
                )}
                <h3>{member.name}</h3>
                {member.role && <p>{member.role}</p>}
                {member.links && (
                  <div className="team-links">
                    {member.links.map((link) => (
                      <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
                        <link.icon aria-hidden="true" />
                        <span>{link.label}</span>
                        <FiArrowUpRight aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
