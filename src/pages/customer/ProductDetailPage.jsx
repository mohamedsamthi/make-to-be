import { useState, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { FiShoppingCart, FiMinus, FiPlus, FiHeart, FiShare2, FiChevronLeft, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi'
import { FaStar, FaWhatsapp } from 'react-icons/fa'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useProducts } from '../../context/ProductContext'
import ProductCard from '../../components/product/ProductCard'
import { shopInfo } from '../../data/demoData'
import toast from 'react-hot-toast'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { user } = useAuth()
  const { getProductById, getProductReviews, products, addReview } = useProducts()

  const product = getProductById(id)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [newRating, setNewRating] = useState(0)
  const [newComment, setNewComment] = useState('')

  const reviews = getProductReviews(id)
  const relatedProducts = products.filter(p => p.category === product?.category && p.id !== id).slice(0, 4)

  if (!product) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <p className="text-[var(--color-text-secondary)] mb-6">The product you're looking for doesn't exist.</p>
          <Link to="/products" className="btn-primary">
            <FiChevronLeft size={18} /> Back to Products
          </Link>
        </div>
      </div>
    )
  }

  const hasDiscount = product.discount_price && product.discount_price < product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0

  const handleAddToCart = () => {
    if (product.sizes?.length > 1 && !selectedSize) {
      toast.error('Please select a size')
      return
    }
    if (product.colors?.length > 1 && !selectedColor) {
      toast.error('Please select a color')
      return
    }
    addToCart(product, quantity, selectedSize || product.sizes?.[0] || '', selectedColor || product.colors?.[0] || '')
  }

  const handleOrderNow = () => {
    handleAddToCart()
    navigate('/cart')
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!user) {
      toast.error('Please login to submit a review')
      navigate('/login')
      return
    }
    if (newRating === 0) {
      toast.error('Please select a rating')
      return
    }
    
    // Save to database
    await addReview({
      product_id: product.id,
      user_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
      rating: newRating,
      comment: newComment
    })
    
    toast.success('Review submitted! Thank you for your feedback.')
    setNewRating(0)
    setNewComment('')
  }

  const whatsappMessage = `Hi! I'm interested in "${product.name}" (LKR ${(hasDiscount ? product.discount_price : product.price).toLocaleString()}). Can you provide more details?`

  return (
    <div className="pt-20 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-gradient-to-b from-[#151230] to-[var(--color-surface)] border-b border-white/5 pt-10 pb-6 lg:pt-14 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="container-custom relative z-10">
          <nav className="text-xs text-gray-400 flex items-center gap-2 flex-wrap">
            <Link to="/" className="hover:text-violet-400 transition-colors">Home</Link>
            <span className="text-gray-600">/</span>
            <Link to="/products" className="hover:text-violet-400 transition-colors">Products</Link>
            <span className="text-gray-600">/</span>
            <Link to={`/products?category=${product.category}`} className="hover:text-violet-400 capitalize transition-colors">{product.category}</Link>
            <span className="text-gray-600">/</span>
            <span className="text-white font-medium truncate max-w-[160px] sm:max-w-xs">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-10">
        {/* Product Section */}
        <div className="grid lg:grid-cols-2 gap-10 mb-16">
          {/* Images */}
          <div className="flex flex-col gap-4">
            <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-[#1e1c3a] to-[#151230] border border-white/5 min-h-[400px] max-h-[500px] flex items-center justify-center group p-8 shadow-2xl">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-violet-500/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-fuchsia-500/20 transition-colors duration-700" />
              <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <img
                src={product.images?.[selectedImage] || product.image_url}
                alt={product.name}
                className="w-full h-full max-h-[400px] object-contain relative z-10 drop-shadow-2xl group-hover:scale-105 transition-transform duration-700"
              />
              
              {hasDiscount && (
                <span className="absolute top-6 left-6 bg-gradient-to-r from-red-500 to-rose-600 text-white font-black text-xs px-4 py-2 rounded-full shadow-lg shadow-red-500/30 z-20 transform -rotate-2">
                  -{discountPercent}% OFF
                </span>
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 shrink-0 rounded-2xl overflow-hidden border-2 transition-all p-1 ${
                      i === selectedImage 
                        ? 'border-violet-500 bg-violet-500/10' 
                        : 'border-white/10 bg-white/5 opacity-60 hover:opacity-100 hover:border-white/30'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain mix-blend-screen" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="mb-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-violet-500/10 text-violet-400 border border-violet-500/20">
                {product.category}
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-[var(--font-family-heading)] text-white mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} size={18} className={i < Math.floor(product.rating) ? 'text-amber-400' : 'text-gray-600'} />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-400">
                {product.rating} <span className="mx-1">•</span> {product.review_count} Reviews
              </span>
            </div>

            {/* Price */}
            <div className="flex flex-wrap items-center gap-4 mb-8 bg-white/5 p-5 rounded-2xl border border-white/5">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Price</span>
                <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">
                  LKR {(hasDiscount ? product.discount_price : product.price).toLocaleString()}
                </span>
              </div>
              {hasDiscount && (
                <div className="flex items-center gap-3 ml-2 mt-4">
                  <span className="text-xl text-gray-500 line-through decoration-red-500/50">
                    LKR {product.price.toLocaleString()}
                  </span>
                  <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-lg font-bold text-sm">
                    Save {discountPercent}%
                  </span>
                </div>
              )}
            </div>

            <p className="text-gray-400 text-sm sm:text-base mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Size Selection */}
            {product.sizes?.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-300 uppercase tracking-widest">Select Size</p>
                  <button className="text-[10px] text-violet-400 hover:text-white uppercase font-bold tracking-wider underline underline-offset-4">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[3rem] px-4 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                        selectedSize === size
                          ? 'border-violet-500 bg-violet-600 shadow-lg shadow-violet-500/25 text-white'
                          : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/30 hover:bg-white/10'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors?.length > 0 && (
              <div className="mb-8">
                <p className="text-sm font-semibold text-gray-300 uppercase tracking-widest mb-3">
                  Color <span className="text-violet-400 ml-1 font-normal capitalize">({selectedColor || 'Select'})</span>
                </p>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                        selectedColor === color
                          ? 'border-violet-500 bg-violet-600 shadow-lg shadow-violet-500/25 text-white'
                          : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/30 hover:bg-white/10'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Actions Container */}
            <div className="bg-white/5 border border-white/5 rounded-2xl p-5 mb-8">
              {/* Quantity */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
                <div>
                  <p className="text-sm font-semibold text-gray-300 uppercase tracking-widest mb-1">Quantity</p>
                  <span className={`text-xs font-medium ${product.stock > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {product.stock > 0 ? `${product.stock} items left` : 'Out of stock'}
                  </span>
                </div>
                <div className="flex items-center rounded-xl bg-black/40 border border-white/10 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                    disabled={quantity <= 1}
                  >
                    <FiMinus size={18} />
                  </button>
                  <span className="w-12 h-10 flex items-center justify-center text-base font-bold text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                    disabled={quantity >= product.stock}
                  >
                    <FiPlus size={18} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={handleAddToCart} 
                  disabled={product.stock === 0}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/10 font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiShoppingCart size={20} /> Add to Cart
                </button>
                <button 
                  onClick={handleOrderNow} 
                  disabled={product.stock === 0}
                  className="flex-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-violet-500/25 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buy it Now
                </button>
              </div>
            </div>

            {/* WhatsApp Order */}
            <a
              href={`${shopInfo.socialMedia.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-3 w-full py-4 rounded-xl relative group overflow-hidden bg-[#1e1c3a] border border-emerald-500/30 mb-8"
            >
              <div className="absolute inset-0 bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors" />
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white relative z-10 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                <FaWhatsapp size={20} />
              </div>
              <span className="text-emerald-400 font-bold text-sm tracking-wide relative z-10 group-hover:text-emerald-300 transition-colors">
                Quick Order via WhatsApp
              </span>
            </a>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: <FiTruck size={20} />, title: 'Free Delivery', desc: 'On orders > 10K' },
                { icon: <FiShield size={20} />, title: '100% Secure', desc: 'Safe Payments' },
                { icon: <FiRefreshCw size={20} />, title: 'Easy Returns', desc: '7 days policy' }
              ].map((badge, i) => (
                <div key={i} className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-black/20 border border-white/5 text-center group">
                  <span className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-violet-400 border border-white/5 group-hover:bg-violet-500/10 group-hover:border-violet-500/20 transition-all">
                    {badge.icon}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white mb-0.5">{badge.title}</h4>
                    <p className="text-[10px] text-gray-500">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-20">
          <div className="flex gap-2 sm:gap-6 border-b border-white/10 mb-8 overflow-x-auto custom-scrollbar pb-1">
            {['description', 'reviews', 'shipping'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 sm:px-6 py-4 text-sm font-bold capitalize transition-all relative shrink-0 ${
                  activeTab === tab
                    ? 'text-white'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {tab}
                {tab === 'reviews' && ` (${reviews.length})`}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
                )}
              </button>
            ))}
          </div>

          <div className="bg-[#1e1c3a]/50 p-6 sm:p-8 rounded-3xl border border-white/5">
            {activeTab === 'description' && (
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                  {product.description}
                </p>
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-black/20 border border-white/5">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Available Sizes</p>
                    <p className="text-sm text-gray-300 font-medium">{product.sizes?.join(', ') || 'N/A'}</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-black/20 border border-white/5">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Available Colors</p>
                    <p className="text-sm text-gray-300 font-medium capitalize">{product.colors?.join(', ') || 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                {/* Submit Review */}
                <form onSubmit={handleSubmitReview} className="p-6 sm:p-8 rounded-2xl bg-black/20 border border-white/5 mb-10">
                  <h3 className="text-lg font-bold text-white mb-6">Write a Review</h3>
                  <div className="mb-5">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Your Rating:</p>
                    <div className="flex gap-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          size={28}
                          className={`cursor-pointer transition-all hover:scale-110 ${
                            i < newRating ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'text-gray-600 hover:text-amber-400/50'
                          }`}
                          onClick={() => setNewRating(i + 1)}
                        />
                      ))}
                    </div>
                  </div>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your experience with this product..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 px-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all resize-none min-h-[120px] mb-5"
                  />
                  <button type="submit" className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-8 rounded-xl transition-all text-sm border border-white/10">
                    Submit Review
                  </button>
                </form>

                {/* Reviews List */}
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map(review => (
                      <div key={review.id} className="p-6 rounded-2xl bg-black/20 border border-white/5">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center font-bold text-white shadow-lg shadow-violet-500/20 text-lg">
                              {review.user_name ? review.user_name[0].toUpperCase() : 'U'}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white">{review.user_name || 'User'}</p>
                              <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500">{review.created_at}</p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} size={14} className={i < review.rating ? 'text-amber-400' : 'text-gray-600'} />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed mb-4">{review.comment}</p>
                        
                        {review.admin_reply && (
                          <div className="mt-4 p-4 rounded-xl bg-violet-500/5 border border-violet-500/10 relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-violet-500" />
                            <p className="text-[10px] font-bold uppercase tracking-widest text-violet-400 mb-1.5 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" /> Team Make To Be
                            </p>
                            <p className="text-sm text-gray-300">{review.admin_reply}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-lg font-medium text-gray-400 mb-2">No reviews yet</p>
                    <p className="text-sm text-gray-600">Be the first to share your thoughts on this product!</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="p-6 rounded-2xl bg-black/20 border border-white/5 group hover:border-violet-500/30 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400 mb-4 group-hover:bg-violet-500/20 transition-colors">
                    <FiTruck size={24} />
                  </div>
                  <h3 className="font-bold text-white mb-2">Delivery</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">We deliver across Sri Lanka within 3-5 business days. <strong className="text-white">Free delivery</strong> on orders above LKR 10,000.</p>
                </div>
                <div className="p-6 rounded-2xl bg-black/20 border border-white/5 group hover:border-amber-500/30 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 mb-4 group-hover:bg-amber-500/20 transition-colors">
                    <FiShield size={24} />
                  </div>
                  <h3 className="font-bold text-white mb-2">Payment</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Direct bank transfer to: <br/> <strong className="text-white">{shopInfo.bankDetails.bankName}</strong><br/>
                    A/C: <span className="font-mono text-amber-400">{shopInfo.bankDetails.accountNumber}</span><br />
                    ({shopInfo.bankDetails.branch})
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-black/20 border border-white/5 group hover:border-emerald-500/30 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 group-hover:bg-emerald-500/20 transition-colors">
                    <FiRefreshCw size={24} />
                  </div>
                  <h3 className="font-bold text-white mb-2">Returns</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">Easy hassle-free returns within 7 days of delivery. Keep original tags intact. Contact us via WhatsApp for quick service.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6 font-[var(--font-family-heading)]">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
