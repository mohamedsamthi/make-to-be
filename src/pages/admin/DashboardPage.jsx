import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiShoppingBag, FiPackage, FiStar, FiPercent } from 'react-icons/fi'
import { useProducts } from '../../context/ProductContext'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function DashboardPage() {
  const { products, orders, promotions, reviews } = useProducts()

  const totalRevenue = orders.reduce((sum, o) => o.payment_status === 'paid' ? sum + o.total : sum, 0)
  const totalOrders = orders.length
  const totalProducts = products.length
  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const totalExpenses = 15000
  const profit = totalRevenue - totalExpenses
  const totalDiscount = products.reduce((sum, p) => p.discount_price ? sum + (p.price - p.discount_price) : sum, 0)

  // Prepare chart data from real orders (last 7 days logic or just chronological)
  const chartData = [...orders].reverse().reduce((acc, order) => {
    const date = new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const existing = acc.find(item => item.name === date)
    if (existing) {
      if (order.payment_status === 'paid') existing.revenue += order.total
    } else {
      acc.push({ name: date, revenue: order.payment_status === 'paid' ? order.total : 0 })
    }
    return acc
  }, []).slice(-10) // show last 10 days of activity

  if (chartData.length === 0) {
    chartData.push({ name: 'No Data', revenue: 0 })
  }

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

      {/* Revenue Chart */}
      <div className="rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] overflow-hidden mb-8 p-5">
        <div className="mb-6">
          <h3 className="text-lg font-bold font-[var(--font-family-heading)]">Revenue Overview</h3>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Real-time revenue from completed orders</p>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e94560" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#e94560" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis 
                stroke="rgba(255,255,255,0.3)" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `Rs.${value >= 1000 ? (value/1000).toFixed(1)+'k' : value}`}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                formatter={(value) => [`LKR ${value.toLocaleString()}`, 'Revenue']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#e94560" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
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
            {[...products].map(p => {
              const productReviews = reviews.filter(r => r.product_id === p.id)
              const reviewCount = productReviews.length
              const rating = reviewCount > 0 ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1) : 0
              return { ...p, realReviewCount: reviewCount, realRating: rating }
            }).sort((a, b) => b.realReviewCount - a.realReviewCount).slice(0, 5).map((p, i) => (
              <div key={p.id} className="flex items-center gap-4 group">
                <span className="text-sm font-bold text-[var(--color-text-muted)] w-5 shrink-0 group-hover:text-violet-400 transition-colors">{i + 1}</span>
                <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-[var(--color-border)] group-hover:border-violet-500/50 transition-colors">
                  <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-1 min-w-0 py-1">
                  <p className="text-sm font-medium truncate text-white">{p.name}</p>
                  <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">{p.realReviewCount} verified review{p.realReviewCount !== 1 ? 's' : ''}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0 bg-white/5 px-2 py-1 rounded-lg">
                  <FiStar size={12} className={p.realRating > 0 ? "text-[var(--color-gold)]" : "text-gray-600"} />
                  <span className="text-xs font-bold text-white">{p.realRating > 0 ? p.realRating : '-'}</span>
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
            {orders.slice(0, 5).map((o, i) => {
               const isPaid = o.payment_status === 'paid'
               const isRecent = new Date(o.created_at) > new Date(Date.now() - 86400000)
               
               let action = 'New order placed'
               let color = 'bg-blue-400'
               if (o.status === 'delivered') { action = 'Order delivered'; color = 'bg-emerald-400' }
               else if (o.status === 'shipped') { action = 'Order shipped'; color = 'bg-purple-400' }
               else if (isPaid) { action = 'Payment confirmed'; color = 'bg-amber-400' }
               
               // Extract relative time 
               const timeDiff = Math.floor((new Date() - new Date(o.created_at)) / (1000 * 60 * 60))
               let timeStr = `${timeDiff}h ago`
               if (timeDiff > 24) timeStr = `${Math.floor(timeDiff/24)}d ago`
               if (timeDiff === 0) timeStr = 'Just now'

               return (
                  <div key={o.id} className="flex items-start gap-4">
                    <div className={`w-2 h-2 rounded-full mt-2 ${color} shrink-0 animate-pulse`} />
                    <div className="flex-1 min-w-0 border-b border-white/5 pb-3">
                      <p className="text-sm font-bold text-white">{action}</p>
                      <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">{o.id} • LKR {o.total.toLocaleString()} by {o.customer_name}</p>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] whitespace-nowrap shrink-0">{timeStr}</span>
                  </div>
               )
            })}
            
            {orders.length === 0 && (
               <div className="text-center py-8">
                 <p className="text-xs text-gray-400">No recent activity detected.</p>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
