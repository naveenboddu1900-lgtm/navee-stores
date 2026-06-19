import { Link } from 'react-router-dom'

export default function WelcomePage() {
  return (
    <main className="welcome-page">
      <section className="welcome-hero">
        <div className="welcome-copy">
          <span className="eyebrow">Market Place</span>
          <h1>Welcome to your multi-store shopping platform.</h1>
          <p>Login to access products, stores, cart, checkout, order details, and role-based dashboards.</p>
          <div className="welcome-actions">
            <Link className="primary link-button" to="/login">Login</Link>
            <Link className="ghost link-button" to="/register">Register</Link>
          </div>
        </div>
        <img src="https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=1400&q=80" alt="Market Place shopping display" />
      </section>
    </main>
  )
}
