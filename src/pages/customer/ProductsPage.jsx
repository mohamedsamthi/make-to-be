import { useState, useMemo } from 'react'
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

  const filteredProducts = useMemo(() => {
    let products = [...allProducts]
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      products = products.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      )
    }
    if (categoryFilter) products = products.filter(p => p.category === categoryFilter)
    if (discountOnly) products = products.filter(p => p.discount_price)
    switch (sortBy) {
      case 'price-low': products.sort((a, b) => (a.discount_price || a.price) - (b.discount_price || b.price)); break
      case 'price-high': products.sort((a, b) => (b.discount_price || b.price) - (a.discount_price || a.price)); break
      case 'rating': products.sort((a, b) => b.rating - a.rating); break
      case 'popular': products.sort((a, b) => b.review_count - a.review_count); break
      default: products.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    }
    return products
  }, [searchQuery, categoryFilter, sortBy, discountOnly, allProducts])

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams)
    localSearch.trim() ? params.set('search', localSearch.trim()) : params.delete('search')
    setSearchParams(params)
  }

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams)
    value ? params.set(key, value) : params.delete(key)
    setSearchParams(params)
  }

  const clearFilters = () => { setSearchParams({}); setLocalSearch('') }
  const hasActiveFilters = searchQuery || categoryFilter || discountOnly || sortBy !== 'newest'

  return (
    <div className="pt-20 min-h-screen">
      {/* Page Header */}
      <div className="bg-[var(--color-primary)] border-b border-[var(--color-border)]">
        <div className="container-custom py-8">
          {/* Breadcrumb */}
          <nav className="text-xs text-[var(--color-text-muted)] flex items-center gap-2 mb-3">
            <Link to="/" className="hover:text-[var(--color-accent)] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[var(--color-text-primary)]">Products</span>
            {categoryFilter && (
              <><span>/</span><span className="text-[var(--color-accent)] capitalize">{categoryFilter}</span></>
            )}
          </nav>

          {/* Title & Search Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-[var(--font-family-heading)]">
                {categoryFilter
                  ? <span className="capitalize">{categoryFilter}</span>
                  : searchQuery
                    ? <>Results for "<span className="text-[var(--color-accent)]">{searchQuery}</span>"</>
                    : 'All Products'}
              </h1>
              <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={16} />
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Search products..."
                  className="input-field pl-9 py-2.5 text-sm"
                  id="products-search-input"
                />
              </div>
              <button type="submit" className="btn-primary px-5 py-2.5 text-sm" id="products-search-btn">
                Search
              </button>
            </form>
          </div>

          {/* Filter Bar */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center">
            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 flex-1">
              <button
                onClick={() => updateFilter('category', '')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  !categoryFilter ? 'bg-[var(--color-accent)] text-white shadow-md' : 'bg-white/5 text-[var(--color-text-secondary)] hover:bg-white/10 hover:text-white border border-[var(--color-border)]'
                }`}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat.slug}
                  onClick={() => updateFilter('category', cat.slug)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    categoryFilter === cat.slug ? 'bg-[var(--color-accent)] text-white shadow-md' : 'bg-white/5 text-[var(--color-text-secondary)] hover:bg-white/10 hover:text-white border border-[var(--color-border)]'
                  }`}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>

            {/* Sort + Deals */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => updateFilter('discount', discountOnly ? '' : 'true')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 border ${
                  discountOnly ? 'bg-amber-500 text-white border-amber-500' : 'bg-white/5 text-[var(--color-text-secondary)] hover:bg-white/10 border-[var(--color-border)]'
                }`}
              >
                🔥 Deals
              </button>

              <select
                value={sortBy}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="input-field text-xs py-1.5 pr-8 w-auto min-w-[130px]"
                id="products-sort"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
                <option value="rating">Top Rated</option>
                <option value="popular">Most Popular</option>
              </select>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="p-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-400/20 flex items-center gap-1"
                  title="Clear all filters"
                >
                  <FiX size={15} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container-custom py-10">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product, i) => (
              <div key={product.id} className="animate-fadeInUp" style={{ animationDelay: `${Math.min(i * 0.04, 0.4)}s` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="text-6xl mb-5">🔍</div>
            <h3 className="text-xl font-bold mb-2">No Products Found</h3>
            <p className="text-[var(--color-text-secondary)] mb-8 max-w-xs mx-auto">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <button onClick={clearFilters} className="btn-primary px-8">Clear Filters</button>
          </div>
        )}
      </div>
    </div>
  )
}
