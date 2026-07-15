import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import { products } from '../data/menuData'
import { PageHero, ProductCard, SectionHeader } from '../components/ui'

export default function Home() {
  const featured = products.filter((product) => product.featured)

  return (
    <>
      <PageHero
        eyebrow="Pães de fermentação natural"
        title="O tempo faz o pão. O cuidado faz toda a diferença."
        text="Pães, bolos e massas de longa fermentação, preparados artesanalmente sob encomenda para chegar fresquinhos à sua mesa."
        image={products[14].image}
        fallbackImage={products[14].fallbackImage}
      >
        <Link className="button primary" to="/cardapio">Explorar cardápio <FiArrowRight /></Link>
        <Link className="button secondary" to="/eventos">Planejar um evento</Link>
      </PageHero>

      <section className="container section-block">
        <SectionHeader
          eyebrow="Cardápio semanal"
          title="Um sabor especial para cada dia"
          text="Da fornada de terça à pizza de sexta: escolha seu favorito e reserve com 1 a 2 dias de antecedência."
          action={<Link className="text-action" to="/cardapio">Ver cardápio completo <FiArrowRight /></Link>}
        />
        <div className="product-grid">
          {featured.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>
    </>
  )
}
