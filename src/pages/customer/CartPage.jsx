import { Link, useNavigate } from 'react-router-dom'
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiArrowLeft } from 'react-icons/fi'
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

  if (cartItems.length === 0) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center animate-fadeInUp">
          <div className="text-7xl mb-6">🛒</div>
          <h2 className="text-2xl font-bold mb-2 font-[var(--font-family-heading)]">Your Cart is Empty</h2>
          <p className="text-[var(--color-text-secondary)] mb-8">Looks like you haven't added any items yet.</p>
          <Link to="/products" className="btn-primary text-base">
            <FiShoppingBag size={20} /> Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="bg-[var(--color-primary)] py-6">
        <div className="container-custom">
          <Link to="/products" className="text-sm text-[var(--color-accent)] flex items-center gap-2 mb-3 hover:gap-3 transition-all">
            <FiArrowLeft size={14} /> Continue Shopping
          </Link>
          <h1 className="text-3xl font-bold font-[var(--font-family-heading)]">Shopping Cart</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">{cartCount} item{cartCount !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="container-custom py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, i) => (
              <div
                key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                className="flex gap-4 p-4 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] card-hover animate-fadeInUp"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {/* Image */}
                <Link to={`/products/${item.id}`} className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden shrink-0">
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${item.id}`} className="text-sm sm:text-base font-semibold hover:text-[var(--color-accent)] transition-colors line-clamp-1">
                    {item.name}
                  </Link>
                  <div className="flex flex-wrap gap-2 mt-1 mb-3">
                    {item.selectedSize && (
                      <span className="text-xs px-2 py-0.5 rounded-lg glass-light text-[var(--color-text-secondary)]">
                        Size: {item.selectedSize}
                      </span>
                    )}
                    {item.selectedColor && (
                      <span className="text-xs px-2 py-0.5 rounded-lg glass-light text-[var(--color-text-secondary)]">
                        Color: {item.selectedColor}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    {/* Quantity */}
                    <div className="flex items-center rounded-xl border border-[var(--color-border)] overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedSize, item.selectedColor)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-white/5 transition-all"
                      >
                        <FiMinus size={14} />
                      </button>
                      <span className="w-10 h-8 flex items-center justify-center text-sm font-semibold border-x border-[var(--color-border)]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedSize, item.selectedColor)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-white/5 transition-all"
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>

                    {/* Price & Remove */}
                    <div className="flex items-center gap-4">
                      <span className="text-sm sm:text-base font-bold text-[var(--color-accent)]">
                        LKR {((item.discount_price || item.price) * item.quantity).toLocaleString()}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/10 text-red-400 transition-all"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={clearCart}
              className="text-sm text-red-400 hover:text-red-300 transition-colors flex items-center gap-2"
            >
              <FiTrash2 size={14} /> Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div>
            <div className="sticky top-24 glass rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4 font-[var(--font-family-heading)]">Order Summary</h3>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-secondary)]">Subtotal ({cartCount} items)</span>
                  <span>LKR {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-secondary)]">Delivery</span>
                  <span className="text-green-400">{cartTotal >= 10000 ? 'Free' : 'LKR 500'}</span>
                </div>
                {cartTotal < 10000 && (
                  <p className="text-xs text-[var(--color-gold)]">
                    Add LKR {(10000 - cartTotal).toLocaleString()} more for free delivery!
                  </p>
                )}
              </div>

              <div className="border-t border-[var(--color-border)] pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold text-[var(--color-accent)]">
                    LKR {(cartTotal + (cartTotal >= 10000 ? 0 : 500)).toLocaleString()}
                  </span>
                </div>
              </div>

              <button onClick={handleCheckout} className="btn-primary w-full justify-center py-3.5 mb-3">
                Proceed to Checkout
              </button>

              <a href={whatsappUrl} target="_blank" rel="noreferrer"
                className="btn-outline w-full justify-center py-3.5 border-green-500 text-green-400 hover:bg-green-500 hover:text-white">
                <FaWhatsapp size={20} /> Order via WhatsApp
              </a>

              {/* Bank Details */}
              <div className="mt-6 p-4 rounded-xl glass-light">
                <p className="text-xs text-[var(--color-text-muted)] mb-2 font-semibold uppercase tracking-wider">Payment Details</p>
                <p className="text-sm"><span className="text-[var(--color-text-muted)]">Bank:</span> {shopInfo.bankDetails.bankName}</p>
                <p className="text-sm"><span className="text-[var(--color-text-muted)]">Account:</span> <span className="font-mono font-bold text-[var(--color-gold)]">{shopInfo.bankDetails.accountNumber}</span></p>
                <p className="text-sm"><span className="text-[var(--color-text-muted)]">Name:</span> {shopInfo.bankDetails.accountName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
