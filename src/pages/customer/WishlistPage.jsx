import { Link } from 'react-router-dom'
import { FiHeart, FiArrowLeft, FiShoppingBag } from 'react-icons/fi'
import { useProducts } from '../../context/ProductContext'
import ProductCard from '../../components/product/ProductCard'

export default function WishlistPage() {
  const { products, favorites } = useProducts()
  
  const favoriteProducts = products.filter(p => favorites.includes(p.id))

  return (
    <div className="pb-20 bg-[var(--color-surface)]">
      {/* Header */}
      <div className="bg-[var(--color-primary)] py-8 mb-10 relative overflow-hidden">
        <div className="container-custom relative z-10">
          <Link to="/products" className="inline-flex items-center gap-2 text-[var(--color-accent-light)] hover:text-white transition-all mb-3 font-black text-[10px] uppercase tracking-widest group">
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Store
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-[var(--font-family-heading)] tracking-tight">
            My <span className="text-[var(--color-accent-light)]">Wishlist</span>
          </h1>
          <p className="text-[var(--color-text-muted)] mt-2 text-xs font-black uppercase tracking-widest opacity-60">
            Saved items & Curated Picks
          </p>
        </div>
      </div>

      <div className="container-custom">
        {favoriteProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fadeInUp">
            {favoriteProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-[var(--color-surface-card)] rounded-3xl border border-[var(--color-border)] p-12 sm:p-20 text-center animate-fadeInUp">
             <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-[var(--color-text-muted)] mx-auto mb-8 border border-white/5 opacity-40">
                <FiHeart size={32} />
             </div>
             <h2 className="text-2xl font-black text-white mb-3 tracking-tight">Your Wishlist is Empty</h2>
             <p className="text-[var(--color-text-muted)] max-w-xs mx-auto mb-10 text-xs font-black uppercase tracking-widest opacity-60">
                Save the pieces you love and come back to them anytime.
             </p>
             <Link to="/products" className="bg-white text-[var(--color-surface)] font-black text-xs uppercase tracking-widest px-10 py-4 rounded-xl hover:bg-gray-200 transition-all shadow-xl">
                Start Exploring
             </Link>
          </div>
        )}
      </div>
    </div>
  )
}
