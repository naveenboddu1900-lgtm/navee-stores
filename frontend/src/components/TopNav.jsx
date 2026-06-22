import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { useCart } from '../context/useCart'
import BrandLogo from './BrandLogo'

export default function TopNav() {
  const { user, logout } = useAuth()
  const { count } = useCart()

  return (
    <header className="top-nav">
      <Link className="brand" to="/" aria-label="Market Place .in home">
        <BrandLogo />
        <span>
          <strong>Market Place .in</strong>
          <small>multi-vendor commerce India</small>
        </span>
      </Link>
      <nav>
        {user ? (
          <>
            <span className="nav-section">Shop</span>
            <NavLink to="/app">App</NavLink>
            <NavLink to="/products">Products</NavLink>
            <NavLink to="/stores">Stores</NavLink>
            <NavLink to="/cart">Cart ({count})</NavLink>
            <NavLink to="/orders">Details</NavLink>
          </>
        ) : (
          <>
            <span className="nav-section">Account</span>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
        {(user?.role === 'vendor' || user?.role === 'super_admin') && <span className="nav-section">Manage</span>}
        {(user?.role === 'vendor' || user?.role === 'super_admin') && <NavLink to="/vendor">Vendor</NavLink>}
        {user?.role === 'super_admin' && <NavLink to="/admin">Admin</NavLink>}
      </nav>
      <div className="identity">
        {user ? (
          <>
            <span>{user.name}</span>
            <button className="ghost" onClick={logout}>Logout</button>
          </>
        ) : (
          <Link className="primary link-button" to="/login">Sign in</Link>
        )}
      </div>
    </header>
  )
}
