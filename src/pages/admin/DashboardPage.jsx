import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiShoppingBag, FiPackage, FiStar, FiPercent } from 'react-icons/fi'
import { useProducts } from '../../context/ProductContext'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function DashboardPage() {
  const { products = [], orders = [], promotions = [], reviews = [] } = useProducts() || {}

  const safeOrders = Array.isArray(orders) ? orders : []
  const safeProducts = Array.isArray(products) ? products : []

  const totalRevenue = safeOrders.reduce((sum, o) => (o && o.payment_status === 'paid') ? sum + Number(o.total || 0) : sum, 0)
  const totalOrders = safeOrders.length
  const totalProducts = safeProducts.length
  const pendingOrders = safeOrders.filter(o => o && o.status === 'pending').length
  const totalExpenses = 15000
  const profit = totalRevenue - totalExpenses
  const totalDiscount = safeProducts.reduce((sum, p) => (p && p.discount_price) ? sum + (Number(p.price || 0) - Number(p.discount_price || 0)) : sum, 0)

  // Prepare chart data for the last 7 days (including days with 0 revenue)
  const chartData = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    
    // Sum up revenue for this specific day
    const dayRevenue = safeOrders.reduce((sum, order) => {
      if (!order || !order.created_at || order.payment_status !== 'paid') return sum
      const orderDate = new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      return orderDate === dateStr ? sum + Number(order.total || 0) : sum
    }, 0)

    chartData.push({ name: dateStr, revenue: dayRevenue })
  }

  if (chartData.length === 0) {
    chartData.push({ name: 'No Data', revenue: 0 })
  }

  const stats = [
    { label: 'Total Revenue', value: `LKR ${totalRevenue.toLocaleString()}`, icon: <span className="font-bold text-sm">Rs.</span>, color: 'from-green-500/20 to-green-500/5', iconBg: 'bg-green-500/15 text-green-400', trend: '+12%', trendUp: true },
    { label: 'Total Expenses', value: `LKR ${totalExpenses.toLocaleString()}`, icon: <FiTrendingDown size={22} />, color: 'from-red-500/20 to-red-500/5', iconBg: 'bg-red-500/15 text-red-400', trend: '-3%', trendUp: false },
    { label: 'Net Profit', value: `LKR ${profit.toLocaleString()}`, icon: <FiTrendingUp size={22} />, color: 'from-[var(--color-gold)]/20 to-[var(--color-gold)]/5', iconBg: 'bg-[var(--color-gold)]/15 text-[var(--color-gold)]', trend: '+18%', trendUp: true },
    { label: 'Total Products', value: totalProducts, icon: <FiShoppingBag size={22} />, color: 'from-orange-500/20 to-orange-500/5', iconBg: 'bg-orange-500/15 text-orange-400', info: `${totalProducts} items` },
    { label: 'Total Orders', value: totalOrders, icon: <FiPackage size={22} />, color: 'from-amber-500/20 to-amber-500/5', iconBg: 'bg-amber-500/15 text-amber-400', info: `${pendingOrders} pending` },
    { label: 'Total Discounts', value: `LKR ${totalDiscount.toLocaleString()}`, icon: <FiPercent size={22} />, color: 'from-[var(--color-accent)]/20 to-[var(--color-accent)]/5', iconBg: 'bg-[var(--color-accent)]/15 text-[var(--color-accent)]', info: 'Active deals' }
  ]

  return (
    <div className="mx-auto w-full max-w-[1400px]">
      <div className="mb-6 md:mb-8">
        <h1 className="mb-1 font-[var(--font-family-heading)] text-xl font-bold tracking-tight text-[var(--color-text-primary)] md:text-2xl">
          Dashboard overview
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)]">Here&apos;s what&apos;s happening with your store</p>
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
              {safeOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-[var(--color-text-muted)]">
                    No orders yet. New orders will appear here.
                  </td>
                </tr>
              )}
              {safeOrders.map((order) => (
                <tr key={order.id} className="border-b border-[var(--color-border)] transition-colors hover:bg-white/3">
                  <td className="px-5 py-3.5 text-sm font-mono font-bold text-[var(--color-accent)]">{order.id}</td>
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium">{order.customer_name || 'Generic Customer'}</p>
                    <p className="text-[11px] text-[var(--color-text-muted)]">{order.customer_phone || 'No Phone'}</p>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-bold">LKR {(Number(order.total || 0)).toLocaleString()}</td>
                  <td className="px-5 py-3.5">
                    <span className={`badge text-[11px] capitalize ${order.status === 'delivered' ? 'badge-success' : order.status === 'shipped' ? 'badge-accent' : 'badge-gold'}`}>{order.status || 'Pending'}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`badge text-[11px] capitalize ${order.payment_status === 'paid' ? 'badge-success' : 'badge-gold'}`}>{order.payment_status || 'Unpaid'}</span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-[var(--color-text-muted)]">{order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Unknown'}</td>
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
            {[...safeProducts].map(p => {
              if (!p) return null
              const productReviews = (reviews || []).filter(r => r && r.product_id === p.id)
              const reviewCount = productReviews.length
              const rating = reviewCount > 0 ? (productReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviewCount).toFixed(1) : 0
              return { ...p, realReviewCount: reviewCount, realRating: rating }
            }).filter(Boolean).sort((a, b) => b.realReviewCount - a.realReviewCount).slice(0, 5).map((p, i) => (
              <div key={p.id} className="flex items-center gap-4 group">
                <span className="text-sm font-bold text-[var(--color-text-muted)] w-5 shrink-0 group-hover:text-[var(--color-accent)] transition-colors">{i + 1}</span>
                <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-[var(--color-border)] group-hover:border-[var(--color-accent)]/50 transition-colors">
                  <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-1 min-w-0 py-1">
                  <p className="text-sm font-medium truncate text-[var(--color-text-primary)]">{p.name}</p>
                  <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">{p.realReviewCount} verified review{p.realReviewCount !== 1 ? 's' : ''}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0 bg-[var(--color-surface)] px-2 py-1 rounded-lg border border-[var(--color-border)]">
                  <FiStar size={12} className={p.realRating > 0 ? "text-[var(--color-gold)]" : "text-[var(--color-text-muted)]"} />
                  <span className="text-xs font-bold text-[var(--color-text-primary)]">{p.realRating > 0 ? p.realRating : '-'}</span>
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
            {safeOrders.slice(0, 5).map((o, i) => {
               if (!o) return null
               const isPaid = o.payment_status === 'paid'
               
               let action = 'New order placed'
               let color = 'bg-[var(--color-accent)]'
               if (o.status === 'delivered') { action = 'Order delivered'; color = 'bg-emerald-400' }
               else if (o.status === 'shipped') { action = 'Order shipped'; color = 'bg-orange-400' }
               else if (isPaid) { action = 'Payment confirmed'; color = 'bg-[var(--color-gold)]' }
               
               // Extract relative time 
               const timeDiff = o.created_at ? Math.floor((new Date() - new Date(o.created_at)) / (1000 * 60 * 60)) : 0
               let timeStr = `${timeDiff}h ago`
               if (timeDiff > 24) timeStr = `${Math.floor(timeDiff/24)}d ago`
               if (timeDiff <= 0) timeStr = 'Just now'

               return (
                  <div key={o.id} className="flex items-start gap-4">
                    <div className={`w-2 h-2 rounded-full mt-2 ${color} shrink-0 animate-pulse`} />
                    <div className="flex-1 min-w-0 border-b border-[var(--color-border)] pb-3">
                      <p className="text-sm font-bold text-[var(--color-text-primary)]">{action}</p>
                      <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">{o.id} • LKR {(Number(o.total || 0)).toLocaleString()} by {o.customer_name || 'User'}</p>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] whitespace-nowrap shrink-0">{timeStr}</span>
                  </div>
               )
            })}
            
            {safeOrders.length === 0 && (
              <div className="py-10 text-center">
                <p className="text-sm text-[var(--color-text-muted)]">No recent activity yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
