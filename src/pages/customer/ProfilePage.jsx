import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useProducts } from '../../context/ProductContext'
import { Link, Navigate } from 'react-router-dom'
import { FiUser, FiMail, FiPhone, FiLogOut, FiPackage, FiSettings, FiImage, FiLock, FiCheck } from 'react-icons/fi'
import { MdDashboard } from 'react-icons/md'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, profile, isAdmin, signOut, loading, updateProfile } = useAuth()
  const { orders } = useProducts()
  const [activeTab, setActiveTab] = useState('orders')
  const [isUpdating, setIsUpdating] = useState(false)
  const [formData, setFormData] = useState({
    fullName: profile?.full_name || '',
    phone: profile?.phone || '',
    avatarUrl: profile?.avatar_url || '',
    password: ''
  })

  // Filter orders where customer_email matches logged in user
  const userOrders = orders.filter(o => o.customer_email === user?.email)

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // Limit size to ~5MB
        toast.error('Image is too large. Please select a smaller one.')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(p => ({...p, avatarUrl: reader.result}))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setIsUpdating(true)
    const { error } = await updateProfile(formData)
    if (error) {
       toast.error(error.message || 'Failed to update profile')
    } else {
       toast.success('Profile updated successfully! ✅')
       if (formData.password) setFormData(prev => ({...prev, password: ''}))
    }
    setIsUpdating(false)
  }

  if (!loading && !user) return <Navigate to="/login" />

  return (
    <div className="pt-24 sm:pt-28 min-h-screen">
      <div className="bg-[var(--color-primary)] py-10">
        <div className="container-custom">
          <h1 className="text-3xl font-bold font-[var(--font-family-heading)]">My Profile</h1>
        </div>
      </div>

      <div className="container-custom py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div>
            <div className="glass rounded-2xl p-6 text-center mb-6">
              <div className="w-24 h-24 rounded-full gradient-accent flex items-center justify-center text-3xl font-bold mx-auto mb-4 overflow-hidden border-2 border-[var(--color-accent)]">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  profile?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'
                )}
              </div>
              <h2 className="text-xl font-bold">{profile?.full_name || 'User'}</h2>
              <p className="text-sm text-[var(--color-text-secondary)]">{user?.email}</p>
              {isAdmin && <span className="badge badge-gold mt-2">Admin</span>}
            </div>

            <div className="space-y-2 mb-6">
              <button onClick={() => setActiveTab('orders')} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full ${activeTab === 'orders' ? 'bg-[var(--color-accent)]/20 text-[var(--color-accent)]' : 'glass-light hover:bg-white/5'}`}>
                <FiPackage size={18} />
                <span className="text-sm font-medium">My Orders</span>
              </button>
              <button onClick={() => setActiveTab('settings')} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full ${activeTab === 'settings' ? 'bg-[var(--color-accent)]/20 text-[var(--color-accent)]' : 'glass-light hover:bg-white/5'}`}>
                <FiSettings size={18} />
                <span className="text-sm font-medium">Account Settings</span>
              </button>
            </div>

            <div className="space-y-2">
              {isAdmin && (
                <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl glass-light hover:bg-white/5 transition-all">
                  <MdDashboard size={18} className="text-[var(--color-accent)]" />
                  <span className="text-sm">Admin Dashboard</span>
                </Link>
              )}
              <button onClick={signOut} className="flex items-center gap-3 px-4 py-3 rounded-xl glass-light hover:bg-red-500/10 transition-all text-red-400 w-full">
                <FiLogOut size={18} />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          </div>

          {/* Order History */}
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            
            {activeTab === 'orders' ? (
              <>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <FiPackage className="text-[var(--color-accent)]" /> My Orders ({userOrders.length})
                </h3>

                <div className="space-y-4">
                  {userOrders.length > 0 ? userOrders.map(order => (
                    <div key={order.id} className="p-5 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-sm">Order #{order.id}</p>
                          <p className="text-xs text-[var(--color-text-muted)]">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className={`badge text-[10px] ${
                            order.status === 'delivered' ? 'badge-success' :
                            order.status === 'shipped' ? 'badge-accent' :
                            order.status === 'cancelled' ? 'bg-red-500/20 text-red-500' :
                            'badge-gold'
                          } capitalize`}>
                            {order.status}
                          </span>
                          <span className={`badge text-[9px] ${order.payment_status === 'paid' ? 'badge-success' : 'badge-gold'} capitalize`}>
                            Payment: {order.payment_status}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1 mb-3 bg-black/10 p-3 rounded-xl border border-white/5">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between items-center text-sm">
                            <span className="text-[var(--color-text-secondary)]">
                              <span className="text-[var(--color-accent)] font-medium">{item.quantity}x</span> {item.product_name} 
                              {item.size && <span className="text-xs text-[var(--color-text-muted)] ml-1">({item.size})</span>}
                            </span>
                            <span className="font-medium">LKR {(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-[var(--color-border)] pt-3 flex justify-between items-center">
                         <span className="text-xs text-[var(--color-text-muted)] hover:text-white cursor-pointer transition-colors">Track Order →</span>
                        <p className="text-sm font-semibold">
                          Total: <span className="text-[var(--color-accent)] text-base">LKR {Number(order.total).toLocaleString()}</span>
                        </p>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-16 glass-light rounded-2xl border border-white/5">
                      <div className="text-5xl mb-4 opacity-50">📦</div>
                      <p className="text-[var(--color-text-secondary)] mb-1">No orders yet</p>
                      <p className="text-sm text-[var(--color-text-muted)]">When you place an order, it will appear here.</p>
                      <Link to="/products" className="btn-primary mt-6 inline-flex">Start Shopping</Link>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <FiSettings className="text-[var(--color-accent)]" /> Account Settings
                </h3>

                <form onSubmit={handleUpdate} className="glass rounded-2xl p-6 sm:p-8 space-y-5 border border-white/5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <div>
                      <label className="text-sm font-medium text-[var(--color-text-secondary)] mb-2 block">Full Name</label>
                      <div className="relative">
                        <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                        <input
                          value={formData.fullName}
                          onChange={e => setFormData(p => ({...p, fullName: e.target.value}))}
                          className="input-field pl-11 py-3"
                          placeholder="Update your name"
                        />
                      </div>
                    </div>

                    {/* Email (Disabled) */}
                    <div>
                      <label className="text-sm font-medium text-[var(--color-text-secondary)] mb-2 block">Email Address</label>
                      <div className="relative">
                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                        <input
                          value={user?.email || ''}
                          className="input-field pl-11 py-3 opacity-50 cursor-not-allowed bg-black/20"
                          disabled
                          title="Email cannot be changed"
                        />
                      </div>
                      <p className="text-[10px] text-[var(--color-text-muted)] mt-1 ml-1">Email address cannot be changed</p>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="text-sm font-medium text-[var(--color-text-secondary)] mb-2 block">Phone Number</label>
                      <div className="relative">
                        <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                        <input
                          value={formData.phone}
                          onChange={e => setFormData(p => ({...p, phone: e.target.value}))}
                          className="input-field pl-11 py-3"
                          placeholder="Optional"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="text-sm font-medium text-[var(--color-text-secondary)] mb-2 block">New Password</label>
                      <div className="relative">
                        <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                        <input
                          type="password"
                          value={formData.password}
                          onChange={e => setFormData(p => ({...p, password: e.target.value}))}
                          className="input-field pl-11 py-3 focus:border-[var(--color-warning)]"
                          placeholder="Leave blank to keep current"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Profile Image Upload */}
                  <div>
                    <label className="text-sm font-medium text-[var(--color-text-secondary)] mb-2 block">Profile Photo</label>
                    <div className="flex items-center gap-4">
                      <label className="cursor-pointer glass-light px-4 py-2.5 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 transition-all flex items-center gap-2">
                        <FiImage className="text-[var(--color-text-muted)]" />
                        <span className="text-sm font-medium text-[var(--color-text-secondary)]">Choose Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[11px] text-[var(--color-text-muted)]">Upload from your device</span>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[var(--color-border)] flex justify-end">
                    <button type="submit" disabled={isUpdating} className="btn-primary py-3 px-8 shadow-lg shadow-[var(--color-accent)]/20 disabled:opacity-50">
                      {isUpdating ? 'Saving...' : <><FiCheck /> Save Changes</>}
                    </button>
                  </div>
                </form>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
