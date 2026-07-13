import { useMemo, useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import { categories, products } from '../data/menuData'
import { CategoryChips, ProductCard, SectionHeader } from '../components/ui'

export default function Cardapio() {
  const [activeCategory, setActiveCategory] = useState('todos')
  const [search, setSearch] = useState('')
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
        eyebrow="Cardápio artesanal"
        title="Escolha o que vai à mesa"
        text="Pratos preparados em pequenos lotes, com ingredientes selecionados e porções pensadas para compartilhar."
      />

      <div className="menu-toolbar">
        <label className="search-box">
          <FiSearch />
          <input
            type="search"
            placeholder="Buscar por prato..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <CategoryChips categories={categories} activeCategory={activeCategory} onSelect={setActiveCategory} />
      </div>

      <div className="product-grid">
        {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>

      {filteredProducts.length === 0 && (
        <div className="empty-results">
          <strong>Nenhum prato encontrado</strong>
          <p>Tente buscar outro nome ou escolher uma categoria diferente.</p>
        </div>
      )}

    </section>
  )
}
