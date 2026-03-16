import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { FiSearch, FiX } from 'react-icons/fi'
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
    <div className="min-h-screen bg-[#151230] text-gray-200">
      {/* Background Orbs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Page Header */}
      <div className="relative z-10 border-b border-white/10 bg-[#1e1c3a]/80 backdrop-blur-md pt-24 pb-8">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="mb-4 flex flex-wrap items-center gap-2 text-xs text-gray-400 font-semibold tracking-wide">
            <Link
              to="/"
              className="transition-colors hover:text-violet-400"
            >
              HOME
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-gray-300">PRODUCTS</span>
            {categoryFilter && (
              <>
                <span className="text-gray-600">/</span>
                <span className="text-violet-400 uppercase">
                  {categoryFilter}
                </span>
              </>
            )}
          </nav>

          {/* Title & Search Row */}
          <div className="flex flex-col flex-wrap lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div>
              <h1 className="font-[var(--font-family-heading)] text-3xl sm:text-5xl font-black text-white tracking-tight">
                {categoryFilter ? (
                  <span className="capitalize text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">{categoryFilter}</span>
                ) : searchQuery ? (
                  <>
                    Search: <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">"{searchQuery}"</span>
                  </>
                ) : (
                  'All Collection'
                )}
              </h1>
              <p className="mt-2 text-sm text-gray-400 font-medium">
                Showing {filteredProducts.length} premium item{filteredProducts.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Search Form */}
            <form
              onSubmit={handleSearch}
              className="flex w-full lg:w-auto items-stretch gap-2 shrink-0 group"
            >
              <div className="relative flex-1 lg:w-80">
                <FiSearch
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-400 transition-colors"
                  size={16}
                />
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Search elegant pieces..."
                  className="w-full bg-[#151230]/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all shadow-inner"
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white px-7 rounded-xl font-bold text-sm transition-all flex items-center justify-center shrink-0 shadow-lg shadow-violet-500/25"
              >
                Search
              </button>
            </form>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-6 border-t border-white/10">
            {/* Category Dropdown */}
            <div className="relative shrink-0">
              <select
                value={categoryFilter}
                onChange={(e) => updateFilter('category', e.target.value)}
                className="appearance-none bg-white/5 border border-white/10 text-white text-xs sm:text-sm rounded-full px-5 py-2 pr-10 focus:outline-none focus:border-violet-500 transition-all cursor-pointer font-medium"
              >
                <option value="" className="bg-gray-900">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug} className="bg-gray-900">
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">
                ▼
              </div>
            </div>

            {/* Sort + Deals */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => updateFilter('discount', discountOnly ? '' : 'true')}
                className={`flex items-center gap-1.5 rounded-full px-5 py-2 text-xs sm:text-sm font-medium transition-all ${
                  discountOnly
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                    : 'bg-white/5 text-amber-500 hover:bg-amber-500/10 border border-amber-500/20'
                }`}
              >
                🔥 SALES ONLY
              </button>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  className="appearance-none bg-white/5 border border-white/10 text-white text-xs sm:text-sm rounded-full px-5 py-2 pr-10 focus:outline-none focus:border-violet-500 transition-all cursor-pointer"
                >
                  <option value="newest" className="bg-gray-900">Sort by: Newest</option>
                  <option value="price-low" className="bg-gray-900">Price: Low → High</option>
                  <option value="price-high" className="bg-gray-900">Price: High → Low</option>
                  <option value="rating" className="bg-gray-900">Top Rated</option>
                  <option value="popular" className="bg-gray-900">Most Popular</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">
                  ▼
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all ml-1 shrink-0"
                  title="Clear all filters"
                >
                  <FiX size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container-custom py-8">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {filteredProducts.map((product, i) => (
              <div
                key={product.id}
                className="animate-fadeInUp"
                style={{ animationDelay: `${Math.min(i * 0.04, 0.4)}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <div className="mb-5 text-6xl">🔍</div>
            <h3 className="mb-2 text-xl font-bold">No Products Found</h3>
            <p className="mx-auto mb-8 max-w-xs text-[var(--color-text-secondary)]">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <button onClick={clearFilters} className="btn-primary px-8">
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}