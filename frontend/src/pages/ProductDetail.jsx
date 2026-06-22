import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCart } from '../context/useCart'
import { api, money } from '../utils/api'

export default function ProductDetail({ products }) {
  const { id } = useParams()
  const { add } = useCart()
  const [product, setProduct] = useState(() => products.find((item) => (item.id || item._id) === id))
  const [error, setError] = useState('')

  useEffect(() => {
    if (product) return
    api(`/products/${id}`)
      .then((result) => setProduct({ ...result.product, id: result.product.id || result.product._id }))
      .catch((err) => setError(err.message))
  }, [id, product])

  if (error) {
    return (
      <main className="workspace panel">
        <h2>Product unavailable</h2>
        <p className="error">{error}</p>
        <Link className="primary link-button" to="/products">Back to products</Link>
      </main>
    )
  }

  if (!product) return <main className="workspace"><p className="muted">Loading product...</p></main>

  const highlights = product.highlights?.length ? product.highlights : [
    'Quality checked before dispatch',
    'Secure NAVEE checkout supported',
    'Packed by verified vendor'
  ]
  const specifications = product.specifications || {
    material: 'Premium everyday materials',
    color: 'Assorted',
    weight: 'Standard package',
    origin: 'NAVEE verified vendor'
  }
  const shipping = product.shipping || {
    delivery: '3-6 business days',
    fee: 'Standard delivery',
    returnPolicy: '7-day return available'
  }

  return (
    <main className="workspace product-detail">
      <div className="detail-media">
        <img src={product.imageUrl} alt={product.title} />
      </div>
      <section className="panel detail-panel">
        <span className="eyebrow">{product.category}</span>
        <h1>{product.title}</h1>
        <div className="rating-row">
          <strong>{product.rating || 4.4} ★</strong>
          <span>{product.reviewCount || 28} reviews</span>
          <span>{product.brand || 'NAVEE vendor'}</span>
        </div>
        <p>{product.description}</p>
        <div className="detail-facts">
          <span>{money(product.price)}</span>
          <span>{product.stock} units available</span>
          <span>{product.status}</span>
          <span>SKU {product.sku || `NV-${String(product.id || product._id).slice(-6)}`}</span>
        </div>
        <div className="detail-section">
          <h2>Highlights</h2>
          <ul>
            {highlights.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <div className="detail-section detail-grid">
          <div>
            <h2>Specifications</h2>
            <dl>
              {Object.entries(specifications).map(([key, value]) => (
                <div key={key}>
                  <dt>{key}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h2>Delivery</h2>
            <dl>
              {Object.entries(shipping).map(([key, value]) => (
                <div key={key}>
                  <dt>{key}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
              <div>
                <dt>warranty</dt>
                <dd>{product.warranty || '6-month seller warranty'}</dd>
              </div>
            </dl>
          </div>
        </div>
        <button className="primary wide" onClick={() => add({ ...product, id: product.id || product._id })}>Add to cart</button>
        <Link className="ghost link-button" to="/cart">Go to cart</Link>
      </section>
    </main>
  )
}
