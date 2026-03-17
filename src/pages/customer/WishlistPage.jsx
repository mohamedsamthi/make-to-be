import { Link } from 'react-router-dom'
import { FiHeart, FiArrowLeft, FiShoppingBag } from 'react-icons/fi'
import { useProducts } from '../../context/ProductContext'
import ProductCard from '../../components/product/ProductCard'

export default function WishlistPage() {
  const { products, favorites } = useProducts()
  
  const favoriteProducts = products.filter(p => favorites.includes(p.id))

  return (
    <div className="min-h-screen pt-12 pb-24 bg-[var(--color-surface)]">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-l-4 border-rose-500 pl-6 animate-fadeInUp">
          <div>
            <Link to="/products" className="inline-flex items-center gap-2 text-rose-400 hover:text-white transition-all mb-4 font-bold text-sm uppercase tracking-widest group">
              <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Store
            </Link>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white font-[var(--font-family-heading)] tracking-tight">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-500">Wishlist</span>
            </h1>
            <p className="text-gray-400 mt-3 text-lg max-w-2xl font-medium opacity-80">
              Your personal collection of curated items. Save the pieces you love and come back to them anytime.
            </p>
          </div>
          
          <div className="shrink-0 flex items-center gap-4 px-6 py-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400">
              <FiHeart size={20} fill="currentColor" />
            </div>
            <div>
               <p className="text-white font-bold text-sm leading-none mb-1">{favoriteProducts.length} Saved Items</p>
               <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest leading-none">Your Favorites</p>
            </div>
          </div>
        </div>

        {favoriteProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            {favoriteProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-[var(--color-surface-card)] rounded-[2.5rem] border border-white/5 p-12 sm:p-20 text-center animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
             <div className="w-24 h-24 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500 mx-auto mb-8 shadow-2xl shadow-rose-500/10 ring-4 ring-rose-500/5">
                <FiHeart size={40} />
             </div>
             <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Your Wishlist is Empty</h2>
             <p className="text-gray-400 max-w-md mx-auto mb-10 text-lg font-medium leading-relaxed">
                Start adding your favorite pieces! Look for the heart icon on any product to save it here for later.
             </p>
             <Link to="/products" className="btn-primary inline-flex items-center gap-3 px-10 py-4 h-auto text-lg hover:scale-105 active:scale-95 shadow-2xl transition-all">
                <FiShoppingBag size={22} /> Explore Products
             </Link>
          </div>
        )}
      </div>
    </div>
  )
}
