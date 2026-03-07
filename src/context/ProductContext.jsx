import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
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

  // Fetch from Supabase on mount
  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const { data: dbProducts, error: pError } = await supabase.from('products').select('*').order('created_at', { ascending: false })
        if (!pError && dbProducts) {
          setProducts(dbProducts)
        }
        
        const { data: dbOrders, error: oError } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
        if (!oError && dbOrders) {
          setOrders(dbOrders)
        } else if (!oError) {
          setOrders([]) // Clear demo orders if real table is empty
        }
      } catch (err) {
        console.error('Error fetching Supabase products:', err)
      }
    }
    fetchRealData()
  }, [])

  // ===== PRODUCT OPERATIONS =====
  const addProduct = async (product) => {
    const tempId = String(Date.now())
    const newProduct = {
      ...product,
      id: tempId,
      rating: 0,
      review_count: 0,
      created_at: new Date().toISOString()
    }
    // Optimistic UI update
    setProducts(prev => [newProduct, ...prev])

    // Save to database
    try {
      const { data, error } = await supabase.from('products').insert([product]).select().single()
      if (!error && data) {
        setProducts(prev => prev.map(p => p.id === tempId ? data : p)) // replace temp ID with real DB UUID
      }
    } catch (err) {
      console.error('Failed to add product to db:', err)
    }
    return newProduct
  }

  const updateProduct = async (id, updatedData) => {
    // Optimistic update
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p))
    
    try {
      if (!id.toString().includes(Date.now().toString().slice(0, 5))) { // Don't try saving temp IDs
        await supabase.from('products').update(updatedData).eq('id', id)
      }
    } catch (err) {
      console.error('Failed to update product in db:', err)
    }
  }

  const deleteProduct = async (id) => {
    // Optimistic update
    setProducts(prev => prev.filter(p => p.id !== id))
    
    try {
      await supabase.from('products').delete().eq('id', id)
    } catch (err) {
      console.error('Failed to delete product in db:', err)
    }
  }

  // ===== ORDER OPERATIONS =====
  const updateOrder = async (id, updatedData) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updatedData } : o))
    
    try {
      await supabase.from('orders').update(updatedData).eq('id', id)
    } catch (err) {
      console.error('Failed to update order in db:', err)
    }
  }

  const addOrder = async (order) => {
    const newOrder = {
      ...order,
      id: `ORD-${Date.now().toString().slice(-6)}`, // generate random ID
      created_at: new Date().toISOString()
    }
    setOrders(prev => [newOrder, ...prev])
    
    try {
      await supabase.from('orders').insert([newOrder])
    } catch (err) {
      console.error('Failed to save order to db:', err)
    }
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
