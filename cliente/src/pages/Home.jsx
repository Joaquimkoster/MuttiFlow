import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import { products, reviews } from '../data/menuData'
import { PageHero, ProductCard, SectionHeader } from '../components/ui'

export default function Home() {
  const featured = products.filter((product) => product.featured)

  return (
    <>
      <PageHero
        title="Peça pratos artesanais com uma experiência simples, elegante e rápida."
        text="Um cardápio online conectado ao atendimento e pronto para receber pedidos com a mesma identidade do painel administrativo."
        image={products[0].image}
      >
        <Link className="button primary" to="/cardapio">Ver Cardápio <FiArrowRight /></Link>
        <Link className="button secondary" to="/historia">Conhecer a história</Link>
      </PageHero>

      <section className="container section-block">
        <SectionHeader
          title="Mais pedidos da semana"
          text="Produtos com alta avaliação, descrição clara e ação rápida para compra."
          action={<Link className="button secondary" to="/cardapio">Ver todos</Link>}
        />
        <div className="product-grid">
          {featured.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>
    </>
  )
}
