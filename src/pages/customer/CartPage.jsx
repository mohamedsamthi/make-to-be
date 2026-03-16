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
        
        <div className="text-center animate-fadeInUp relative z-10 glass p-12 rounded-3xl max-w-lg border border-white/10 shadow-2xl">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 flex items-center justify-center border border-white/10 shadow-lg shadow-violet-500/20">
            <FiShoppingBag size={40} className="text-violet-400" />
          </div>
          <h2 className="text-3xl font-black mb-3 text-white tracking-tight">Your Cart is Empty</h2>
          <p className="text-gray-400 mb-8 max-w-xs mx-auto text-sm leading-relaxed">Looks like you haven't added any premium items to your collection yet.</p>
          <Link to="/products" className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold py-3.5 px-8 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-violet-500/25">
             Start Shopping <FiArrowRight size={18} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#151230] text-gray-200">
      {/* Page Header */}
      <div className="bg-[#1e1c3a]/80 backdrop-blur-xl border-b border-white/10 py-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10 pointer-events-none" />
        <div className="container-custom relative z-10">
          <Link to="/products" className="inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 hover:gap-3 transition-all mb-4 font-semibold">
            <FiArrowLeft size={16} /> Continue Shopping
          </Link>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-2">Shopping Cart</h1>
          <p className="text-sm text-gray-400 font-medium">{cartCount} premium item{cartCount !== 1 ? 's' : ''} reserved</p>
        </div>
      </div>

      <div className="container-custom py-10">
        <div className="grid lg:grid-cols-3 gap-8 items-start">

          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-5">
            {cartItems.map((item, i) => (
              <div
                key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                className="flex flex-col sm:flex-row gap-5 p-5 rounded-3xl bg-[#1e1c3a] border border-white/10 hover:border-violet-500/30 transition-all animate-fadeInUp shadow-lg group relative overflow-hidden"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {/* Highlight Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/0 to-fuchsia-500/0 group-hover:from-violet-500/5 group-hover:to-fuchsia-500/5 transition-colors pointer-events-none" />

                {/* Product Image */}
                <Link to={`/products/${item.id}`} className="w-full sm:w-32 aspect-square rounded-2xl overflow-hidden shrink-0 bg-black/40 border border-white/5 relative z-10">
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-1 relative z-10">
                  <div>
                    <div className="flex justify-between items-start gap-4">
                      <Link to={`/products/${item.id}`} className="text-lg font-bold text-white hover:text-violet-400 transition-colors line-clamp-2 leading-snug">
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)}
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all shrink-0"
                        title="Remove item"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      {item.selectedSize && (
                        <span className="text-xs px-3 py-1.5 rounded-lg bg-black/40 text-gray-300 border border-white/5 font-medium">
                          Size: <span className="text-white font-bold ml-1">{item.selectedSize}</span>
                        </span>
                      )}
                      {item.selectedColor && (
                        <span className="text-xs px-3 py-1.5 rounded-lg bg-black/40 text-gray-300 border border-white/5 font-medium">
                          Color: <span className="text-white font-bold ml-1">{item.selectedColor}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-5 flex-wrap gap-4 border-t border-white/5 pt-4">
                    {/* Quantity Control */}
                    <div className="flex items-center rounded-xl border border-white/10 overflow-hidden bg-black/40">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedSize, item.selectedColor)}
                        className="w-10 h-10 flex items-center justify-center hover:bg-violet-500/20 text-gray-400 hover:text-violet-400 transition-colors"
                      >
                        <FiMinus size={14} />
                      </button>
                      <span className="w-10 h-10 flex items-center justify-center text-sm font-bold text-white border-x border-white/10">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedSize, item.selectedColor)}
                        className="w-10 h-10 flex items-center justify-center hover:bg-violet-500/20 text-gray-400 hover:text-violet-400 transition-colors"
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
                        <p className="text-xs text-gray-500 font-medium">
                          LKR {(item.discount_price || item.price).toLocaleString()} each
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Clear Cart */}
            <div className="flex justify-end pt-2">
              <button
                onClick={clearCart}
                className="text-sm font-medium text-gray-400 hover:text-red-400 transition-colors flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-red-500/10"
              >
                <FiTrash2 size={16} /> Clear entire cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-28">
            <div className="bg-[#1e1c3a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500" />
              
              <div className="p-6 border-b border-white/5">
                <h3 className="text-xl font-black text-white tracking-tight">Order Summary</h3>
              </div>

              <div className="p-6 space-y-5">
                {/* Line items */}
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 font-medium">Subtotal ({cartCount} items)</span>
                    <span className="text-white font-bold tracking-tight">LKR {cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 font-medium">Delivery</span>
                    <span className={deliveryFee === 0 ? 'text-emerald-400 font-bold tracking-tight' : 'text-white font-bold tracking-tight'}>
                      {deliveryFee === 0 ? '🎉 Free' : `LKR ${deliveryFee.toLocaleString()}`}
                    </span>
                  </div>
                </div>

                {/* Free delivery nudge */}
                {cartTotal < 10000 && (
                  <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex gap-3 relative z-10">
                      <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                        <FiTruck size={14} />
                      </div>
                      <p className="text-sm text-orange-200/90 leading-tight pt-1">
                        Add <strong className="text-orange-400">LKR {(10000 - cartTotal).toLocaleString()}</strong> more to your cart to unlock <strong className="text-orange-400">FREE Delivery!</strong>
                      </p>
                    </div>
                  </div>
                )}

                {/* Total */}
                <div className="border-t border-white/10 pt-5">
                  <div className="flex justify-between items-end">
                    <span className="text-gray-300 font-medium pb-1">Total</span>
                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 tracking-tight">
                      LKR {grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="space-y-3 pt-4">
                  <button onClick={handleCheckout} className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold text-base shadow-lg shadow-violet-500/25 transition-all hover:scale-[1.02] active:scale-95">
                    Proceed to Checkout
                  </button>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] font-bold text-sm hover:bg-[#25D366] hover:text-white transition-all hover:shadow-lg hover:shadow-[#25D366]/20"
                  >
                    <FaWhatsapp size={20} /> Order via WhatsApp
                  </a>
                </div>

                {/* Payment Security Info */}
                <div className="mt-6 p-4 rounded-2xl bg-black/30 border border-white/5 flex items-center gap-4 border-l-2 border-l-violet-500">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-violet-400 shrink-0">
                    <FiShield size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white mb-0.5">Secure Checkout</p>
                    <p className="text-xs text-gray-400">Bank Transfer payment accepted. Details provided at checkout.</p>
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
