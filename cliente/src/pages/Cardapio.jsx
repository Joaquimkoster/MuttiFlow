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

  const visibleDays = categories
    .filter((category) => category.id !== 'todos')
    .filter((category) => activeCategory === 'todos' || category.id === activeCategory)

  return (
    <section className="container menu-page">
      <SectionHeader
        eyebrow="Cardápio semanal"
        title="Escolha o dia da sua fornada"
        text="Produção artesanal sob encomenda. Reserve com 1 a 2 dias de antecedência para receber tudo fresco."
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

      <div className="weekly-menu">
        {visibleDays.map((day) => {
          const dayProducts = filteredProducts.filter((product) => product.category === day.id)
          if (!dayProducts.length) return null

          return (
            <section className="menu-day" key={day.id}>
              <div className="day-heading">
                <span>{day.label}</span>
                <small>{day.id === 'sexta' ? 'Massas de longa fermentação' : 'Fornada artesanal'}</small>
              </div>
              <div className="product-grid">
                {dayProducts.map((product) => <ProductCard key={product.id} product={product} />)}
              </div>
            </section>
          )
        })}
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
