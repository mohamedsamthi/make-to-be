import { useState } from 'react'
import { FiUsers, FiMail, FiPhone, FiCheckCircle, FiSlash, FiSearch, FiUserCheck, FiUserX } from 'react-icons/fi'
import { useProducts } from '../../context/ProductContext'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'

export default function AdminCustomersPage() {
  const { profiles, orders, updateProfile } = useProducts()
  const [search, setSearch] = useState('')

  const handleToggleStatus = async (customer) => {
    const isBlocking = customer.status !== 'inactive'
    const newStatus = isBlocking ? 'inactive' : 'active'
    
    // Find the real profile object if profileId is missing but match exists
    let targetProfileId = customer.profileId
    if (!targetProfileId) {
      const match = profiles.find(p => p.email === customer.email || p.full_name === customer.name)
      if (match) targetProfileId = match.id
    }

    if (!targetProfileId) {
      toast.error('Only registered users can be blocked. Guests have no account.')
      return
    }

    Swal.fire({
      title: isBlocking ? 'Block This User?' : 'Activate This User?',
      text: isBlocking 
        ? `User ${customer.name} will be logged out and unable to access their account.` 
        : `User ${customer.name} will regain access to their account.`,
      icon: isBlocking ? 'warning' : 'question',
      showCancelButton: true,
      confirmButtonColor: isBlocking ? '#ef4444' : '#10b981',
      cancelButtonColor: '#374151',
      confirmButtonText: isBlocking ? 'Yes, Block User' : 'Yes, Activate User',
      background: '#151230',
      color: '#fff',
      customClass: {
        popup: 'rounded-3xl border border-white/10 shadow-2xl'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await updateProfile(targetProfileId, { status: newStatus })
          toast.success(`User is now ${newStatus}`)
        } catch (err) {
          toast.error('Failed to update status')
        }
      }
    })
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
          <p className="text-3xl font-black text-[var(--color-text-primary)]">{customers.length}</p>
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
          <p className="text-sm text-[var(--color-text-muted)]">When customers place orders or sign up, they will appear here.</p>
        </div>
      ) : (
        <div className="rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-light)]">
                  <th className="text-left text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest px-6 py-4">Customer</th>
                  <th className="text-left text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest px-6 py-4">Contact</th>
                  <th className="text-right text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest px-6 py-4">Orders</th>
                  <th className="text-right text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest px-6 py-4">Total Spent</th>
                  <th className="text-center text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest px-6 py-4">Status</th>
                  <th className="text-right text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {customers.map(c => (
                  <tr key={c.id} className="group transition-colors hover:bg-[var(--color-surface-light)]">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[var(--color-accent)] to-[var(--color-accent-dark)] flex items-center justify-center font-black text-white shadow-lg overflow-hidden shrink-0">
                          {c.avatar_url ? (
                            <img src={c.avatar_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            (c.name?.[0] || c.email?.[0] || 'U').toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-[var(--color-text-primary)] transition-colors group-hover:text-[var(--color-accent)]">{c.name}</p>
                          <p className="text-[10px] font-mono text-[var(--color-text-muted)]">
                            {c.joined ? `Joined ${new Date(c.joined).toLocaleDateString()}` : 'Guest'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {c.email && <p className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]"><FiMail className="text-[var(--color-accent)]" /> {c.email}</p>}
                      {c.phone && <p className="mt-1 flex items-center gap-2 text-sm text-[var(--color-text-secondary)]"><FiPhone className="text-[var(--color-accent)]" /> {c.phone}</p>}
                      {!c.email && !c.phone && <p className="text-sm italic text-[var(--color-text-muted)]">No contact info</p>}
                    </td>
                    <td className="px-6 py-5 text-right text-lg font-bold text-[var(--color-text-primary)]">{c.orderCount}</td>
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
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-[11px] font-bold uppercase tracking-wider ${
                            c.status === 'inactive' 
                              ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white shadow-lg shadow-emerald-500/10' 
                              : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white shadow-lg shadow-rose-500/10'
                          }`}
                        >
                          {c.status === 'inactive' ? (
                            <><FiUserCheck size={14} /> Activate Account</>
                          ) : (
                            <><FiUserX size={14} /> Inactive / Block</>
                          )}
                        </button>
                      ) : (
                        <span className="text-[10px] italic text-[var(--color-text-muted)] opacity-70">Guest Checkout</span>
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
