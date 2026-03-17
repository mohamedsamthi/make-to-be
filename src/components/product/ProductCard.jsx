import { Link } from 'react-router-dom'
import { FiShoppingCart, FiEye, FiHeart } from 'react-icons/fi'
import { FaStar, FaHeart } from 'react-icons/fa'
import { useCart } from '../../context/CartContext'
import { useProducts } from '../../context/ProductContext'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { favorites, toggleFavorite } = useProducts()
  
  const isFavorite = favorites.includes(product.id)

  const hasDiscount = product.discount_price && product.discount_price < product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1, product.sizes?.[0] || '', product.colors?.[0] || '')
  }

  const handleFavorite = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(product.id)
  }

  return (
    <Link
      to={`/products/${product.id}`}
      className="group flex flex-col bg-[var(--color-surface-card)] rounded-2xl overflow-hidden border border-[var(--color-border)] hover:border-[var(--color-accent)]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[var(--color-accent)]/10"
      id={`product-card-${product.id}`}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-[var(--color-surface-light)] shrink-0">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Favorite Button (Visible on Hover or if Active) */}
        <button
          onClick={handleFavorite}
          className={`absolute top-3 right-3 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 z-10 ${
            isFavorite 
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' 
              : 'bg-black/10 dark:bg-white/10 backdrop-blur-md text-[var(--color-text-primary)] border border-white/20 hover:bg-black/20 dark:hover:bg-white/20 opacity-0 group-hover:opacity-100'
          }`}
          title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        >
          {isFavorite ? <FaHeart size={16} /> : <FiHeart size={16} />}
        </button>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
          <button
            onClick={handleAddToCart}
            className="w-11 h-11 rounded-xl bg-[var(--color-accent)] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
            title="Add to Cart"
          >
            <FiShoppingCart size={18} />
          </button>
          <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:scale-110 transition-transform" title="View Details">
            <FiEye size={18} />
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {hasDiscount && (
            <span className="bg-[var(--color-accent)] text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg">
              -{discountPercent}% OFF
            </span>
          )}
          {product.featured && (
            <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg">
              ⭐ Featured
            </span>
          )}
        </div>

        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-3 right-3 bg-red-500/90 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg">
            Only {product.stock} left
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <p className="text-[10px] text-[var(--color-accent)] font-semibold uppercase tracking-widest">
          {product.category}
        </p>
        <h3 className="text-sm font-semibold line-clamp-2 leading-snug group-hover:text-[var(--color-accent)] transition-colors min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                size={11}
                className={i < Math.floor(product.rating) ? 'text-amber-400' : 'text-[var(--color-border)]'}
              />
            ))}
          </div>
          <span className="text-[11px] text-[var(--color-text-muted)]">({product.review_count})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-auto pt-2 border-t border-[var(--color-border)]/50">
          <span className="text-base font-bold text-[var(--color-accent)]">
            LKR {(hasDiscount ? product.discount_price : product.price).toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-xs text-[var(--color-text-muted)] line-through">
              LKR {product.price.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
