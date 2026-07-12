const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export async function createEvent(eventData) {
  const response = await fetch(`${API_URL}/eventos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventData),
  })
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.erro ?? 'Não foi possível enviar a solicitação')
  }

  return data
}
