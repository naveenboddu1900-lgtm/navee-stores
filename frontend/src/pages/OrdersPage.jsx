import { Link } from 'react-router-dom'
import { money } from '../utils/api'

export default function OrdersPage({ orders }) {
  return (
    <main className="workspace">
      <section className="section-head">
        <div>
          <span className="eyebrow">Customer orders</span>
          <h2>Order history</h2>
        </div>
        <Link className="primary link-button" to="/products">Shop products</Link>
      </section>
      <section className="panel">
        {orders.length === 0 ? <p className="muted">No orders yet.</p> : (
          <div className="table">
            {orders.map((order) => (
              <div className="table-row" key={order.id || order._id}>
                <strong>{money(order.total)}</strong>
                <span>{order.paymentStatus}</span>
                <span>{order.fulfillmentStatus}</span>
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
