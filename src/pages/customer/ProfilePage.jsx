import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useProducts } from '../../context/ProductContext'
import { supabaseData } from '../../lib/supabase'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { FiUser, FiMail, FiPhone, FiLogOut, FiPackage, FiSettings, FiImage, FiLock, FiCheck, FiArrowRight, FiMessageSquare, FiSend } from 'react-icons/fi'
import { MdDashboard } from 'react-icons/md'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, profile, isAdmin, signOut, loading, updateProfile } = useAuth()
  const { orders, messages, replyToMessage, updateOrder } = useProducts()
  
  const location = useLocation()
  const [activeTab, setActiveTab] = useState(new URLSearchParams(location.search).get('tab') || 'orders')
  const [isUpdating, setIsUpdating] = useState(false)
  const [customerReplyText, setCustomerReplyText] = useState({})
  const [isSendingReply, setIsSendingReply] = useState(false)
  const [formData, setFormData] = useState({
    fullName: profile?.full_name || '',
    phone: profile?.phone || '',
    avatarUrl: profile?.avatar_url || '',
    password: ''
  })

  // Sync formData with profile when profile changes
  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        fullName: profile.full_name || '',
        phone: profile.phone || '',
        avatarUrl: profile.avatar_url || ''
      }))
    }
  }, [profile])

  // Mark support messages as read
  useEffect(() => {
    if (activeTab === 'support') {
      const myMsgs = messages.filter(m => 
        (m.user_id === user?.id || m.email === user?.email || (profile?.phone && m.phone === profile.phone)) && 
        m.status === 'replied' && !m.readbyuser
      )
      myMsgs.forEach(m => {
        // We use replyToMessage but with a flag to mark as read by user
        supabaseData.from('messages').update({ readbyuser: true }).eq('id', m.id).then(() => {
          // No need for local update as realtime will handle it, but we can if we want speed
        })
      })
    }
  }, [activeTab, messages, user?.email, profile?.phone])

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // Limit size to ~5MB
        toast.error('Image is too large. Please select a smaller one.')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const max_size = 150
          let width = img.width
          let height = img.height
          if (width > height) {
            if (width > max_size) {
              height *= max_size / width
              width = max_size
            }
          } else {
            if (height > max_size) {
              width *= max_size / height
              height = max_size
            }
          }
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)
          const tinyBase64 = canvas.toDataURL('image/jpeg', 0.6)
          setFormData(p => ({...p, avatarUrl: tinyBase64}))
        }
        img.src = reader.result
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setIsUpdating(true)
    const { error } = await updateProfile(formData)
    if (error) {
       toast.error(error.message || 'Failed to update profile')
    } else {
       toast.success('Profile updated successfully! ✅')
       if (formData.password) setFormData(prev => ({...prev, password: ''}))
    }
    setIsUpdating(false)
  }

  const { customerReply } = useProducts()

  const handleCustomerReply = async (messageId) => {
    const text = customerReplyText[messageId]
    if (!text?.trim()) return
    
    setIsSendingReply(true)
    await customerReply(messageId, text)
    setCustomerReplyText(p => ({...p, [messageId]: ''}))
    setIsSendingReply(false)
  }

  if (!loading && !user) return <Navigate to="/login" />

  const userOrders = orders.filter(o => o.customer_email === user?.email)

  return (
    <div className="bg-[var(--color-surface)] relative overflow-hidden pb-10">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[var(--color-accent)]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Header */}
      <div className="bg-[var(--color-primary)] py-8 mb-6 relative z-10">
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl font-black font-[var(--font-family-heading)] text-white mb-2 tracking-tight">
             My Account
          </h1>
          <p className="text-[var(--color-text-muted)] max-w-lg text-xs font-black uppercase tracking-widest opacity-60">
            Control Center & Identity
          </p>
        </div>
      </div>

      <div className="container-custom px-4 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar / Profile Card */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-dark)]" />
              
              {/* Profile DP View */}
              <div className="relative inline-block mb-6 group/avatar">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-dark)] p-1 shadow-lg shadow-[var(--color-accent)]/20 transition-all">
                  <div className="w-full h-full rounded-full bg-[var(--color-surface)] flex items-center justify-center text-4xl font-black text-white overflow-hidden border-2 border-[var(--color-surface-card)]">
                    {formData.avatarUrl || profile?.avatar_url ? (
                      <img src={formData.avatarUrl || profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      (profile?.full_name?.[0] || user?.email?.[0] || 'U').toUpperCase()
                    )}
                  </div>
                </div>
                
                {/* DP Update Trigger */}
                <label className="absolute bottom-1 right-1 w-10 h-10 bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] text-black rounded-xl flex items-center justify-center cursor-pointer shadow-xl border-2 border-[#1e1c3a] transition-all hover:scale-110 active:scale-95 group-hover/avatar:opacity-100 opacity-90">
                  <FiImage size={18} />
                  <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                </label>
              </div>

              <h2 className="text-2xl font-black text-white mb-1 tracking-tight">
                {profile?.full_name || 'User Name'}
              </h2>
              <p className="text-gray-400 text-sm mb-4 font-medium">{user?.email}</p>
              
              {isAdmin && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[10px] font-black uppercase tracking-widest mb-6">
                  <FiSettings size={12} /> Admin Mode
                </div>
              )}

              <div className="space-y-2 text-left mt-4 border-t border-white/5 pt-6">
                <button 
                  onClick={() => setActiveTab('orders')} 
                  className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all font-bold text-sm ${
                    activeTab === 'orders' 
                    ? 'bg-[var(--color-accent)] text-black shadow-lg shadow-[var(--color-accent)]/20' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <FiPackage size={18} /> My Orders
                </button>
                 <button 
                  onClick={() => setActiveTab('support')} 
                  className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all font-bold text-sm ${
                    activeTab === 'support' 
                    ? 'bg-[var(--color-accent)] text-black shadow-lg shadow-[var(--color-accent)]/20' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <FiMessageSquare size={18} /> Support Details
                  {messages.filter(m => m.email === user?.email && m.status === 'replied' && !m.readbyuser).length > 0 && (
                    <span className="w-2 h-2 rounded-full bg-red-500 ml-auto animate-pulse" />
                  )}
                </button>
                <button 
                  onClick={() => setActiveTab('settings')} 
                  className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all font-bold text-sm ${
                    activeTab === 'settings' 
                    ? 'bg-[var(--color-accent)] text-black shadow-lg shadow-[var(--color-accent)]/20' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <FiSettings size={18} /> Account Settings
                </button>
                
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-amber-400 hover:text-amber-300 hover:bg-amber-400/10 font-bold text-sm transition-all"
                  >
                    <MdDashboard size={18} /> Admin Dashboard
                  </Link>
                )}

                <button 
                  onClick={signOut} 
                  className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-red-400 hover:text-red-300 hover:bg-red-400/10 font-bold text-sm transition-all mt-4"
                >
                  <FiLogOut size={18} /> Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8">
            <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-3xl shadow-2xl overflow-hidden min-h-[500px]">
              
              {activeTab === 'orders' ? (
                <div className="p-8 sm:p-10">
                  <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent)]">
                      <FiPackage size={22} />
                    </div>
                    Recent Orders
                    <span className="ml-2 px-3 py-1 bg-white/5 rounded-lg text-sm text-gray-500 font-bold">
                      {userOrders.length}
                    </span>
                  </h3>

                  <div className="space-y-4">
                    {userOrders.length > 0 ? userOrders.map(order => (
                      <div key={order.id} className="group p-6 rounded-2xl bg-black/40 border border-white/5 hover:border-[var(--color-accent)]/30 transition-all hover:bg-black/60 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4">
                           <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30' :
                            order.status === 'shipped' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/30' :
                            order.status === 'cancelled' ? 'bg-red-500/10 text-red-500 border border-red-500/30' :
                            'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                          <div>
                            <p className="font-black text-white mb-0.5 tracking-wide uppercase text-sm">Order #{order.id.slice(-8)}</p>
                            <p className="text-xs text-gray-500 font-bold">{new Date(order.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-widest">Total Amount</p>
                             <p className="text-xl font-black text-white">LKR {Number(order.total).toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="space-y-2 mb-6 bg-[#151230]/50 p-4 rounded-xl border border-white/5">
                          {order.items.filter(i => !i.is_sales_data).map((item, i) => (
                            <div key={i} className="flex justify-between items-center text-sm group/item">
                              <span className="text-gray-400 font-medium">
                                <span className="text-[var(--color-accent)] font-bold mr-2 uppercase tracking-tighter">{item.quantity}x</span> 
                                <span className="text-gray-300">{item.product_name}</span>
                                {item.size && <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded ml-2 font-black uppercase">{item.size}</span>}
                              </span>
                              <span className="font-bold text-white text-xs">LKR {(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${order.payment_status === 'paid' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                              Payment: {order.payment_status === 'paid' ? 'Completed' : 'Pending'}
                            </span>
                          </div>
                          <Link to={`/orders?id=${order.id}`} className="text-xs font-black text-[var(--color-accent)] hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1.5">
                            Track Status <FiArrowRight />
                          </Link>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-20 bg-black/20 border border-dashed border-white/10 rounded-3xl">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                          <FiPackage className="text-gray-600 text-3xl" />
                        </div>
                        <h4 className="text-xl font-black text-white mb-2">No Active Orders</h4>
                        <p className="text-gray-500 text-sm max-w-xs mx-auto mb-8">
                          Your shopping venture awaits! Start exploring our collections.
                        </p>
                        <Link to="/products" className="bg-[var(--color-accent)] text-black px-8 py-3.5 rounded-xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform inline-block">
                          Start Shopping
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ) : activeTab === 'support' ? (
                <div className="p-8 sm:p-10">
                  <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent)]">
                      <FiMessageSquare size={22} />
                    </div>
                    Support History
                  </h3>
                  <div className="space-y-8">
                    {messages
                      .filter(m => m.user_id === user?.id || m.email === user?.email || (profile?.phone && m.phone === profile.phone))
                      .sort((a, b) => {
                        const timeA = a.chat_history && a.chat_history.length > 0 ? new Date(a.chat_history[a.chat_history.length-1].time).getTime() : new Date(a.created_at).getTime()
                        const timeB = b.chat_history && b.chat_history.length > 0 ? new Date(b.chat_history[b.chat_history.length-1].time).getTime() : new Date(b.created_at).getTime()
                        return timeB - timeA
                      })
                      .length > 0 ? (
                      messages
                        .filter(m => m.user_id === user?.id || m.email === user?.email || (profile?.phone && m.phone === profile.phone))
                        .sort((a, b) => {
                          const timeA = a.chat_history && a.chat_history.length > 0 ? new Date(a.chat_history[a.chat_history.length-1].time).getTime() : new Date(a.created_at).getTime()
                          const timeB = b.chat_history && b.chat_history.length > 0 ? new Date(b.chat_history[b.chat_history.length-1].time).getTime() : new Date(b.created_at).getTime()
                          return timeB - timeA
                        })
                        .map(msg => (
                        <div key={msg.id} className="rounded-3xl bg-black/40 border border-white/5 overflow-hidden shadow-sm">
                          {/* Chat Header */}
                          <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center text-[10px] font-black text-black">M</div>
                                <div>
                                   <p className="text-xs font-black text-white uppercase tracking-wider">Ticket #{msg.id.slice(0, 8)}</p>
                                   <p className="text-[10px] text-gray-500 font-bold">{new Date(msg.created_at).toLocaleDateString()}</p>
                                </div>
                             </div>
                             <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${
                                msg.status === 'unread' ? 'bg-[var(--color-accent)]/20 text-[var(--color-accent)]' : 'bg-emerald-500/20 text-emerald-400'
                             }`}>
                               {msg.status}
                             </span>
                          </div>

                          {/* Chat Messages */}
                          <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar bg-[#1a1738]/30">
                            {/* Original Message */}
                            <div className="flex flex-col items-start max-w-[85%]">
                               <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-sm text-sm text-gray-200">
                                 {msg.message}
                               </div>
                               <span className="text-[9px] text-gray-600 font-bold mt-1 ml-2">YOU • {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>

                            {/* Chat History */}
                            {Array.isArray(msg.chat_history) && msg.chat_history.slice(1).map((chat, idx) => (
                              <div key={idx} className={`flex flex-col ${chat.sender === 'admin' ? 'items-end' : 'items-start'} max-w-[100%]`}>
                                 <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
                                   chat.sender === 'admin' 
                                   ? 'bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 text-white rounded-tr-sm' 
                                   : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-sm'
                                 }`}>
                                   {chat.message}
                                   {chat.sender === 'admin' && (
                                      <div className="flex justify-end mt-2 opacity-50">
                                        <div className="flex -space-x-1.5">
                                          <FiCheck size={10} className="text-emerald-400" />
                                          <FiCheck size={10} className="text-emerald-400" />
                                        </div>
                                      </div>
                                   )}
                                 </div>
                                 <span className={`text-[9px] font-bold mt-1 px-2 ${chat.sender === 'admin' ? 'text-[var(--color-accent)]' : 'text-gray-600'}`}>
                                   {chat.sender === 'admin' ? 'ADMIN' : 'YOU'} • {new Date(chat.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                 </span>
                              </div>
                            ))}
                          </div>

                          {/* Chat Footer / Reply Input */}
                          <div className="p-4 border-t border-white/5 bg-black/20">
                             <div className="flex gap-2">
                               <input 
                                 value={customerReplyText[msg.id] || ''}
                                 onChange={e => setCustomerReplyText(p => ({...p, [msg.id]: e.target.value}))}
                                 placeholder="Type your reply here..."
                                 className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-[var(--color-accent)] outline-none transition-all"
                                 onKeyDown={e => {
                                   if (e.key === 'Enter' && !e.shiftKey) {
                                     e.preventDefault();
                                     handleCustomerReply(msg.id);
                                   }
                                 }}
                               />
                               <button 
                                 onClick={() => handleCustomerReply(msg.id)}
                                 disabled={!customerReplyText[msg.id]?.trim() || isSendingReply}
                                 className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale"
                               >
                                 <FiSend size={18} />
                               </button>
                             </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-20 bg-black/20 border border-dashed border-white/10 rounded-3xl">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                           <FiMessageSquare className="text-gray-600 text-2xl" />
                        </div>
                        <h4 className="text-lg font-black text-white mb-2">No Support Tickets</h4>
                        <p className="text-gray-500 text-sm max-w-xs mx-auto mb-6">
                          Need help? Our team is ready to assist you.
                        </p>
                        <Link to="/contact" className="bg-white/5 hover:bg-white/10 text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all">
                          Open New Ticket
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-8 sm:p-10">
                  <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent)]">
                      <FiSettings size={22} />
                    </div>
                    Account Settings
                  </h3>

                  <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Basic Info Group */}
                    <div className="space-y-6">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-accent)]/80 mb-2">Personal Information</h4>
                       
                       {/* Name Input */}
                       <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">Full Name</label>
                        <div className="relative group/input">
                          <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/input:text-[var(--color-accent)] transition-colors" />
                          <input
                            value={formData.fullName}
                            onChange={e => setFormData(p => ({...p, fullName: e.target.value}))}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all font-bold"
                            placeholder="Your display name"
                          />
                        </div>
                      </div>

                      {/* Phone Input */}
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">Contact Number</label>
                        <div className="relative group/input">
                          <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/input:text-[var(--color-accent)] transition-colors" />
                          <input
                            value={formData.phone}
                            onChange={e => setFormData(p => ({...p, phone: e.target.value}))}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all font-bold"
                            placeholder="+94 XX XXX XXXX"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Security Group */}
                    <div className="space-y-6">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-accent)]/80 mb-2">Security & Identity</h4>

                      {/* Email (Static) */}
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block ml-1">Account Email</label>
                        <div className="relative opacity-60">
                          <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                          <input
                            value={user?.email || ''}
                            disabled
                            className="w-full bg-black/20 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-gray-500 cursor-not-allowed font-bold"
                          />
                          <FiLock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700" title="Fixed" />
                        </div>
                      </div>

                      {/* Password Update */}
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">New Password</label>
                        <div className="relative group/input">
                          <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/input:text-[var(--color-accent)] transition-colors" />
                          <input
                            type="password"
                            value={formData.password}
                            onChange={e => setFormData(p => ({...p, password: e.target.value}))}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all font-bold"
                            placeholder="Change password (optional)"
                          />
                        </div>
                        <p className="text-[10px] text-gray-500 mt-2 ml-1 italic font-medium">* Leave empty to keep existing password</p>
                      </div>
                    </div>

                    <div className="md:col-span-2 pt-6 border-t border-white/5 mt-4 flex items-center justify-between">
                      <p className="text-xs text-gray-500 font-medium hidden sm:block">
                        Updates might take a few moments to sync across devices.
                      </p>
                      <button 
                        type="submit" 
                        disabled={isUpdating} 
                        className="w-full sm:w-auto bg-[var(--color-accent)] text-black px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-[var(--color-accent)]/20 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isUpdating ? (
                           <svg className="animate-spin h-5 w-5 border-2 border-black/30 border-t-black rounded-full" viewBox="0 0 24 24"></svg>
                        ) : (
                          <><FiCheck size={18}/> Update Account</>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
