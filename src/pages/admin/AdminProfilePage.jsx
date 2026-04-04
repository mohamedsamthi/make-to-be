import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FiUser, FiMail, FiPhone, FiShield, FiEdit3, FiCamera } from 'react-icons/fi'

export default function AdminProfilePage() {
  const [adminAuth, setAdminAuth] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('adminAuth') || '{}')
    } catch {
      return {}
    }
  })
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    username: adminAuth.username || '',
    workEmail: adminAuth.workEmail || 'admin@maketobe.com',
    phone: adminAuth.phone || '+94 75 902 8379',
  })

  useEffect(() => {
    if (isEditing) return
    setFormData({
      username: adminAuth.username || '',
      workEmail: adminAuth.workEmail || 'admin@maketobe.com',
      phone: adminAuth.phone || '+94 75 902 8379',
    })
  }, [adminAuth, isEditing])

  const handleToggleEdit = () => {
    if (isEditing) {
      setIsEditing(false)
      return
    }
    setIsEditing(true)
  }

  const handleSave = (e) => {
    e?.preventDefault?.()
    const nextUsername = (formData.username || '').trim()
    if (!nextUsername) {
      toast.error('Username is required')
      return
    }

    const updated = {
      ...adminAuth,
      username: nextUsername,
      workEmail: formData.workEmail,
      phone: formData.phone,
    }

    setAdminAuth(updated)
    localStorage.setItem('adminAuth', JSON.stringify(updated))
    toast.success('Profile updated')
    setIsEditing(false)
  }

  return (
    <div className="max-w-4xl animate-fadeInUp">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-[var(--color-surface-card)] rounded-3xl border border-[var(--color-border)] p-8 text-center ring-1 ring-white/5">
                <div className="relative inline-block mb-6">
                <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-[var(--color-accent)] to-[var(--color-accent-dark)] flex items-center justify-center text-white font-black text-4xl shadow-2xl shadow-[0_0_30px_rgba(200,230,0,0.25)] overflow-hidden">
                   {adminAuth.username?.[0]?.toUpperCase() || 'A'}
                </div>
                <button className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-[var(--color-surface-light)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-accent)] hover:text-white hover:bg-[var(--color-accent)] transition-all shadow-xl">
                   <FiCamera size={18} />
                </button>
             </div>
             <h2 className="mb-2 text-2xl font-black tracking-tight text-[var(--color-text-primary)]">{adminAuth.username || 'Admin'}</h2>
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 text-[var(--color-accent)] text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                <FiShield size={12} /> System Admin
             </div>
             
             <div className="pt-6 border-t border-[var(--color-border)]">
               <div className="flex items-center justify-between text-left mb-4">
                  <span className="text-xs text-[var(--color-text-muted)] font-bold uppercase tracking-widest">Active Since</span>
                  <span className="text-sm font-bold text-[var(--color-text-primary)]">Jan 2024</span>
               </div>
               <div className="flex items-center justify-between text-left">
                  <span className="text-xs text-[var(--color-text-muted)] font-bold uppercase tracking-widest">Access Level</span>
                  <span className="text-sm font-bold text-[var(--color-accent)]">Full Access</span>
               </div>
             </div>
          </div>
        </div>

        {/* Info Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[var(--color-surface-card)] rounded-3xl border border-[var(--color-border)] overflow-hidden shadow-2xl shadow-black/20">
             <div className="px-8 py-6 border-b border-[var(--color-border)] flex items-center justify-between bg-white/[0.02]">
                <h3 className="font-black text-lg tracking-tight">Admin Information</h3>
                <button
                  type="button"
                  onClick={handleToggleEdit}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--color-accent)] hover:text-white transition-all group"
                >
                  <FiEdit3 className="group-hover:rotate-12 transition-transform" /> {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
             </div>
             <div className="p-8 space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] ml-1">Username</label>
                      <div className="relative group">
                        <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-accent)] transition-colors" />
                        <input
                          type="text"
                          value={formData.username}
                          readOnly={!isEditing}
                          onChange={(ev) => setFormData((p) => ({ ...p, username: ev.target.value }))}
                          className="w-full h-12 bg-black/20 border border-[var(--color-border)] rounded-xl pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-[var(--color-accent)]/50 transition-all text-white read-only:opacity-60"
                          aria-label="Admin username"
                          autoComplete="username"
                        />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] ml-1">Work Email</label>
                      <div className="relative group">
                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-accent)] transition-colors" />
                        <input
                          type="email"
                          value={formData.workEmail}
                          readOnly={!isEditing}
                          onChange={(ev) => setFormData((p) => ({ ...p, workEmail: ev.target.value }))}
                          className="w-full h-12 bg-black/20 border border-[var(--color-border)] rounded-xl pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-[var(--color-accent)]/50 transition-all text-white read-only:opacity-60"
                          aria-label="Work email"
                          autoComplete="email"
                        />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] ml-1">Contact Phone</label>
                      <div className="relative group">
                        <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-accent)] transition-colors" />
                        <input
                          type="text"
                          value={formData.phone}
                          readOnly={!isEditing}
                          onChange={(ev) => setFormData((p) => ({ ...p, phone: ev.target.value }))}
                          className="w-full h-12 bg-black/20 border border-[var(--color-border)] rounded-xl pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-[var(--color-accent)]/50 transition-all text-white read-only:opacity-60"
                          aria-label="Contact phone"
                          autoComplete="tel"
                        />
                      </div>
                   </div>
                </div>

                {isEditing && (
                  <div className="pt-6">
                    <button
                      type="button"
                      onClick={handleSave}
                      className="btn-primary h-12 min-h-[44px] px-10 w-full sm:w-auto sm:px-12"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
             </div>
          </div>

          <div className="bg-[var(--color-surface-card)] rounded-3xl border border-[var(--color-border)] p-8 bg-gradient-to-br from-[var(--color-accent)]/5 to-transparent border-l-4 border-l-[var(--color-accent)]">
             <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent)] shrink-0 shadow-inner">
                   <FiShield size={28} />
                </div>
                <div>
                  <h4 className="text-lg font-black text-white mb-1">Security Standards</h4>
                  <p className="text-sm text-[var(--color-text-muted)] font-medium leading-relaxed">Your account has maximum security privileges. Ensure you use strong passwords and avoid sharing your admin credentials.</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
