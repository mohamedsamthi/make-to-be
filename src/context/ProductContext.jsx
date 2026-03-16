import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { demoCategories } from '../data/demoData'

const ProductContext = createContext()

export function useProducts() {
  return useContext(ProductContext)
}

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([])
  const [categories] = useState(demoCategories)
  const [orders, setOrders] = useState([])
  const [reviews, setReviews] = useState([])
  const [promotions, setPromotions] = useState([])
  const [profiles, setProfiles] = useState([])

  // Fetch from Supabase on mount + set up realtime
  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const { data: dbProducts } = await supabase.from('products').select('*').order('created_at', { ascending: false })
        if (dbProducts) setProducts(dbProducts)
        
        const { data: dbOrders } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
        if (dbOrders) setOrders(dbOrders)

        const { data: dbPromotions } = await supabase.from('promotions').select('*').order('created_at', { ascending: false })
        if (dbPromotions) setPromotions(dbPromotions)

        const { data: dbReviews } = await supabase.from('reviews').select('*').order('created_at', { ascending: false })
        if (dbReviews) setReviews(dbReviews)

        const { data: dbProfiles } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
        if (dbProfiles) setProfiles(dbProfiles)
      } catch (err) {
        console.error('Error fetching Supabase data:', err)
      }
    }
    fetchRealData()
    
    // ===== AUTO-REFRESH (Guaranteed sync) =====
    // Polling removed to prevent Supabase Auth Lock AbortErrors.
    // Realtime subscriptions handle synchronization instead.

    // ===== REALTIME SUBSCRIPTIONS (Instant sync if enabled) =====
    const productsChannel = supabase
      .channel('realtime-products')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setProducts(prev => {
            if (prev.find(p => p.id === payload.new.id)) return prev
            return [payload.new, ...prev]
          })
        } else if (payload.eventType === 'UPDATE') {
          setProducts(prev => prev.map(p => p.id === payload.new.id ? { ...p, ...payload.new } : p))
        } else if (payload.eventType === 'DELETE') {
          setProducts(prev => prev.filter(p => p.id !== payload.old.id))
        }
      })
      .subscribe()

    const ordersChannel = supabase
      .channel('realtime-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setOrders(prev => {
            if (prev.find(o => o.id === payload.new.id)) return prev
            return [payload.new, ...prev]
          })
        } else if (payload.eventType === 'UPDATE') {
          setOrders(prev => prev.map(o => o.id === payload.new.id ? { ...o, ...payload.new } : o))
        } else if (payload.eventType === 'DELETE') {
          setOrders(prev => prev.filter(o => o.id !== payload.old.id))
        }
      })
      .subscribe()

    const promoChannel = supabase
      .channel('realtime-promotions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'promotions' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setPromotions(prev => {
            if (prev.find(p => p.id === payload.new.id)) return prev
            return [payload.new, ...prev]
          })
        } else if (payload.eventType === 'UPDATE') {
          setPromotions(prev => prev.map(p => p.id === payload.new.id ? { ...p, ...payload.new } : p))
        } else if (payload.eventType === 'DELETE') {
          setPromotions(prev => prev.filter(p => p.id !== payload.old.id))
        }
      })
      .subscribe()

    const reviewsChannel = supabase
      .channel('realtime-reviews')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setReviews(prev => {
            if (prev.find(r => r.id === payload.new.id)) return prev
            return [payload.new, ...prev]
          })
        } else if (payload.eventType === 'UPDATE') {
          setReviews(prev => prev.map(r => r.id === payload.new.id ? { ...r, ...payload.new } : r))
        } else if (payload.eventType === 'DELETE') {
          setReviews(prev => prev.filter(r => r.id !== payload.old.id))
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(productsChannel)
      supabase.removeChannel(ordersChannel)
      supabase.removeChannel(promoChannel)
      supabase.removeChannel(reviewsChannel)
    }
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
    setProducts(prev => [newProduct, ...prev])

    let retryCount = 0;
    while (retryCount < 2) {
      try {
        const { data, error } = await supabase.from('products').insert([product]).select().single()
        if (error) throw error
        if (data) {
          setProducts(prev => {
            // If realtime already added it, or we just need to update tempId
            const exists = prev.find(p => p.id === tempId || p.id === data.id)
            if (exists) {
              return prev.map(p => (p.id === tempId || p.id === data.id) ? data : p)
            }
            return [data, ...prev.filter(p => p.id !== tempId)]
          })
        }
        return newProduct // Success
      } catch (err) {
        if (err.message && err.message.includes('Lock broken') && retryCount < 1) {
          retryCount++;
          await new Promise(res => setTimeout(res, 500)); // wait and retry
          continue;
        }
        console.error('Failed to add product to db:', err)
        setProducts(prev => prev.filter(p => p.id !== tempId))
        alert(`Storage Error: ${err.message || JSON.stringify(err)}`)
        break;
      }
    }
    return newProduct
  }

  const updateProduct = async (id, updatedData) => {
    const previousProducts = [...products]
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p))
    
    try {
      const { error } = await supabase.from('products').update(updatedData).eq('id', id)
      if (error) throw error
    } catch (err) {
      console.error('Failed to update product in db:', err)
      setProducts(previousProducts)
    }
  }

  const deleteProduct = async (id) => {
    const previousProducts = [...products]
    setProducts(prev => prev.filter(p => p.id !== id))
    
    try {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) throw error
    } catch (err) {
      console.error('Failed to delete product in db:', err)
      setProducts(previousProducts)
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
      id: `ORD-${Date.now().toString().slice(-6)}`,
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

  const deleteOrder = async (id) => {
    setOrders(prev => prev.filter(o => o.id !== id))
    try {
      await supabase.from('orders').delete().eq('id', id)
    } catch (err) {
      console.error('Failed to delete order from db:', err)
    }
  }

  // ===== REVIEW OPERATIONS =====
  const addReview = async (review) => {
    const tempId = String(Date.now())
    const newReview = {
      ...review,
      id: tempId,
      created_at: new Date().toISOString()
    }
    setReviews(prev => [newReview, ...prev])
    
    const productReviews = [...reviews.filter(r => r.product_id === review.product_id), newReview]
    const avgRating = productReviews.reduce((s, r) => s + r.rating, 0) / productReviews.length
    updateProduct(review.product_id, {
      rating: Math.round(avgRating * 10) / 10,
      review_count: productReviews.length
    })

    try {
      const { data, error } = await supabase.from('reviews').insert([{
         product_id: review.product_id,
         user_name: review.user_name,
         rating: review.rating,
         comment: review.comment
      }]).select().single()
      if (data) {
        setReviews(prev => prev.map(r => r.id === tempId ? data : r))
      }
    } catch (e) { console.error('Failed to add review to db:', e) }

    return newReview
  }

  const replyToReview = async (reviewId, reply) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, admin_reply: reply } : r))
    try {
      await supabase.from('reviews').update({ admin_reply: reply }).eq('id', reviewId)
    } catch(e) {}
  }

  // ===== PROMOTION OPERATIONS =====
  const addPromotion = async (promo) => {
    const tempId = String(Date.now())
    const newPromo = { ...promo, id: tempId, created_at: new Date().toISOString() }
    setPromotions(prev => [newPromo, ...prev])
    try {
      const { data } = await supabase.from('promotions').insert([promo]).select().single()
      if (data) setPromotions(prev => prev.map(p => p.id === tempId ? data : p))
    } catch(e) {}
    return newPromo
  }

  const updatePromotion = async (id, updatedData) => {
    setPromotions(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p))
    try {
      await supabase.from('promotions').update(updatedData).eq('id', id)
    } catch(e) {}
  }

  const deletePromotion = async (id) => {
    setPromotions(prev => prev.filter(p => p.id !== id))
    try {
      await supabase.from('promotions').delete().eq('id', id)
    } catch(e) {}
  }

  // ===== PROFILE OPERATIONS =====
  const updateProfile = async (id, updatedData) => {
    setProfiles(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p))
    try {
      const { error } = await supabase.from('profiles').update(updatedData).eq('id', id)
      if (error) throw error
    } catch (err) {
      console.error('Failed to update profile:', err)
    }
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
    profiles,
    featuredProducts,
    discountedProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getCategoryProducts,
    updateOrder,
    addOrder,
    addReview,
    replyToReview,
    getProductReviews,
    addPromotion,
    updatePromotion,
    deletePromotion,
    updateProfile,
    deleteOrder
  }

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  )
}
