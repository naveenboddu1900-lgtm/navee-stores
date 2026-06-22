import { useEffect, useMemo, useState } from 'react'
import { api } from '../utils/api'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('redx_user')
    return stored ? JSON.parse(stored) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('redx_token'))

  useEffect(() => {
    if (!token) return
    api('/auth/me').then((result) => {
      setUser(result.user)
      localStorage.setItem('redx_user', JSON.stringify(result.user))
    }).catch(() => logout())
  }, [token])

  async function login(email, password) {
    const result = await api('/auth/login', { method: 'POST', body: { email, password } })
    setUser(result.user)
    setToken(result.token)
    localStorage.setItem('redx_user', JSON.stringify(result.user))
    localStorage.setItem('redx_token', result.token)
  }

  async function register(payload) {
    const result = await api('/auth/register', { method: 'POST', body: payload })
    setUser(result.user)
    setToken(result.token)
    localStorage.setItem('redx_user', JSON.stringify(result.user))
    localStorage.setItem('redx_token', result.token)
  }

  function logout() {
    setUser(null)
    setToken(null)
    localStorage.removeItem('redx_user')
    localStorage.removeItem('redx_token')
  }

  const value = useMemo(() => ({ user, token, login, register, logout }), [user, token])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
