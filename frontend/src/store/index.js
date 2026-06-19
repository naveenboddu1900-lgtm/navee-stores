import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './cartSlice'

const CART_STORAGE_KEY = 'marketplace_cart'

function loadCartState() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    return raw ? { cart: JSON.parse(raw) } : undefined
  } catch {
    return undefined
  }
}

export const store = configureStore({
  reducer: {
    cart: cartReducer
  },
  preloadedState: loadCartState()
})

store.subscribe(() => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(store.getState().cart))
})
