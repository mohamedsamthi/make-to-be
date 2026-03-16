import { useState } from 'react'
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiX, FiImage, FiCheck } from 'react-icons/fi'
import { useProducts } from '../../context/ProductContext'
import toast from 'react-hot-toast'

export default function AdminProductsPage() {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useProducts()
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', discount_price: '', category: 'watches',
    image_url: '', sizes: '', colors: '', stock: '', featured: false
  })

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
    const matchCategory = filterCategory === 'all' || p.category === filterCategory
    return matchSearch && matchCategory
  })

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', discount_price: '', category: 'watches', image_url: '', sizes: '', colors: '', stock: '', featured: false })
  }

  const openAdd = () => {
    setEditProduct(null)
    resetForm()
    setShowForm(true)
  }

  const openEdit = (p) => {
    setEditProduct(p)
    setFormData({
      name: p.name,
      description: p.description,
      price: String(p.price),
      discount_price: p.discount_price ? String(p.discount_price) : '',
      category: p.category,
      image_url: p.image_url,
      sizes: p.sizes?.join(', ') || '',
      colors: p.colors?.join(', ') || '',
      stock: String(p.stock),
      featured: p.featured
    })
    setShowForm(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.name || !formData.price || !formData.stock) {
      toast.error('Please fill required fields')
      return
    }

    const productData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      discount_price: formData.discount_price ? Number(formData.discount_price) : null,
      category: formData.category,
      image_url: formData.image_url.trim() || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
      images: [formData.image_url.trim() || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'],
      sizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean),
      colors: formData.colors.split(',').map(s => s.trim()).filter(Boolean),
      stock: Number(formData.stock),
      featured: formData.featured
    }

    if (editProduct) {
      updateProduct(editProduct.id, productData)
      toast.success('Product updated successfully! ✅')
    } else {
      addProduct(productData)
      toast.success('Product added successfully! 🎉')
    }
    setShowForm(false)
    resetForm()
  }

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 8 * 1024 * 1024) { 
        toast.error('Image is too large. Please select a smaller one.')
        return
      }
      
      const reader = new FileReader()
      reader.onloadend = () => {
        // Compress image using canvas
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const MAX_WIDTH = 800
          const scaleSize = MAX_WIDTH / img.width
          canvas.width = MAX_WIDTH
          canvas.height = img.height * scaleSize
          
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          
          // Convert to base64 with lower quality to reduce payload size
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6)
          setFormData(p => ({...p, image_url: compressedBase64}))
        }
        img.src = reader.result
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDelete = (id, name) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteProduct(id)
      toast.success('Product deleted! 🗑️')
    }
  }

  const discountPercent = (price, discountPrice) => {
    if (!discountPrice) return 0
    return Math.round(((price - discountPrice) / price) * 100)
  }

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-[var(--font-family-heading)]">Product Management</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">{products.length} total products • {filtered.length} shown</p>
        </div>
        <button onClick={openAdd} className="btn-primary shadow-lg shadow-[var(--color-accent)]/20">
          <FiPlus size={18} /> Add New Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={16} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="input-field pl-11"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filterCategory === 'all'
                ? 'gradient-accent text-white'
                : 'glass-light text-[var(--color-text-secondary)] hover:text-white'
            }`}
          >
            All
          </button>
          {categories.map(c => (
            <button
              key={c.slug}
              onClick={() => setFilterCategory(c.slug)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filterCategory === c.slug
                  ? 'gradient-accent text-white'
                  : 'glass-light text-[var(--color-text-secondary)] hover:text-white'
              }`}
            >
              {c.icon} {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-white/2">
                <th className="text-left text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider px-5 py-3.5">Product</th>
                <th className="text-left text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider px-5 py-3.5">Category</th>
                <th className="text-left text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider px-5 py-3.5">Price</th>
                <th className="text-left text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider px-5 py-3.5">Stock</th>
                <th className="text-left text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider px-5 py-3.5">Status</th>
                <th className="text-right text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider px-5 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? filtered.map(p => (
                <tr key={p.id} className="border-b border-[var(--color-border)] hover:bg-white/3 transition-colors group">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[var(--color-border)]">
                        <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate max-w-[200px]">{p.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {p.featured && <span className="badge badge-gold text-[9px] py-0">Featured</span>}
                          {p.discount_price && <span className="badge badge-accent text-[9px] py-0">-{discountPercent(p.price, p.discount_price)}%</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm capitalize text-[var(--color-text-secondary)] flex items-center gap-1.5">
                      {categories.find(c => c.slug === p.category)?.icon} {p.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-bold">LKR {(p.discount_price || p.price).toLocaleString()}</p>
                    {p.discount_price && (
                      <p className="text-[11px] text-[var(--color-text-muted)] line-through">LKR {p.price.toLocaleString()}</p>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-sm font-semibold ${p.stock < 10 ? 'text-[var(--color-warning)]' : ''}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`badge text-[11px] ${p.stock > 0 ? 'badge-success' : 'bg-red-500/15 text-red-400'}`}>
                      {p.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => openEdit(p)}
                        className="w-9 h-9 rounded-xl glass-light flex items-center justify-center hover:bg-blue-500/15 text-blue-400 transition-all opacity-60 group-hover:opacity-100"
                        title="Edit"
                      >
                        <FiEdit size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="w-9 h-9 rounded-xl glass-light flex items-center justify-center hover:bg-red-500/15 text-red-400 transition-all opacity-60 group-hover:opacity-100"
                        title="Delete"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <div className="text-4xl mb-3">📦</div>
                    <p className="text-[var(--color-text-muted)]">No products found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setShowForm(false)}>
          <div
            className="w-full max-w-xl bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl max-h-[90vh] overflow-hidden animate-fadeInUp"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
              <div>
                <h3 className="text-lg font-bold font-[var(--font-family-heading)]">
                  {editProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <p className="text-xs text-[var(--color-text-muted)]">
                  {editProduct ? 'Update product details' : 'Add a new product to your store'}
                </p>
              </div>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-lg glass-light flex items-center justify-center hover:bg-red-500/10 hover:text-red-400 transition-all">
                <FiX size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-130px)]">
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="text-sm font-medium text-[var(--color-text-secondary)] mb-1.5 block">
                    Product Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    value={formData.name}
                    onChange={e => setFormData(p => ({...p, name: e.target.value}))}
                    className="input-field"
                    placeholder="e.g., Luxury Gold Watch"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-medium text-[var(--color-text-secondary)] mb-1.5 block">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData(p => ({...p, description: e.target.value}))}
                    className="input-field min-h-[80px]"
                    placeholder="Describe the product..."
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="text-sm font-medium text-[var(--color-text-secondary)] mb-1.5 block">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {categories.map(c => (
                      <button
                        key={c.slug}
                        type="button"
                        onClick={() => setFormData(p => ({...p, category: c.slug}))}
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                          formData.category === c.slug
                            ? 'gradient-accent text-white shadow-lg shadow-[var(--color-accent)]/20'
                            : 'bg-[var(--color-surface-light)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)]/30'
                        }`}
                      >
                        <span>{c.icon}</span>
                        {c.name}
                        {formData.category === c.slug && <FiCheck size={14} />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-[var(--color-text-secondary)] mb-1.5 block">
                      Price (LKR) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={e => setFormData(p => ({...p, price: e.target.value}))}
                      className="input-field"
                      placeholder="15000"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-[var(--color-accent)] mb-1.5 block">
                      Sale / Discount Price (Triggers Sale!)
                    </label>
                    <input
                      type="number"
                      value={formData.discount_price}
                      onChange={e => setFormData(p => ({...p, discount_price: e.target.value}))}
                      className="input-field"
                      placeholder="12000 (optional)"
                    />
                    {formData.price && formData.discount_price && (
                      <p className="text-[11px] text-green-400 mt-1">
                        {discountPercent(Number(formData.price), Number(formData.discount_price))}% discount
                      </p>
                    )}
                  </div>
                </div>

                {/* Stock */}
                <div>
                  <label className="text-sm font-medium text-[var(--color-text-secondary)] mb-1.5 block">
                    Stock Quantity <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={e => setFormData(p => ({...p, stock: e.target.value}))}
                    className="input-field"
                    placeholder="25"
                    required
                  />
                </div>

                {/* Image Upload/Link */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-[var(--color-text-secondary)] block">
                    <FiImage className="inline mr-1" size={14} /> Product Image
                  </label>
                  
                  {/* Option 1: URL */}
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={e => setFormData(p => ({...p, image_url: e.target.value}))}
                    className="input-field w-full"
                    placeholder="Paste image link here (https://...)"
                  />
                  
                  {/* Option 2: Upload */}
                  <div className="flex items-center gap-4">
                    <div className="text-xs text-[var(--color-text-muted)] w-12 text-center">OR</div>
                    <label className="cursor-pointer glass-light px-4 py-2.5 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 transition-all flex items-center gap-2">
                      <span className="text-sm font-medium text-[var(--color-text-secondary)]">Upload File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {formData.image_url && typeof formData.image_url === 'string' && (
                    <div className="mt-4 w-32 h-32 rounded-xl overflow-hidden border border-[var(--color-border)] shadow-lg shadow-black/20 bg-black/20 flex items-center justify-center">
                      <img src={formData.image_url} alt="Preview" className="max-w-full max-h-full object-contain" onError={e => e.target.style.display='none'} />
                    </div>
                  )}
                </div>

                {/* Sizes & Colors */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-[var(--color-text-secondary)] mb-1.5 block">Sizes</label>
                    <input
                      value={formData.sizes}
                      onChange={e => setFormData(p => ({...p, sizes: e.target.value}))}
                      className="input-field"
                      placeholder="S, M, L, XL"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[var(--color-text-secondary)] mb-1.5 block">Colors</label>
                    <input
                      value={formData.colors}
                      onChange={e => setFormData(p => ({...p, colors: e.target.value}))}
                      className="input-field"
                      placeholder="Black, White, Red"
                    />
                  </div>
                </div>

                {/* Featured Toggle */}
                <label 
                  htmlFor="featured-toggle"
                  className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-[var(--color-surface-light)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 transition-all"
                >
                  <input
                    id="featured-toggle"
                    type="checkbox"
                    checked={formData.featured}
                    onChange={e => setFormData(p => ({...p, featured: e.target.checked}))}
                    className="hidden"
                  />
                  <div className={`w-10 h-6 rounded-full relative transition-all ${formData.featured ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-border)]'}`}>
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all ${formData.featured ? 'left-[18px]' : 'left-0.5'}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Featured Product</p>
                    <p className="text-[11px] text-[var(--color-text-muted)]">Show on homepage featured section</p>
                  </div>
                </label>
              </div>

              {/* Submit */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-[var(--color-border)]">
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline flex-1 py-3">
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1 py-3 shadow-lg shadow-[var(--color-accent)]/20">
                  {editProduct ? (
                    <><FiCheck size={18} /> Update Product</>
                  ) : (
                    <><FiPlus size={18} /> Add Product</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
