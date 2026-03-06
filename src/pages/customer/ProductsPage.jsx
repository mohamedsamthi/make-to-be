import { useState, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { FiSearch, FiFilter, FiX, FiGrid, FiList, FiChevronDown } from 'react-icons/fi'
import ProductCard from '../../components/product/ProductCard'
import { useProducts } from '../../context/ProductContext'

export default function ProductsPage() {
  const { products: allProducts, categories } = useProducts()
  const [searchParams, setSearchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState('grid')

  const searchQuery = searchParams.get('search') || ''
  const categoryFilter = searchParams.get('category') || ''
  const sortBy = searchParams.get('sort') || 'newest'
  const discountOnly = searchParams.get('discount') === 'true'

  const [localSearch, setLocalSearch] = useState(searchQuery)

  const filteredProducts = useMemo(() => {
    let products = [...allProducts]

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      products = products.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      )
    }

    // Category
    if (categoryFilter) {
      products = products.filter(p => p.category === categoryFilter)
    }

    // Discount
    if (discountOnly) {
      products = products.filter(p => p.discount_price)
    }

    // Sort
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
      case 'newest':
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

  const hasActiveFilters = searchQuery || categoryFilter || discountOnly || sortBy !== 'newest'

  return (
    <div className="pt-20 min-h-screen">
      {/* Header */}
      <div className="bg-[var(--color-primary)] py-10">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <nav className="text-xs text-[var(--color-text-muted)] mb-2 flex items-center gap-2">
                <Link to="/" className="hover:text-[var(--color-accent)]">Home</Link>
                <span>/</span>
                <span className="text-[var(--color-text-primary)]">Products</span>
                {categoryFilter && (
                  <>
                    <span>/</span>
                    <span className="text-[var(--color-accent)] capitalize">{categoryFilter}</span>
                  </>
                )}
              </nav>
              <h1 className="text-3xl font-bold font-[var(--font-family-heading)]">
                {categoryFilter ? (
                  <span className="capitalize">{categoryFilter}</span>
                ) : searchQuery ? (
                  <>Results for "<span className="text-[var(--color-accent)]">{searchQuery}</span>"</>
                ) : (
                  'All Products'
                )}
              </h1>
              <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-72">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={16} />
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Search products..."
                  className="input-field pl-10"
                  id="products-search-input"
                />
              </div>
              <button type="submit" className="btn-primary px-4" id="products-search-btn">
                Search
              </button>
            </form>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => updateFilter('category', '')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  !categoryFilter
                    ? 'gradient-accent text-white'
                    : 'glass-light text-[var(--color-text-secondary)] hover:text-white'
                }`}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat.slug}
                  onClick={() => updateFilter('category', cat.slug)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    categoryFilter === cat.slug
                      ? 'gradient-accent text-white'
                      : 'glass-light text-[var(--color-text-secondary)] hover:text-white'
                  }`}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 ml-auto">
              {/* Discount Filter */}
              <button
                onClick={() => updateFilter('discount', discountOnly ? '' : 'true')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                  discountOnly
                    ? 'gradient-gold text-[var(--color-surface)]'
                    : 'glass-light text-[var(--color-text-secondary)] hover:text-white'
                }`}
              >
                🔥 Deals
              </button>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="input-field w-auto text-sm py-2 pr-8 appearance-auto"
                id="products-sort"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="popular">Most Popular</option>
              </select>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all flex items-center gap-1"
                >
                  <FiX size={14} /> Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container-custom py-10">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, i) => (
              <div key={product.id} className="animate-fadeInUp" style={{ animationDelay: `${i * 0.05}s` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-2">No Products Found</h3>
            <p className="text-[var(--color-text-secondary)] mb-6">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <button onClick={clearFilters} className="btn-primary">
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
