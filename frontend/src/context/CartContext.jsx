import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  addToCart,
  clearCart,
  removeFromCart,
  selectCartCount,
  selectCartItems,
  selectCartTotal,
  updateQuantity
} from '../store/cartSlice'

export function CartProvider({ children }) {
  return children
}

export function useCart() {
  const dispatch = useDispatch()
  const items = useSelector(selectCartItems)
  const total = useSelector(selectCartTotal)
  const count = useSelector(selectCartCount)

  return useMemo(() => ({
    items,
    total,
    count,
    add: (product) => dispatch(addToCart(product)),
    update: (productId, quantity) => dispatch(updateQuantity({ productId, quantity })),
    remove: (productId) => dispatch(removeFromCart(productId)),
    clear: () => dispatch(clearCart())
  }), [count, dispatch, items, total])
}
