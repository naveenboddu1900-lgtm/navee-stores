import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: []
}

function productId(product) {
  return product.id || product._id
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const product = { ...action.payload, id: productId(action.payload) }
      const existing = state.items.find((item) => item.product.id === product.id)
      if (existing) {
        existing.quantity += 1
      } else {
        state.items.push({ product, quantity: 1 })
      }
    },
    updateQuantity(state, action) {
      const { productId: id, quantity } = action.payload
      const item = state.items.find((entry) => entry.product.id === id)
      if (item) item.quantity = Math.max(1, Number(quantity || 1))
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((item) => item.product.id !== action.payload)
    },
    clearCart(state) {
      state.items = []
    }
  }
})

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions
export default cartSlice.reducer

export function selectCartItems(state) {
  return state.cart.items
}

export function selectCartTotal(state) {
  return state.cart.items.reduce((sum, item) => sum + Number(item.product.price || 0) * item.quantity, 0)
}

export function selectCartCount(state) {
  return state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
}
