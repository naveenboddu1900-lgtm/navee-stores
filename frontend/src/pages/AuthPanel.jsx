import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

const demos = [
  ['Super Admin', 'admin@redx.dev'],
  ['Vendor', 'vendor@redx.dev'],
  ['Customer', 'customer@redx.dev'],
]

export default function AuthPanel({ modeDefault = 'login' }) {
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState(modeDefault)
  const [form, setForm] = useState({ name: '', email: 'customer@redx.dev', password: 'Password123!' })
  const [error, setError] = useState('')

  async function submit(event) {
    event.preventDefault()
    setError('')
    try {
      if (mode === 'login') {
        await login(form.email, form.password)
        navigate('/success?type=login')
      } else {
        await register(form)
        navigate('/success?type=register')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="auth-grid">
      <div className="auth-copy">
        <span className="eyebrow">Secure access</span>
        <h1>Tenant-aware commerce control for every role.</h1>
        <p>Use the demo accounts to move between customer checkout, vendor inventory, and platform administration.</p>
        <div className="demo-list">
          {demos.map(([label, email]) => (
            <button key={email} onClick={() => setForm({ ...form, email, password: 'Password123!' })}>
              <strong>{label}</strong>
              <span>{email}</span>
            </button>
          ))}
        </div>
      </div>
      <form className="panel form-panel" onSubmit={submit}>
        <div className="segmented">
          <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Login</button>
          <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>Register</button>
        </div>
        {mode === 'register' && (
          <label>Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        )}
        <label>Email<input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label>Password<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
        {error && <p className="error">{error}</p>}
        <button className="primary wide" type="submit">{mode === 'login' ? 'Sign in' : 'Create account'}</button>
        <p className="muted">{mode === 'login' ? 'Need an account?' : 'Already have an account?'} <Link to={mode === 'login' ? '/register' : '/login'}>{mode === 'login' ? 'Register' : 'Login'}</Link></p>
      </form>
    </section>
  )
}
