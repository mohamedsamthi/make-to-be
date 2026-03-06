import { useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import { useProducts } from '../../context/ProductContext'
import toast from 'react-hot-toast'

export default function AdminOrdersPage() {
  const { orders, updateOrder } = useProducts()
  const [search, setSearch] = useState('')

  const filtered = orders.filter(o =>
    o.id.toLowerCase().includes(search.toLowerCase()) ||
    o.customer_name.toLowerCase().includes(search.toLowerCase())
  )

  const handleStatusChange = (id, field, value) => {
    updateOrder(id, { [field]: value })
    toast.success(`Order ${field.replace('_', ' ')} updated!`)
  }

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-[var(--font-family-heading)]">Order Management</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">{orders.length} total orders</p>
      </div>

      <div className="relative mb-6 max-w-sm">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={16} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders..." className="input-field pl-11" />
      </div>

      <div className="rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-white/2">
                {['Order', 'Customer', 'Items', 'Total', 'Order Status', 'Payment', 'Date'].map(h => (
                  <th key={h} className="text-left text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider px-5 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => (
                <tr key={order.id} className="border-b border-[var(--color-border)] hover:bg-white/3 transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-sm font-mono font-bold text-[var(--color-accent)]">{order.id}</p>
                    <p className="text-[11px] text-[var(--color-text-muted)]">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium">{order.customer_name}</p>
                    <p className="text-[11px] text-[var(--color-text-muted)]">{order.customer_phone}</p>
                  </td>
                  <td className="px-5 py-4">
                    {order.items.map((item, i) => (
                      <p key={i} className="text-xs text-[var(--color-text-secondary)]">{item.product_name} ×{item.quantity}</p>
                    ))}
                  </td>
                  <td className="px-5 py-4 text-sm font-bold">LKR {order.total.toLocaleString()}</td>
                  <td className="px-5 py-4">
                    <select
                      value={order.status}
                      onChange={e => handleStatusChange(order.id, 'status', e.target.value)}
                      className="input-field text-xs py-2 w-auto min-w-[120px]"
                    >
                      <option value="pending">⏳ Pending</option>
                      <option value="confirmed">✅ Confirmed</option>
                      <option value="processing">📦 Processing</option>
                      <option value="shipped">🚚 Shipped</option>
                      <option value="delivered">📍 Delivered</option>
                      <option value="cancelled">❌ Cancelled</option>
                    </select>
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={order.payment_status}
                      onChange={e => handleStatusChange(order.id, 'payment_status', e.target.value)}
                      className="input-field text-xs py-2 w-auto min-w-[110px]"
                    >
                      <option value="pending">⏳ Pending</option>
                      <option value="paid">✅ Paid</option>
                      <option value="refunded">↩️ Refunded</option>
                    </select>
                  </td>
                  <td className="px-5 py-4 text-sm text-[var(--color-text-muted)]">{order.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
