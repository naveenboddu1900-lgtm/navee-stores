import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AnalyticsCharts from '../components/AnalyticsCharts'
import MetricCard from '../components/MetricCard'
import { api, money } from '../utils/api'

export default function AdminDashboard({ summary, users, stores }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    ownerName: 'New Vendor',
    ownerEmail: 'new-vendor@redx.dev',
    storeName: 'New Tenant Store',
    slug: 'new-tenant-store',
    plan: 'starter',
    currency: 'USD'
  })
  const [status, setStatus] = useState('')

  async function createTenant(event) {
    event.preventDefault()
    setStatus('')
    try {
      await api('/admin/stores', { method: 'POST', body: form })
      navigate('/success?type=tenant')
    } catch (error) {
      setStatus(error.message)
    }
  }

  return (
    <main className="workspace">
      <section className="section-head">
        <div>
          <span className="eyebrow">Super admin</span>
          <h2>Platform integrity and oversight</h2>
        </div>
      </section>
      <section className="metrics">
        <MetricCard label="Revenue" value={money(summary?.revenue)} sub="All tenants" />
        <MetricCard label="AOV" value={money(summary?.averageOrderValue)} sub="Average order value" />
        <MetricCard label="Users" value={summary?.users || users.length} sub="RBAC accounts" />
        <MetricCard label="Tenants" value={stores.length} sub="Active stores" />
      </section>
      <AnalyticsCharts summary={summary} />
      <section className="two-col">
        <div className="panel">
          <span className="eyebrow">Tenants</span>
          <div className="table">
            {stores.map((store) => (
              <div className="table-row" key={store.id || store._id}>
                <strong>{store.name}</strong>
                <span>{store.plan}</span>
                <span>{store.status}</span>
                <span>{store.currency}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <span className="eyebrow">Users</span>
          <div className="table">
            {users.map((user) => (
              <div className="table-row" key={user.id || user._id}>
                <strong>{user.name}</strong>
                <span>{user.email}</span>
                <span>{user.role}</span>
                <span>{user.status}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="panel form-panel admin-create">
        <span className="eyebrow">Tenant onboarding</span>
        <h2>Create vendor store</h2>
        <form className="tenant-form" onSubmit={createTenant}>
          {Object.keys(form).map((key) => (
            <label key={key}>{key.replace(/([A-Z])/g, ' $1')}
              <input value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} />
            </label>
          ))}
          <button className="primary" type="submit">Create tenant</button>
        </form>
        {status && <p className="status">{status}</p>}
      </section>
    </main>
  )
}
