import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const displayCards = [
  {
    title: 'Products',
    label: 'Browse catalog',
    href: '/products',
    image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1100&q=80',
    text: 'Open the product shopping interface.'
  },
  {
    title: 'Stores',
    label: 'Open tenants',
    href: '/stores',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1100&q=80',
    text: 'View all stores running on NAVEE Stores.'
  },
  {
    title: 'Cart',
    label: 'Checkout',
    href: '/cart',
    image: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=1100&q=80',
    text: 'Review cart, address, and payment methods.'
  },
  {
    title: 'Payments',
    label: 'Methods',
    href: '/payments',
    image: 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&w=1100&q=80',
    text: 'View payment methods and payment status.'
  },
  {
    title: 'Details',
    label: 'Orders',
    href: '/orders',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1100&q=80',
    text: 'Open order history and customer details.'
  }
]

export default function HomePage({ products, stores }) {
  const { items } = useCart()

  return (
    <main className="workspace app-display">
      <section className="display-hero">
        <div>
          <span className="eyebrow">App interface</span>
          <h1>NAVEE Stores</h1>
          <p>Choose one section from the display page. Each section opens separately, so the interface stays clean and focused.</p>
        </div>
        <div className="display-summary">
          <strong>{products.length}</strong>
          <span>Products</span>
          <strong>{stores.length}</strong>
          <span>Stores</span>
          <strong>{items.length}</strong>
          <span>Cart items</span>
        </div>
      </section>

      <section className="display-grid">
        {displayCards.map((card) => (
          <Link className="display-card" to={card.href} key={card.title}>
            <img src={card.image} alt={card.title} />
            <div>
              <span>{card.label}</span>
              <h2>{card.title}</h2>
              <p>{card.text}</p>
            </div>
          </Link>
        ))}
      </section>
    </main>
  )
}
