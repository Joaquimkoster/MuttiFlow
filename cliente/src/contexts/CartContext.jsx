import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  addCartItem,
  clearCart,
  createOrder,
  getCart,
  removeCartItem,
  updateCartItem,
} from '../services/cartApi'
import { CartContext } from './cartContext'

function normalizeItems(cart) {
  return (cart?.itens ?? []).map((item) => ({
    id: item.id,
    productId: item.produto_id,
    name: item.name,
    image: item.image,
    serves: item.serves ?? 'Produto MuttiFlow',
    price: Number(item.price),
    quantity: Number(item.quantidade),
  }))
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [couponCode, setCouponCode] = useState('')
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [couponMessage, setCouponMessage] = useState('')
  const [deliveryData, setDeliveryData] = useState({
    nome: '',
    whatsapp: '',
    email: '',
    pagamento: 'Pix',
    endereco: '',
    complemento: '',
    cidade: '',
    bairro: '',
    dataEntrega: '',
    horario: '',
    observacoes: '',
  })

  const items = useMemo(() => normalizeItems(cart), [cart])
  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]

  )

  const loadCart = useCallback(async () => {
    try {
      setError('')
      const data = await getCart()
      setCart(data)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCart().catch(() => { })
  }, [loadCart])

  async function addItem(produtoId, quantity = 1) {
    const data = await addCartItem(produtoId, quantity)
    setCart(data)
    return data
  }

  async function updateItem(itemId, quantity) {
    const data = await updateCartItem(itemId, quantity)
    setCart(data)
    return data
  }

  async function removeItem(itemId) {
    const data = await removeCartItem(itemId)
    setCart(data)
    return data
  }

  async function emptyCart() {
    await clearCart()
    setCouponCode('')
    setCouponDiscount(0)
    setCouponMessage('')
    await loadCart()
  }

  async function submitOrder() {
  try {
    setError('');

    const order = await createOrder(
      deliveryData,
      couponCode
    );

    setCart(null);
    return order;
  } catch (err) {
    setError(err.message);
    throw err;
  }
}

  function applyCoupon() {
    if (couponCode.trim().toUpperCase() === 'MUTTI15') {
      setCouponDiscount(10)
      setCouponMessage('Cupom aplicado com sucesso')
      return
    }

    setCouponDiscount(0)
    setCouponMessage('Cupom inválido')
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        couponCode,
        couponDiscount,
        couponMessage,
        error,
        isLoading,
        itemCount,
        items,
        addItem,
        applyCoupon,
        emptyCart,
        loadCart,
        removeItem,
        setCouponCode,
        setError,
        submitOrder,
        updateItem,
        deliveryData,
        setDeliveryData,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
