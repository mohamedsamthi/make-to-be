import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FiCheck, FiArrowLeft } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { shopInfo } from '../../data/demoData'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const { cartItems, cartTotal, cartCount, clearCart } = useCart()
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [formData, setFormData] = useState({
    fullName: profile?.full_name || '',
    email: user?.email || '',
    phone: profile?.phone || '',
    address: '',
    city: '',
    postalCode: '',
    notes: ''
  })

  const deliveryFee = cartTotal >= 10000 ? 0 : 500
  const totalWithDelivery = cartTotal + deliveryFee

  if (cartItems.length === 0 && !orderPlaced) {
    navigate('/cart')
    return null
  }

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.fullName || !formData.phone || !formData.address) {
      toast.error('Please fill in all required fields')
      return
    }

    // In production, this would create an order in Supabase
    toast.success('Order placed successfully! 🎉')
    setOrderPlaced(true)
    clearCart()
  }

  if (orderPlaced) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 animate-fadeInUp">
          <div className="w-20 h-20 rounded-full gradient-accent flex items-center justify-center mx-auto mb-6 animate-pulse-soft">
            <FiCheck size={40} />
          </div>
          <h2 className="text-3xl font-bold mb-3 font-[var(--font-family-heading)]">Order Placed! 🎉</h2>
          <p className="text-[var(--color-text-secondary)] mb-6">
            Your order has been sent to our team. We'll contact you shortly to confirm your order.
          </p>
          <div className="p-4 rounded-xl glass-light mb-6 text-left">
            <p className="text-sm font-semibold mb-2">Please transfer payment to:</p>
            <p className="text-sm"><span className="text-[var(--color-text-muted)]">Bank:</span> {shopInfo.bankDetails.bankName}</p>
            <p className="text-sm"><span className="text-[var(--color-text-muted)]">Account:</span> <span className="font-mono font-bold text-[var(--color-gold)]">{shopInfo.bankDetails.accountNumber}</span></p>
            <p className="text-sm"><span className="text-[var(--color-text-muted)]">Name:</span> {shopInfo.bankDetails.accountName}</p>
            <p className="text-sm"><span className="text-[var(--color-text-muted)]">Amount:</span> <span className="font-bold text-[var(--color-accent)]">LKR {totalWithDelivery.toLocaleString()}</span></p>
          </div>
          <div className="flex flex-col gap-3">
            <a href={shopInfo.socialMedia.whatsapp} target="_blank" rel="noreferrer"
              className="btn-outline justify-center border-green-500 text-green-400 hover:bg-green-500 hover:text-white">
              <FaWhatsapp size={20} /> Send Payment Proof via WhatsApp
            </a>
            <Link to="/products" className="btn-primary justify-center">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="bg-[var(--color-primary)] py-6">
        <div className="container-custom">
          <Link to="/cart" className="text-sm text-[var(--color-accent)] flex items-center gap-2 mb-3 hover:gap-3 transition-all">
            <FiArrowLeft size={14} /> Back to Cart
          </Link>
          <h1 className="text-3xl font-bold font-[var(--font-family-heading)]">Checkout</h1>
        </div>
      </div>

      <div className="container-custom py-10">
        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)]">
              <h3 className="text-lg font-semibold mb-4">Delivery Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-[var(--color-text-secondary)] mb-1 block">Full Name *</label>
                  <input name="fullName" value={formData.fullName} onChange={handleChange} className="input-field" required />
                </div>
                <div>
                  <label className="text-sm text-[var(--color-text-secondary)] mb-1 block">Phone Number *</label>
                  <input name="phone" value={formData.phone} onChange={handleChange} className="input-field" required />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm text-[var(--color-text-secondary)] mb-1 block">Email</label>
                  <input name="email" type="email" value={formData.email} onChange={handleChange} className="input-field" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm text-[var(--color-text-secondary)] mb-1 block">Delivery Address *</label>
                  <textarea name="address" value={formData.address} onChange={handleChange} className="input-field min-h-[80px] resize-none" required />
                </div>
                <div>
                  <label className="text-sm text-[var(--color-text-secondary)] mb-1 block">City</label>
                  <input name="city" value={formData.city} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label className="text-sm text-[var(--color-text-secondary)] mb-1 block">Postal Code</label>
                  <input name="postalCode" value={formData.postalCode} onChange={handleChange} className="input-field" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm text-[var(--color-text-secondary)] mb-1 block">Order Notes (optional)</label>
                  <textarea name="notes" value={formData.notes} onChange={handleChange} className="input-field min-h-[60px] resize-none" placeholder="Any special instructions..." />
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="p-6 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)]">
              <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
              <div className="p-4 rounded-xl gradient-accent/10 border border-[var(--color-accent)]/20">
                <p className="text-sm font-semibold mb-3">Bank Transfer</p>
                <div className="space-y-1">
                  <p className="text-sm"><span className="text-[var(--color-text-muted)]">Bank:</span> {shopInfo.bankDetails.bankName}</p>
                  <p className="text-sm"><span className="text-[var(--color-text-muted)]">Account Name:</span> {shopInfo.bankDetails.accountName}</p>
                  <p className="text-sm"><span className="text-[var(--color-text-muted)]">Account Number:</span> <span className="font-mono font-bold text-[var(--color-gold)] text-base">{shopInfo.bankDetails.accountNumber}</span></p>
                  <p className="text-sm"><span className="text-[var(--color-text-muted)]">Branch:</span> {shopInfo.bankDetails.branch}</p>
                </div>
                <p className="text-xs text-[var(--color-text-muted)] mt-3">
                  Please transfer the total amount and send payment proof via WhatsApp after placing the order.
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="sticky top-24 glass rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4 font-[var(--font-family-heading)]">Order Summary</h3>
              <div className="space-y-3 mb-4">
                {cartItems.map(item => (
                  <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-3">
                    <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0">
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">x{item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold">LKR {((item.discount_price || item.price) * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-[var(--color-border)] pt-4 space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-secondary)]">Subtotal</span>
                  <span>LKR {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-secondary)]">Delivery</span>
                  <span className={deliveryFee === 0 ? 'text-green-400' : ''}>
                    {deliveryFee === 0 ? 'Free' : `LKR ${deliveryFee}`}
                  </span>
                </div>
              </div>

              <div className="border-t border-[var(--color-border)] pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold text-[var(--color-accent)]">
                    LKR {totalWithDelivery.toLocaleString()}
                  </span>
                </div>
              </div>

              <button type="submit" className="btn-primary w-full justify-center py-3.5">
                Place Order
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
