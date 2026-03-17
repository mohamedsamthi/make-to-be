import { useState } from 'react'
import { FiSearch, FiTrash2, FiPrinter, FiCheckCircle } from 'react-icons/fi'
import { useProducts } from '../../context/ProductContext'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'

export default function AdminOrdersPage() {
  const { orders, updateOrder, deleteOrder } = useProducts()
  const [search, setSearch] = useState('')

  const filtered = orders.filter(o =>
    o.id.toLowerCase().includes(search.toLowerCase()) ||
    o.customer_name.toLowerCase().includes(search.toLowerCase())
  )

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
    <div className="max-w-[1400px] mx-auto pb-10">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold font-[var(--font-family-heading)]">Order Management</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">{orders.length} total orders</p>
        </div>
      </div>

      <div className="relative mb-6 max-w-sm">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={16} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search order ID or customer..." className="input-field pl-11" />
      </div>

      <div className="rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="bg-black/20 border-b border-[var(--color-border)]">
                {['Order', 'Customer', 'Items', 'Total', 'Order Status', 'Payment', 'Date', 'Actions'].map(h => (
                  <th key={h} className="text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest px-6 py-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filtered.map(order => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-5">
                    <p className="text-sm font-mono font-bold text-[var(--color-accent)]">{order.id}</p>
                    <p className="text-[10px] text-gray-500">{order.items.filter(i => !i.is_sales_data).length} items</p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-white leading-tight">{order.customer_name}</p>
                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">{order.customer_phone}</p>
                  </td>
                  <td className="px-6 py-5 max-w-[200px]">
                    <div className="space-y-0.5">
                      {order.items.filter(i => !i.is_sales_data).map((item, i) => (
                        <p key={i} className="text-[11px] text-gray-400 truncate">{item.product_name} <span className="text-[var(--color-accent)] font-bold">×{item.quantity}</span></p>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-black text-white">LKR {order.total.toLocaleString()}</td>
                  <td className="px-6 py-5">
                    <select
                      value={order.status}
                      onChange={e => handleStatusChange(order.id, 'status', e.target.value)}
                      className="bg-black/40 border border-white/10 rounded-lg text-[11px] px-2 py-1.5 focus:border-violet-500 outline-none transition-all cursor-pointer"
                    >
                      <option value="pending">⏳ Pending</option>
                      <option value="confirmed">✅ Confirmed</option>
                      <option value="processing">📦 Processing</option>
                      <option value="shipped">🚚 Shipped</option>
                      <option value="delivered">📍 Delivered</option>
                      <option value="cancelled">❌ Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-5">
                    <select
                      value={order.payment_status}
                      onChange={e => handleStatusChange(order.id, 'payment_status', e.target.value)}
                      className="bg-black/40 border border-white/10 rounded-lg text-[11px] px-2 py-1.5 focus:border-emerald-500 outline-none transition-all cursor-pointer"
                    >
                      <option value="pending">🚫 Pending</option>
                      <option value="paid">💰 Paid</option>
                      <option value="refunded">↩️ Refunded</option>
                    </select>
                  </td>
                  <td className="px-6 py-5 text-[11px] text-gray-500 font-mono whitespace-nowrap">
                    {new Date(order.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <button 
                        onClick={() => handleCompleteOrder(order)}
                        className={`p-2 rounded-xl transition-all shadow-lg ${order.status === 'delivered' && order.payment_status === 'paid' ? 'bg-emerald-500/20 text-emerald-500 cursor-default' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white hover:shadow-emerald-500/20'}`}
                        title="Complete Order (Deliver & Pay)"
                        disabled={order.status === 'delivered' && order.payment_status === 'paid'}
                      >
                        <FiCheckCircle size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteOrder(order.id)}
                        className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg hover:shadow-red-500/20"
                        title="Delete Order"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-20 text-center">
              <p className="text-gray-500 font-bold italic">No orders found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

