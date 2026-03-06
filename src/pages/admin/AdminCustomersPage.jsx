import { FiUsers, FiMail, FiPhone } from 'react-icons/fi'

export default function AdminCustomersPage() {
  const customers = [
    { id: '1', name: 'Amara Sivakumar', email: 'amara@example.com', phone: '+94771234567', orders: 3, total_spent: 45000, joined: '2026-01-10', status: 'active' },
    { id: '2', name: 'Kamal Rajapakse', email: 'kamal@example.com', phone: '+94779876543', orders: 2, total_spent: 31000, joined: '2026-01-20', status: 'active' },
    { id: '3', name: 'Fatima Noorudeen', email: 'fatima@example.com', phone: '+94771112233', orders: 1, total_spent: 19998, joined: '2026-02-15', status: 'active' },
    { id: '4', name: 'Rajan Perera', email: 'rajan@example.com', phone: '+94773334455', orders: 5, total_spent: 72000, joined: '2025-12-01', status: 'active' },
    { id: '5', name: 'Nisha Kumar', email: 'nisha@example.com', phone: '+94775556677', orders: 0, total_spent: 0, joined: '2026-03-01', status: 'new' }
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-[var(--font-family-heading)]">Customers</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">{customers.length} registered customers</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400"><FiUsers /></div>
            <div>
              <p className="text-2xl font-bold">{customers.length}</p>
              <p className="text-xs text-[var(--color-text-muted)]">Total Customers</p>
            </div>
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400"><FiUsers /></div>
            <div>
              <p className="text-2xl font-bold">{customers.filter(c => c.status === 'active').length}</p>
              <p className="text-xs text-[var(--color-text-muted)]">Active Customers</p>
            </div>
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-gold)]/10 flex items-center justify-center text-[var(--color-gold)]"><FiUsers /></div>
            <div>
              <p className="text-2xl font-bold">{customers.filter(c => c.status === 'new').length}</p>
              <p className="text-xs text-[var(--color-text-muted)]">New This Month</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase px-5 py-3">Customer</th>
                <th className="text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase px-5 py-3">Contact</th>
                <th className="text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase px-5 py-3">Orders</th>
                <th className="text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase px-5 py-3">Total Spent</th>
                <th className="text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase px-5 py-3">Joined</th>
                <th className="text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.id} className="border-b border-[var(--color-border)] hover:bg-white/2">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full gradient-accent flex items-center justify-center font-bold text-sm shrink-0">
                        {c.name[0]}
                      </div>
                      <p className="text-sm font-medium">{c.name}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-[var(--color-text-secondary)] flex items-center gap-1"><FiMail size={12} />{c.email}</p>
                    <p className="text-sm text-[var(--color-text-secondary)] flex items-center gap-1"><FiPhone size={12} />{c.phone}</p>
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold">{c.orders}</td>
                  <td className="px-5 py-4 text-sm font-semibold">LKR {c.total_spent.toLocaleString()}</td>
                  <td className="px-5 py-4 text-sm text-[var(--color-text-muted)]">{c.joined}</td>
                  <td className="px-5 py-4">
                    <span className={`badge ${c.status === 'active' ? 'badge-success' : 'badge-gold'} capitalize`}>{c.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
