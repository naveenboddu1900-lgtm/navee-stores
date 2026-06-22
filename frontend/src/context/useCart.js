import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  addToCart,
  clearCart,
  removeFromCart,
  selectCartCount,
  selectCartItems,
  selectCartShipping,
  selectCartSubtotal,
  selectCartTax,
  selectCartTotal,
  updateQuantity
} from '../store/cartSlice'

export function useCart() {
  const dispatch = useDispatch()
  const items = useSelector(selectCartItems)
  const subtotal = useSelector(selectCartSubtotal)
  const shipping = useSelector(selectCartShipping)
  const tax = useSelector(selectCartTax)
  const total = useSelector(selectCartTotal)
  const count = useSelector(selectCartCount)

  return useMemo(() => ({
    items,
    subtotal,
    shipping,
    tax,
    total,
    count,
    add: (product) => dispatch(addToCart(product)),
    update: (productId, quantity) => dispatch(updateQuantity({ productId, quantity })),
    remove: (productId) => dispatch(removeFromCart(productId)),
    clear: () => dispatch(clearCart())
  }), [count, dispatch, items, shipping, subtotal, tax, total])
}
