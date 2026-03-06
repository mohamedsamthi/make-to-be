import { Link } from 'react-router-dom'
import { FiPackage, FiCheck, FiTruck, FiMapPin, FiClock, FiArrowLeft } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import { useProducts } from '../../context/ProductContext'
import { shopInfo } from '../../data/demoData'

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
              <p className={`text-xs font-semibold mt-2 ${isCompleted ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)]'}`}>
                {step.label}
              </p>
              <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5 hidden sm:block">{step.desc}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function OrderTrackingPage() {
  const { user } = useAuth()
  const { orders } = useProducts()

  // Use demoOrders for now, will be replaced with real orders
  const demoOrders = orders

  return (
    <div className="pt-20 min-h-screen">
      <div className="bg-[var(--color-primary)] py-8 border-b border-[var(--color-border)]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <Link to="/profile" className="text-sm text-[var(--color-accent)] flex items-center gap-2 mb-3 hover:gap-3 transition-all">
            <FiArrowLeft size={14} /> Back to Profile
          </Link>
          <h1 className="text-3xl font-bold font-[var(--font-family-heading)]">
            <FiPackage className="inline mr-2" /> My Orders
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">Track your order status</p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
        {demoOrders.length > 0 ? (
          <div className="space-y-6">
            {demoOrders.map((order, idx) => (
              <div
                key={order.id}
                className="rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] overflow-hidden animate-fadeInUp"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {/* Order Header */}
                <div className="p-5 sm:p-6 border-b border-[var(--color-border)] flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold font-mono text-[var(--color-accent)]">{order.id}</h3>
                      <span className={`badge capitalize ${
                        order.status === 'delivered' ? 'badge-success' :
                        order.status === 'shipped' ? 'badge-accent' :
                        order.status === 'confirmed' || order.status === 'processing' ? 'bg-blue-500/15 text-blue-400' :
                        'badge-gold'
                      }`}>{order.status}</span>
                      <span className={`badge capitalize ${
                        order.payment_status === 'paid' ? 'badge-success' : 'badge-gold'
                      }`}>{order.payment_status}</span>
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)]">Ordered on {order.created_at}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-[var(--color-accent)]">LKR {order.total.toLocaleString()}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                  </div>
                </div>

                {/* Status Tracker */}
                <div className="p-5 sm:p-8 bg-[var(--color-surface)]/50">
                  <OrderStatusTracker status={order.status} />
                </div>

                {/* Order Items */}
                <div className="p-5 sm:p-6 border-t border-[var(--color-border)]">
                  <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">Order Items</p>
                  <div className="space-y-3">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-2 px-3 rounded-xl bg-white/2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[var(--color-surface-light)] flex items-center justify-center text-[var(--color-accent)]">
                            <FiPackage size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{item.product_name}</p>
                            <p className="text-xs text-[var(--color-text-muted)]">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="text-sm font-semibold">LKR {(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 flex flex-wrap gap-3">
                  <a
                    href={`${shopInfo.socialMedia.whatsapp}?text=${encodeURIComponent(`Hi! I want to check the status of my order ${order.id}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-outline py-2 px-4 text-sm border-green-500 text-green-400 hover:bg-green-500 hover:text-white"
                  >
                    <FaWhatsapp size={16} /> Contact About Order
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-7xl mb-6">📦</div>
            <h2 className="text-2xl font-bold mb-2 font-[var(--font-family-heading)]">No Orders Yet</h2>
            <p className="text-[var(--color-text-secondary)] mb-8">You haven't placed any orders yet.</p>
            <Link to="/products" className="btn-primary text-base">
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
