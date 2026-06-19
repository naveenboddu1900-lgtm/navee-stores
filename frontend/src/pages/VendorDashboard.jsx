import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AnalyticsCharts from '../components/AnalyticsCharts'
import MetricCard from '../components/MetricCard'
import { api, money } from '../utils/api'

export default function VendorDashboard({ products, orders, summary, refresh }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: 'New Vendor Product',
    description: 'A production-ready item created from the Market Place vendor dashboard.',
    category: 'New',
    price: 49,
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
    status: 'active'
  })
  const [status, setStatus] = useState('')

  async function createProduct(event) {
    event.preventDefault()
    setStatus('')
    try {
      await api('/vendor/products', { method: 'POST', body: form })
      refresh()
      navigate('/success?type=product')
    } catch (error) {
      setStatus(error.message)
    }
  }

  async function archiveProduct(productId) {
    setStatus('')
    try {
      await api(`/vendor/products/${productId}`, { method: 'DELETE' })
      refresh()
      navigate('/success?type=product')
    } catch (error) {
      setStatus(error.message)
    }
  }

  async function updateOrder(orderId, fulfillmentStatus) {
    setStatus('')
    try {
      await api(`/vendor/orders/${orderId}`, { method: 'PATCH', body: { fulfillmentStatus } })
      refresh()
      navigate('/success?type=request')
    } catch (error) {
      setStatus(error.message)
    }
  }

  return (
    <main className="workspace">
      <section className="section-head">
        <div>
          <span className="eyebrow">Vendor operations</span>
          <h2>Inventory, orders, and revenue</h2>
        </div>
      </section>
      <section className="metrics">
        <MetricCard label="Revenue" value={money(summary?.revenue)} sub="Paid orders" />
        <MetricCard label="Orders" value={summary?.orders || orders.length} sub="Total volume" />
        <MetricCard label="Products" value={products.length} sub="Catalog items" />
        <MetricCard label="AOV" value={money(summary?.averageOrderValue)} sub="Average order" />
      </section>
      <AnalyticsCharts summary={summary} />
      <section className="two-col">
      <section className="panel">
        <span className="eyebrow">Vendor operations</span>
        <h2>Inventory</h2>
        <div className="table">
          {products.map((product) => (
            <div className="table-row" key={product.id || product._id}>
              <strong>{product.title}</strong>
              <span>{product.category}</span>
              <span>{money(product.price)}</span>
              <button className="ghost" onClick={() => archiveProduct(product.id || product._id)}>Archive</button>
            </div>
          ))}
        </div>
        <h2>Orders</h2>
        <div className="table">
          {orders.map((order) => (
            <div className="table-row" key={order.id || order._id}>
              <strong>{money(order.total)}</strong>
              <span>{order.paymentStatus}</span>
              <span>{order.fulfillmentStatus}</span>
              <button className="ghost" onClick={() => updateOrder(order.id || order._id, 'shipped')}>Ship</button>
            </div>
          ))}
        </div>
      </section>
      <form className="panel form-panel" onSubmit={createProduct}>
        <span className="eyebrow">Create product</span>
        {['title', 'description', 'category', 'price', 'stock', 'imageUrl'].map((key) => (
          <label key={key}>{key}
            <input value={form[key]} type={['price', 'stock'].includes(key) ? 'number' : 'text'} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
          </label>
        ))}
        <button className="primary wide" type="submit">Save product</button>
        {status && <p className="status">{status}</p>}
      </form>
      </section>
    </main>
  )
}
