import { useState, useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { MdDashboard, MdInventory, MdLocalOffer, MdRateReview } from 'react-icons/md'
import { FiPackage, FiUsers, FiMenu, FiX, FiArrowLeft, FiLogOut, FiShield, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const sidebarLinks = [
  { name: 'Dashboard', path: '/admin', icon: <MdDashboard size={20} /> },
  { name: 'Products', path: '/admin/products', icon: <MdInventory size={20} /> },
  { name: 'Orders', path: '/admin/orders', icon: <FiPackage size={20} /> },
  { name: 'Customers', path: '/admin/customers', icon: <FiUsers size={20} /> },
  { name: 'Reviews', path: '/admin/reviews', icon: <MdRateReview size={20} /> },
  { name: 'Promotions', path: '/admin/promotions', icon: <MdLocalOffer size={20} /> }
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebar, setMobileSidebar] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const adminAuth = JSON.parse(localStorage.getItem('adminAuth') || '{}')
  const isLoggedIn = adminAuth.loggedIn === true

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/admin-login')
    }
  }, [isLoggedIn, navigate])

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileSidebar(false)
  }, [location])

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    navigate('/admin-login')
  }

  if (!isLoggedIn) return null

  const sidebarWidth = sidebarOpen ? 'w-64' : 'w-[72px]'
  const contentMargin = sidebarOpen ? 'lg:ml-64' : 'lg:ml-[72px]'

  return (
    <div className="min-h-screen flex bg-[var(--color-surface)]">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex fixed inset-y-0 left-0 z-50 ${sidebarWidth} bg-[var(--color-primary)] border-r border-[var(--color-border)] transition-all duration-300 flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between min-h-[65px]">
          {sidebarOpen ? (
            <Link to="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center shrink-0">
                <FiShield size={18} />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold font-[var(--font-family-heading)] whitespace-nowrap">Admin Panel</p>
                <p className="text-[10px] text-[var(--color-text-muted)] whitespace-nowrap">Make To Be</p>
              </div>
            </Link>
          ) : (
            <Link to="/admin" className="mx-auto">
              <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
                <FiShield size={18} />
              </div>
            </Link>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          {sidebarOpen && (
            <p className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-widest mb-3 px-3">Menu</p>
          )}
          <div className="space-y-1">
            {sidebarLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                title={!sidebarOpen ? link.name : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  location.pathname === link.path
                    ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                    : 'text-[var(--color-text-secondary)] hover:text-white hover:bg-white/5'
                } ${!sidebarOpen ? 'justify-center' : ''}`}
              >
                <span className="shrink-0">{link.icon}</span>
                {sidebarOpen && <span className="truncate">{link.name}</span>}
                {sidebarOpen && location.pathname === link.path && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] shrink-0" />
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-[var(--color-border)] space-y-1">
          <Link
            to="/"
            title={!sidebarOpen ? 'Back to Shop' : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[var(--color-text-secondary)] hover:text-white hover:bg-white/5 transition-all ${!sidebarOpen ? 'justify-center' : ''}`}
          >
            <FiArrowLeft size={18} className="shrink-0" />
            {sidebarOpen && <span>Back to Shop</span>}
          </Link>
          <button
            onClick={handleLogout}
            title={!sidebarOpen ? 'Sign Out' : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all w-full ${!sidebarOpen ? 'justify-center' : ''}`}
          >
            <FiLogOut size={18} className="shrink-0" />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[var(--color-surface-card)] border border-[var(--color-border)] flex items-center justify-center hover:bg-[var(--color-accent)]/20 hover:border-[var(--color-accent)]/30 transition-all z-10 text-[var(--color-text-muted)] hover:text-white"
        >
          {sidebarOpen ? <FiChevronLeft size={12} /> : <FiChevronRight size={12} />}
        </button>
      </aside>

      {/* Mobile Sidebar */}
      <aside className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-[var(--color-primary)] border-r border-[var(--color-border)] transition-transform duration-300 flex flex-col ${
        mobileSidebar ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center"><FiShield size={18} /></div>
            <div>
              <p className="text-sm font-bold font-[var(--font-family-heading)]">Admin Panel</p>
              <p className="text-[10px] text-[var(--color-text-muted)]">Make To Be</p>
            </div>
          </Link>
          <button onClick={() => setMobileSidebar(false)} className="w-8 h-8 rounded-lg glass-light flex items-center justify-center">
            <FiX size={18} />
          </button>
        </div>
        <nav className="flex-1 p-3 overflow-y-auto">
          <p className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-widest mb-3 px-3">Menu</p>
          <div className="space-y-1">
            {sidebarLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  location.pathname === link.path
                    ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                    : 'text-[var(--color-text-secondary)] hover:text-white hover:bg-white/5'
                }`}
              >
                {link.icon} {link.name}
              </Link>
            ))}
          </div>
        </nav>
        <div className="p-3 border-t border-[var(--color-border)] space-y-1">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[var(--color-text-secondary)] hover:text-white hover:bg-white/5 transition-all">
            <FiArrowLeft size={18} /> Back to Shop
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all w-full">
            <FiLogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileSidebar && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setMobileSidebar(false)} />
      )}

      {/* Main Content */}
      <main className={`flex-1 ${contentMargin} min-w-0 transition-all duration-300`}>
        {/* Top Bar */}
        <div className="sticky top-0 z-30 bg-[var(--color-surface)]/95 backdrop-blur-xl border-b border-[var(--color-border)]">
          <div className="flex items-center justify-between px-5 py-3.5">
            <div className="flex items-center gap-4">
              <button onClick={() => setMobileSidebar(true)} className="lg:hidden w-10 h-10 rounded-xl glass-light flex items-center justify-center">
                <FiMenu size={18} />
              </button>
              <div>
                <h2 className="text-lg font-bold font-[var(--font-family-heading)]">
                  {sidebarLinks.find(l => l.path === location.pathname)?.name || 'Admin'}
                </h2>
                <p className="text-[11px] text-[var(--color-text-muted)]">Make To Be Admin Control</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-light">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-xs font-medium text-[var(--color-text-secondary)]">{adminAuth.username}</span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-5 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
