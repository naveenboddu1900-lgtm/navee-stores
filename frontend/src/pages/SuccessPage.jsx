import { Link, useSearchParams } from 'react-router-dom'
import { money } from '../utils/api'

const messages = {
  login: {
    title: 'Login successful',
    text: 'You are signed in and can now open your details, cart, or dashboard.',
    action: 'Open app',
    href: '/app'
  },
  register: {
    title: 'Account created',
    text: 'Your Market Place customer account is ready.',
    action: 'Open app',
    href: '/app'
  },
  checkout: {
    title: 'Order placed',
    text: 'Your order request was completed successfully.',
    action: 'View details',
    href: '/orders'
  },
  product: {
    title: 'Product saved',
    text: 'The vendor product request was completed successfully.',
    action: 'Back to vendor',
    href: '/vendor'
  },
  tenant: {
    title: 'Store created',
    text: 'The new store and vendor account were created successfully.',
    action: 'Back to admin',
    href: '/admin'
  },
  request: {
    title: 'Request successful',
    text: 'The request was completed successfully.',
    action: 'Go home',
    href: '/'
  }
}

export default function SuccessPage() {
  const [searchParams] = useSearchParams()
  const type = searchParams.get('type') || 'request'
  const paymentMethod = searchParams.get('paymentMethod')
  const amount = Number(searchParams.get('amount') || 0)
  const customerName = searchParams.get('name')
  const mobile = searchParams.get('mobile')
  const village = searchParams.get('village')
  const message = messages[type] || messages.request

  return (
    <main className="workspace success-page">
      <section className="success-panel">
        <span className="success-icon">✓</span>
        <span className="eyebrow">Successful request</span>
        <h1>{message.title}</h1>
        <p>{message.text}</p>
        {amount > 0 && <strong className="paid-amount">Amount paid: {money(amount)}</strong>}
        {paymentMethod && <small>Payment method: {paymentMethod.replace(/_/g, ' ')}</small>}
        {(customerName || mobile || village) && (
          <div className="success-details">
            {customerName && <div><span>Name</span><strong>{customerName}</strong></div>}
            {mobile && <div><span>Mobile number</span><strong>{mobile}</strong></div>}
            {village && <div><span>Village</span><strong>{village}</strong></div>}
          </div>
        )}
        <div className="success-actions">
          <Link className="primary link-button" to={message.href}>{message.action}</Link>
          <Link className="ghost link-button" to="/">Welcome page</Link>
        </div>
      </section>
    </main>
  )
}
