import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiSearch, FiShoppingBag } from 'react-icons/fi'
import { categories, products } from '../data/menuData'
import { CategoryChips, ProductCard, SectionHeader } from '../components/ui'
import { useCart } from '../hooks/useCart'

export default function Cardapio() {
  const [activeCategory, setActiveCategory] = useState('todos')
  const [search, setSearch] = useState('')
  const { itemCount } = useCart()

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryMatch = activeCategory === 'todos' || product.category === activeCategory
      const searchMatch = product.name.toLowerCase().includes(search.toLowerCase())
      return categoryMatch && searchMatch
    })
  }, [activeCategory, search])

  return (
    <section className="container menu-page">
      <SectionHeader
        title="Escolha seus pratos"
        text="Pesquisa, filtros por categoria, cards responsivos e carrinho sempre acessível."
      />

      <div className="menu-toolbar">
        <label className="search-box">
          <FiSearch />
          <input
            type="search"
            placeholder="Buscar produto"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <CategoryChips categories={categories} activeCategory={activeCategory} onSelect={setActiveCategory} />
      </div>

      <div className="product-grid">
        {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>

      <Link className="floating-cart" to="/carrinho" aria-label="Abrir carrinho">
        <FiShoppingBag />
        <span>{itemCount === 1 ? '1 item' : `${itemCount} itens`}</span>
      </Link>
    </section>
  )
}
