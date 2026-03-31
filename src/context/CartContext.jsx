import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext({})

export const useCart = () => useContext(CartContext)

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('makeToBeCart')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('makeToBeCart', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (product, quantity = 1, selectedSize = '', selectedColor = '') => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.id === product.id && item.selectedSize === selectedSize && item.selectedColor === selectedColor
      )
      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex].quantity += quantity
        toast.success('Cart updated!')
        return updated
      }
      toast.success('Added to cart!')
      return [...prev, { ...product, quantity, selectedSize, selectedColor }]
    })
  }

  const removeFromCart = (productId, selectedSize = '', selectedColor = '') => {
    setCartItems(prev =>
      prev.filter(item =>
        !(item.id === productId && item.selectedSize === selectedSize && item.selectedColor === selectedColor)
      )
    )
    toast.success('Removed from cart')
  }

  const updateQuantity = (productId, quantity, selectedSize = '', selectedColor = '') => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize, selectedColor)
      return
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId && item.selectedSize === selectedSize && item.selectedColor === selectedColor
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
    toast.success('Cart cleared')
  }

  const cartTotal = cartItems.reduce((total, item) => {
    const price = item.discount_price || item.price
    return total + price * item.quantity
  }, 0)

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0)

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}
