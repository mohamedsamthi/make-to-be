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
    <div className="min-h-screen">
      {/* Breadcrumb & Background Effects */}
      <div className="relative overflow-hidden pt-4 pb-3 bg-[#151230]">
        <div className="absolute -top-24 -left-20 w-64 h-64 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="container-custom relative z-10">
          <nav className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 flex items-center gap-2 flex-wrap">
            <Link to="/" className="hover:text-violet-400 transition-colors">Home</Link>
            <span className="opacity-30">/</span>
            <Link to="/products" className="hover:text-violet-400 transition-colors">Shop</Link>
            <span className="opacity-30">/</span>
            <Link to={`/products?category=${product.category}`} className="hover:text-violet-400 transition-colors">{product.category}</Link>
            <span className="opacity-30">/</span>
            <span className="text-white truncate max-w-[120px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-4 lg:py-6">
        {/* Product Section */}
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 mb-12">
          {/* Images Gallery - Compact 5-col width on desktop */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="relative aspect-[4/5] sm:aspect-square rounded-3xl overflow-hidden bg-[#1e1c3a]/30 border border-white/5 group p-4 sm:p-8 shadow-xl backdrop-blur-xl">
              {/* Dynamic Glow Background */}
              <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/5 via-transparent to-fuchsia-600/5 opacity-50" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-violet-500/5 rounded-full blur-[80px]" />
              
              <img
                key={selectedImage}
                src={product.images?.[selectedImage] || product.image_url}
                alt={product.name}
                className="w-full h-full object-contain relative z-10 drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-700 ease-out animate-fade-in"
              />
              
              {hasDiscount && (
                <div className="absolute top-4 left-4 z-30 flex flex-col gap-1">
                  <span className="bg-red-500 text-white font-black text-[9px] uppercase tracking-tighter px-3 py-1.5 rounded-lg shadow-lg shadow-red-500/30">
                    SALE
                  </span>
                  <span className="bg-white text-black font-black text-sm px-2.5 py-1 rounded-lg shadow-xl w-fit transform -rotate-2">
                    -{discountPercent}%
                  </span>
                </div>
              )}

              {/* Share/Heart Overlay */}
              <div className="absolute top-4 right-4 z-30 flex flex-col gap-2">
                <button className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all">
                  <FiHeart size={16} />
                </button>
              </div>
            </div>

            {product.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all p-1.5 relative group ${
                      i === selectedImage 
                        ? 'border-violet-500 bg-violet-500/5' 
                        : 'border-white/5 bg-white/5 opacity-40 hover:opacity-100 hover:border-white/20'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details - 7-col width on desktop */}
          <div className="lg:col-span-7 flex flex-col pt-2 lg:pt-0">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-violet-400 bg-violet-400/10 px-2 py-0.5 rounded">
                {product.category}
              </span>
              <div className="flex items-center gap-1">
                <FaStar size={12} className="text-amber-400" />
                <span className="text-[10px] font-bold text-gray-400">{product.rating} ({product.review_count} Reviews)</span>
              </div>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-3">
              {product.name}
            </h1>

            {/* Price section - Cleaner */}
            <div className="flex items-baseline gap-3 mb-5">
              <span className="text-3xl font-black text-white">
                LKR {(hasDiscount ? product.discount_price : product.price).toLocaleString()}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-gray-500 line-through">
                    LKR {product.price.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-black uppercase text-emerald-400">
                    You save LKR {(product.price - product.discount_price).toLocaleString()}
                  </span>
                </>
              )}
            </div>

            <p className="text-gray-400 text-xs sm:text-sm mb-6 leading-relaxed max-w-2xl border-l border-white/5 pl-4">
              {product.description}
            </p>

            <div className="grid sm:grid-cols-2 gap-8 mb-8">
                {/* Size Selection */}
                {product.sizes?.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Size</p>
                      <button className="text-[9px] text-violet-400 font-bold uppercase trekking-widest hover:underline">Guide</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map(size => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`min-w-[2.5rem] h-9 rounded-lg text-[10px] font-black transition-all border ${
                            selectedSize === size
                              ? 'border-violet-500 bg-violet-600 text-white shadow-lg shadow-violet-500/20'
                              : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
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
                  <div>
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3">
                      Color <span className="text-white ml-1">• {selectedColor || 'Select'}</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map(color => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`h-9 px-3 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border ${
                            selectedColor === color
                              ? 'border-violet-500 bg-violet-600 text-white shadow-lg shadow-violet-500/20'
                              : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            {/* Compact Action Group */}
            <div className="rounded-2xl border border-white/5 bg-white/5 p-5 mb-6">
                <div className="flex flex-wrap items-center gap-6 mb-6">
                   {/* Compact Quantity */}
                   <div>
                     <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">Quantity</p>
                     <div className="flex items-center h-10 rounded-xl bg-black/40 border border-white/10 p-1">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white" disabled={quantity <= 1}>
                          <FiMinus size={14} />
                        </button>
                        <span className="w-10 text-center text-xs font-black text-white">{quantity}</span>
                        <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white" disabled={quantity >= product.stock}>
                          <FiPlus size={14} />
                        </button>
                     </div>
                   </div>

                   <div>
                      <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">Availability</p>
                      <div className="flex items-center gap-2 h-10">
                        <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${product.stock > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {product.stock > 0 ? `${product.stock} In Stock` : 'Sold Out'}
                        </span>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={handleAddToCart} 
                    disabled={product.stock === 0}
                    className="h-12 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-30"
                  >
                    <FiShoppingCart size={14} /> Add to Bag
                  </button>
                  <button 
                    onClick={handleOrderNow} 
                    disabled={product.stock === 0}
                    className="h-12 rounded-xl bg-white text-black font-black text-[10px] uppercase tracking-widest hover:bg-white/90 transition-all shadow-lg shadow-white/5 flex items-center justify-center gap-2 disabled:opacity-30"
                  >
                    Buy Now
                  </button>
                </div>
            </div>

            {/* Slimmer WhatsApp & Trust */}
            <div className="grid sm:grid-cols-12 gap-4">
               <a
                href={`${shopInfo.socialMedia.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noreferrer"
                className="sm:col-span-5 flex items-center justify-center gap-2 h-12 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 transition-all font-black text-[10px] uppercase tracking-widest"
              >
                <FaWhatsapp size={14} /> Order WhatsApp
              </a>
              
              <div className="sm:col-span-7 grid grid-cols-3 gap-2">
                {[
                  { icon: <FiTruck size={14} />, title: 'Fast delivery' },
                  { icon: <FiShield size={14} />, title: 'Secure' },
                  { icon: <FiRefreshCw size={14} />, title: 'Easy Returns' }
                ].map((badge, i) => (
                  <div key={i} className="flex flex-col items-center justify-center gap-1 rounded-xl bg-black/20 border border-white/5 py-1.5">
                    <span className="text-violet-400">{badge.icon}</span>
                    <span className="text-[8px] font-black uppercase text-gray-500 text-center px-1">{badge.title}</span>
                  </div>
                ))}
              </div>
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
