import {
  FiAward,
  FiCalendar,
  FiCoffee,
  FiHeart,
  FiHome,
  FiShoppingBag,
  FiStar,
  FiTruck,
} from 'react-icons/fi'
import paesImage from '../assets/cardapio/paes-artesanais.jpeg'
import pizzaImage from '../assets/cardapio/pizza-artesanal.jpeg'
import kitPaoBatataImage from '../assets/produtos/kit-pao-batata.jpeg'
import focacciaTradicionalImage from '../assets/produtos/focaccia-tradicional.jpeg'
import boloChocolateImage from '../assets/produtos/bolo-chocolate.jpeg'
import cinnamonRollsImage from '../assets/produtos/cinnamon-rolls.jpeg'

export const categories = [
  { id: 'todos', label: 'Semana toda', icon: FiShoppingBag },
  { id: 'terca', label: 'Terça', icon: FiCalendar },
  { id: 'quarta', label: 'Quarta', icon: FiCalendar },
  { id: 'quinta', label: 'Quinta', icon: FiCoffee },
  { id: 'sexta', label: 'Sexta', icon: FiHeart },
]

const makeProduct = (id, backendId, name, category, price, description, options = {}) => ({
  id,
  backendId,
  name,
  category,
  day: categories.find((item) => item.id === category)?.label,
  price,
  rating: 4.9,
  image: options.image || (category === 'sexta' ? pizzaImage : paesImage),
  fallbackImage: category === 'sexta' ? pizzaImage : paesImage,
  description,
  ingredients: options.ingredients || description.split(',').slice(0, 4).map((item) => item.trim()),
  weight: options.weight || 'Produção artesanal',
  serves: options.serves || '1 unidade',
  featured: options.featured || false,
  badge: options.badge || categories.find((item) => item.id === category)?.label,
  imagePosition: options.imagePosition || (category === 'sexta' ? '70% center' : '18% center'),
})

export const products = [
  makeProduct('multigraos', 1, 'Multigrãos', 'terca', 26, 'Blend de farinhas com sementes especiais: girassol, abóbora, chia, linhaça, gergelim e avelã.', { featured: true, badge: 'Nutritivo', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=85', ingredients: ['Farinha artesanal', 'Girassol', 'Abóbora', 'Chia', 'Linhaça', 'Gergelim', 'Avelã'] }),
  makeProduct('pao-caseirinho', 2, 'Pão Caseirinho', 'terca', 22, 'Feito com levain e trigo especial. Aromático, macio e com gostinho de casa.', { featured: true, badge: 'Queridinho', image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=1000&q=85', ingredients: ['Farinha de trigo', 'Levain', 'Água', 'Sal'] }),
  makeProduct('kit-pao-batata', 3, 'Kit Pão de Batata', 'terca', 9, 'Kit com 4 pãezinhos de batata, com 50 g cada.', { image: kitPaoBatataImage, imagePosition: '50% center', weight: '4 × 50 g', serves: 'Kit com 4 unidades' }),
  makeProduct('kit-cenourinha', 4, 'Kit Cenourinha', 'terca', 18, 'Oito pãezinhos nutritivos feitos com levain e cúrcuma.', { image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=1000&q=85', weight: '8 × 30 g', serves: 'Kit com 8 unidades', ingredients: ['Farinha de trigo', 'Cenoura', 'Levain', 'Cúrcuma'] }),
  makeProduct('pao-forma', 5, 'Pão de Forma', 'terca', 22, 'Feito com levain e trigo especial, com miolo leve e macio.', { image: 'https://images.unsplash.com/photo-1598373182133-52452f7691ef?auto=format&fit=crop&w=1000&q=85' }),

  makeProduct('pao-italiano', 6, 'Pão Italiano', 'quarta', 27, 'Pão rústico de fermentação lenta, casca dourada e aroma especial.', { featured: true, badge: 'Fermentação lenta', image: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&w=1000&q=85' }),
  makeProduct('alecrim-azeitonas', 7, 'Alecrim e Azeitonas', 'quarta', 28, 'Pão de longa fermentação, aromatizado com alecrim fresco e azeitonas.', { image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=1000&q=85', ingredients: ['Farinha de trigo', 'Levain', 'Alecrim fresco', 'Azeitonas'] }),
  makeProduct('pao-multigraos', 8, 'Pão Multigrãos', 'quarta', 30, 'Pão rústico e nutritivo com uma seleção de grãos incorporados à massa.', { badge: 'Rústico', image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=1000&q=85' }),
  makeProduct('crosta-aveia', 9, 'Crosta de Aveia', 'quarta', 27, 'Pão de levain muito aromático, finalizado com uma delicada crosta de aveia.', { image: 'https://images.unsplash.com/photo-1568471173242-461f0a730452?auto=format&fit=crop&w=1000&q=85', ingredients: ['Farinha de trigo', 'Levain', 'Aveia', 'Sal'] }),
  makeProduct('pao-australiano', 10, 'Pão Australiano', 'quarta', 28, 'Pão macio e úmido, feito com cacau e melaço, de aroma marcante.', { image: 'https://images.unsplash.com/photo-1559811814-e2c57b5e69df?auto=format&fit=crop&w=1000&q=85', ingredients: ['Farinha de trigo', 'Cacau', 'Melaço', 'Fermento natural'] }),

  makeProduct('pao-colonial', 11, 'Pão Colonial', 'quinta', 24, 'Massa macia com toque de fubá, casca dourada e sabor caseiro.', { image: 'https://images.unsplash.com/photo-1541833000669-75e92444e2a3?auto=format&fit=crop&w=1000&q=85', ingredients: ['Farinha de trigo', 'Fubá', 'Levain', 'Sal'] }),
  makeProduct('bolo-cenoura', 12, 'Bolo de Cenoura', 'quinta', 18, 'Feito com cenouras frescas e cobertura tradicional de chocolate 100% cacau.', { badge: 'Afetivo', image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=1000&q=85', ingredients: ['Cenoura fresca', 'Farinha', 'Ovos', 'Chocolate 100% cacau'] }),
  makeProduct('bolo-chocolate', 13, 'Bolo de Chocolate', 'quinta', 18, 'Bolo macio feito com cacau 100% e uma leve cobertura de ganache.', { image: boloChocolateImage, ingredients: ['Cacau 100%', 'Farinha', 'Ovos', 'Ganache'] }),
  makeProduct('cinnamon-rolls', 14, 'Cinnamon Rolls', 'quinta', 20, 'Dois pãezinhos suecos em espiral, recheados com canela e finalizados com cream cheese.', { featured: true, badge: 'Kit com 2', image: cinnamonRollsImage, imagePosition: '18% 75%', serves: 'Kit com 2 unidades', ingredients: ['Canela', 'Manteiga', 'Açúcar', 'Cream cheese', 'Baunilha'] }),

  makeProduct('pizza-pomodoro', 15, 'Pizza Pomodoro', 'sexta', 15, 'Pizza de longa fermentação, entre 24 e 72 horas, leve, saborosa e fácil de digerir.', { featured: true, badge: '24–72h', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1000&q=85', ingredients: ['Farinha italiana', 'Molho pomodoro', 'Fermento natural', 'Azeite'] }),
  makeProduct('focaccia-tradicional', 16, 'Focaccia Tradicional', 'sexta', 28, 'Pão italiano rústico, de fermentação lenta, crocante por fora e úmido por dentro.', { image: focacciaTradicionalImage, ingredients: ['Farinha italiana', 'Azeite', 'Fermento natural', 'Sal'] }),
  makeProduct('tortano-napoletano', 17, 'Tortano Napoletano', 'sexta', 30, 'Pão típico de Nápoles enriquecido com calabresa, azeite e funcho.', { badge: 'Nápoles', image: 'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=1000&q=85', ingredients: ['Farinha de trigo', 'Calabresa', 'Azeite', 'Funcho'] }),
]

export const cartItems = [
  { ...products[0], quantity: 1 },
  { ...products[5], quantity: 1 },
  { ...products[14], quantity: 2 },
]

export const reviews = [
  { name: 'Marina Lopes', role: 'Cliente recorrente', rating: 5, text: 'Pães perfumados, casca perfeita e um cuidado que dá para sentir em cada detalhe.' },
  { name: 'Rafael Nunes', role: 'Encomenda em família', rating: 5, text: 'A fermentação longa faz toda diferença. A pizza chegou leve e deliciosa.' },
  { name: 'Beatriz Melo', role: 'Cliente semanal', rating: 5, text: 'Adoro poder escolher pelo dia. O caseirinho e os cinnamon rolls viraram tradição aqui em casa.' },
]

export const values = [
  { title: 'Fermentação natural', icon: FiAward, text: 'Tempo, técnica e levain para pães mais aromáticos, leves e cheios de textura.' },
  { title: 'Feito sob encomenda', icon: FiTruck, text: 'Produção artesanal planejada para cada pedido, sempre fresca e cuidadosa.' },
  { title: 'Sabor de casa', icon: FiHome, text: 'Receitas que resgatam memória afetiva e convidam a compartilhar a mesa.' },
  { title: 'Ingredientes de verdade', icon: FiStar, text: 'Farinhas especiais, sementes, ervas frescas e ingredientes selecionados.' },
]

export const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
