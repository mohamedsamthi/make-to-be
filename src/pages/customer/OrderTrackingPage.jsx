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
    <div className="min-h-screen bg-[#151230] text-gray-200 font-sans relative">
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
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="bg-[#1e1c3a]/80 backdrop-blur-md py-6 border-b border-white/10 relative z-10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <Link to="/profile" className="text-sm text-violet-400 font-semibold flex items-center gap-2 mb-3 hover:text-violet-300 transition-all">
            <FiArrowLeft size={16} /> Back to Profile
          </Link>
          <h1 className="text-3xl font-black text-white tracking-tight">
            <FiPackage className="inline mr-3 mb-1" /> My Orders & Tracking
          </h1>
          <p className="text-sm text-gray-400 mt-1">Track your order statuses and view your receipts</p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 relative z-10">
        {userOrders.length > 0 ? (
          <div className="space-y-6">
            {userOrders.map((order, idx) => (
              <div
                key={order.id}
                className="rounded-3xl bg-[#1e1c3a] border border-white/10 overflow-hidden shadow-2xl animate-fadeInUp hover:border-violet-500/30 transition-all duration-300"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {/* Order Header */}
                <div className="p-6 sm:p-8 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 bg-white/5 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-violet-500 to-fuchsia-500" />
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">{order.id}</h3>
                      <span className={`px-3 py-1 text-xs font-bold rounded-full capitalize ${
                        order.status === 'delivered' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        order.status === 'shipped' ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30' :
                        order.status === 'confirmed' || order.status === 'processing' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>{order.status}</span>
                      <span className={`px-3 py-1 text-xs font-bold rounded-full capitalize ${
                        order.payment_status === 'paid' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>{order.payment_status}</span>
                    </div>
                    <p className="text-xs font-medium text-gray-400">Ordered on {new Date(order.created_at).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-white">LKR {order.total.toLocaleString()}</p>
                    <p className="text-sm font-medium text-gray-400">{order.items.filter(i => !i.is_sales_data).length} item{order.items.filter(i => !i.is_sales_data).length !== 1 ? 's' : ''}</p>
                  </div>
                </div>

                {/* Status Tracker */}
                <div className="p-6 sm:p-10 bg-black/20">
                  <OrderStatusTracker status={order.status} />
                </div>

                {/* Actions */}
                <div className="p-6 sm:p-8 border-t border-white/10 flex flex-wrap gap-4 items-center bg-white/5">
                  <button
                    onClick={() => { setSelectedReceiptId(order.id); setActiveTab('receipt'); }}
                    className="flex-1 sm:flex-none flex justify-center items-center gap-2 py-3 px-6 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm transition-all shadow-lg shadow-violet-500/25 relative"
                  >
                    <FiFileText size={18} /> View Receipt & Chat
                    {(order.items?.find(i => i.is_sales_data)?.chat_history || []).slice(-1)[0]?.sender === 'admin' && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-[#151230] rounded-full animate-pulse" />
                    )}
                  </button>
                  <a
                    href={`${shopInfo.socialMedia.whatsapp}?text=${encodeURIComponent(`Hi! I want to check the status of my order ${order.id}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-none flex justify-center items-center gap-2 py-3 px-6 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] font-bold text-sm hover:bg-[#25D366] hover:text-white transition-all shadow-lg shadow-[#25D366]/20"
                  >
                    <FaWhatsapp size={18} /> Follow up Order
                  </a>
                  <button
                    onClick={() => {
                      Swal.fire({
                        title: 'Cancel & Delete Order?',
                        text: "This will remove your order from the system permanently.",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#ef4444',
                        cancelButtonColor: '#374151',
                        confirmButtonText: 'Yes, Delete it!',
                        background: '#1e1c3a',
                        color: '#fff'
                      }).then((result) => {
                        if (result.isConfirmed) {
                          deleteOrder(order.id)
                          toast.success('Order deleted successfully')
                        }
                      })
                    }}
                    className="flex-1 sm:flex-none flex justify-center items-center gap-2 py-3 px-6 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 font-bold text-sm hover:bg-red-500 hover:text-white transition-all shadow-lg hover:shadow-red-500/20"
                  >
                    <FiTrash2 size={18} /> Delete Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#1e1c3a] border border-white/10 rounded-3xl shadow-2xl max-w-lg mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 flex items-center justify-center border border-white/10">
              <span className="text-5xl">📦</span>
            </div>
            <h2 className="text-2xl font-black mb-3 text-white tracking-tight">No Orders Yet</h2>
            <p className="text-gray-400 mb-8 max-w-xs mx-auto text-sm leading-relaxed">It looks like you haven't bought anything from our premium collection yet.</p>
            <Link to="/products" className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-lg shadow-violet-500/25">
              Start Shopping
            </Link>
          </div>
        )}
      </div>

      {/* Bill/Receipt/Chat Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pb-20 sm:pb-6 overflow-y-auto">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedReceiptId(null)} />
          
          <div className="relative z-10 w-full max-w-lg bg-[#151230] rounded-2xl shadow-2xl overflow-hidden animate-fadeInUp text-gray-200 my-auto border border-violet-500/30">
            
            {/* Modal Header */}
            <div className="bg-[#1e1c3a] p-5 border-b border-violet-500/30 flex justify-between items-center">
               <div>
                  <h2 className="text-lg font-black tracking-tight mb-0.5 flex items-center gap-2 text-white">
                    Order Center
                  </h2>
                  <p className="text-xs text-violet-300 font-mono">{selectedReceipt.id}</p>
               </div>
               <button onClick={() => setSelectedReceiptId(null)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-red-500/80 flex items-center justify-center transition-colors">
                  <FiX size={16} />
               </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10 bg-[#1e1c3a]/50">
               <button onClick={() => setActiveTab('receipt')} className={`flex-1 py-3 text-sm font-bold uppercase tracking-widest transition-all ${activeTab === 'receipt' ? 'bg-violet-600 text-white border-b-2 border-fuchsia-400' : 'text-gray-400 hover:bg-white/5'}`}>
                 Digital Receipt
               </button>
               <button onClick={() => setActiveTab('chat')} className={`flex-1 py-3 text-sm font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'chat' ? 'bg-violet-600 text-white border-b-2 border-fuchsia-400' : 'text-gray-400 hover:bg-white/5'}`}>
                 Live Chat
                 {(selectedReceipt.items.find(i => i.is_sales_data)?.chat_history?.length > 0) && (
                   <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                 )}
               </button>
            </div>

            {/* Modal Body */}
            {activeTab === 'receipt' ? (
              <div className="p-6 bg-white text-gray-800 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] max-h-[60vh] overflow-y-auto custom-scrollbar relative printable-receipt">
                <div className="flex justify-between items-start border-b-2 border-dashed border-gray-300 pb-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                         <div className="w-8 h-8 bg-violet-600 rounded flex items-center justify-center text-white font-black">M</div>
                         <h2 className="text-xl font-black text-gray-900 tracking-tighter">MAKE TO BE</h2>
                      </div>
                      <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Billed To</h3>
                      <p className="text-base font-bold text-gray-900">{selectedReceipt.customer_name}</p>
                      <p className="text-sm text-gray-600">{selectedReceipt.customer_phone}</p>
                      <p className="text-[10px] text-gray-500 max-w-[200px] mt-1 line-clamp-2 italic">{selectedReceipt.customer_address}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Receipt ID</p>
                      <p className="text-xs font-mono font-bold text-violet-600">{selectedReceipt.id}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 mb-1">Date</p>
                      <p className="text-xs font-bold text-gray-900">{new Date(selectedReceipt.created_at).toLocaleDateString()}</p>
                      
                      {(() => {
                        const paid = selectedReceipt.items.find(i => i.is_sales_data)?.amount_paid || 0;
                        const total = selectedReceipt.total;
                        const isFullyPaid = paid >= total || selectedReceipt.payment_status === 'paid';
                        
                        return (
                          <div className={`mt-3 px-3 py-1 text-[10px] font-black uppercase rounded-full border shadow-sm ${
                            isFullyPaid ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                          }`}>
                            {isFullyPaid ? '✅ Full Payment Received' : `⌛ Payment Pending: LKR ${(total - paid).toLocaleString()} Left`}
                          </div>
                        )
                      })()}
                    </div>
                </div>

                <table className="w-full mb-6">
                  <thead>
                    <tr className="border-b-2 border-gray-900">
                      <th className="text-left text-xs font-black text-gray-900 uppercase py-3">Item Description</th>
                      <th className="text-center text-xs font-black text-gray-900 uppercase py-3">Qty</th>
                      <th className="text-right text-xs font-black text-gray-900 uppercase py-3">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedReceipt.items.filter(i => !i.is_sales_data).map((item, i) => (
                      <tr key={i}>
                        <td className="py-4 text-sm font-medium text-gray-800">
                          {item.product_name}
                          {(item.size || item.color) && (
                            <span className="block text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-widest">{item.size && `Size: ${item.size}`} • {item.color && `Color: ${item.color}`}</span>
                          )}
                        </td>
                        <td className="py-4 text-sm text-center text-gray-600">{item.quantity}</td>
                        <td className="py-4 text-sm font-bold text-right text-gray-900">LKR {(item.price * item.quantity).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="space-y-3 pt-4 border-t border-gray-200 mb-6">
                  <div className="flex justify-between items-center text-xs text-gray-500 font-bold uppercase tracking-wider">
                    <span>Subtotal</span>
                    <span className="text-gray-900">LKR {selectedReceipt.items.filter(i => !i.is_sales_data).reduce((s,i) => s + (i.price*i.quantity), 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-500 font-bold uppercase tracking-wider">
                    <span>Shipping & Handling</span>
                    <span className="text-gray-900">LKR {(selectedReceipt.total - selectedReceipt.items.filter(i => !i.is_sales_data).reduce((s,i) => s + (i.price*i.quantity), 0)).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center bg-violet-600 p-4 rounded-xl text-white shadow-lg shadow-violet-600/20">
                    <span className="text-sm font-black uppercase tracking-widest">Total Amount Paid</span>
                    <span className="text-xl font-black">LKR {selectedReceipt.total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="text-center pt-4 border-t border-dashed border-gray-300">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-4">Thank you for shopping with Make To Be!</p>
                  <button 
                    onClick={handlePrintReceipt}
                    className="no-print w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white py-3 rounded-xl font-bold transition-all"
                  >
                    <FiPrinter size={18} /> Print or Save as PDF
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-[60vh] bg-[#1e1c3a]">
                {/* Chat Details Banner */}
                <div className="p-4 bg-emerald-500/10 border-b border-emerald-500/20 flex justify-between items-center">
                   <div className="text-xs">
                     <p className="text-emerald-400 font-bold uppercase tracking-widest mb-0.5">Payment Balance</p>
                     <p className="text-gray-300">
                       LKR {Math.max(0, selectedReceipt.total - (selectedReceipt.items.find(i => i.is_sales_data)?.amount_paid || 0)).toLocaleString()} Due
                     </p>
                   </div>
                   <div className="text-right text-xs">
                     <p className="text-emerald-400 font-bold uppercase tracking-widest mb-0.5">Paid So Far</p>
                     <p className="text-white font-bold">LKR {(selectedReceipt.items.find(i => i.is_sales_data)?.amount_paid || 0).toLocaleString()}</p>
                   </div>
                </div>

                {/* Chat History */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-[#151230]/50">
                  <div className="text-center pb-2">
                    <span className="text-[10px] bg-white/5 px-3 py-1 text-gray-400 font-bold rounded-full">Secure Live Chat Enabled</span>
                  </div>

                  {(selectedReceipt.items.find(i => i.is_sales_data)?.chat_history || []).length === 0 ? (
                    <div className="text-center text-gray-500 text-sm mt-10">No messages yet. Say hi!</div>
                  ) : (
                    (selectedReceipt.items.find(i => i.is_sales_data)?.chat_history || []).map((msg, i) => {
                      const isMe = msg.sender === 'user'
                      const isSystem = msg.sender === 'system'

                      if (isSystem) {
                        return (
                          <div key={i} className="flex justify-center my-3">
                            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] px-4 py-1.5 rounded-full font-bold">
                              {msg.message}
                            </div>
                          </div>
                        )
                      }
                      
                      return (
                        <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[75%] p-3.5 rounded-2xl ${
                            isMe 
                              ? 'bg-violet-600 text-white rounded-tr-sm shadow-lg shadow-violet-500/20' 
                              : 'bg-white/10 text-gray-200 rounded-tl-sm border border-white/5'
                          }`}>
                            <p className="text-sm font-medium">{msg.message}</p>
                            <p className={`text-[9px] mt-1.5 ${isMe ? 'text-violet-200 text-right opacity-80' : 'text-gray-500'}`}>
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      )
                    })
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <form 
                  className="p-4 border-t border-white/5 bg-[#1e1c3a] flex gap-2"
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
                    placeholder="Message Make To Be..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                  />
                  <button type="submit" disabled={!chatMessage.trim()} className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white w-12 h-12 flex items-center justify-center rounded-xl disabled:opacity-50">
                    <FiArrowLeft size={18} className="rotate-[135deg]" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
