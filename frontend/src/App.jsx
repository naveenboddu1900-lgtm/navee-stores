import { useCallback, useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider, useCart } from './context/CartContext'
import { api } from './utils/api'
import TopNav from './components/TopNav'
import Storefront from './pages/Storefront'
import CartPage from './pages/CartPage'
import AuthPanel from './pages/AuthPanel'
import VendorDashboard from './pages/VendorDashboard'
import AdminDashboard from './pages/AdminDashboard'
import ProductDetail from './pages/ProductDetail'
import OrdersPage from './pages/OrdersPage'
import StoresPage from './pages/StoresPage'
import PaymentsPage from './pages/PaymentsPage'
import HomePage from './pages/HomePage'
import SuccessPage from './pages/SuccessPage'
import WelcomePage from './pages/WelcomePage'

function RequireAuth({ roles, children }) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  if (roles?.length && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

function Shell() {
  const { user } = useAuth()
  const { reconcile } = useCart()
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
    refresh()
  }, [refresh])

  useEffect(() => {
    reconcile(products)
  }, [products, reconcile])

  return (
    <>
      <TopNav />
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/app" element={<RequireAuth><HomePage products={products} stores={stores} /></RequireAuth>} />
        <Route path="/products" element={<RequireAuth><Storefront products={products} stores={stores} summary={summary} loading={loading} /></RequireAuth>} />
        <Route path="/stores" element={<RequireAuth><StoresPage stores={stores} products={products} loading={loading} /></RequireAuth>} />
        <Route path="/products/:id" element={<RequireAuth><ProductDetail products={products} refresh={refresh} /></RequireAuth>} />
        <Route path="/cart" element={<RequireAuth><CartPage /></RequireAuth>} />
        <Route path="/checkout" element={<RequireAuth><CartPage checkoutMode /></RequireAuth>} />
        <Route path="/payments" element={<RequireAuth><PaymentsPage orders={orders} /></RequireAuth>} />
        <Route path="/login" element={<AuthPanel modeDefault="login" />} />
        <Route path="/register" element={<AuthPanel modeDefault="register" />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/orders" element={<RequireAuth><OrdersPage orders={orders} refresh={refresh} /></RequireAuth>} />
        <Route path="/vendor" element={<RequireAuth roles={['vendor', 'super_admin']}><VendorDashboard orders={orders} refresh={refresh} /></RequireAuth>} />
        <Route path="/admin" element={<RequireAuth roles={['super_admin']}><AdminDashboard summary={summary} users={users} /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Shell />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
