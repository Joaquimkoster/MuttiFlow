import {
  FiAward,
  FiBox,
  FiCoffee,
  FiHeart,
  FiHome,
  FiPackage,
  FiShoppingBag,
  FiStar,
  FiTruck,
} from 'react-icons/fi'

export const categories = [
  { id: 'todos', label: 'Todos', icon: FiShoppingBag },
  { id: 'massas', label: 'Massas', icon: FiCoffee },
  { id: 'combos', label: 'Combos', icon: FiPackage },
  { id: 'sobremesas', label: 'Sobremesas', icon: FiHeart },
  { id: 'bebidas', label: 'Bebidas', icon: FiBox },
]

export const products = [
  {
    id: 'lasanha-familia',
    name: 'Lasanha Família Mutti',
    category: 'massas',
    price: 89.9,
    oldPrice: 104.9,
    rating: 4.9,
    image:
      'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=1000&q=80',
    description:
      'Lasanha artesanal com molho de tomate lento, bechamel cremoso, queijo gratinado e massa fresca.',
    ingredients: ['Massa fresca', 'Molho pomodoro', 'Carne selecionada', 'Muçarela', 'Parmesão'],
    weight: '1,4 kg',
    serves: 'Serve 4 pessoas',
    featured: true,
    badge: 'Mais vendido',
  },
  {
    id: 'combo-domingo',
    name: 'Combo Domingo Italiano',
    category: 'combos',
    price: 149.9,
    rating: 4.8,
    image:
      'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1000&q=80',
    description:
      'Seleção completa com massa, antepasto, sobremesa e bebida para uma refeição especial.',
    ingredients: ['Ravioli', 'Focaccia', 'Tiramisù', 'Suco artesanal'],
    weight: '2,2 kg',
    serves: 'Serve 5 pessoas',
    featured: true,
    badge: 'Combo',
  },
  {
    id: 'ravioli-caprese',
    name: 'Ravioli Caprese',
    category: 'massas',
    price: 64.9,
    rating: 4.7,
    image:
      'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1000&q=80',
    description:
      'Ravioli recheado com queijo, tomate confit e manjericão fresco finalizado com azeite.',
    ingredients: ['Ravioli fresco', 'Tomate confit', 'Manjericão', 'Azeite', 'Queijo'],
    weight: '650 g',
    serves: 'Serve 2 pessoas',
    featured: true,
    badge: 'Novo',
  },
  {
    id: 'tiramisu',
    name: 'Tiramisù Clássico',
    category: 'sobremesas',
    price: 32.9,
    rating: 4.9,
    image:
      'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=1000&q=80',
    description:
      'Sobremesa italiana com mascarpone, café espresso, cacau e biscoito champagne.',
    ingredients: ['Mascarpone', 'Café', 'Cacau', 'Biscoito champagne'],
    weight: '220 g',
    serves: 'Serve 1 pessoa',
    featured: false,
    badge: 'Premium',
  },
  {
    id: 'focaccia',
    name: 'Focaccia da Casa',
    category: 'massas',
    price: 28.9,
    rating: 4.6,
    image:
      'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=1000&q=80',
    description:
      'Focaccia de fermentação lenta com alecrim, flor de sal e azeite extra virgem.',
    ingredients: ['Farinha italiana', 'Azeite', 'Alecrim', 'Flor de sal'],
    weight: '420 g',
    serves: 'Serve 3 pessoas',
    featured: false,
    badge: 'Artesanal',
  },
  {
    id: 'limonada',
    name: 'Limonada Siciliana',
    category: 'bebidas',
    price: 16.9,
    rating: 4.8,
    image:
      'https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=1000&q=80',
    description:
      'Limonada natural com limão siciliano, hortelã e leve toque de mel.',
    ingredients: ['Limão siciliano', 'Hortelã', 'Mel', 'Água com gás'],
    weight: '500 ml',
    serves: 'Serve 1 pessoa',
    featured: false,
    badge: 'Natural',
  },
]

export const cartItems = [
  { ...products[0], quantity: 1 },
  { ...products[2], quantity: 2 },
  { ...products[5], quantity: 1 },
]

export const reviews = [
  {
    name: 'Marina Lopes',
    role: 'Cliente recorrente',
    rating: 5,
    text: 'Pedido impecável, embalagem bonita e a lasanha chegou no ponto perfeito.',
  },
  {
    name: 'Rafael Nunes',
    role: 'Evento corporativo',
    rating: 5,
    text: 'A experiência parece de restaurante premium, mas com a praticidade do delivery.',
  },
  {
    name: 'Beatriz Melo',
    role: 'Almoço em família',
    rating: 5,
    text: 'Tudo organizado, fácil de pedir e com atendimento muito rápido pelo WhatsApp.',
  },
]

export const values = [
  { title: 'Qualidade artesanal', icon: FiAward, text: 'Receitas preparadas em pequenos lotes, com ingredientes selecionados.' },
  { title: 'Entrega cuidadosa', icon: FiTruck, text: 'Pedidos embalados para manter textura, temperatura e apresentação.' },
  { title: 'Comida com memória', icon: FiHome, text: 'Pratos pensados para reunir pessoas em volta da mesa.' },
  { title: 'Atendimento próximo', icon: FiStar, text: 'Comunicação clara antes, durante e depois de cada pedido.' },
]

export const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
