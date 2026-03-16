import { useState } from 'react'
import { FiUsers, FiMail, FiPhone, FiCheckCircle, FiSlash, FiSearch } from 'react-icons/fi'
import { useProducts } from '../../context/ProductContext'
import toast from 'react-hot-toast'

export default function AdminCustomersPage() {
  const { profiles, orders, updateProfile } = useProducts()
  const [search, setSearch] = useState('')

  const handleToggleStatus = async (customer) => {
    const newStatus = customer.status === 'inactive' ? 'active' : 'inactive'
    // Only update via profiles if there's a profile ID (UUID)
    if (customer.profileId) {
      try {
        await updateProfile(customer.profileId, { status: newStatus })
        toast.success(`User set to ${newStatus}`)
      } catch (err) {
        toast.error('Failed to update status')
      }
    } else {
      toast.error('This user has no profile account to manage')
    }
  }

  // Build customers from BOTH profiles and orders
  const customersMap = {}

  // First, add all customers from orders (this always works)
  orders.forEach(order => {
    const key = order.customer_email || order.customer_phone || `guest_${order.id}`
    
    if (!customersMap[key]) {
      customersMap[key] = {
        id: key,
        profileId: null,
        name: order.customer_name || 'Guest User',
        email: order.customer_email || '',
        phone: order.customer_phone || '',
        orderCount: 0,
        totalSpent: 0,
        joined: order.created_at,
        status: 'active',
        avatar_url: null
      }
    }
    customersMap[key].orderCount += 1
    customersMap[key].totalSpent += Number(order.total || 0)
  })

  // Then, merge/override with real profiles data (if available)
  if (profiles && profiles.length > 0) {
    profiles.forEach(p => {
      const key = p.email || p.id
      if (customersMap[key]) {
        // Merge profile data into existing order-based customer
        customersMap[key].profileId = p.id
        customersMap[key].name = p.full_name || customersMap[key].name
        customersMap[key].avatar_url = p.avatar_url || null
        customersMap[key].status = p.status || 'active'
        customersMap[key].phone = p.phone || customersMap[key].phone
        customersMap[key].joined = p.created_at || customersMap[key].joined
      } else {
        // Profile exists but no orders yet
        customersMap[key] = {
          id: key,
          profileId: p.id,
          name: p.full_name || 'User',
          email: p.email || '',
          phone: p.phone || '',
          orderCount: 0,
          totalSpent: 0,
          joined: p.created_at,
          status: p.status || 'active',
          avatar_url: p.avatar_url || null
        }
      }
    })
  }

  const customers = Object.values(customersMap)
    .filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(b.joined) - new Date(a.joined))

  return (
    <div>
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold font-[var(--font-family-heading)]">User Management</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">{customers.length} customers detected</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)]">
          <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-widest font-bold mb-1">Total Users</p>
          <p className="text-3xl font-black">{customers.length}</p>
        </div>
        <div className="p-5 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)]">
          <p className="text-xs text-emerald-400 uppercase tracking-widest font-bold mb-1">Active Accounts</p>
          <p className="text-3xl font-black text-emerald-400">{customers.filter(c => c.status !== 'inactive').length}</p>
        </div>
        <div className="p-5 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)]">
          <p className="text-xs text-rose-400 uppercase tracking-widest font-bold mb-1">Blocked / Inactive</p>
          <p className="text-3xl font-black text-rose-400">{customers.filter(c => c.status === 'inactive').length}</p>
        </div>
      </div>

      <div className="relative mb-6 max-w-sm">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={16} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="input-field pl-11" />
      </div>

      {customers.length === 0 ? (
        <div className="text-center py-20 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)]">
          <p className="text-5xl mb-4">👤</p>
          <h3 className="text-xl font-bold mb-2">No Customers Yet</h3>
          <p className="text-sm text-gray-500">When customers place orders or sign up, they will appear here.</p>
        </div>
      ) : (
        <div className="rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-black/20 border-b border-[var(--color-border)]">
                  <th className="text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest px-6 py-4">Customer</th>
                  <th className="text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest px-6 py-4">Contact</th>
                  <th className="text-right text-[10px] font-bold text-gray-500 uppercase tracking-widest px-6 py-4">Orders</th>
                  <th className="text-right text-[10px] font-bold text-gray-500 uppercase tracking-widest px-6 py-4">Total Spent</th>
                  <th className="text-center text-[10px] font-bold text-gray-500 uppercase tracking-widest px-6 py-4">Status</th>
                  <th className="text-right text-[10px] font-bold text-gray-500 uppercase tracking-widest px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {customers.map(c => (
                  <tr key={c.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center font-black text-white shadow-lg overflow-hidden shrink-0">
                          {c.avatar_url ? (
                            <img src={c.avatar_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            (c.name?.[0] || c.email?.[0] || 'U').toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-white group-hover:text-violet-400 transition-colors">{c.name}</p>
                          <p className="text-[10px] text-gray-500 font-mono">
                            {c.joined ? `Joined ${new Date(c.joined).toLocaleDateString()}` : 'Guest'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {c.email && <p className="text-sm text-gray-300 flex items-center gap-2"><FiMail className="text-violet-500" /> {c.email}</p>}
                      {c.phone && <p className="text-sm text-gray-300 flex items-center gap-2 mt-1"><FiPhone className="text-violet-500" /> {c.phone}</p>}
                      {!c.email && !c.phone && <p className="text-sm text-gray-500 italic">No contact info</p>}
                    </td>
                    <td className="px-6 py-5 text-right font-bold text-lg">{c.orderCount}</td>
                    <td className="px-6 py-5 text-right font-black text-amber-400">LKR {c.totalSpent.toLocaleString()}</td>
                    <td className="px-6 py-5 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        c.status === 'inactive' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {c.status === 'inactive' ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      {c.profileId ? (
                        <button
                          onClick={() => handleToggleStatus(c)}
                          className={`p-2 rounded-xl transition-all ${
                            c.status === 'inactive' 
                              ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white' 
                              : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white'
                          }`}
                          title={c.status === 'inactive' ? 'Activate User' : 'Block User'}
                        >
                          {c.status === 'inactive' ? <FiCheckCircle size={20} /> : <FiSlash size={20} />}
                        </button>
                      ) : (
                        <span className="text-[10px] text-gray-500 italic">Guest</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
