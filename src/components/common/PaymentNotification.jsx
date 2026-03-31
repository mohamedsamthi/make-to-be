import { Link } from 'react-router-dom'
import { FiMessageSquare, FiX } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { useProducts } from '../../context/ProductContext'
import { useState, useEffect } from 'react'

export default function PaymentNotification() {
  const { user } = useAuth()
  const { orders } = useProducts()
  const [dismissed, setDismissed] = useState(false)

  if (!user || dismissed) return null

  // Find unread admin messages
  const incomingMessages = orders.filter(o => {
    const isOwner = (o.customer_email === user?.email || (user?.user_metadata?.phone && o.customer_phone === user.user_metadata.phone))
    if (!isOwner) return false
    
    const meta = o.items.find(i => i.is_sales_data)
    const chat = meta?.chat_history || []
    return chat.length > 0 && chat[chat.length - 1].sender === 'admin'
  })

  if (incomingMessages.length === 0) return null

  const order = incomingMessages[0]
  const lastMsg = order.items.find(i => i.is_sales_data)?.chat_history.slice(-1)[0]

  return (
    <div className="fixed bottom-24 left-6 z-[100] animate-fadeInUp">
      <div className="relative group">
        <Link
          to={`/orders?id=${order.id}&tab=chat`}
          className="flex items-center gap-4 p-4 bg-[#1e1c3a] border-2 border-amber-500/50 rounded-2xl shadow-2xl shadow-amber-500/20 max-w-sm hover:scale-105 transition-all ring-4 ring-amber-500/10"
        >
          <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-amber-500/40 shrink-0 animate-bounce">
            <FiMessageSquare size={24} />
          </div>
          <div className="flex-1 min-w-0 pr-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-1">New Message from Admin</p>
            <p className="text-sm font-bold text-white truncate">"{lastMsg?.message}"</p>
            <p className="text-[10px] text-gray-400 mt-1 font-mono uppercase">Order #{order.id.slice(-8)}</p>
          </div>
        </Link>
        <button 
          onClick={() => setDismissed(true)}
          className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors z-10"
        >
          <FiX size={14} />
        </button>
      </div>
    </div>
  )
}
