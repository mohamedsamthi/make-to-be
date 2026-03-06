import { useState } from 'react'
import { FiPlus, FiEdit, FiTrash2, FiX, FiCheck } from 'react-icons/fi'
import { useProducts } from '../../context/ProductContext'
import toast from 'react-hot-toast'

const bannerColors = [
  'linear-gradient(135deg, #e94560, #ff6b81)',
  'linear-gradient(135deg, #f5a623, #ffc857)',
  'linear-gradient(135deg, #6c5ce7, #a29bfe)',
  'linear-gradient(135deg, #2ecc71, #55efc4)',
  'linear-gradient(135deg, #0984e3, #74b9ff)',
]

export default function AdminPromotionsPage() {
  const { promotions, addPromotion, updatePromotion, deletePromotion } = useProducts()
  const [showForm, setShowForm] = useState(false)
  const [editPromo, setEditPromo] = useState(null)
  const [formData, setFormData] = useState({
    title: '', description: '', discount_percentage: '', active: true, banner_color: bannerColors[0]
  })

  const openAdd = () => {
    setEditPromo(null)
    setFormData({ title: '', description: '', discount_percentage: '', active: true, banner_color: bannerColors[0] })
    setShowForm(true)
  }

  const openEdit = (p) => {
    setEditPromo(p)
    setFormData({ title: p.title, description: p.description, discount_percentage: String(p.discount_percentage), active: p.active, banner_color: p.banner_color })
    setShowForm(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title) { toast.error('Enter title'); return }
    const data = { ...formData, discount_percentage: Number(formData.discount_percentage) || 0 }
    if (editPromo) {
      updatePromotion(editPromo.id, data)
      toast.success('Promotion updated!')
    } else {
      addPromotion(data)
      toast.success('Promotion added!')
    }
    setShowForm(false)
  }

  const handleDelete = (id) => {
    if (confirm('Delete this promotion?')) { deletePromotion(id); toast.success('Deleted!') }
  }

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-[var(--font-family-heading)]">Promotions</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">{promotions.length} promotions</p>
        </div>
        <button onClick={openAdd} className="btn-primary"><FiPlus size={18} /> Add Promotion</button>
      </div>

      <div className="space-y-4">
        {promotions.map(promo => (
          <div key={promo.id} className="rounded-2xl overflow-hidden border border-[var(--color-border)]">
            <div className="p-5 relative" style={{ background: promo.banner_color }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold mb-1">{promo.title}</h3>
                    <p className="text-sm opacity-90">{promo.description}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="px-3 py-1 rounded-lg bg-white/20 text-sm font-bold">{promo.discount_percentage}% OFF</span>
                      <button
                        onClick={() => updatePromotion(promo.id, { active: !promo.active })}
                        className={`px-3 py-1 rounded-lg text-sm font-bold ${promo.active ? 'bg-green-500/30 text-green-100' : 'bg-red-500/30 text-red-100'}`}
                      >
                        {promo.active ? '● Active' : '○ Inactive'}
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(promo)} className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all">
                      <FiEdit size={14} />
                    </button>
                    <button onClick={() => handleDelete(promo.id)} className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center hover:bg-red-500/40 transition-all">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setShowForm(false)}>
          <div className="w-full max-w-md bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl animate-fadeInUp" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
              <h3 className="text-lg font-bold font-[var(--font-family-heading)]">{editPromo ? 'Edit Promotion' : 'Add Promotion'}</h3>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-lg glass-light flex items-center justify-center"><FiX size={16} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-[var(--color-text-secondary)] mb-1.5 block">Title</label>
                <input value={formData.title} onChange={e => setFormData(p => ({...p, title: e.target.value}))} className="input-field" placeholder="🔥 Sale Title" required />
              </div>
              <div>
                <label className="text-sm font-medium text-[var(--color-text-secondary)] mb-1.5 block">Description</label>
                <input value={formData.description} onChange={e => setFormData(p => ({...p, description: e.target.value}))} className="input-field" placeholder="Sale details..." />
              </div>
              <div>
                <label className="text-sm font-medium text-[var(--color-text-secondary)] mb-1.5 block">Discount %</label>
                <input type="number" value={formData.discount_percentage} onChange={e => setFormData(p => ({...p, discount_percentage: e.target.value}))} className="input-field" placeholder="30" />
              </div>
              <div>
                <label className="text-sm font-medium text-[var(--color-text-secondary)] mb-1.5 block">Banner Color</label>
                <div className="flex gap-2 flex-wrap">
                  {bannerColors.map(c => (
                    <button key={c} type="button" onClick={() => setFormData(p => ({...p, banner_color: c}))}
                      className={`w-10 h-10 rounded-xl transition-all ${formData.banner_color === c ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'}`}
                      style={{ background: c }} />
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-[var(--color-border)]">
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1"><FiCheck size={18} /> {editPromo ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
