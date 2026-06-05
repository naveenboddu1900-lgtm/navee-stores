import { useNavigate } from 'react-router-dom'
import { api, money } from '../utils/api'

export default function VendorDashboard({ orders, refresh }) {
  const navigate = useNavigate()

  async function updateOrder(orderId, fulfillmentStatus) {
    try {
      await api(`/vendor/orders/${orderId}`, { method: 'PATCH', body: { fulfillmentStatus } })
      refresh()
      navigate('/success?type=request')
    } catch (error) {}
  }

  return (
    <main className="workspace">
      <section className="panel">
        <span className="eyebrow">Vendor operations</span>
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
    </main>
  )
}
