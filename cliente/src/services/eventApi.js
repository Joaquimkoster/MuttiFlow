const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export async function createEvent(eventData) {
  let response

  try {
    response = await fetch(`${API_URL}/eventos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    })
  } catch {
    throw new Error('Não foi possível conectar ao servidor. Tente novamente em instantes.')
  }
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.erro ?? 'Não foi possível enviar a solicitação')
  }

  return data
}
