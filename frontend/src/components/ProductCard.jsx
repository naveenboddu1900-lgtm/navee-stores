import { Link } from 'react-router-dom'
import { useState } from 'react'
import { money } from '../utils/api'
import { useCart } from '../context/useCart'

export default function ProductCard({ product }) {
  const { add } = useCart()
  const [added, setAdded] = useState(false)

  function addToCart() {
    add(product)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1200)
  }

  return (
    <article className="product-card">
      <Link className="product-image" to={`/products/${product.id || product._id}`}>
        <img src={product.imageUrl} alt={product.title} />
        <span>{product.stock > 30 ? 'In stock' : 'Limited'}</span>
      </Link>
      <div className="product-body">
        <div>
          <span className="eyebrow">{product.category}</span>
          <h3><Link to={`/products/${product.id || product._id}`}>{product.title}</Link></h3>
          <p>{product.description}</p>
        </div>
        <div className="product-footer">
          <div>
            <strong>{money(product.price)}</strong>
            <span>{product.stock} available</span>
          </div>
          <button className="primary" onClick={addToCart}>{added ? 'Added' : 'Add to cart'}</button>
        </div>
      </div>
    </article>
  )
}
