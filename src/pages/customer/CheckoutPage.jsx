import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FiCheck, FiArrowLeft } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useProducts } from '../../context/ProductContext'
import { shopInfo } from '../../data/demoData'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const { cartItems, cartTotal, cartCount, clearCart } = useCart()
  const { user, profile } = useAuth()
  const { addOrder } = useProducts()
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.fullName || !formData.phone || !formData.address) {
      toast.error('Please fill in all required fields')
      return
    }

    const newOrder = {
      customer_name: formData.fullName,
      customer_phone: formData.phone,
      customer_email: formData.email,
      customer_address: `${formData.address}${formData.city ? ', '+formData.city : ''}${formData.postalCode ? ', '+formData.postalCode : ''}`,
      total: totalWithDelivery,
      status: 'pending',
      payment_status: 'pending',
      items: cartItems.map(item => ({
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        price: item.discount_price || item.price,
        size: item.selectedSize || null,
        color: item.selectedColor || null
      }))
    }

    try {
      await addOrder(newOrder)
      toast.success('Order placed successfully! 🎉')
      setOrderPlaced(true)
      clearCart()
    } catch (err) {
      toast.error('Failed to place order. Try again.')
      console.error(err)
    }
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-[#151230] flex items-center justify-center relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="text-center max-w-md mx-auto p-10 animate-fadeInUp relative z-10 glass rounded-3xl border border-white/10 shadow-2xl">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center mx-auto mb-8 animate-pulse-soft shadow-lg shadow-violet-500/30">
            <FiCheck size={48} className="text-white" />
          </div>
          <h2 className="text-3xl font-black mb-4 text-white tracking-tight">Order Placed! 🎉</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Your order has been securely sent. We'll contact you shortly to confirm your delivery details.
          </p>
          
          <div className="p-6 rounded-2xl bg-black/40 border border-white/5 mb-8 text-left relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-violet-500 to-fuchsia-500" />
            <p className="text-sm font-bold text-white mb-4 tracking-wide uppercase">Payment Instructions</p>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-gray-400 text-sm">Bank:</span>
                <span className="text-white font-medium text-sm">{shopInfo.bankDetails.bankName}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-gray-400 text-sm">Account:</span>
                <span className="font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-400 text-base">{shopInfo.bankDetails.accountNumber}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-gray-400 text-sm">Name:</span>
                <span className="text-white font-medium text-sm">{shopInfo.bankDetails.accountName}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-gray-400 text-sm">Amount:</span>
                <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 text-lg">LKR {totalWithDelivery.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <a href={shopInfo.socialMedia.whatsapp} target="_blank" rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] font-bold text-sm hover:bg-[#25D366] hover:text-white transition-all hover:shadow-lg hover:shadow-[#25D366]/20">
              <FaWhatsapp size={20} /> Send Payment Proof
            </a>
            <Link to="/products" className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all">
              Continue Shopping
            </Link>
          </div>
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
          <Link to="/cart" className="inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 hover:gap-3 transition-all mb-4 font-semibold">
            <FiArrowLeft size={16} /> Back to Cart
          </Link>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">Secure Checkout</h1>
        </div>
      </div>

      <div className="container-custom py-12">
        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-8 rounded-3xl bg-[#1e1c3a] border border-white/10 shadow-xl">
              <h3 className="text-xl font-black text-white tracking-tight mb-6">Delivery Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-bold text-gray-400 mb-2 block">Full Name *</label>
                  <input name="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all font-medium" required />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-400 mb-2 block">Phone Number *</label>
                  <input name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all font-medium" required />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-bold text-gray-400 mb-2 block">Email Address</label>
                  <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all font-medium" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-bold text-gray-400 mb-2 block">Complete Delivery Address *</label>
                  <textarea name="address" value={formData.address} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all min-h-[100px] resize-none font-medium" required placeholder="House No, Street Name..." />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-400 mb-2 block">City / Town</label>
                  <input name="city" value={formData.city} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all font-medium" />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-400 mb-2 block">Postal Code <span className="text-xs text-gray-500 font-normal">(optional)</span></label>
                  <input name="postalCode" value={formData.postalCode} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all font-medium" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-bold text-gray-400 mb-2 block">Order Notes <span className="text-xs text-gray-500 font-normal">(optional)</span></label>
                  <textarea name="notes" value={formData.notes} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all min-h-[80px] resize-none font-medium text-sm" placeholder="Any special instructions for delivery..." />
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="p-8 rounded-3xl bg-[#1e1c3a] border border-white/10 shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl" />
              <h3 className="text-xl font-black text-white tracking-tight mb-6 relative z-10">Payment Method</h3>
              
              <div className="p-6 rounded-2xl bg-gradient-to-br from-violet-600/10 to-fuchsia-600/10 border border-violet-500/20 relative z-10 group">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400">
                    <FiCheck size={20} />
                  </div>
                  <h4 className="text-lg font-bold text-white tracking-tight">Direct Bank Transfer</h4>
                </div>
                
                <div className="space-y-3 bg-black/20 p-5 rounded-xl border border-white/5 mb-4">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-sm text-gray-400">Bank Name</span>
                    <span className="text-sm font-bold text-white">{shopInfo.bankDetails.bankName}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-sm text-gray-400">Account Name</span>
                    <span className="text-sm font-bold text-white">{shopInfo.bankDetails.accountName}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-sm text-gray-400">Account No.</span>
                    <span className="text-base font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-400">{shopInfo.bankDetails.accountNumber}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Branch Name</span>
                    <span className="text-sm font-bold text-white">{shopInfo.bankDetails.branch}</span>
                  </div>
                </div>
                
                <p className="text-xs text-violet-300/80 leading-relaxed font-medium">
                  After placing the order, please transfer the exact total amount and securely send the payment receipt to our WhatsApp team for verification.
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-28">
            <div className="bg-[#1e1c3a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative p-6">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500" />
              <h3 className="text-xl font-black text-white tracking-tight mb-6">Review Cart Summary</h3>
              
              <div className="space-y-4 mb-6">
                {cartItems.map(item => (
                  <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-4 p-3 rounded-2xl bg-black/20 border border-white/5">
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-black/40">
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 py-1">
                      <p className="text-sm font-bold text-white truncate mb-1">{item.name}</p>
                      <p className="text-xs text-gray-400 font-medium">Quantity: <span className="text-white">{item.quantity}</span></p>
                    </div>
                    <div className="py-1 shrink-0 text-right">
                      <p className="text-sm font-black text-white">LKR {((item.discount_price || item.price) * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-5 space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-medium">Items Subtotal</span>
                  <span className="text-white font-bold">LKR {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-medium">Delivery Cost</span>
                  <span className={deliveryFee === 0 ? 'text-emerald-400 font-bold' : 'text-white font-bold'}>
                    {deliveryFee === 0 ? 'Free' : `LKR ${deliveryFee}`}
                  </span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-5 mb-6">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-gray-300 pb-1">Grand Total</span>
                  <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 tracking-tight">
                    LKR {totalWithDelivery.toLocaleString()}
                  </span>
                </div>
              </div>

              <button type="submit" className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold text-base shadow-lg shadow-violet-500/25 transition-all hover:scale-[1.02] active:scale-95">
                Complete Order
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
