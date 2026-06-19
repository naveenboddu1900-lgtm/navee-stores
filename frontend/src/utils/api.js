const API_URL = import.meta.env.VITE_API_URL || '/api'
const REQUEST_TIMEOUT_MS = 15000

function getToken() {
  return localStorage.getItem('redx_token')
}

export async function api(path, options = {}) {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), options.timeout || REQUEST_TIMEOUT_MS)
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
      body: options.body ? JSON.stringify(options.body) : undefined,
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(data.message || 'Request failed')
    return data
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('Request timed out')
    throw error
  } finally {
    window.clearTimeout(timeout)
  }
}

export function money(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0)
}
