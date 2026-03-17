import { Link, useNavigate } from 'react-router-dom'
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiArrowLeft, FiTruck, FiArrowRight, FiShield } from 'react-icons/fi'
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
      <div className="min-h-screen bg-[#151230] flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="text-center animate-fadeInUp relative z-10 glass p-8 sm:p-12 rounded-3xl max-w-lg border border-white/10 shadow-2xl">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 flex items-center justify-center border border-white/10 shadow-lg shadow-violet-500/20">
            <FiShoppingBag size={32} className="text-violet-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mb-3 text-white tracking-tight">Your Cart is Empty</h2>
          <p className="text-gray-400 mb-8 max-w-xs mx-auto text-sm leading-relaxed">Looks like you haven't added any premium items to your collection yet.</p>
          <Link to="/products" className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold py-3 px-8 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-violet-500/25">
             Start Shopping <FiArrowRight size={18} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[var(--color-surface)] text-[var(--color-text-primary)]">
      {/* Page Header */}
      <div className="bg-[var(--color-primary)] py-5 relative overflow-hidden">
        <div className="container-custom relative z-10">
          <Link to="/products" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-[var(--color-accent-light)] hover:text-white transition-all mb-2 font-black">
            <FiArrowLeft size={14} /> Continue Shopping
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">Shopping Bag</h1>
          <p className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-black opacity-60">{cartCount} premium item{cartCount !== 1 ? 's' : ''} reserved</p>
        </div>
      </div>

      <div className="container-custom py-6 lg:py-10">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start">

          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, i) => (
              <div
                key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                className="flex flex-col sm:flex-row gap-5 p-5 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 transition-all animate-fadeInUp shadow-lg group relative overflow-hidden"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {/* Product Image */}
                <Link to={`/products/${item.id}`} className="w-full sm:w-36 aspect-square rounded-xl overflow-hidden shrink-0 bg-white/5 border border-white/5 relative z-10 flex items-center justify-center p-4">
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-1 relative z-10">
                  <div>
                    <div className="flex justify-between items-start gap-4">
                      <Link to={`/products/${item.id}`} className="text-lg font-black text-white hover:text-[var(--color-accent-light)] transition-colors line-clamp-2 leading-tight">
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)}
                        className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 hover:bg-red-500/20 text-[var(--color-text-muted)] hover:text-red-400 transition-all shrink-0 border border-white/5"
                        title="Remove item"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      {item.selectedSize && (
                        <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg bg-black/20 text-[var(--color-text-muted)] border border-white/5">
                          Size: <span className="text-white ml-1">{item.selectedSize}</span>
                        </span>
                      )}
                      {item.selectedColor && (
                        <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg bg-black/20 text-[var(--color-text-muted)] border border-white/5">
                          Color: <span className="text-white ml-1">{item.selectedColor}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6 flex-wrap gap-4 pt-5 border-t border-white/5">
                    {/* Quantity Control */}
                    <div className="flex items-center rounded-xl border border-white/10 overflow-hidden bg-black/20 p-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedSize, item.selectedColor)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-[var(--color-text-muted)] hover:text-white transition-colors"
                      >
                        <FiMinus size={14} />
                      </button>
                      <span className="w-10 text-center text-xs font-black text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedSize, item.selectedColor)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-[var(--color-text-muted)] hover:text-white transition-colors"
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-lg font-black text-white tracking-tight">
                        LKR {((item.discount_price || item.price) * item.quantity).toLocaleString()}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-[10px] text-[var(--color-text-muted)] font-bold uppercase tracking-widest">
                          LKR {(item.discount_price || item.price).toLocaleString()} / unit
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Clear Cart */}
            <div className="flex justify-start pt-2">
              <button
                onClick={clearCart}
                className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] hover:text-red-400 transition-all flex items-center gap-2 px-5 py-2.5 rounded-xl hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
              >
                <FiTrash2 size={16} /> Discard Bag
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-28">
            <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-3xl overflow-hidden shadow-2xl relative">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-dark)]" />
              
              <div className="p-8 border-b border-white/5">
                <h3 className="text-xl font-black text-white tracking-tight font-[var(--font-family-heading)] uppercase tracking-widest text-xs">Summary</h3>
              </div>

              <div className="p-8 space-y-6">
                {/* Line items */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[var(--color-text-muted)] font-black uppercase tracking-widest">Subtotal</span>
                    <span className="text-white font-black">LKR {cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[var(--color-text-muted)] font-black uppercase tracking-widest">Delivery</span>
                    <span className={deliveryFee === 0 ? 'text-emerald-400 font-black' : 'text-white font-black'}>
                      {deliveryFee === 0 ? 'FREE' : `LKR ${deliveryFee.toLocaleString()}`}
                    </span>
                  </div>
                </div>

                {/* Free delivery nudge */}
                {cartTotal < 10000 && (
                  <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                        <FiTruck size={14} />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-amber-200/60 leading-relaxed pt-1">
                        Add <span className="text-amber-400">LKR {(10000 - cartTotal).toLocaleString()}</span> more to unlock <span className="text-amber-400">FREE DELIVERY</span>
                      </p>
                    </div>
                  </div>
                )}

                {/* Total */}
                <div className="border-t border-white/5 pt-6">
                  <div className="flex justify-between items-end">
                    <span className="text-[var(--color-text-muted)] font-black uppercase tracking-widest text-[9px] pb-1">Total Amount</span>
                    <span className="text-3xl font-black text-white tracking-tighter">
                      LKR {grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="space-y-3 pt-6">
                  <button onClick={handleCheckout} className="w-full py-4 rounded-xl bg-white text-[var(--color-surface)] font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all shadow-xl active:scale-95">
                    Proceed to Checkout
                  </button>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black text-xs uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all"
                  >
                    <FaWhatsapp size={18} /> WhatsApp Order
                  </a>
                </div>

                {/* Security */}
                <div className="pt-4 flex items-center justify-center gap-6 opacity-40">
                   <FiShield size={24} className="text-white" />
                   <FiTruck size={24} className="text-white" />
                   <div className="h-6 w-px bg-white/20" />
                   <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white">Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
