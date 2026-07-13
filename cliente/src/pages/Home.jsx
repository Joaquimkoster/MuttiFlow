import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import { products } from '../data/menuData'
import { PageHero, ProductCard, SectionHeader } from '../components/ui'

export default function Home() {
  const featured = products.filter((product) => product.featured)

  return (
    <>
      <PageHero
        eyebrow="Receitas que acolhem"
        title="Comida artesanal para transformar qualquer mesa em encontro."
        text="Massas frescas, molhos de longa cocção e sobremesas feitas em pequenos lotes. Escolha com calma; nós cuidamos do resto."
        image={products[0].image}
      >
        <Link className="button primary" to="/cardapio">Explorar cardápio <FiArrowRight /></Link>
        <Link className="button secondary" to="/eventos">Planejar um evento</Link>
      </PageHero>

      <section className="container section-block">
        <SectionHeader
          eyebrow="Favoritos da casa"
          title="Os mais pedidos da semana"
          text="Pratos escolhidos por quem gosta de servir bem sem abrir mão do sabor de comida feita em casa."
          action={<Link className="text-action" to="/cardapio">Ver cardápio completo <FiArrowRight /></Link>}
        />
        <div className="product-grid">
          {featured.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>
    </>
  )
}
