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
  const { getProductById, getProductReviews, products } = useProducts()

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
    if (product.sizes.length > 1 && !selectedSize) {
      toast.error('Please select a size')
      return
    }
    if (product.colors.length > 1 && !selectedColor) {
      toast.error('Please select a color')
      return
    }
    addToCart(product, quantity, selectedSize || product.sizes[0], selectedColor || product.colors[0])
  }

  const handleOrderNow = () => {
    handleAddToCart()
    navigate('/cart')
  }

  const handleSubmitReview = (e) => {
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
    toast.success('Review submitted! Thank you for your feedback.')
    setNewRating(0)
    setNewComment('')
  }

  const whatsappMessage = `Hi! I'm interested in "${product.name}" (LKR ${(hasDiscount ? product.discount_price : product.price).toLocaleString()}). Can you provide more details?`

  return (
    <div className="pt-20 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-[var(--color-primary)] border-b border-[var(--color-border)] py-4">
        <div className="container-custom">
          <nav className="text-xs text-[var(--color-text-muted)] flex items-center gap-2 flex-wrap">
            <Link to="/" className="hover:text-[var(--color-accent)] transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-[var(--color-accent)] transition-colors">Products</Link>
            <span>/</span>
            <Link to={`/products?category=${product.category}`} className="hover:text-[var(--color-accent)] capitalize transition-colors">{product.category}</Link>
            <span>/</span>
            <span className="text-[var(--color-text-primary)] truncate max-w-[160px] sm:max-w-xs">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-10">
        {/* Product Section */}
        <div className="grid lg:grid-cols-2 gap-10 mb-16">
          {/* Images */}
          <div>
            <div className="relative rounded-2xl overflow-hidden bg-[var(--color-surface-card)] mb-4 max-h-[500px] flex items-center justify-center">
              <img
                src={product.images[selectedImage] || product.image_url}
                alt={product.name}
                className="w-full h-full max-h-[500px] object-contain"
              />
              {hasDiscount && (
                <span className="absolute top-4 left-4 badge gradient-accent text-white font-bold shadow-lg text-sm">
                  -{discountPercent}% OFF
                </span>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      i === selectedImage ? 'border-[var(--color-accent)]' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <span className="badge badge-accent mb-3 capitalize">{product.category}</span>
            <h1 className="text-3xl font-bold font-[var(--font-family-heading)] mb-3">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} size={16} className={i < Math.floor(product.rating) ? 'text-[var(--color-gold)]' : 'text-[var(--color-text-muted)]'} />
                ))}
              </div>
              <span className="text-sm text-[var(--color-text-secondary)]">
                {product.rating} ({product.review_count} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-[var(--color-accent)]">
                LKR {(hasDiscount ? product.discount_price : product.price).toLocaleString()}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-xl text-[var(--color-text-muted)] line-through">
                    LKR {product.price.toLocaleString()}
                  </span>
                  <span className="badge badge-gold font-bold">Save {discountPercent}%</span>
                </>
              )}
            </div>

            <p className="text-[var(--color-text-secondary)] mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Size Selection */}
            {product.sizes.length > 0 && (
              <div className="mb-5">
                <p className="text-sm font-semibold mb-2">Size:</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                        selectedSize === size
                          ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                          : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors.length > 0 && (
              <div className="mb-5">
                <p className="text-sm font-semibold mb-2">Color: <span className="text-[var(--color-accent)]">{selectedColor}</span></p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                        selectedColor === color
                          ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                          : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)]'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <p className="text-sm font-semibold mb-2">Quantity:</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-xl border border-[var(--color-border)] overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-white/5 transition-all"
                  >
                    <FiMinus size={16} />
                  </button>
                  <span className="w-12 h-10 flex items-center justify-center text-sm font-semibold border-x border-[var(--color-border)]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-white/5 transition-all"
                  >
                    <FiPlus size={16} />
                  </button>
                </div>
                <span className="text-sm text-[var(--color-text-muted)]">
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <button onClick={handleAddToCart} className="btn-primary flex-1 justify-center py-3.5" disabled={product.stock === 0}>
                <FiShoppingCart size={18} /> Add to Cart
              </button>
              <button onClick={handleOrderNow} className="btn-gold flex-1 justify-center py-3.5" disabled={product.stock === 0}>
                Order Now
              </button>
            </div>

            {/* WhatsApp Order */}
            <a
              href={`${shopInfo.socialMedia.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border-2 border-emerald-500 text-emerald-400 font-semibold hover:bg-emerald-500 hover:text-white transition-all text-sm mb-6"
            >
              <FaWhatsapp size={20} /> Order via WhatsApp
            </a>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <FiTruck size={18} />, text: 'Free Delivery' },
                { icon: <FiShield size={18} />, text: 'Genuine Product' },
                { icon: <FiRefreshCw size={18} />, text: 'Easy Returns' }
              ].map((badge, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] text-center">
                  <span className="text-[var(--color-accent)]">{badge.icon}</span>
                  <span className="text-[10px] font-medium text-[var(--color-text-secondary)] leading-tight">{badge.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-16">
          <div className="flex gap-1 border-b border-[var(--color-border)] mb-6">
            {['description', 'reviews', 'shipping'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium capitalize transition-all relative ${
                  activeTab === tab
                    ? 'text-[var(--color-accent)]'
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

          {activeTab === 'description' && (
            <div className="prose prose-invert max-w-none">
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                {product.description}
              </p>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl glass-light">
                  <p className="text-sm font-semibold mb-1">Available Sizes</p>
                  <p className="text-sm text-[var(--color-text-secondary)]">{product.sizes.join(', ')}</p>
                </div>
                <div className="p-4 rounded-xl glass-light">
                  <p className="text-sm font-semibold mb-1">Available Colors</p>
                  <p className="text-sm text-[var(--color-text-secondary)]">{product.colors.join(', ')}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              {/* Submit Review */}
              <form onSubmit={handleSubmitReview} className="p-6 rounded-2xl glass-light mb-8">
                <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Your Rating:</p>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        size={24}
                        className={`cursor-pointer transition-colors ${
                          i < newRating ? 'text-[var(--color-gold)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-gold-light)]'
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
                  className="input-field mb-4 min-h-[100px] resize-none"
                  rows={3}
                />
                <button type="submit" className="btn-primary">
                  Submit Review
                </button>
              </form>

              {/* Reviews List */}
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map(review => (
                    <div key={review.id} className="p-5 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)]">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full gradient-accent flex items-center justify-center font-bold text-sm">
                            {review.user_name[0]}
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{review.user_name}</p>
                            <p className="text-xs text-[var(--color-text-muted)]">{review.created_at}</p>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} size={12} className={i < review.rating ? 'text-[var(--color-gold)]' : 'text-[var(--color-text-muted)]'} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{review.comment}</p>
                      {review.admin_reply && (
                        <div className="mt-3 ml-4 pl-4 border-l-2 border-[var(--color-accent)] py-2">
                          <p className="text-xs text-[var(--color-accent)] font-semibold mb-1">Reply from Make To Be:</p>
                          <p className="text-sm text-[var(--color-text-secondary)]">{review.admin_reply}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-[var(--color-text-muted)] py-8">No reviews yet. Be the first to review!</p>
              )}
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl glass-light">
                <h3 className="font-semibold mb-2 flex items-center gap-2"><FiTruck /> Delivery</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">We deliver across Sri Lanka within 3-5 business days. Free delivery on orders above LKR 10,000.</p>
              </div>
              <div className="p-4 rounded-xl glass-light">
                <h3 className="font-semibold mb-2 flex items-center gap-2"><FiShield /> Payment</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Bank Transfer to: <strong>{shopInfo.bankDetails.bankName}</strong> - A/C: <strong className="text-[var(--color-gold)]">{shopInfo.bankDetails.accountNumber}</strong> ({shopInfo.bankDetails.branch})
                </p>
              </div>
              <div className="p-4 rounded-xl glass-light">
                <h3 className="font-semibold mb-2 flex items-center gap-2"><FiRefreshCw /> Returns</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">Easy returns within 7 days of delivery. Contact us via WhatsApp for return requests.</p>
              </div>
            </div>
          )}
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
