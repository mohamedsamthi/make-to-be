import { useState } from 'react'
import { FiSearch, FiTrash2, FiCheckCircle, FiPackage, FiClock, FiCheck, FiDollarSign, FiFilter, FiExternalLink } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { useProducts } from '../../context/ProductContext'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'

export default function AdminOrdersPage() {
  const { orders, updateOrder, deleteOrder } = useProducts()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all') 

  const filtered = (orders || [])
    .filter(o => {
      if (!o) return false
      if (filter === 'all') return true
      return o.status === filter
    })
    .filter(o => {
      const id = String(o.id || '').toLowerCase()
      const name = String(o.customer_name || '').toLowerCase()
      const phone = String(o.customer_phone || '').toLowerCase()
      const term = search.toLowerCase()
      return id.includes(term) || name.includes(term) || phone.includes(term)
    })

  const stats = {
    total: (orders || []).length,
    pending: (orders || []).filter(o => o.status === 'pending').length,
    completed: (orders || []).filter(o => o.status === 'delivered').length,
    revenue: (orders || []).filter(o => o.payment_status === 'paid').reduce((acc, o) => acc + Number(o.total || 0), 0)
  }

  const handleStatusChange = (id, field, value) => {
    updateOrder(id, { [field]: value })
    toast.success(`Order ${field.replace('_', ' ')} updated!`)
  }

  const handleDeleteOrder = (id) => {
    if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      deleteOrder(id)
      toast.success('Order deleted successfully')
    }
  }

  const handleCompleteOrder = (order) => {
    Swal.fire({
      title: 'Complete Order?',
      text: `Mark Order ${order.id} as Delivered and Paid?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#374151',
      confirmButtonText: 'Yes, Complete it!',
      background: '#1e1c3a',
      color: '#fff'
    }).then((result) => {
      if (result.isConfirmed) {
        updateOrder(order.id, { status: 'delivered', payment_status: 'paid' })
        Swal.fire({
          title: 'Success!',
          text: 'Order has been completed.',
          icon: 'success',
          background: '#1e1c3a',
          color: '#fff'
        })
      }
    })
  }

  return (
    <div className="max-w-[1440px] mx-auto pb-10">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-[var(--font-family-heading)] text-white mb-1">Order Management</h1>
          <p className="text-sm text-gray-400">Manage, track and update customer purchases</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="Search orders..." 
              className="w-full md:w-64 bg-white/5 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white focus:border-violet-500 transition-all outline-none" 
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Orders', value: stats.total, icon: <FiPackage />, color: 'from-blue-500/20' },
          { label: 'Pending', value: stats.pending, icon: <FiClock />, color: 'from-amber-500/20' },
          { label: 'Completed', value: stats.completed, icon: <FiCheck />, color: 'from-emerald-500/20' },
          { label: 'Total Revenue', value: `Rs.${stats.revenue.toLocaleString()}`, icon: <span className="font-bold text-sm">Rs.</span>, color: 'from-violet-500/20' },
        ].map((s, i) => (
          <div key={i} className={`p-5 rounded-2xl bg-gradient-to-br ${s.color} to-transparent border border-white/5 animate-fadeInUp shadow-xl`} style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-lg mb-4 text-white/70">{s.icon}</div>
            <p className="text-2xl font-black text-white">{s.value}</p>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters & Table */}
      <div className="bg-[#1e1c3a]/50 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        {/* Tabs */}
        <div className="p-4 border-b border-white/5 flex flex-wrap items-center gap-2 bg-black/20">
          {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${filter === t ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] border-collapse">
            <thead>
              <tr className="bg-white/2 border-b border-white/5">
                <th className="text-left text-[11px] font-bold text-gray-500 uppercase tracking-widest px-6 py-5">Order Info</th>
                <th className="text-left text-[11px] font-bold text-gray-500 uppercase tracking-widest px-6 py-5">Customer</th>
                <th className="text-left text-[11px] font-bold text-gray-500 uppercase tracking-widest px-6 py-5">Items Delivery</th>
                <th className="text-left text-[11px] font-bold text-gray-500 uppercase tracking-widest px-6 py-5">Total</th>
                <th className="text-left text-[11px] font-bold text-gray-500 uppercase tracking-widest px-6 py-5">Status Updates</th>
                <th className="text-right text-[11px] font-bold text-gray-500 uppercase tracking-widest px-6 py-5">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length > 0 ? filtered.map((order, idx) => (
                <tr key={order.id} className="hover:bg-white/[0.03] transition-colors group animate-fadeInUp" style={{ animationDelay: `${idx * 0.05}s` }}>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-10 rounded-full bg-gradient-to-b ${
                        order.status === 'delivered' ? 'from-emerald-500 to-teal-500' : 
                        order.status === 'cancelled' ? 'from-red-500 to-pink-500' : 
                        'from-violet-500 to-fuchsia-500'}`} 
                      />
                      <div>
                        <p className="text-sm font-mono font-black text-white">{order.id}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{new Date(order.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-gray-100">{order.customer_name}</p>
                      <div className="flex items-center gap-2">
                         <span className="text-[10px] font-mono text-gray-500">{order.customer_phone}</span>
                         <a 
                           href={`https://wa.me/${order.customer_phone.replace(/\D/g,'')}?text=Hello ${order.customer_name}, regarding your order ${order.id}...`}
                           target="_blank" rel="noreferrer"
                           className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all"
                         >
                           <FaWhatsapp size={12} />
                         </a>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="max-w-[220px]">
                      <div className="flex flex-wrap gap-1">
                        {(order.items || []).filter(i => i && !i.is_sales_data).map((item, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/5 text-[10px] text-gray-400 whitespace-nowrap">
                            {item.product_name} <span className="text-violet-400 font-bold">×{item.quantity}</span>
                          </span>
                        ))}
                      </div>
                      <p className="text-[10px] text-gray-500 mt-2 line-clamp-1 italic">{order.customer_address}</p>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <p className="text-base font-black text-white">LKR {order.total.toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col gap-2">
                       <select
                        value={order.status}
                        onChange={e => handleStatusChange(order.id, 'status', e.target.value)}
                        className={`bg-black/40 border border-white/10 rounded-xl text-[11px] font-bold px-3 py-2 outline-none transition-all cursor-pointer ${
                          order.status === 'delivered' ? 'text-emerald-400 border-emerald-500/30' : 
                          order.status === 'cancelled' ? 'text-red-400 border-red-500/30' : 
                          'text-violet-400'
                        }`}
                      >
                        <option value="pending">⏳ Pending</option>
                        <option value="confirmed">✅ Confirmed</option>
                        <option value="processing">📦 Processing</option>
                        <option value="shipped">🚚 Shipped</option>
                        <option value="delivered">📍 Delivered</option>
                        <option value="cancelled">❌ Cancelled</option>
                      </select>
                      <select
                        value={order.payment_status}
                        onChange={e => handleStatusChange(order.id, 'payment_status', e.target.value)}
                        className={`bg-black/40 border border-white/10 rounded-xl text-[11px] font-bold px-3 py-2 outline-none transition-all cursor-pointer ${
                          order.payment_status === 'paid' ? 'text-emerald-400 border-emerald-500/30' : 'text-amber-400'
                        }`}
                      >
                        <option value="pending">🚫 Unpaid</option>
                        <option value="paid">💰 Paid</option>
                        <option value="refunded">↩️ Refunded</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <button 
                        onClick={() => handleCompleteOrder(order)}
                        className={`group h-10 px-4 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                          order.status === 'delivered' && order.payment_status === 'paid' 
                          ? 'bg-emerald-500/10 text-emerald-500 cursor-default opacity-50' 
                          : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95'}`}
                        disabled={order.status === 'delivered' && order.payment_status === 'paid'}
                      >
                        <FiCheckCircle size={14} className="group-hover:animate-bounce" />
                        Complete
                      </button>
                      <button 
                        onClick={() => handleDeleteOrder(order.id)}
                        className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center shadow-lg group"
                      >
                        <FiTrash2 size={16} className="group-hover:rotate-12" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="py-32 text-center">
                    <div className="flex flex-col items-center gap-4 text-gray-500">
                       <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-2xl">📦</div>
                       <p className="font-bold italic">No orders found matching your criteria</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


