import { Suspense, lazy, useCallback, useEffect, useState } from 'react'
import { BrowserRouter, HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { useAuth } from './context/useAuth'
import { api } from './utils/api'
import TopNav from './components/TopNav'
const Storefront = lazy(() => import('./pages/Storefront'))
const CartPage = lazy(() => import('./pages/CartPage'))
const AuthPanel = lazy(() => import('./pages/AuthPanel'))
const VendorDashboard = lazy(() => import('./pages/VendorDashboard'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const OrdersPage = lazy(() => import('./pages/OrdersPage'))
const StoresPage = lazy(() => import('./pages/StoresPage'))
const HomePage = lazy(() => import('./pages/HomePage'))
const SuccessPage = lazy(() => import('./pages/SuccessPage'))
const WelcomePage = lazy(() => import('./pages/WelcomePage'))

function RequireAuth({ roles, children }) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  if (roles?.length && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

function Shell() {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [stores, setStores] = useState([])
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const [productData, storeData] = await Promise.all([api('/products'), api('/stores')])
      setProducts(productData.products)
      setStores(storeData.stores)
      if (user) {
        const orderData = await api('/orders').catch(() => ({ orders: [] }))
        setOrders(orderData.orders)
      }
      if (user?.role === 'vendor' || user?.role === 'super_admin') {
        const summaryData = await api('/analytics/summary').catch(() => ({ summary: null }))
        setSummary(summaryData.summary)
      }
      if (user?.role === 'super_admin') {
        const userData = await api('/admin/users').catch(() => ({ users: [] }))
        setUsers(userData.users)
      }
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    const refreshId = window.setTimeout(() => {
      refresh()
    }, 0)

    return () => window.clearTimeout(refreshId)
  }, [refresh])

  return (
    <>
      <TopNav />
      <Suspense fallback={<main className="workspace"><section className="panel"><span className="eyebrow">Loading</span></section></main>}>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/app" element={<RequireAuth><HomePage products={products} stores={stores} /></RequireAuth>} />
          <Route path="/products" element={<RequireAuth><Storefront products={products} stores={stores} summary={summary} loading={loading} /></RequireAuth>} />
          <Route path="/stores" element={<RequireAuth><StoresPage stores={stores} products={products} loading={loading} /></RequireAuth>} />
          <Route path="/products/:id" element={<RequireAuth><ProductDetail products={products} refresh={refresh} /></RequireAuth>} />
          <Route path="/cart" element={<RequireAuth><CartPage /></RequireAuth>} />
          <Route path="/checkout" element={<RequireAuth><CartPage checkoutMode /></RequireAuth>} />
          <Route path="/login" element={<AuthPanel key="login" modeDefault="login" />} />
          <Route path="/register" element={<AuthPanel key="register" modeDefault="register" />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/orders" element={<RequireAuth><OrdersPage orders={orders} refresh={refresh} /></RequireAuth>} />
          <Route path="/vendor" element={<RequireAuth roles={['vendor', 'super_admin']}><VendorDashboard products={products} orders={orders} summary={summary} refresh={refresh} /></RequireAuth>} />
          <Route path="/admin" element={<RequireAuth roles={['super_admin']}><AdminDashboard summary={summary} users={users} stores={stores} /></RequireAuth>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <footer className="site-credit">Developed by Naveen Kumar Boddu</footer>
    </>
  )
}

export default function App() {
  const staticDemo = import.meta.env.VITE_STATIC_DEMO === 'true'
  const basename = staticDemo || import.meta.env.BASE_URL === '/' ? undefined : import.meta.env.BASE_URL.replace(/\/$/, '')
  const Router = staticDemo ? HashRouter : BrowserRouter

  return (
    <Router basename={basename}>
      <AuthProvider>
        <CartProvider>
          <Shell />
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}
