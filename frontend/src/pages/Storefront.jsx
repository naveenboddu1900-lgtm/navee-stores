import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'

export default function Storefront({ products, stores, loading }) {
  const [category, setCategory] = useState('All')
  const [searchParams] = useSearchParams()
  const selectedStoreId = searchParams.get('storeId')
  const selectedStore = stores.find((store) => String(store.id || store._id) === String(selectedStoreId))
  const storeProducts = useMemo(() => (
    selectedStoreId ? products.filter((product) => String(product.storeId) === String(selectedStoreId)) : products
  ), [products, selectedStoreId])
  const categories = [...new Set(storeProducts.map((product) => product.category))]
  const visibleProducts = useMemo(() => (
    category === 'All' ? storeProducts : storeProducts.filter((product) => product.category === category)
  ), [category, storeProducts])

  return (
    <main className="workspace">
      <section className="section-head focused-head">
        <div>
          <span className="eyebrow">{selectedStore ? selectedStore.name : 'Products'}</span>
          <h2>{selectedStore ? `Products from ${selectedStore.name}` : 'Shop products'}</h2>
          <p className="muted">
            {selectedStore ? `${visibleProducts.length} products in this store.` : `${products.length} products available.`}
          </p>
          {selectedStore && <Link className="ghost link-button" to="/products">View all products</Link>}
        </div>
        <div className="chips category-filter">
          {['All', ...categories].map((item) => (
            <button className={category === item ? 'active' : ''} key={item} onClick={() => setCategory(item)}>
              {item}
            </button>
          ))}
        </div>
      </section>

      {loading ? <p className="muted">Loading products...</p> : (
        <section className="product-grid">
          {visibleProducts.map((product) => <ProductCard key={product.id || product._id} product={{ ...product, id: product.id || product._id }} />)}
        </section>
      )}
    </main>
  )
}
