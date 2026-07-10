import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import Home from './pages/Home'
import Cardapio from './pages/Cardapio'
import Produto from './pages/Produto'
import Carrinho from './pages/Carrinho'
import Checkout from './pages/Checkout'
import Confirmacao from './pages/Confirmacao'
import PedidoFinalizado from './pages/PedidoFinalizado'
import Contato from './pages/Contato'
import Historia from './pages/Historia'
import Eventos from './pages/Eventos'
import { CartProvider } from './contexts/CartContext'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cardapio" element={<Cardapio />} />
            <Route path="/produto/:id" element={<Produto />} />
            <Route path="/carrinho" element={<Carrinho />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/confirmacao" element={<Confirmacao />} />
            <Route path="/pedido-finalizado" element={<PedidoFinalizado />} />
            <Route path="/obrigado" element={<PedidoFinalizado />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/historia" element={<Historia />} />
            <Route path="/eventos" element={<Eventos />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </CartProvider>
    </BrowserRouter>
  )
}

export default App
