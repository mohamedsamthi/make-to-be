import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiShoppingBag, FiPackage, FiStar, FiPercent } from 'react-icons/fi'
import { useProducts } from '../../context/ProductContext'

export default function DashboardPage() {
  const { products, orders, promotions } = useProducts()

  const totalRevenue = orders.reduce((sum, o) => o.payment_status === 'paid' ? sum + o.total : sum, 0)
  const totalOrders = orders.length
  const totalProducts = products.length
  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const totalExpenses = 15000
  const profit = totalRevenue - totalExpenses
  const totalDiscount = products.reduce((sum, p) => p.discount_price ? sum + (p.price - p.discount_price) : sum, 0)

  const stats = [
    { label: 'Total Revenue', value: `LKR ${totalRevenue.toLocaleString()}`, icon: <FiDollarSign size={22} />, color: 'from-green-500/20 to-green-500/5', iconBg: 'bg-green-500/15 text-green-400', trend: '+12%', trendUp: true },
    { label: 'Total Expenses', value: `LKR ${totalExpenses.toLocaleString()}`, icon: <FiTrendingDown size={22} />, color: 'from-red-500/20 to-red-500/5', iconBg: 'bg-red-500/15 text-red-400', trend: '-3%', trendUp: false },
    { label: 'Net Profit', value: `LKR ${profit.toLocaleString()}`, icon: <FiTrendingUp size={22} />, color: 'from-[var(--color-gold)]/20 to-[var(--color-gold)]/5', iconBg: 'bg-[var(--color-gold)]/15 text-[var(--color-gold)]', trend: '+18%', trendUp: true },
    { label: 'Total Products', value: totalProducts, icon: <FiShoppingBag size={22} />, color: 'from-purple-500/20 to-purple-500/5', iconBg: 'bg-purple-500/15 text-purple-400', info: `${totalProducts} items` },
    { label: 'Total Orders', value: totalOrders, icon: <FiPackage size={22} />, color: 'from-blue-500/20 to-blue-500/5', iconBg: 'bg-blue-500/15 text-blue-400', info: `${pendingOrders} pending` },
    { label: 'Total Discounts', value: `LKR ${totalDiscount.toLocaleString()}`, icon: <FiPercent size={22} />, color: 'from-[var(--color-accent)]/20 to-[var(--color-accent)]/5', iconBg: 'bg-[var(--color-accent)]/15 text-[var(--color-accent)]', info: 'Active deals' }
  ]

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-[var(--font-family-heading)] mb-1">Dashboard Overview</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">Here's what's happening with your store</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className={`p-5 rounded-2xl bg-gradient-to-br ${stat.color} border border-[var(--color-border)] card-hover animate-fadeInUp`} style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${stat.iconBg} flex items-center justify-center`}>{stat.icon}</div>
              {stat.trendUp !== undefined ? (
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${stat.trendUp ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>{stat.trend}</span>
              ) : (
                <span className="text-xs text-[var(--color-text-muted)] bg-white/5 px-2.5 py-1 rounded-lg">{stat.info}</span>
              )}
            </div>
            <p className="text-2xl font-bold mb-1">{stat.value}</p>
            <p className="text-xs text-[var(--color-text-muted)] font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] overflow-hidden mb-8">
        <div className="p-5 border-b border-[var(--color-border)] flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold font-[var(--font-family-heading)]">Recent Orders</h3>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{totalOrders} total</p>
          </div>
          {pendingOrders > 0 && <span className="badge badge-accent">{pendingOrders} pending</span>}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-white/2">
                {['Order ID', 'Customer', 'Total', 'Status', 'Payment', 'Date'].map(h => (
                  <th key={h} className="text-left text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b border-[var(--color-border)] hover:bg-white/3 transition-colors">
                  <td className="px-5 py-3.5 text-sm font-mono font-bold text-[var(--color-accent)]">{order.id}</td>
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium">{order.customer_name}</p>
                    <p className="text-[11px] text-[var(--color-text-muted)]">{order.customer_phone}</p>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-bold">LKR {order.total.toLocaleString()}</td>
                  <td className="px-5 py-3.5">
                    <span className={`badge text-[11px] capitalize ${order.status === 'delivered' ? 'badge-success' : order.status === 'shipped' ? 'badge-accent' : 'badge-gold'}`}>{order.status}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`badge text-[11px] capitalize ${order.payment_status === 'paid' ? 'badge-success' : 'badge-gold'}`}>{order.payment_status}</span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-[var(--color-text-muted)]">{order.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] overflow-hidden">
          <div className="p-5 border-b border-[var(--color-border)]">
            <h3 className="text-lg font-bold font-[var(--font-family-heading)]">Top Products</h3>
          </div>
          <div className="p-5 space-y-4">
            {[...products].sort((a, b) => b.review_count - a.review_count).slice(0, 5).map((p, i) => (
              <div key={p.id} className="flex items-center gap-4">
                <span className="text-sm font-bold text-[var(--color-text-muted)] w-5 shrink-0">{i + 1}</span>
                <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-[var(--color-border)]">
                  <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-[11px] text-[var(--color-text-muted)]">{p.review_count} reviews</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <FiStar size={13} className="text-[var(--color-gold)]" />
                  <span className="text-sm font-bold">{p.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] overflow-hidden">
          <div className="p-5 border-b border-[var(--color-border)]">
            <h3 className="text-lg font-bold font-[var(--font-family-heading)]">Recent Activity</h3>
          </div>
          <div className="p-5 space-y-4">
            {[
              { action: 'New order placed', detail: 'ORD-003 • LKR 19,998', time: '2h ago', color: 'bg-green-400' },
              { action: 'Payment received', detail: 'ORD-002 • LKR 22,000', time: '5h ago', color: 'bg-[var(--color-gold)]' },
              { action: 'New customer registered', detail: 'Fatima Noorudeen', time: '1d ago', color: 'bg-blue-400' },
              { action: 'Order shipped', detail: 'ORD-002', time: '1d ago', color: 'bg-purple-400' },
              { action: 'Order delivered', detail: 'ORD-001', time: '3d ago', color: 'bg-[var(--color-accent)]' }
            ].map((a, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${a.color} shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{a.action}</p>
                  <p className="text-[11px] text-[var(--color-text-muted)]">{a.detail}</p>
                </div>
                <span className="text-[11px] text-[var(--color-text-muted)] whitespace-nowrap shrink-0">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
