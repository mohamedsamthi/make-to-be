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
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="mb-1 text-3xl font-black text-[var(--color-text-primary)] font-[var(--font-family-heading)]">Order Management</h1>
          <p className="text-sm text-[var(--color-text-muted)]">Manage, track and update customer purchases</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-72">
            <FiSearch className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders..."
              className="input-field w-full pl-11"
            />
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Orders', value: stats.total, icon: <FiPackage />, color: 'from-blue-500/15' },
          { label: 'Pending', value: stats.pending, icon: <FiClock />, color: 'from-amber-500/15' },
          { label: 'Completed', value: stats.completed, icon: <FiCheck />, color: 'from-emerald-500/15' },
          { label: 'Total Revenue', value: `Rs.${stats.revenue.toLocaleString()}`, icon: <span className="text-sm font-bold">Rs.</span>, color: 'from-[var(--color-accent)]/15' },
        ].map((s, i) => (
          <div
            key={i}
            className={`animate-fadeInUp rounded-2xl border border-[var(--color-border)] bg-gradient-to-br ${s.color} to-[var(--color-surface-card)] p-5 shadow-lg`}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-surface-light)] text-lg text-[var(--color-text-secondary)]">
              {s.icon}
            </div>
            <p className="text-2xl font-black text-[var(--color-text-primary)]">{s.value}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-xl">
        <div className="flex flex-wrap items-center gap-2 border-b border-[var(--color-border)] bg-[var(--color-surface-light)] p-4">
          {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFilter(t)}
              className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                filter === t
                  ? 'bg-[var(--color-accent)] text-black shadow-md shadow-[var(--color-accent)]/25'
                  : 'text-[var(--color-text-muted)] hover:bg-[var(--color-border)]/40 hover:text-[var(--color-text-primary)]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-light)]">
                <th className="px-6 py-5 text-left text-[11px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Order Info</th>
                <th className="px-6 py-5 text-left text-[11px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Customer</th>
                <th className="px-6 py-5 text-left text-[11px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Items Delivery</th>
                <th className="px-6 py-5 text-left text-[11px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Total</th>
                <th className="px-6 py-5 text-left text-[11px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Status Updates</th>
                <th className="px-6 py-5 text-right text-[11px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filtered.length > 0 ? filtered.map((order, idx) => (
                <tr key={order.id} className="group animate-fadeInUp transition-colors hover:bg-[var(--color-surface-light)]" style={{ animationDelay: `${idx * 0.05}s` }}>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-2 rounded-full bg-gradient-to-b ${
                        order.status === 'delivered' ? 'from-emerald-500 to-teal-500' : 
                        order.status === 'cancelled' ? 'from-red-500 to-pink-500' : 
                        'from-[var(--color-accent)] to-[var(--color-accent-dark)]'}`} 
                      />
                      <div>
                        <p className="font-mono text-sm font-black text-[var(--color-text-primary)]">{order.id}</p>
                        <p className="mt-0.5 text-[10px] text-[var(--color-text-muted)]">{new Date(order.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-[var(--color-text-primary)]">{order.customer_name}</p>
                      <div className="flex items-center gap-2">
                         <span className="font-mono text-[10px] text-[var(--color-text-muted)]">{order.customer_phone}</span>
                         <a 
                           href={`https://wa.me/${order.customer_phone.replace(/\D/g,'')}?text=Hello ${order.customer_name}, regarding your order ${order.id}...`}
                           target="_blank" rel="noreferrer"
                           className="rounded-lg bg-emerald-500/10 p-1.5 text-emerald-600 transition-all hover:bg-emerald-500 hover:text-white dark:text-emerald-400"
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
                          <span key={i} className="whitespace-nowrap rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-light)] px-2 py-0.5 text-[10px] text-[var(--color-text-secondary)]">
                            {item.product_name} <span className="font-bold text-[var(--color-accent)]">×{item.quantity}</span>
                          </span>
                        ))}
                      </div>
                      <p className="mt-2 line-clamp-1 text-[10px] italic text-[var(--color-text-muted)]">{order.customer_address}</p>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <p className="text-base font-black text-[var(--color-text-primary)]">LKR {order.total.toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col gap-2">
                       <select
                        value={order.status}
                        onChange={e => handleStatusChange(order.id, 'status', e.target.value)}
                        className={`input-field cursor-pointer px-3 py-2 text-[11px] font-bold ${
                          order.status === 'delivered' ? 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400' : 
                          order.status === 'cancelled' ? 'border-red-500/40 text-red-600 dark:text-red-400' : 
                          'text-[var(--color-accent)]'
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
                        className={`input-field cursor-pointer px-3 py-2 text-[11px] font-bold ${
                          order.payment_status === 'paid' ? 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
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
                    <div className="flex flex-col items-center gap-4 text-[var(--color-text-muted)]">
                       <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-surface-light)] text-2xl">📦</div>
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


