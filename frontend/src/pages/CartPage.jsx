import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { useCart } from '../context/useCart'
import { api, money } from '../utils/api'

const paymentMethods = [
  { id: 'card', label: 'Credit / debit card', detail: 'Visa, Mastercard, RuPay' },
  { id: 'upi', label: 'UPI', detail: 'Google Pay, PhonePe, Paytm' },
  { id: 'net_banking', label: 'Net banking', detail: 'Major banks supported' },
  { id: 'wallet', label: 'Wallet', detail: 'Fast prepaid wallet checkout' },
  { id: 'cod', label: 'Cash on delivery', detail: 'Pay when the order arrives' }
]

export default function CartPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { items, update, remove, clear, subtotal, shipping, tax, total } = useCart()
  const [address, setAddress] = useState({ fullName: 'Casey Customer', line1: '14 Market Street', city: 'Austin', country: 'USA', phone: '+1 555 0132' })
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [status, setStatus] = useState('')

  async function checkout() {
    if (!user) {
      navigate('/login')
      return
    }
    setStatus('Processing checkout...')
    try {
      await api('/checkout', {
        method: 'POST',
        body: {
          items: items.map((item) => ({ productId: item.product.id, quantity: item.quantity })),
          shippingAddress: address,
          paymentMethod
        }
      })
      clear()
      navigate(`/success?type=checkout&paymentMethod=${paymentMethod}`)
    } catch (error) {
      setStatus(error.message)
    }
  }

  return (
    <main className="workspace two-col">
      <section className="panel">
        <span className="eyebrow">Checkout</span>
        <h2>Cart</h2>
        {items.length === 0 ? <p className="muted">Your cart is empty.</p> : items.map((item) => (
          <div className="cart-row" key={item.product.id}>
            <img src={item.product.imageUrl} alt={item.product.title} />
            <div>
              <strong>{item.product.title}</strong>
              <span>{money(item.product.price)}</span>
            </div>
            <input type="number" min="1" value={item.quantity} onChange={(e) => update(item.product.id, Number(e.target.value))} />
            <button className="ghost" onClick={() => remove(item.product.id)}>Remove</button>
          </div>
        ))}
        <Link className="ghost link-button" to="/products">Continue shopping</Link>
      </section>
      <section className="panel form-panel">
        <span className="eyebrow">Secure order</span>
        <h2>{money(total)}</h2>
        <div className="order-summary">
          <div><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
          <div><span>Shipping</span><strong>{shipping === 0 ? 'Free' : money(shipping)}</strong></div>
          <div><span>Tax</span><strong>{money(tax)}</strong></div>
          <div className="summary-total"><span>Total</span><strong>{money(total)}</strong></div>
        </div>
        {Object.keys(address).map((key) => (
          <label key={key}>{key.replace(/([A-Z])/g, ' $1')}
            <input value={address[key]} onChange={(e) => setAddress({ ...address, [key]: e.target.value })} />
          </label>
        ))}
        <div className="payment-methods">
          <span className="eyebrow">Payment method</span>
          {paymentMethods.map((method) => (
            <label className={`payment-option ${paymentMethod === method.id ? 'selected' : ''}`} key={method.id}>
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={paymentMethod === method.id}
                onChange={(event) => setPaymentMethod(event.target.value)}
              />
              <span>
                <strong>{method.label}</strong>
                <small>{method.detail}</small>
              </span>
            </label>
          ))}
        </div>
        <button className="primary wide" disabled={!items.length} onClick={checkout}>Place order</button>
        {status && <p className="status">{status}</p>}
      </section>
    </main>
  )
}
