const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
const SESSION_KEY = 'muttiflow_session_id'

function getSessionId() {
  const savedSession = localStorage.getItem(SESSION_KEY)

  if (savedSession) {
    return savedSession
  }

  const newSession = crypto.randomUUID()
  localStorage.setItem(SESSION_KEY, newSession)
  return newSession
}

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-session-id': getSessionId(),
      ...options.headers,
    },
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.erro ?? 'Erro ao sincronizar carrinho')
  }

  return data
}

export function getCart() {
  return request('/carrinho')
}

export function addCartItem(produtoId, quantidade = 1) {
  return request('/carrinho/itens', {
    method: 'POST',
    body: JSON.stringify({
      produto_id: produtoId,
      quantidade,
    }),
  })
}

export function updateCartItem(itemId, quantidade) {
  return request(`/carrinho/itens/${itemId}`, {
    method: 'PATCH',
    body: JSON.stringify({ quantidade }),
  })
}

export function removeCartItem(itemId) {
  return request(`/carrinho/itens/${itemId}`, {
    method: 'DELETE',
  })
}

export function clearCart() {
  return request('/carrinho', {
    method: 'DELETE',
  })
}

export function createOrder(deliveryData, couponCode) {
  return request('/pedidos', {
    method: 'POST',
    body: JSON.stringify({
      ...deliveryData,
      cupom: couponCode.trim().toUpperCase(),
    }),
  });
}