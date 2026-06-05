import { Link } from 'react-router-dom'
import { money } from '../utils/api'

const paymentMethods = [
  { id: 'card', label: 'Credit / Debit Card', detail: 'Visa, Mastercard, RuPay, and standard card checkout.' },
  { id: 'upi', label: 'UPI', detail: 'Google Pay, PhonePe, Paytm, and UPI ID payments.' },
  { id: 'net_banking', label: 'Net Banking', detail: 'Pay directly from supported bank accounts.' },
  { id: 'wallet', label: 'Wallet', detail: 'Fast prepaid wallet checkout for repeat orders.' },
  { id: 'cod', label: 'Cash on Delivery', detail: 'Pay after the order arrives.' }
]

export default function PaymentsPage({ orders }) {
  const paidOrders = orders.filter((order) => order.paymentStatus === 'paid')
  const pendingOrders = orders.filter((order) => order.paymentStatus === 'pending')
  const paidTotal = paidOrders.reduce((sum, order) => sum + Number(order.total || 0), 0)
  const recentPayments = orders.slice(0, 6)

  return (
    <main className="workspace">
      <section className="section-head">
        <div>
          <span className="eyebrow">Payments</span>
          <h2>Payment methods and status</h2>
        </div>
        <Link className="primary link-button" to="/cart">Open cart</Link>
      </section>

      <section className="metrics">
        <article className="metric-card">
          <span>Total paid</span>
          <strong>{money(paidTotal)}</strong>
          <small>Completed payments</small>
        </article>
        <article className="metric-card">
          <span>Paid orders</span>
          <strong>{paidOrders.length}</strong>
          <small>Payment received</small>
        </article>
        <article className="metric-card">
          <span>Pending</span>
          <strong>{pendingOrders.length}</strong>
          <small>COD or unpaid orders</small>
        </article>
        <article className="metric-card">
          <span>Methods</span>
          <strong>{paymentMethods.length}</strong>
          <small>Available at checkout</small>
        </article>
      </section>

      <section className="analytics-grid">
        {paymentMethods.map((method) => (
          <article className="panel" key={method.id}>
            <span className="eyebrow">{method.id.replace('_', ' ')}</span>
            <h2>{method.label}</h2>
            <p className="muted">{method.detail}</p>
          </article>
        ))}
      </section>

      <section className="panel">
        <span className="eyebrow">Recent payments</span>
        {recentPayments.length === 0 ? <p className="muted">No payments yet.</p> : (
          <div className="table">
            {recentPayments.map((order) => (
              <div className="table-row" key={order.id || order._id}>
                <strong>{money(order.total)}</strong>
                <span>{(order.paymentMethod || 'card').replace('_', ' ')}</span>
                <span>{order.paymentStatus}</span>
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
