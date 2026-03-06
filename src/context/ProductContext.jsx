import { createContext, useContext, useState } from 'react'
import { demoProducts, demoCategories, demoOrders, demoReviews, demoPromotions } from '../data/demoData'

const ProductContext = createContext()

export function useProducts() {
  return useContext(ProductContext)
}

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(demoProducts)
  const [categories] = useState(demoCategories)
  const [orders, setOrders] = useState(demoOrders)
  const [reviews, setReviews] = useState(demoReviews)
  const [promotions, setPromotions] = useState(demoPromotions)

  // ===== PRODUCT OPERATIONS =====
  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: String(Date.now()),
      rating: 0,
      review_count: 0,
      created_at: new Date().toISOString().slice(0, 10)
    }
    setProducts(prev => [newProduct, ...prev])
    return newProduct
  }

  const updateProduct = (id, updatedData) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p))
  }

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  // ===== ORDER OPERATIONS =====
  const updateOrder = (id, updatedData) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updatedData } : o))
  }

  const addOrder = (order) => {
    const newOrder = {
      ...order,
      id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
      created_at: new Date().toISOString().slice(0, 10)
    }
    setOrders(prev => [newOrder, ...prev])
    return newOrder
  }

  // ===== REVIEW OPERATIONS =====
  const addReview = (review) => {
    const newReview = {
      ...review,
      id: String(Date.now()),
      created_at: new Date().toISOString().slice(0, 10)
    }
    setReviews(prev => [newReview, ...prev])
    // Update product rating
    const productReviews = [...reviews.filter(r => r.product_id === review.product_id), newReview]
    const avgRating = productReviews.reduce((s, r) => s + r.rating, 0) / productReviews.length
    updateProduct(review.product_id, {
      rating: Math.round(avgRating * 10) / 10,
      review_count: productReviews.length
    })
    return newReview
  }

  const replyToReview = (reviewId, reply) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, admin_reply: reply } : r))
  }

  // ===== PROMOTION OPERATIONS =====
  const addPromotion = (promo) => {
    const newPromo = { ...promo, id: String(Date.now()) }
    setPromotions(prev => [newPromo, ...prev])
    return newPromo
  }

  const updatePromotion = (id, data) => {
    setPromotions(prev => prev.map(p => p.id === id ? { ...p, ...data } : p))
  }

  const deletePromotion = (id) => {
    setPromotions(prev => prev.filter(p => p.id !== id))
  }

  // ===== DERIVED DATA =====
  const featuredProducts = products.filter(p => p.featured)
  const discountedProducts = products.filter(p => p.discount_price)

  const getCategoryProducts = (category) => {
    if (!category || category === 'all') return products
    return products.filter(p => p.category === category)
  }

  const getProductById = (id) => products.find(p => p.id === id)

  const getProductReviews = (productId) => reviews.filter(r => r.product_id === productId)

  const value = {
    products,
    categories,
    orders,
    reviews,
    promotions,
    featuredProducts,
    discountedProducts,
    // Product ops
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getCategoryProducts,
    // Order ops
    orders,
    updateOrder,
    addOrder,
    // Review ops
    addReview,
    replyToReview,
    getProductReviews,
    // Promotion ops
    addPromotion,
    updatePromotion,
    deletePromotion
  }

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  )
}
