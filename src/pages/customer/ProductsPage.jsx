import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { FiSearch, FiX, FiFilter, FiChevronDown, FiTrendingUp } from 'react-icons/fi'
import ProductCard from '../../components/product/ProductCard'
import { useProducts } from '../../context/ProductContext'

export default function ProductsPage() {
  const { products: allProducts, categories } = useProducts()
  const [searchParams, setSearchParams] = useSearchParams()

  const searchQuery = searchParams.get('search') || ''
  const categoryFilter = searchParams.get('category') || ''
  const sortBy = searchParams.get('sort') || 'newest'
  const discountOnly = searchParams.get('discount') === 'true'

  const [localSearch, setLocalSearch] = useState(searchQuery)

  useEffect(() => {
    setLocalSearch(searchQuery)
  }, [searchQuery])

  const filteredProducts = useMemo(() => {
    let products = [...allProducts]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      )
    }

    if (categoryFilter) {
      products = products.filter((p) => p.category === categoryFilter)
    }

    if (discountOnly) {
      products = products.filter((p) => p.discount_price)
    }

    switch (sortBy) {
      case 'price-low':
        products.sort((a, b) => (a.discount_price || a.price) - (b.discount_price || b.price))
        break
      case 'price-high':
        products.sort((a, b) => (b.discount_price || b.price) - (a.discount_price || a.price))
        break
      case 'rating':
        products.sort((a, b) => b.rating - a.rating)
        break
      case 'popular':
        products.sort((a, b) => b.review_count - a.review_count)
        break
      default:
        products.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    }

    return products
  }, [searchQuery, categoryFilter, sortBy, discountOnly, allProducts])

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams)

    if (localSearch.trim()) {
      params.set('search', localSearch.trim())
    } else {
      params.delete('search')
    }

    setSearchParams(params)
  }

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams)

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    setSearchParams(params)
  }

  const clearFilters = () => {
    setSearchParams({})
    setLocalSearch('')
  }

  const hasActiveFilters =
    searchQuery || categoryFilter || discountOnly || sortBy !== 'newest'

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-gray-200 selection:bg-violet-500/30">
      {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-violet-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[-5%] w-[30%] h-[30%] bg-fuchsia-600/5 rounded-full blur-[100px]" />
      </div>

      {/* Hero Header Area */}
      <div className="relative z-10 pt-10 pb-6">
        <div className="container-custom">
          {/* Detailed Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span className="w-1 h-1 rounded-full bg-gray-700 mx-1" />
            <span className={categoryFilter ? 'hover:text-white transition-colors cursor-pointer' : 'text-violet-400'}>Catalog</span>
            {categoryFilter && (
              <>
                <span className="w-1 h-1 rounded-full bg-gray-700 mx-1" />
                <span className="text-violet-400">{categoryFilter}</span>
              </>
            )}
          </nav>

          {/* Title and Stats Row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div className="max-w-2xl">
              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tighter leading-none mb-3">
                {categoryFilter ? (
                  <span className="capitalize">{categoryFilter}</span>
                ) : searchQuery ? (
                  <span>Results for <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">"{searchQuery}"</span></span>
                ) : (
                  <span>Curated <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Collections</span></span>
                )}
              </h1>
              <div className="flex items-center gap-4 text-xs sm:text-sm font-medium text-gray-500">
                <p>Showing {filteredProducts.length} premium pieces</p>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-800" />
                <p className="flex items-center gap-1.5"><FiTrendingUp className="text-emerald-500" /> Currently Trending</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Filters Unified */}
      <div className="sticky top-[64px] z-40 bg-[#0a0a1a]/80 backdrop-blur-2xl border-y border-white/5 py-3">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Search Input - Left side */}
            <form onSubmit={handleSearch} className="relative flex-1 group">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-violet-400 transition-colors" size={16} />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search collection..."
                className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/30 focus:ring-1 focus:ring-violet-500/20 transition-all"
              />
              {localSearch && (
                <button 
                  type="button" 
                  onClick={() => { setLocalSearch(''); updateFilter('search', ''); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  <FiX size={14} />
                </button>
              )}
            </form>

            {/* Filter Actions - Right side */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Category Select */}
              <div className="relative group">
                <FiFilter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                <select
                  value={categoryFilter}
                  onChange={(e) => updateFilter('category', e.target.value)}
                  className="appearance-none bg-white/5 border border-white/5 text-xs font-bold uppercase tracking-wider text-gray-300 rounded-xl pl-9 pr-10 py-2.5 hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer outline-none"
                >
                  <option value="" className="bg-[#0f111a]">Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.slug} value={cat.slug} className="bg-[#0f111a]">
                      {cat.name}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-hover:text-white transition-colors" size={12} />
              </div>

              {/* Sort Select */}
              <div className="relative group">
                <select
                  value={sortBy}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  className="appearance-none bg-white/5 border border-white/5 text-xs font-bold uppercase tracking-wider text-gray-300 rounded-xl px-4 py-2.5 pr-10 hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer outline-none"
                >
                  <option value="newest" className="bg-[#0f111a]">New Arrival</option>
                  <option value="price-low" className="bg-[#0f111a]">Price: Low</option>
                  <option value="price-high" className="bg-[#0f111a]">Price: High</option>
                  <option value="rating" className="bg-[#0f111a]">Top Rated</option>
                  <option value="popular" className="bg-[#0f111a]">Popularity</option>
                </select>
                <FiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-hover:text-white transition-colors" size={12} />
              </div>

              {/* Sales Toggle */}
              <button
                onClick={() => updateFilter('discount', discountOnly ? '' : 'true')}
                className={`h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all flex items-center gap-2 ${
                  discountOnly
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                    : 'bg-white/5 text-amber-500 border border-amber-500/10 hover:bg-amber-500/10'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                Special Offers
              </button>

              {/* Clear Button */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 border border-red-500/10 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center shrink-0"
                  title="Clear all filters"
                >
                  <FiX size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="container-custom py-12 relative z-10">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4 lg:gap-8">
            {filteredProducts.map((product, i) => (
              <div
                key={product.id}
                className="animate-fadeInUp"
                style={{ animationDelay: `${Math.min(i * 0.05, 0.5)}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="py-24 text-center max-w-md mx-auto">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
              <FiSearch size={40} className="text-gray-600" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2 tracking-tight">No results matched</h3>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed font-medium">
              Try adjusting your search terms or filters. We're sure there's something you'll love.
            </p>
            <button 
              onClick={clearFilters} 
              className="h-12 px-8 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-violet-500/20 transition-all active:scale-95"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}