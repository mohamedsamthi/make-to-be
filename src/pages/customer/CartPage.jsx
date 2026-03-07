import { Link, useNavigate } from 'react-router-dom'
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiArrowLeft, FiTruck } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { shopInfo } from '../../data/demoData'
import toast from 'react-hot-toast'

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login to place an order')
      navigate('/login')
      return
    }
    navigate('/checkout')
  }

  const whatsappOrderMessage = cartItems.map(item =>
    `• ${item.name} (${item.selectedSize || '-'}, ${item.selectedColor || '-'}) x${item.quantity} = LKR ${((item.discount_price || item.price) * item.quantity).toLocaleString()}`
  ).join('\n')
  const whatsappUrl = `${shopInfo.socialMedia.whatsapp}?text=${encodeURIComponent(`Hi! I'd like to order:\n\n${whatsappOrderMessage}\n\nTotal: LKR ${cartTotal.toLocaleString()}\n\nPlease confirm my order.`)}`

  const deliveryFee = cartTotal >= 10000 ? 0 : 500
  const grandTotal = cartTotal + deliveryFee

  if (cartItems.length === 0) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center px-4">
        <div className="text-center animate-fadeInUp">
          <div className="text-7xl mb-6">🛒</div>
          <h2 className="text-2xl font-bold mb-3 font-[var(--font-family-heading)]">Your Cart is Empty</h2>
          <p className="text-[var(--color-text-secondary)] mb-8 max-w-xs mx-auto">Looks like you haven't added any items yet.</p>
          <Link to="/products" className="btn-primary text-base px-8 py-3">
            <FiShoppingBag size={20} /> Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen bg-[var(--color-surface)]">
      {/* Page Header */}
      <div className="bg-[var(--color-primary)] border-b border-[var(--color-border)] py-8">
        <div className="container-custom">
          <Link to="/products" className="inline-flex items-center gap-2 text-sm text-[var(--color-accent)] hover:gap-3 transition-all mb-4">
            <FiArrowLeft size={14} /> Continue Shopping
          </Link>
          <h1 className="text-3xl font-bold font-[var(--font-family-heading)]">Shopping Cart</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">{cartCount} item{cartCount !== 1 ? 's' : ''} in your cart</p>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid lg:grid-cols-3 gap-8 items-start">

          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, i) => (
              <div
                key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                className="flex gap-4 p-4 sm:p-5 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 transition-all animate-fadeInUp"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {/* Product Image */}
                <Link to={`/products/${item.id}`} className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-[var(--color-surface-light)]">
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <Link to={`/products/${item.id}`} className="text-sm sm:text-base font-semibold hover:text-[var(--color-accent)] transition-colors line-clamp-2 leading-snug">
                      {item.name}
                    </Link>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {item.selectedSize && (
                        <span className="text-xs px-2.5 py-1 rounded-lg bg-[var(--color-primary)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">
                          Size: <strong>{item.selectedSize}</strong>
                        </span>
                      )}
                      {item.selectedColor && (
                        <span className="text-xs px-2.5 py-1 rounded-lg bg-[var(--color-primary)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">
                          Color: <strong>{item.selectedColor}</strong>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
                    {/* Quantity Control */}
                    <div className="flex items-center rounded-xl border border-[var(--color-border)] overflow-hidden bg-[var(--color-primary)]">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedSize, item.selectedColor)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-[var(--color-accent)]/10 hover:text-[var(--color-accent)] transition-all"
                      >
                        <FiMinus size={14} />
                      </button>
                      <span className="w-10 h-9 flex items-center justify-center text-sm font-bold border-x border-[var(--color-border)]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedSize, item.selectedColor)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-[var(--color-accent)]/10 hover:text-[var(--color-accent)] transition-all"
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>

                    {/* Price + Remove */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-base font-bold text-[var(--color-accent)]">
                          LKR {((item.discount_price || item.price) * item.quantity).toLocaleString()}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-[11px] text-[var(--color-text-muted)]">
                            LKR {(item.discount_price || item.price).toLocaleString()} each
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)}
                        className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-red-500/15 text-[var(--color-text-muted)] hover:text-red-400 transition-all border border-transparent hover:border-red-400/30"
                        title="Remove item"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Clear Cart */}
            <div className="flex justify-end pt-2">
              <button
                onClick={clearCart}
                className="text-sm text-[var(--color-text-muted)] hover:text-red-400 transition-colors flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-red-500/10"
              >
                <FiTrash2 size={14} /> Clear entire cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="sticky top-24">
            <div className="rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-primary)]">
                <h3 className="text-lg font-bold font-[var(--font-family-heading)]">Order Summary</h3>
              </div>

              <div className="p-6 space-y-4">
                {/* Line items */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-text-secondary)]">Subtotal ({cartCount} items)</span>
                    <span className="font-medium">LKR {cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-text-secondary)]">Delivery</span>
                    <span className={deliveryFee === 0 ? 'text-emerald-400 font-medium' : 'font-medium'}>
                      {deliveryFee === 0 ? '🎉 Free' : `LKR ${deliveryFee.toLocaleString()}`}
                    </span>
                  </div>
                </div>

                {/* Free delivery nudge */}
                {cartTotal < 10000 && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <FiTruck size={14} className="text-amber-400 mt-0.5 shrink-0" />
                    <p className="text-xs text-amber-300 leading-relaxed">
                      Add <strong>LKR {(10000 - cartTotal).toLocaleString()}</strong> more for FREE delivery!
                    </p>
                  </div>
                )}

                {/* Total */}
                <div className="border-t border-[var(--color-border)] pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total</span>
                    <span className="text-2xl font-black text-[var(--color-accent)]">
                      LKR {grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="space-y-3 pt-2">
                  <button onClick={handleCheckout} className="btn-primary w-full justify-center py-3.5 text-base font-semibold">
                    Proceed to Checkout
                  </button>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border-2 border-emerald-500 text-emerald-400 font-semibold hover:bg-emerald-500 hover:text-white transition-all text-sm"
                  >
                    <FaWhatsapp size={20} /> Order via WhatsApp
                  </a>
                </div>

                {/* Bank Payment Info */}
                <div className="rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-3">Payment Details</p>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[var(--color-text-muted)]">Bank</span>
                      <span className="font-medium">{shopInfo.bankDetails.bankName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-text-muted)]">Name</span>
                      <span className="font-medium">{shopInfo.bankDetails.accountName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-text-muted)]">Account</span>
                      <span className="font-mono font-bold text-amber-400 tracking-wider">{shopInfo.bankDetails.accountNumber}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
