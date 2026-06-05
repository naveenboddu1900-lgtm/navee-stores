import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)
const CART_KEY = 'navee_cart'

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem(CART_KEY)
    return stored ? JSON.parse(stored) : []
  })

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  }, [items])

  function add(product) {
    const productId = product.id || product._id
    const normalizedProduct = { ...product, id: productId }

    setItems((current) => {
      const existing = current.find((item) => item.product.id === productId)
      if (existing) {
        return current.map((item) => item.product.id === productId ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...current, { product: normalizedProduct, quantity: 1 }]
    })
  }

  function update(productId, quantity) {
    setItems((current) => current
      .map((item) => item.product.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item)
      .filter((item) => item.quantity > 0))
  }

  function remove(productId) {
    setItems((current) => current.filter((item) => item.product.id !== productId))
  }

  function clear() {
    setItems([])
    localStorage.removeItem(CART_KEY)
  }

  const reconcile = useCallback((products) => {
    if (!Array.isArray(products) || products.length === 0) return
    setItems((current) => current
      .map((item) => {
        const product = products.find((entry) => String(entry.id || entry._id) === String(item.product.id))
        if (!product || product.status !== 'active') return null
        return { ...item, product: { ...product, id: product.id || product._id } }
      })
      .filter(Boolean))
  }, [])

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const shipping = items.length ? (subtotal > 150 ? 0 : 7) : 0
  const tax = Number((subtotal * 0.08).toFixed(2))
  const total = Number((subtotal + shipping + tax).toFixed(2))
  const count = items.reduce((sum, item) => sum + item.quantity, 0)
  const value = useMemo(() => ({ items, add, update, remove, clear, reconcile, subtotal, shipping, tax, total, count }), [items, reconcile, subtotal, shipping, tax, total, count])
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  return useContext(CartContext)
}
