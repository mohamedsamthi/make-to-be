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
  const { getProductById, getProductReviews, products, addReview, favorites, toggleFavorite } = useProducts()

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
    <div>
      {/* Breadcrumb & Background Effects */}
      <div className="relative overflow-hidden pt-4 pb-3 bg-[var(--color-primary)]">
        <div className="container-custom relative z-10">
          <nav className="text-[9px] font-black uppercase tracking-[0.15em] text-[var(--color-text-muted)] flex items-center gap-2 flex-wrap">
            <Link to="/" className="hover:text-[var(--color-accent-light)] transition-colors">Home</Link>
            <span className="opacity-30">/</span>
            <Link to="/products" className="hover:text-[var(--color-accent-light)] transition-colors">Shop</Link>
            <span className="opacity-30">/</span>
            <Link to={`/products?category=${product.category}`} className="hover:text-[var(--color-accent-light)] transition-colors">{product.category}</Link>
            <span className="opacity-30">/</span>
            <span className="text-white truncate max-w-[120px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-6 lg:py-8 max-w-6xl mx-auto">
        {/* Product Section */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 mb-10">
          {/* Images Gallery */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/5 group p-4 shadow-xl">
              <img
                key={selectedImage}
                src={product.images?.[selectedImage] || product.image_url}
                alt={product.name}
                className="w-full h-full object-contain relative z-10 drop-shadow-2xl group-hover:scale-105 transition-transform duration-700 ease-out animate-fade-in"
              />
              
              {hasDiscount && (
                <div className="absolute top-4 left-4 z-30 flex flex-col gap-1">
                  <span className="bg-red-500 text-white font-black text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-lg shadow-red-500/30">
                    SALE
                  </span>
                </div>
              )}

              {/* Heart Overlay */}
              <div className="absolute top-4 right-4 z-30">
                <button 
                  onClick={() => toggleFavorite(product.id)}
                  className={`w-10 h-10 rounded-xl border transition-all flex items-center justify-center backdrop-blur-md ${
                    favorites.includes(product.id)
                      ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/20'
                      : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                  }`}
                >
                  <FiHeart size={18} className={favorites.includes(product.id) ? 'fill-white' : ''} />
                </button>
              </div>
            </div>

            {product.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all p-1.5 relative group ${
                      i === selectedImage 
                        ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/5' 
                        : 'border-white/5 bg-white/5 opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-accent-light)]">
                {product.category}
              </span>
              <div className="flex items-center gap-1">
                <FaStar size={12} className="text-amber-400" />
                <span className="text-[10px] font-bold text-[var(--color-text-muted)]">{product.rating} ({product.review_count} Reviews)</span>
              </div>
            </div>
            
            <h1 className="text-xl sm:text-2xl font-black text-white mb-3 leading-tight">
              {product.name}
            </h1>

            {/* Price section */}
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-2xl font-black text-white">
                LKR {(hasDiscount ? product.discount_price : product.price).toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-lg text-[var(--color-text-muted)] line-through">
                  LKR {product.price.toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-[var(--color-text-secondary)] text-sm mb-6 leading-relaxed max-w-xl">
              {product.description}
            </p>

            <div className="grid sm:grid-cols-2 gap-8 mb-8">
                {product.sizes?.length > 0 && (
                  <div>
                    <p className="text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-widest mb-3">Size</p>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map(size => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`min-w-[2.5rem] h-10 rounded-xl text-[10px] font-black transition-all border ${
                            selectedSize === size
                              ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-white shadow-lg shadow-[var(--color-accent)]/20'
                              : 'border-white/10 bg-white/5 text-[var(--color-text-muted)] hover:border-white/20'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {product.colors?.length > 0 && (
                  <div>
                    <p className="text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-widest mb-3">Color</p>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map(color => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                            selectedColor === color
                              ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-white shadow-lg shadow-[var(--color-accent)]/20'
                              : 'border-white/10 bg-white/5 text-[var(--color-text-muted)] hover:border-white/20'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            {/* Action Group */}
            <div className="rounded-2xl border border-white/5 bg-white/5 p-6 mb-8">
                <div className="flex flex-wrap items-center gap-6 mb-6">
                   <div>
                     <p className="text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-widest mb-2">Quantity</p>
                     <div className="flex items-center h-10 rounded-xl bg-black/20 border border-white/10 p-1">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-text-muted)] hover:text-white" disabled={quantity <= 1}>
                          <FiMinus size={14} />
                        </button>
                        <span className="w-10 text-center text-xs font-black text-white">{quantity}</span>
                        <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-text-muted)] hover:text-white" disabled={quantity >= product.stock}>
                          <FiPlus size={14} />
                        </button>
                     </div>
                   </div>

                   <div>
                      <p className="text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-widest mb-2">Availability</p>
                      <div className="flex items-center gap-2 h-10">
                        <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${product.stock > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {product.stock > 0 ? `${product.stock} In Stock` : 'Sold Out'}
                        </span>
                      </div>
                   </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={handleAddToCart} 
                    disabled={product.stock === 0}
                    className="flex-1 h-12 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-30"
                  >
                    <FiShoppingCart size={16} /> Add to Bag
                  </button>
                  <button 
                    onClick={handleOrderNow} 
                    disabled={product.stock === 0}
                    className="flex-1 h-12 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-gray-100 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-30"
                  >
                    Buy Now
                  </button>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <FiTruck size={16} />, title: 'Fast Delivery' },
                { icon: <FiShield size={16} />, title: 'Secure' },
                { icon: <FiRefreshCw size={16} />, title: 'Easy Returns' }
              ].map((badge, i) => (
                <div key={i} className="flex flex-col items-center justify-center gap-1.5 rounded-xl bg-black/10 border border-white/5 py-3">
                  <span className="text-[var(--color-accent-light)]">{badge.icon}</span>
                  <span className="text-[9px] font-black uppercase text-[var(--color-text-muted)] text-center">{badge.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-16">
          <div className="flex gap-6 border-b border-white/5 mb-8 overflow-x-auto no-scrollbar">
            {['description', 'reviews', 'shipping'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-2 py-4 text-xs font-black uppercase tracking-widest transition-all relative shrink-0 ${
                  activeTab === tab
                    ? 'text-white'
                    : 'text-[var(--color-text-muted)] hover:text-white'
                }`}
              >
                {tab}
                {tab === 'reviews' && ` (${reviews.length})`}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-accent)]" />
                )}
              </button>
            ))}
          </div>

          <div className="bg-white/5 p-6 sm:p-10 rounded-2xl border border-white/5">
            {activeTab === 'description' && (
              <div className="prose prose-invert max-w-none">
                <p className="text-[var(--color-text-secondary)] leading-relaxed text-sm sm:text-base">
                  {product.description}
                </p>
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl bg-black/20 border border-white/5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Available Sizes</p>
                    <p className="text-sm text-white font-medium">{product.sizes?.join(', ') || 'N/A'}</p>
                  </div>
                  <div className="p-5 rounded-xl bg-black/20 border border-white/5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Available Colors</p>
                    <p className="text-sm text-white font-medium capitalize">{product.colors?.join(', ') || 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <form onSubmit={handleSubmitReview} className="p-6 rounded-xl bg-black/20 border border-white/5 mb-8">
                  <h3 className="text-base font-bold text-white mb-4">Write a Review</h3>
                  <div className="mb-4">
                    <div className="flex gap-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          size={24}
                          className={`cursor-pointer transition-all ${
                            i < newRating ? 'text-amber-400' : 'text-white/10'
                          }`}
                          onClick={() => setNewRating(i + 1)}
                        />
                      ))}
                    </div>
                  </div>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your experience..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-600 mb-4 resize-none h-24"
                  />
                  <button type="submit" className="btn-primary py-2 px-8 text-xs">
                    Submit
                  </button>
                </form>

                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map(review => (
                      <div key={review.id} className="p-6 rounded-xl bg-black/20 border border-white/5">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-[var(--color-accent)] to-[var(--color-accent-dark)] flex items-center justify-center font-bold text-white text-sm">
                              {review.user_name ? review.user_name[0].toUpperCase() : 'U'}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white">{review.user_name || 'User'}</p>
                              <p className="text-[9px] uppercase font-bold text-[var(--color-text-muted)]">{review.created_at}</p>
                            </div>
                          </div>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} size={10} className={i < review.rating ? 'text-amber-400' : 'text-white/10'} />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-[var(--color-text-muted)] text-sm">No reviews yet.</div>
                )}
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: <FiTruck size={20} />, title: 'Delivery', desc: 'Standard shipping 3-5 days. Free over LKR 10,000.' },
                  { icon: <FiShield size={20} />, title: 'Payment', desc: 'Safe & secure transactions via bank transfer.' },
                  { icon: <FiRefreshCw size={20} />, title: 'Returns', desc: '7-day easy returns policy. Contact support.' }
                ].map((item, i) => (
                  <div key={i} className="p-6 rounded-xl bg-black/20 border border-white/5">
                    <div className="text-[var(--color-accent-light)] mb-4">{item.icon}</div>
                    <h3 className="font-bold text-white text-sm mb-2">{item.title}</h3>
                    <p className="text-[var(--color-text-muted)] text-xs leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-6 font-[var(--font-family-heading)] uppercase tracking-widest text-white">You May Also Like</h2>
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
