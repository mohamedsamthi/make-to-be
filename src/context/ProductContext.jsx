import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { supabase, supabaseData } from '../lib/supabase'
import { demoCategories } from '../data/demoData'
import toast from 'react-hot-toast'

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
  const [messages, setMessages] = useState([])
  const [promotionalVideos, setPromotionalVideos] = useState([])
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('make_to_be_favorites')
    return saved ? JSON.parse(saved) : []
  })
  const updateTimeouts = useRef({})

  useEffect(() => {
    localStorage.setItem('make_to_be_favorites', JSON.stringify(favorites))
  }, [favorites])

  const toggleFavorite = (productId) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    )
  }

  // Fetch from Supabase on mount + set up realtime
  useEffect(() => {
    const fetchRealData = async () => {
      console.log('[MakeToBe] Starting data fetch from Supabase...')
      
      // Fetch all tables independently using supabaseData (no auth locks)
      const fetches = [
        { name: 'products', setter: setProducts, query: supabaseData.from('products').select('*').order('created_at', { ascending: false }) },
        { name: 'orders', setter: setOrders, query: supabaseData.from('orders').select('*').order('created_at', { ascending: false }) },
        { name: 'promotions', setter: setPromotions, query: supabaseData.from('promotions').select('*').order('created_at', { ascending: false }) },
        { name: 'reviews', setter: setReviews, query: supabaseData.from('reviews').select('*').order('created_at', { ascending: false }) },
        { name: 'profiles', setter: setProfiles, query: supabaseData.from('profiles').select('*').order('created_at', { ascending: false }) },
        { name: 'messages', setter: setMessages, query: supabaseData.from('messages').select('*').order('created_at', { ascending: false }) },
        { name: 'promotional_videos', setter: setPromotionalVideos, query: supabaseData.from('promotional_videos').select('*').order('created_at', { ascending: false }) },
      ]

      await Promise.all(fetches.map(async ({ name, setter, query }) => {
        try {
          const { data, error } = await query
          if (error) {
            console.error(`[MakeToBe] Error fetching ${name}:`, error.message)
          } else if (data) {
            console.log(`[MakeToBe] Loaded ${data.length} ${name}`)
            if (name === 'orders') {
              const cleaned = data.map(o => ({
                ...o,
                items: typeof o.items === 'string' ? JSON.parse(o.items) : (Array.isArray(o.items) ? o.items : [])
              }))
              setter(cleaned)
            } else {
              setter(data)
            }
          }
        } catch (err) {
          console.error(`[MakeToBe] Failed to fetch ${name}:`, err)
        }
      }))
      
      console.log('[MakeToBe] Data fetch complete!')
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
          toast.success(`🎉 New Order Received: ${payload.new.id}`, { duration: 5000, icon: '📦' })
          setOrders(prev => {
            if (prev.find(o => o.id === payload.new.id)) return prev
            return [payload.new, ...prev]
          })
        } else if (payload.eventType === 'UPDATE') {
          const newRow = { ...payload.new }
          // Fix: Ensure items are parsed if they come as a string (common in Supabase Realtime)
          if (typeof newRow.items === 'string') {
            try { newRow.items = JSON.parse(newRow.items); } catch (e) { console.error('Parse error', e); }
          }
          setOrders(prev => prev.map(o => o.id === newRow.id ? { ...o, ...newRow } : o))
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

    const messagesChannel = supabase
      .channel('realtime-messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          toast.success(`💬 New Support Message from ${payload.new.name}`, { duration: 5000, icon: '✉️' })
          setMessages(prev => {
            if (prev.find(m => m.id === payload.new.id)) return prev
            return [payload.new, ...prev]
          })
        } else if (payload.eventType === 'UPDATE') {
          const newRow = { ...payload.new }
          if (typeof newRow.chat_history === 'string') {
            try { newRow.chat_history = JSON.parse(newRow.chat_history); } catch (e) { console.error('Parse error', e); }
          }
          setMessages(prev => prev.map(m => m.id === newRow.id ? { ...m, ...newRow } : m))
        } else if (payload.eventType === 'DELETE') {
          setMessages(prev => prev.filter(m => m.id !== payload.old.id))
        }
      })
      .subscribe()

    const videoChannel = supabase
      .channel('realtime-videos')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'promotional_videos' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setPromotionalVideos(prev => [payload.new, ...prev])
        } else if (payload.eventType === 'UPDATE') {
          setPromotionalVideos(prev => prev.map(v => v.id === payload.new.id ? { ...v, ...payload.new } : v))
        } else if (payload.eventType === 'DELETE') {
          setPromotionalVideos(prev => prev.filter(v => v.id !== payload.old.id))
        }
      })
      .subscribe()

    const profilesChannel = supabase
      .channel('realtime-profiles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setProfiles(prev => [payload.new, ...prev])
        } else if (payload.eventType === 'UPDATE') {
          setProfiles(prev => prev.map(p => p.id === payload.new.id ? { ...p, ...payload.new } : p))
        } else if (payload.eventType === 'DELETE') {
          setProfiles(prev => prev.filter(p => p.id !== payload.old.id))
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(productsChannel)
      supabase.removeChannel(ordersChannel)
      supabase.removeChannel(promoChannel)
      supabase.removeChannel(reviewsChannel)
      supabase.removeChannel(messagesChannel)
      supabase.removeChannel(profilesChannel)
      supabase.removeChannel(videoChannel)
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
    // 1. Update local state immediately for UI responsiveness
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updatedData } : o))
    
    // 2. Clear existing timeout for this ID to debounce rapid updates
    if (updateTimeouts.current[id]) clearTimeout(updateTimeouts.current[id])
    
    updateTimeouts.current[id] = setTimeout(async () => {
      try {
        const { error } = await supabaseData.from('orders').update(updatedData).eq('id', id)
        if (error) {
           console.error('Supabase Update Error:', error);
           toast.error(`Database Error: ${error.message}`);
           throw error;
        }
      } catch (err) {
        console.error('Failed to update order in db:', err)
        // Final fallback: fetch actual DB state to ensure local state is correct
        const { data } = await supabaseData.from('orders').select('*').eq('id', id).single()
        if (data) setOrders(prev => prev.map(o => o.id === id ? data : o))
      }
      delete updateTimeouts.current[id]
    }, 300)
  }

  const addOrder = async (order) => {
    const newOrder = {
      ...order,
      id: `ORD-${Date.now().toString().slice(-6)}`,
      created_at: new Date().toISOString()
    }
    setOrders(prev => [newOrder, ...prev])
    try {
      const { error } = await supabaseData.from('orders').insert([newOrder])
      if (error) throw error
    } catch (err) {
      console.error('Failed to save order to db:', err)
      throw err
    }
    return newOrder
  }

  const deleteOrder = async (id) => {
    setOrders(prev => prev.filter(o => o.id !== id))
    try {
      await supabaseData.from('orders').delete().eq('id', id)
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
      const { data, error } = await supabaseData.from('reviews').insert([{
         product_id: review.product_id,
         user_name: review.user_name,
         rating: review.rating,
         comment: review.comment
      }]).select().single()
      if (error) throw error
      if (data) {
        setReviews(prev => prev.map(r => r.id === tempId ? data : r))
      }
    } catch (err) { 
      console.error('Failed to add review to db:', err)
    }

    return newReview
  }

  const deleteReview = async (id) => {
    const review = reviews.find(r => r.id === id)
    if (!review) return

    setReviews(prev => prev.filter(r => r.id !== id))
    
    // Recalculate rating
    const otherReviews = reviews.filter(r => r.product_id === review.product_id && r.id !== id)
    const newCount = otherReviews.length
    const newRating = newCount > 0 ? (otherReviews.reduce((s, r) => s + r.rating, 0) / newCount) : 0
    
    updateProduct(review.product_id, {
      rating: Math.round(newRating * 10) / 10,
      review_count: newCount
    })

    try {
      const { error } = await supabaseData.from('reviews').delete().eq('id', id)
      if (error) throw error
    } catch (err) {
      console.error('Failed to delete review from db:', err)
    }
  }

  const replyToReview = async (reviewId, reply) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, admin_reply: reply } : r))
    try {
      const { error } = await supabaseData.from('reviews').update({ admin_reply: reply }).eq('id', reviewId)
      if (error) throw error
    } catch (err) {
      console.error('Failed to reply to review:', err)
    }
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
   // No duplicate review section needed here


  // ===== MESSAGE OPERATIONS =====
  const sendMessage = async (msgData) => {
    // Get current session user to avoid hardcoded localStorage keys
    const { data: { session } } = await supabase.auth.getSession()
    const user = session?.user

    const finalData = { 
      ...msgData, 
      user_id: user?.id || null,
      status: 'unread',
      chat_history: [{
        sender: 'user',
        message: msgData.message,
        time: new Date().toISOString()
      }]
    }
    
    try {
      const { data, error } = await supabaseData.from('messages').insert([finalData]).select().single()
      if (error) throw error
      if (data) setMessages(prev => [data, ...prev])
      return data
    } catch (err) {
      console.error('Error sending message:', err)
      throw err
    }
  }

  const customerReply = async (messageId, replyText) => {
    try {
      const msg = messages.find(m => m.id === messageId)
      if (!msg) {
        console.error('Message not found for ID:', messageId)
        // Try fetching it directly if not in state
        const { data: directMsg } = await supabase.from('messages').select('*').eq('id', messageId).single()
        if (!directMsg) {
          toast.error('Message record not found.')
          return
        }
      }
      
      const currentMsg = msg || messages.find(m => m.id === messageId) // Fallback
      const history = Array.isArray(currentMsg?.chat_history) ? [...currentMsg.chat_history] : []
      history.push({
        sender: 'user',
        message: replyText,
        time: new Date().toISOString()
      })

      const updateData = {
        chat_history: history,
        status: 'unread', // Admin sees it as unread again
        readbyadmin: false
      }

      const { error } = await supabase.from('messages').update(updateData).eq('id', messageId)
      if (error) throw error
      
      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, ...updateData } : m))
      toast.success('Reply sent!')
    } catch (err) {
      console.error('Error sending customer reply:', err)
      toast.error('Failed to send reply. Please try again.')
    }
  }

  const replyToMessage = async (id, reply) => {
    try {
      const msg = messages.find(m => m.id === id)
      if (!msg) return

      const status = reply ? 'replied' : 'read'
      const updateData = { admin_reply: reply, status }
      
      if (reply) {
        updateData.readbyuser = false
        const history = Array.isArray(msg.chat_history) ? [...msg.chat_history] : []
        history.push({
          sender: 'admin',
          message: reply,
          time: new Date().toISOString()
        })
        updateData.chat_history = history
      } else {
        updateData.readbyadmin = true
      }

      const { error } = await supabaseData.from('messages').update(updateData).eq('id', id)
      if (error) throw error
      setMessages(prev => prev.map(m => m.id === id ? { ...m, ...updateData } : m))
      if (reply) toast.success('Reply sent to customer!')
    } catch (err) {
      console.error('Error replying to message:', err)
      toast.error('Failed to save reply.')
      throw err // Propagate error so caller knows it failed
    }
  }

  const deleteMessage = async (id) => {
    try {
      const { error } = await supabaseData.from('messages').delete().eq('id', id)
      if (error) throw error
      setMessages(prev => prev.filter(m => m.id !== id))
    } catch (err) {
      console.error('Error deleting message:', err)
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
    messages,
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
    deleteReview,
    replyToReview,
    getProductReviews,
    addPromotion,
    updatePromotion,
    deletePromotion,
    updateProfile,
    deleteOrder,
    sendMessage,
    replyToMessage,
    customerReply,
    messages,
    favorites,
    toggleFavorite,
    promotionalVideos,
    setPromotionalVideos,
    deleteMessage
  }

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  )
}
