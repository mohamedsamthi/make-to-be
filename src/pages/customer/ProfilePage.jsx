import { useAuth } from '../../context/AuthContext'
import { Link, Navigate } from 'react-router-dom'
import { FiUser, FiMail, FiPhone, FiLogOut, FiPackage, FiSettings } from 'react-icons/fi'
import { MdDashboard } from 'react-icons/md'
import { demoOrders } from '../../data/demoData'

export default function ProfilePage() {
  const { user, profile, isAdmin, signOut, loading } = useAuth()

  if (!loading && !user) return <Navigate to="/login" />

  return (
    <div className="pt-20 min-h-screen">
      <div className="bg-[var(--color-primary)] py-10">
        <div className="container-custom">
          <h1 className="text-3xl font-bold font-[var(--font-family-heading)]">My Profile</h1>
        </div>
      </div>

      <div className="container-custom py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div>
            <div className="glass rounded-2xl p-6 text-center mb-6">
              <div className="w-24 h-24 rounded-full gradient-accent flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                {profile?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <h2 className="text-xl font-bold">{profile?.full_name || 'User'}</h2>
              <p className="text-sm text-[var(--color-text-secondary)]">{user?.email}</p>
              {isAdmin && <span className="badge badge-gold mt-2">Admin</span>}
            </div>

            <div className="space-y-2">
              {isAdmin && (
                <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl glass-light hover:bg-white/5 transition-all">
                  <MdDashboard size={18} className="text-[var(--color-accent)]" />
                  <span className="text-sm">Admin Dashboard</span>
                </Link>
              )}
              <button onClick={signOut} className="flex items-center gap-3 px-4 py-3 rounded-xl glass-light hover:bg-red-500/10 transition-all text-red-400 w-full">
                <FiLogOut size={18} />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          </div>

          {/* Order History */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <FiPackage className="text-[var(--color-accent)]" /> My Orders
            </h3>

            <div className="space-y-4">
              {demoOrders.length > 0 ? demoOrders.map(order => (
                <div key={order.id} className="p-5 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)]">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold">{order.id}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{order.created_at}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`badge ${
                        order.status === 'delivered' ? 'badge-success' :
                        order.status === 'shipped' ? 'badge-accent' :
                        'badge-gold'
                      } capitalize`}>
                        {order.status}
                      </span>
                      <span className={`badge ${order.payment_status === 'paid' ? 'badge-success' : 'badge-gold'} capitalize`}>
                        {order.payment_status}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1 mb-3">
                    {order.items.map((item, i) => (
                      <p key={i} className="text-sm text-[var(--color-text-secondary)]">
                        {item.product_name} x{item.quantity} - LKR {(item.price * item.quantity).toLocaleString()}
                      </p>
                    ))}
                  </div>
                  <div className="border-t border-[var(--color-border)] pt-2">
                    <p className="text-sm font-semibold text-right">
                      Total: <span className="text-[var(--color-accent)]">LKR {order.total.toLocaleString()}</span>
                    </p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-10">
                  <div className="text-5xl mb-4">📦</div>
                  <p className="text-[var(--color-text-secondary)]">No orders yet</p>
                  <Link to="/products" className="btn-primary mt-4 inline-flex">Start Shopping</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
