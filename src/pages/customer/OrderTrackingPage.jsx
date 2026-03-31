import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiPackage, FiCheck, FiTruck, FiMapPin, FiClock, FiArrowLeft, FiFileText, FiX, FiDownload, FiPrinter, FiTrash2 } from 'react-icons/fi'
import Swal from 'sweetalert2'
import { FaWhatsapp } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import { useProducts } from '../../context/ProductContext'
import { shopInfo } from '../../data/demoData'
import toast from 'react-hot-toast'

const statusSteps = [
  { key: 'pending', label: 'Order Placed', icon: <FiClock size={20} />, desc: 'Your order has been received' },
  { key: 'confirmed', label: 'Confirmed', icon: <FiCheck size={20} />, desc: 'Order confirmed by seller' },
  { key: 'processing', label: 'Processing', icon: <FiPackage size={20} />, desc: 'Your order is being prepared' },
  { key: 'shipped', label: 'Shipped', icon: <FiTruck size={20} />, desc: 'Order is on the way' },
  { key: 'delivered', label: 'Delivered', icon: <FiMapPin size={20} />, desc: 'Order delivered successfully' }
]

function getStatusIndex(status) {
  const idx = statusSteps.findIndex(s => s.key === status)
  return idx >= 0 ? idx : 0
}

function OrderStatusTracker({ status }) {
  const currentStep = getStatusIndex(status)

  return (
    <div className="relative">
      {/* Progress line */}
      <div className="absolute top-6 left-6 right-6 h-0.5 bg-[var(--color-border)]">
        <div
          className="h-full gradient-accent transition-all duration-500"
          style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
        />
      </div>

      {/* Steps */}
      <div className="relative flex justify-between">
        {statusSteps.map((step, i) => {
          const isCompleted = i <= currentStep
          const isCurrent = i === currentStep

          return (
            <div key={step.key} className="flex flex-col items-center text-center" style={{ width: '20%' }}>
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${
                  isCompleted
                    ? 'gradient-accent text-white shadow-lg shadow-[var(--color-accent)]/30'
                    : 'bg-[var(--color-surface-card)] border-2 border-[var(--color-border)] text-[var(--color-text-muted)]'
                } ${isCurrent ? 'ring-4 ring-[var(--color-accent)]/20 scale-110' : ''}`}
              >
                {isCompleted && i < currentStep ? <FiCheck size={20} /> : step.icon}
              </div>
              <p className={`text-xs font-semibold mt-2 ${isCompleted ? 'text-white' : 'text-gray-500'}`}>
                {step.label}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5 hidden sm:block">{step.desc}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function OrderTrackingPage() {
  const { user } = useAuth()
  const { orders, updateOrder, deleteOrder } = useProducts()
  const [orderQuery, setOrderQuery] = useState('')
  const [selectedReceiptId, setSelectedReceiptId] = useState(null)
  const [activeTab, setActiveTab] = useState('receipt')
  const [chatMessage, setChatMessage] = useState('')

  const selectedReceipt = orders.find(o => o.id === selectedReceiptId)

  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const orderIdFromQuery = queryParams.get('id')
  const tabFromQuery = queryParams.get('tab')

  // Filter orders for the logged in user
  const userOrders = orders.filter(o => o.customer_email === user?.email || o.customer_phone === user?.user_metadata?.phone)

  const chatEndRef = useRef(null)

  // Auto-scroll chat
  useEffect(() => {
    if (activeTab === 'chat' && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [activeTab, selectedReceipt?.items])

  // REMOVED: Auto-open modal logic to prevent unwanted popups on refresh
  /* 
  useEffect(() => {
    if (orderIdFromQuery && userOrders.length > 0) {
      const order = userOrders.find(o => o.id === orderIdFromQuery)
      if (order) {
        setSelectedReceiptId(order.id)
        if (tabFromQuery === 'chat') setActiveTab('chat')
      }
    }
  }, [orderIdFromQuery, userOrders.length])
  */

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="bg-[var(--color-surface)] text-[var(--color-text-primary)]">
      {/* Print-only content */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * { visibility: hidden; }
          .printable-receipt, .printable-receipt * { visibility: visible; }
          .printable-receipt { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100%; 
            padding: 20px; 
            background: white !important;
            color: black !important;
          }
          .no-print { display: none !important; }
        }
      `}} />

      <div className="bg-[var(--color-primary)] py-5 relative z-10">
        <div className="container-custom">
          <Link to="/profile" className="text-[10px] uppercase tracking-widest text-[var(--color-accent-light)] font-black flex items-center gap-2 mb-2 hover:text-white transition-all">
            <FiArrowLeft size={14} /> Back to Profile
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
             Orders & Tracking
          </h1>
        </div>
      </div>

      <div className="container-custom py-6 lg:py-10 relative z-10">
        {userOrders.length > 0 ? (
          <div className="space-y-6">
            {userOrders.map((order, idx) => (
              <div
                key={order.id}
                className="rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] overflow-hidden shadow-2xl animate-fadeInUp hover:border-[var(--color-accent)]/30 transition-all duration-300"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {/* Order Header */}
                <div className="p-5 sm:p-7 border-b border-white/5 flex flex-wrap items-center justify-between gap-4 bg-white/5 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[var(--color-accent)] to-[var(--color-accent-dark)]" />
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-lg font-black font-mono text-white">{order.id}</h3>
                      <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg ${
                        order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        order.status === 'shipped' ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent-light)] border border-[var(--color-accent)]/20' :
                        'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>{order.status}</span>
                    </div>
                    <p className="text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-widest leading-none">Placed {new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-white tracking-tight">LKR {order.total.toLocaleString()}</p>
                    <p className="text-[9px] font-black text-[var(--color-text-muted)] uppercase tracking-widest mt-1 opacity-60">{order.items.filter(i => !i.is_sales_data).length} items reserved</p>
                  </div>
                </div>

                {/* Status Tracker */}
                <div className="p-6 sm:p-10 bg-black/5">
                  <OrderStatusTracker status={order.status} />
                </div>

                {/* Actions */}
                <div className="p-5 sm:p-7 border-t border-white/5 flex flex-wrap gap-3 items-center bg-white/5">
                  <button
                    onClick={() => { setSelectedReceiptId(order.id); setActiveTab('receipt'); }}
                    className="flex-1 sm:flex-none flex justify-center items-center gap-2 py-3.5 px-6 rounded-xl bg-white text-[var(--color-surface)] font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all shadow-xl relative"
                  >
                    <FiFileText size={16} /> Details & Chat
                    {(order.items?.find(i => i.is_sales_data)?.chat_history || []).slice(-1)[0]?.sender === 'admin' && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 border-2 border-[var(--color-surface)] rounded-full animate-pulse" />
                    )}
                  </button>
                  <a
                    href={`${shopInfo.socialMedia.whatsapp}?text=${encodeURIComponent(`Hi! I want to check the status of my order ${order.id}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-none flex justify-center items-center gap-2 py-3.5 px-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black text-[10px] uppercase tracking-widest transition-all"
                  >
                    <FaWhatsapp size={16} /> WhatsApp Follow-up
                  </a>
                  <button
                    onClick={() => {
                      Swal.fire({
                        title: 'Cancel & Delete Order?',
                        text: "This will remove your order from our system.",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#ef4444',
                        cancelButtonColor: '#1a1835',
                        confirmButtonText: 'Confirm Deletion',
                        background: '#151230',
                        color: '#fff'
                      }).then((result) => {
                        if (result.isConfirmed) {
                          deleteOrder(order.id)
                          toast.success('Order deleted successfully')
                        }
                      })
                    }}
                    className="flex-1 sm:flex-none flex justify-center items-center gap-2 py-3.5 px-6 rounded-xl bg-red-500/5 text-red-500 border border-red-500/10 font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                  >
                    <FiTrash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-3xl shadow-2xl max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center border border-white/5 opacity-40">
              <FiPackage size={32} />
            </div>
            <h2 className="text-2xl font-black mb-2 text-white tracking-tight">No Orders Found</h2>
            <p className="text-[var(--color-text-muted)] mb-8 max-w-[240px] mx-auto text-xs leading-relaxed font-medium">Step into our collection and discover something extraordinary today.</p>
            <Link to="/products" className="inline-flex items-center gap-2 bg-white text-[var(--color-surface)] font-black text-[10px] uppercase tracking-widest py-3.5 px-10 rounded-xl transition-all shadow-xl hover:scale-105">
              Explore Store
            </Link>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10 overflow-hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedReceiptId(null)} />
          
          <div className="relative z-10 w-full max-w-lg bg-[var(--color-surface)] rounded-2xl shadow-3xl overflow-hidden animate-fadeInUp text-[var(--color-text-primary)] border border-white/5 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-[var(--color-primary)] p-5 border-b border-white/5 flex justify-between items-center">
               <div>
                  <h2 className="text-sm font-black uppercase tracking-widest text-white">Order Command</h2>
                  <p className="text-[9px] text-[var(--color-text-muted)] font-mono font-bold mt-0.5">{selectedReceipt.id}</p>
               </div>
               <button onClick={() => setSelectedReceiptId(null)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center transition-all border border-white/10">
                  <FiX size={16} />
               </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/5 bg-black/20">
               <button onClick={() => setActiveTab('receipt')} className={`flex-1 py-4 text-[9px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'receipt' ? 'text-white' : 'text-[var(--color-text-muted)] hover:text-white'}`}>
                 Digital Receipt
                 {activeTab === 'receipt' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-accent-light)]" />}
               </button>
               <button onClick={() => setActiveTab('chat')} className={`flex-1 py-4 text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 relative ${activeTab === 'chat' ? 'text-white' : 'text-[var(--color-text-muted)] hover:text-white'}`}>
                 Secure Chat
                 {(selectedReceipt.items.find(i => i.is_sales_data)?.chat_history?.length > 0) && (
                   <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                 )}
                 {activeTab === 'chat' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-accent-light)]" />}
               </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {activeTab === 'receipt' ? (
                <div className="p-6 sm:p-8 bg-white text-gray-800 overflow-y-auto custom-scrollbar printable-receipt">
                  <div className="flex justify-between items-start border-b border-gray-100 pb-6 mb-6">
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                           <div className="w-8 h-8 bg-black rounded flex items-center justify-center text-white font-black text-xs">M</div>
                           <h2 className="text-lg font-black tracking-tighter">MAKE TO BE</h2>
                        </div>
                        <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Billed To</h3>
                        <p className="text-sm font-black text-gray-900">{selectedReceipt.customer_name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{selectedReceipt.customer_phone}</p>
                        <p className="text-[10px] text-gray-400 max-w-[180px] mt-2 leading-relaxed font-medium">{selectedReceipt.customer_address}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Receipt Ref</p>
                        <p className="text-[10px] font-mono font-bold text-gray-900 mb-4">{selectedReceipt.id}</p>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Date</p>
                        <p className="text-[10px] font-bold text-gray-900">{new Date(selectedReceipt.created_at).toLocaleDateString()}</p>
                      </div>
                  </div>

                  <table className="w-full mb-8">
                    <thead>
                      <tr className="border-b border-gray-100 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                        <th className="text-left pb-3">Item</th>
                        <th className="text-center pb-3">Qty</th>
                        <th className="text-right pb-3">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {selectedReceipt.items.filter(i => !i.is_sales_data).map((item, i) => (
                        <tr key={i}>
                          <td className="py-4">
                            <p className="text-xs font-bold text-gray-800 leading-tight">{item.product_name}</p>
                            {(item.size || item.color) && (
                              <p className="text-[9px] text-gray-400 mt-1 uppercase font-black tracking-widest">{item.size && `Size: ${item.size}`} • {item.color && `${item.color}`}</p>
                            )}
                          </td>
                          <td className="py-4 text-xs text-center text-gray-600 font-medium">{item.quantity}</td>
                          <td className="py-4 text-xs font-black text-right text-gray-900">LKR {(item.price * item.quantity).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="space-y-3 pt-6 border-t border-gray-100 mb-8">
                    <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      <span>Subtotal</span>
                      <span className="text-gray-900">LKR {selectedReceipt.items.filter(i => !i.is_sales_data).reduce((s,i) => s + (i.price*i.quantity), 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      <span>Delivery</span>
                      <span className="text-gray-900">LKR {(selectedReceipt.total - selectedReceipt.items.filter(i => !i.is_sales_data).reduce((s,i) => s + (i.price*i.quantity), 0)).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Charged</span>
                      <span className="text-xl font-black text-gray-900">LKR {selectedReceipt.total.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-3 no-print">
                    <button 
                      onClick={handlePrintReceipt}
                      className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-xl"
                    >
                      <FiPrinter size={16} /> Print Receipt
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col flex-1 bg-[var(--color-primary)]">
                  {/* Status Banner */}
                  <div className="p-4 bg-emerald-500/10 border-b border-emerald-500/20 grid grid-cols-2 gap-4">
                     <div>
                       <p className="text-[8px] font-black uppercase text-emerald-400 tracking-widest mb-0.5">Balance</p>
                       <p className="text-white font-black text-xs leading-none">
                         LKR {Math.max(0, selectedReceipt.total - (selectedReceipt.items.find(i => i.is_sales_data)?.amount_paid || 0)).toLocaleString()}
                       </p>
                     </div>
                     <div className="text-right">
                       <p className="text-[8px] font-black uppercase text-emerald-400 tracking-widest mb-0.5">Status</p>
                       <p className="text-white font-black text-xs leading-none uppercase">{selectedReceipt.payment_status || 'Pending'}</p>
                     </div>
                  </div>

                  {/* Chat */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
                    {(selectedReceipt.items.find(i => i.is_sales_data)?.chat_history || []).map((msg, i) => {
                        const isMe = msg.sender === 'user'
                        const isSystem = msg.sender === 'system'
                        
                        if (isSystem) return (
                          <div key={i} className="flex justify-center"><span className="text-[9px] bg-white/5 px-3 py-1 text-gray-500 font-black uppercase tracking-widest rounded-full">{msg.message}</span></div>
                        )

                        return (
                          <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-4 rounded-2xl ${isMe ? 'bg-[var(--color-accent)] text-white rounded-tr-sm' : 'bg-white/5 text-[var(--color-text-primary)] border border-white/5 rounded-tl-sm'}`}>
                              <p className="text-sm font-medium leading-relaxed">{msg.message}</p>
                              <p className={`text-[8px] mt-2 font-bold uppercase tracking-widest ${isMe ? 'opacity-50 text-right' : 'text-[var(--color-text-muted)]'}`}>
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        )
                    })}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Input */}
                  <form 
                    className="p-4 bg-[var(--color-surface)] border-t border-white/5 flex gap-2"
                    onSubmit={(e) => {
                      e.preventDefault()
                      if (!chatMessage.trim()) return
                      const meta = selectedReceipt.items.find(i => i.is_sales_data) || { amount_paid: 0, chat_history: [] }
                      const newChat = [...(meta.chat_history || []), { sender: 'user', message: chatMessage.trim(), timestamp: new Date().toISOString() }]
                      const cleanedItems = selectedReceipt.items.filter(i => !i.is_sales_data)
                      cleanedItems.push({ ...meta, chat_history: newChat, product_id: 'sales-tracker', is_sales_data: true, quantity: 1, price: 0 })
                      updateOrder(selectedReceipt.id, { items: cleanedItems })
                      setChatMessage('')
                    }}
                  >
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={e => setChatMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm focus:border-[var(--color-accent)] transition-all"
                    />
                    <button type="submit" disabled={!chatMessage.trim()} className="w-12 h-12 flex items-center justify-center rounded-xl bg-[var(--color-accent)] text-white disabled:opacity-30">
                      <FiTruck className="rotate-[135deg]" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
