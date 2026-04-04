import { useState, useEffect, Suspense } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import RouteFallback from '../../components/common/RouteFallback'
import { MdDashboard, MdInventory, MdLocalOffer, MdRateReview } from 'react-icons/md'
import { FiPackage, FiUsers, FiMenu, FiX, FiArrowLeft, FiLogOut, FiShield, FiChevronLeft, FiChevronRight, FiDollarSign, FiMessageSquare, FiVideo, FiUser, FiSettings, FiSun, FiMoon } from 'react-icons/fi'
import { useProducts } from '../../context/ProductContext'

import { useTheme } from '../../context/ThemeContext'

const sidebarLinks = [
  { name: 'Dashboard', path: '/admin', icon: <MdDashboard size={20} /> },
  { name: 'Products', path: '/admin/products', icon: <MdInventory size={20} /> },
  { name: 'Orders', path: '/admin/orders', icon: <FiPackage size={20} /> },
  { name: 'Customers', path: '/admin/customers', icon: <FiUsers size={20} /> },
  { name: 'Reviews', path: '/admin/reviews', icon: <MdRateReview size={20} /> },
  { name: 'Sales / Track', path: '/admin/sales', icon: <FiDollarSign size={20} /> },
  { name: 'Promotions', path: '/admin/promotions', icon: <MdLocalOffer size={20} /> },
  { name: 'Promo Video', path: '/admin/promo-video', icon: <FiVideo size={20} /> },
  { name: 'Messages', path: '/admin/messages', icon: <FiMessageSquare size={20} /> },
  { name: 'Admin Profile', path: '/admin/profile', icon: <FiUser size={20} /> },
  { name: 'Settings', path: '/admin/settings', icon: <FiSettings size={20} /> }
]

export default function AdminLayout() {
  const { messages } = useProducts()
  const unreadCount = messages?.filter(m => m.status === 'unread')?.length || 0
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebar, setMobileSidebar] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const { theme, toggleTheme } = useTheme()

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

  const pageTitle =
    sidebarLinks.find((l) =>
      l.path === '/admin'
        ? location.pathname === '/admin' || location.pathname === '/admin/'
        : location.pathname === l.path
    )?.name || 'Admin'

  return (
    <div className="flex min-h-[100dvh] min-h-screen bg-[var(--color-surface)] text-[var(--color-text-primary)]">
      {/* Desktop Sidebar — always dark so it stays readable when main app is in light mode */}
      <aside
        className={`hidden lg:flex ${sidebarWidth} fixed inset-y-0 left-0 z-50 flex-col border-r border-zinc-800 bg-zinc-950 text-zinc-200 transition-all duration-300`}
      >
        <div className="flex min-h-[65px] items-center justify-between border-b border-zinc-800 p-4">
          {sidebarOpen ? (
            <Link to="/admin" className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl gradient-accent">
                <FiShield size={18} className="text-black" />
              </div>
              <div className="overflow-hidden">
                <p className="whitespace-nowrap text-sm font-bold text-white font-[var(--font-family-heading)]">Admin Panel</p>
                <p className="whitespace-nowrap text-[10px] text-zinc-500">Make To Be</p>
              </div>
            </Link>
          ) : (
            <Link to="/admin" className="mx-auto">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-accent">
                <FiShield size={18} className="text-black" />
              </div>
            </Link>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {sidebarOpen && (
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Menu</p>
          )}
          <div className="space-y-1">
            {sidebarLinks.map((link) => {
              const active =
                link.path === '/admin'
                  ? location.pathname === '/admin' || location.pathname === '/admin/'
                  : location.pathname === link.path
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  title={!sidebarOpen ? link.name : undefined}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    active
                      ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)]'
                      : 'text-zinc-400 hover:bg-white/10 hover:text-white'
                  } ${!sidebarOpen ? 'justify-center' : ''}`}
                >
                  <span className="relative shrink-0">
                    {link.icon}
                    {link.name === 'Messages' && unreadCount > 0 && !sidebarOpen && (
                      <span className="absolute -right-1.5 -top-1.5 h-3 w-3 rounded-full border-2 border-zinc-950 bg-red-500" />
                    )}
                  </span>
                  {sidebarOpen && <span className="truncate">{link.name}</span>}
                  {sidebarOpen && link.name === 'Messages' && unreadCount > 0 && (
                    <span className="ml-auto shrink-0 rounded-md bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                  {sidebarOpen && active && link.name !== 'Messages' && (
                    <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="space-y-1 border-t border-zinc-800 p-3">
          <Link
            to="/"
            title={!sidebarOpen ? 'Back to Shop' : undefined}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-400 transition-all hover:bg-white/10 hover:text-white ${!sidebarOpen ? 'justify-center' : ''}`}
          >
            <FiArrowLeft size={18} className="shrink-0" />
            {sidebarOpen && <span>Back to Shop</span>}
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            title={!sidebarOpen ? 'Sign Out' : undefined}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-400 transition-all hover:bg-red-500/15 ${!sidebarOpen ? 'justify-center' : ''}`}
          >
            <FiLogOut size={18} className="shrink-0" />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>

        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-20 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-zinc-400 transition-all hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-accent)]/20 hover:text-white"
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarOpen ? <FiChevronLeft size={12} /> : <FiChevronRight size={12} />}
        </button>
      </aside>

      <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-zinc-800 bg-zinc-950 text-zinc-200 transition-transform duration-300 lg:hidden ${
        mobileSidebar ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between border-b border-zinc-800 p-4">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-accent">
              <FiShield size={18} className="text-black" />
            </div>
            <div>
              <p className="text-sm font-bold text-white font-[var(--font-family-heading)]">Admin Panel</p>
              <p className="text-[10px] text-zinc-500">Make To Be</p>
            </div>
          </Link>
          <button type="button" onClick={() => setMobileSidebar(false)} className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800" aria-label="Close menu">
            <FiX size={18} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-3">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Menu</p>
          <div className="space-y-1">
            {sidebarLinks.map((link) => {
              const active =
                link.path === '/admin'
                  ? location.pathname === '/admin' || location.pathname === '/admin/'
                  : location.pathname === link.path
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    active
                      ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)]'
                      : 'text-zinc-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="relative shrink-0">
                    {link.icon}
                    {link.name === 'Messages' && unreadCount > 0 && (
                      <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </span>
                  <span className="truncate">{link.name}</span>
                </Link>
              )
            })}
          </div>
        </nav>
        <div className="space-y-1 border-t border-zinc-800 p-3">
          <Link to="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-400 transition-all hover:bg-white/10 hover:text-white">
            <FiArrowLeft size={18} /> Back to Shop
          </Link>
          <button type="button" onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-400 transition-all hover:bg-red-500/15">
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
        <div className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 pt-[env(safe-area-inset-top,0px)] backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3 px-4 py-3.5 sm:px-5 lg:px-6">
            <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => setMobileSidebar(true)}
                className="flex h-10 min-h-[44px] w-10 min-w-[44px] shrink-0 items-center justify-center rounded-xl glass-light lg:hidden"
                aria-label="Open menu"
              >
                <FiMenu size={18} />
              </button>
              <div className="min-w-0">
                <h2 className="truncate text-base font-bold font-[var(--font-family-heading)] sm:text-lg">{pageTitle}</h2>
                <p className="truncate text-[10px] text-[var(--color-text-muted)] sm:text-[11px]">Make To Be Admin</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              {/* Theme Toggle */}
              <button
                type="button"
                onClick={(e) => toggleTheme(e)}
                className="flex h-10 min-h-[44px] w-10 min-w-[44px] items-center justify-center rounded-xl glass-light text-[var(--color-text-muted)] transition-all hover:text-[var(--color-text-primary)]"
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
              </button>

              <div className="hidden max-w-[140px] items-center gap-2 rounded-xl px-2.5 py-1.5 glass-light sm:flex sm:max-w-none sm:px-3">
                <div className="h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
                <span className="truncate text-xs font-medium text-[var(--color-text-secondary)]">{adminAuth.username}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content — Suspense keeps shell (sidebars) mounted while lazy admin chunks load */}
        <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-5 lg:px-8 lg:py-8">
          <Suspense fallback={<RouteFallback />}>
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
