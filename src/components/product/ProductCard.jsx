import { Link } from 'react-router-dom'
import { FiShoppingCart, FiEye, FiHeart } from 'react-icons/fi'
import { FaStar } from 'react-icons/fa'
import { useCart } from '../../context/CartContext'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const hasDiscount = product.discount_price && product.discount_price < product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1, product.sizes?.[0] || '', product.colors?.[0] || '')
  }

  return (
    <Link
      to={`/products/${product.id}`}
      className="group block bg-[var(--color-surface-card)] rounded-2xl overflow-hidden card-hover border border-[var(--color-border)] hover:border-[var(--color-accent)]/30"
      id={`product-card-${product.id}`}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-[var(--color-surface-light)]">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
          <button
            onClick={handleAddToCart}
            className="w-11 h-11 rounded-xl bg-[var(--color-accent)] text-white flex items-center justify-center hover:scale-110 transition-transform"
            title="Add to Cart"
          >
            <FiShoppingCart size={18} />
          </button>
          <div
            className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:scale-110 transition-transform"
            title="Quick View"
          >
            <FiEye size={18} />
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {hasDiscount && (
            <span className="badge gradient-accent text-white text-[11px] font-bold shadow-lg">
              -{discountPercent}%
            </span>
          )}
          {product.featured && (
            <span className="badge gradient-gold text-[var(--color-surface)] text-[11px] font-bold shadow-lg">
              ⭐ Featured
            </span>
          )}
        </div>

        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-3 right-3 badge bg-red-500/80 text-white text-[11px] font-bold">
            Only {product.stock} left
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-[11px] text-[var(--color-accent)] font-semibold uppercase tracking-wider mb-1">
          {product.category}
        </p>
        <h3 className="text-sm font-semibold mb-2 line-clamp-2 group-hover:text-[var(--color-accent)] transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                size={12}
                className={i < Math.floor(product.rating) ? 'text-[var(--color-gold)]' : 'text-[var(--color-text-muted)]'}
              />
            ))}
          </div>
          <span className="text-xs text-[var(--color-text-muted)]">
            ({product.review_count})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-[var(--color-accent)]">
            LKR {(hasDiscount ? product.discount_price : product.price).toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-sm text-[var(--color-text-muted)] line-through">
              LKR {product.price.toLocaleString()}
            </span>
          )}
        </div>

        {/* Colors Preview */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1 mt-3">
            <span className="text-[10px] text-[var(--color-text-muted)] mr-1">Colors:</span>
            {product.colors.slice(0, 4).map((color, i) => (
              <span
                key={i}
                className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/5 text-[var(--color-text-secondary)]"
              >
                {color}
              </span>
            ))}
            {product.colors.length > 4 && (
              <span className="text-[10px] text-[var(--color-text-muted)]">+{product.colors.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
