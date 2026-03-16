import { useState, useRef, useEffect } from 'react'
import { FiSearch, FiDollarSign, FiMessageCircle, FiX, FiSend, FiPlus, FiCheckCircle, FiTrash2 } from 'react-icons/fi'
import { useProducts } from '../../context/ProductContext'
import toast from 'react-hot-toast'

export default function AdminSalesPage() {
  const { orders, updateOrder, deleteOrder } = useProducts()
  const [search, setSearch] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [chatMessage, setChatMessage] = useState('')
  const [addPayment, setAddPayment] = useState('')
  
  const chatEndRef = useRef(null)

  const filtered = orders.filter(o =>
    o.id.toLowerCase().includes(search.toLowerCase()) ||
    o.customer_name.toLowerCase().includes(search.toLowerCase())
  ).sort((a,b) => new Date(b.created_at) - new Date(a.created_at))

  // Auto-scroll chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [selectedOrder])

  const getSalesData = (order) => {
    const meta = order?.items?.find(i => i.is_sales_data) || { amount_paid: 0, chat_history: [] }
    return {
      is_sales_data: true,
      amount_paid: Number(meta.amount_paid) || 0,
      chat_history: meta.chat_history || []
    }
  }

  const updateOrderSalesData = (orderId, newSalesData) => {
    const order = orders.find(o => o.id === orderId)
    if (!order) return;
    
    // Filter out old sales data
    const cleanedItems = order.items.filter(i => !i.is_sales_data)
    cleanedItems.push({ ...newSalesData, product_id: 'sales-tracker', is_sales_data: true, quantity: 1, price: 0 })
    
    updateOrder(orderId, { items: cleanedItems })
    setSelectedOrder({ ...order, items: cleanedItems }) // local update to rerender modal instantly
  }

  const handleAddPayment = (e) => {
    e.preventDefault()
    if (!addPayment || isNaN(addPayment) || Number(addPayment) <= 0) return;
    
    const currentSales = getSalesData(selectedOrder)
    const newPaid = currentSales.amount_paid + Number(addPayment)
    
    // Auto-update to full payment if paid matches total
    if (newPaid >= selectedOrder.total) {
      updateOrder(selectedOrder.id, { payment_status: 'paid' })
      toast.success('Full payment complete!')
    }

    const newChat = [...currentSales.chat_history, { sender: 'system', message: `✅ Admin logged payment of LKR ${Number(addPayment).toLocaleString()}`, timestamp: new Date().toISOString() }]
    
    updateOrderSalesData(selectedOrder.id, {
      ...currentSales,
      amount_paid: newPaid,
      chat_history: newChat
    })
    setAddPayment('')
    toast.success('Payment logged successfully')
  }

  const handleSendChat = (e) => {
    e.preventDefault()
    if (!chatMessage.trim()) return;
    
    const currentSales = getSalesData(selectedOrder)
    const newChat = [...currentSales.chat_history, { sender: 'admin', message: chatMessage.trim(), timestamp: new Date().toISOString() }]
    
    updateOrderSalesData(selectedOrder.id, {
      ...currentSales,
      chat_history: newChat
    })
    setChatMessage('')
  }

  const markFullPayment = () => {
    const currentSales = getSalesData(selectedOrder)
    const balance = selectedOrder.total - currentSales.amount_paid
    if (balance <= 0) {
      toast.success('Already fully paid.')
      return
    }

    const newChat = [...currentSales.chat_history, { sender: 'system', message: `✅ Full payment completed! Payment confirmed.`, timestamp: new Date().toISOString() }]
    
    updateOrderSalesData(selectedOrder.id, {
      ...currentSales,
      amount_paid: selectedOrder.total,
      chat_history: newChat
    })
    updateOrder(selectedOrder.id, { payment_status: 'paid' })
    toast.success('Sales marked as fully paid!')
  }

  return (
    <div className="max-w-[1400px] mx-auto pb-10">
      <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-[var(--font-family-heading)]">Sales Tracker & Payment Chat</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">Manage partial payments and chat securely with customers</p>
        </div>
      </div>

      <div className="relative mb-6 max-w-sm">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={16} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search order ID or customer..." className="input-field pl-11" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(order => {
          const salesData = getSalesData(order)
          const balance = order.total - salesData.amount_paid
          const isFullyPaid = balance <= 0
          
          return (
            <div key={order.id} className="p-6 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] hover:border-amber-500/50 cursor-pointer transition-all shadow-lg hover:shadow-amber-500/10 group select-none relative">
              {/* Delete button on card */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`Delete order ${order.id}? This cannot be undone.`)) {
                    deleteOrder(order.id);
                    toast.success('Order deleted');
                  }
                }}
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 z-10"
                title="Delete Order"
              >
                <FiTrash2 size={14} />
              </button>
              
              <div onClick={() => setSelectedOrder(order)}>
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">{order.id}</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${isFullyPaid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                  {isFullyPaid ? 'Settled' : 'Pending'}
                </span>
              </div>
              <p className="text-sm font-semibold mb-1">{order.customer_name}</p>
              
              <div className="mt-4 p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Total Bill</span>
                  <span className="font-bold">LKR {order.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Total Paid</span>
                  <span className="font-bold text-emerald-400">LKR {salesData.amount_paid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between tracking-wide font-bold pt-2 mt-2 border-t border-white/10">
                  <span className="text-gray-300">Balance</span>
                  <span className={isFullyPaid ? 'text-gray-500' : 'text-rose-400'}>
                    LKR {Math.max(0, balance).toLocaleString()}
                  </span>
                </div>
              </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Sales / Chat Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}>
          <div className="w-full max-w-4xl h-[85vh] flex overflow-hidden bg-[#1e1c3a] border border-white/10 rounded-2xl shadow-2xl animate-fadeInUp" onClick={e => e.stopPropagation()}>
            
            {/* Left Side: Payment Details */}
            <div className="w-1/3 min-w-[300px] border-r border-white/5 bg-[#151230] flex flex-col hide-scrollbar overflow-y-auto">
              <div className="p-6 border-b border-white/5">
                <h2 className="text-lg font-bold">Manage Sales</h2>
                <p className="text-xs text-amber-400 font-mono mt-1">{selectedOrder.id}</p>
              </div>
              
              <div className="p-6 space-y-6 flex-1">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 text-center">
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Total Bill</p>
                  <p className="text-2xl font-black text-white">LKR {selectedOrder.total.toLocaleString()}</p>
                </div>
                
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                  <p className="text-xs text-emerald-400 uppercase tracking-widest font-bold mb-1">Amount Paid</p>
                  <p className="text-2xl font-black text-emerald-400">LKR {getSalesData(selectedOrder).amount_paid.toLocaleString()}</p>
                </div>

                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center">
                  <p className="text-xs text-rose-400 uppercase tracking-widest font-bold mb-1">Balance Due</p>
                  <p className="text-2xl font-black text-rose-400">LKR {Math.max(0, selectedOrder.total - getSalesData(selectedOrder).amount_paid).toLocaleString()}</p>
                </div>

                {/* Add Payment Form */}
                <form onSubmit={handleAddPayment} className="pt-4 border-t border-white/10">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Log Partial Payment</label>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      value={addPayment} 
                      onChange={e => setAddPayment(e.target.value)} 
                      placeholder="e.g. 5000" 
                      className="input-field flex-1"
                    />
                    <button type="submit" className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white px-4 rounded-xl transition-colors font-bold border border-emerald-500/20">
                      <FiPlus size={18} />
                    </button>
                  </div>
                </form>

                <button onClick={markFullPayment} className="w-full mt-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20">
                  <FiCheckCircle /> Mark Full Payment Complete
                </button>

                <button 
                  onClick={() => {
                    if (window.confirm(`Delete order ${selectedOrder.id}? This cannot be undone.`)) {
                      deleteOrder(selectedOrder.id);
                      setSelectedOrder(null);
                      toast.success('Order deleted');
                    }
                  }} 
                  className="w-full mt-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <FiTrash2 /> Delete This Order
                </button>
              </div>
            </div>

            {/* Right Side: Chat System */}
            <div className="flex-1 flex flex-col bg-[#1e1c3a]">
              <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-fuchsia-500 flex items-center justify-center font-bold shadow-lg">
                    {selectedOrder.customer_name[0].toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold">{selectedOrder.customer_name}</h3>
                    <p className="text-xs text-emerald-400">Live Custom Order Chat</p>
                  </div>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center transition-colors">
                  <FiX />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar">
                <div className="text-center pb-4">
                  <span className="text-[10px] bg-white/5 px-3 py-1 rounded-full text-gray-400 font-medium">Chat Started on {new Date(selectedOrder.created_at).toLocaleDateString()}</span>
                </div>
                
                {getSalesData(selectedOrder).chat_history.map((msg, i) => {
                  const isAdmin = msg.sender === 'admin'
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
                    <div key={i} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] p-3.5 rounded-2xl ${
                        isAdmin 
                          ? 'bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white rounded-tr-sm shadow-lg shadow-violet-500/20' 
                          : 'bg-white/10 border border-white/5 text-gray-200 rounded-tl-sm'
                      }`}>
                        <p className="text-sm font-medium leading-relaxed">{msg.message}</p>
                        <p className={`text-[9px] mt-1.5 ${isAdmin ? 'text-violet-200 opacity-80 text-right' : 'text-gray-500'}`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  )
                })}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-5 border-t border-white/5 bg-[#151230]">
                <form onSubmit={handleSendChat} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={e => setChatMessage(e.target.value)}
                    placeholder="Type a message to the customer..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-sm text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
                  />
                  <button type="submit" disabled={!chatMessage.trim()} className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-amber-500/20 hover:scale-105">
                    <FiSend size={18} />
                  </button>
                </form>
              </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  )
}
