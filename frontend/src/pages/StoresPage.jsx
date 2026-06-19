import { Link } from 'react-router-dom'

const storeImages = [
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=900&q=80'
]

export default function StoresPage({ stores, products, loading }) {
  function productCount(storeId) {
    return products.filter((product) => String(product.storeId) === String(storeId)).length
  }

  return (
    <main className="workspace">
      <section className="stores-hero">
        <div>
          <span className="eyebrow">Tenant marketplace</span>
          <h1>Browse every store running on Market Place.</h1>
          <p>Each vendor has isolated catalog data, operational controls, and storefront access inside one SaaS commerce system.</p>
        </div>
        <div className="stores-hero-panel">
          <strong>{stores.length}</strong>
          <span>active stores</span>
          <small>{products.length} live products across the marketplace</small>
        </div>
      </section>

      {loading ? <p className="muted">Loading stores...</p> : (
        <section className="all-store-grid">
          {stores.map((store, index) => {
            const id = store.id || store._id
            return (
              <article className="market-store-card" key={id}>
                <Link className="market-store-media" to={`/products?storeId=${id}`}>
                  <img src={storeImages[index % storeImages.length]} alt={store.name} />
                  <span>{store.status}</span>
                </Link>
                <div className="market-store-body">
                  <div className="store-title-row">
                    <span className="store-swatch" style={{ backgroundColor: store.brandColor }}></span>
                    <div>
                      <h3>{store.name}</h3>
                      <small>{store.slug}</small>
                    </div>
                  </div>
                  <div className="store-stats">
                    <span>{store.plan} plan</span>
                    <span>{store.currency}</span>
                    <span>{productCount(id)} products</span>
                  </div>
                  <Link className="primary wide" to={`/products?storeId=${id}`}>Open store</Link>
                </div>
              </article>
            )
          })}
        </section>
      )}
    </main>
  )
}
