import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FiShoppingCart, FiSearch, FiUser, FiMenu, FiX, FiLogOut, FiPackage, FiChevronDown } from 'react-icons/fi'
import { MdDashboard } from 'react-icons/md'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

export default function Navbar() {
  const [scrolled, setScrolled]         = useState(false)
  const [menuOpen, setMenuOpen]         = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery]   = useState('')
  const { user, isAdmin, signOut, profile } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const userMenuRef = useRef(null)

  const isAdminPage = location.pathname.startsWith('/admin')
  if (isAdminPage) return null

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false); setUserMenuOpen(false) }, [location])

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e) => { if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ]

  const categories = [
    { name: 'Watches',     path: '/products?category=watches',     emoji: '⌚' },
    { name: 'Dresses',     path: '/products?category=dresses',     emoji: '👗' },
    { name: 'Shoes',       path: '/products?category=shoes',       emoji: '👟' },
    { name: 'Accessories', path: '/products?category=accessories', emoji: '💍' },
    { name: '🔥 Hot Deals', path: '/products?discount=true',       emoji: '' },
  ]

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'shadow-xl shadow-black/30' : ''
        }`}
      >
        {/* ── TOP ROW: Logo + Search + Actions ── */}
        <div className="bg-[var(--color-primary)] border-b border-white/5">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-3 flex items-center gap-3 sm:gap-5">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0 group" aria-label="Home">
              <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center font-black text-lg shadow-lg shadow-[var(--color-accent)]/30 group-hover:scale-105 transition-transform">
                M
              </div>
              <div className="hidden sm:block">
                <p className="text-base font-black leading-tight font-[var(--font-family-heading)]">Make To Be</p>
                <p className="text-[9px] text-[var(--color-text-muted)] uppercase tracking-widest leading-none">Premium Shop</p>
              </div>
            </Link>

            {/* ── SEARCH BAR (centre, fully visible) ── */}
            <form onSubmit={handleSearch} className="flex-1 flex items-center gap-0" id="navbar-search-form">
              <div className="flex w-full rounded-xl overflow-hidden border border-[var(--color-border)] focus-within:border-[var(--color-accent)] focus-within:shadow-[0_0_0_3px_rgba(124,58,237,0.15)] transition-all bg-[var(--color-surface-light)]">
                <FiSearch className="ml-4 shrink-0 text-[var(--color-text-muted)] self-center" size={17} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search watches, dresses, shoes..."
                  className="flex-1 bg-transparent py-2.5 px-3 text-sm text-white placeholder:text-[var(--color-text-muted)] outline-none"
                  id="search-input"
                />
                <button
                  type="submit"
                  id="search-submit"
                  className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] text-white px-5 py-2.5 text-sm font-semibold transition-colors shrink-0"
                >
                  Search
                </button>
              </div>
            </form>

            {/* ── RIGHT ACTIONS ── */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">

              {/* Cart */}
              <Link
                to="/cart"
                className="relative flex flex-col items-center justify-center gap-0.5 w-11 h-11 rounded-xl hover:bg-white/5 transition-all group"
                id="cart-link"
                aria-label="Cart"
              >
                <div className="relative">
                  <FiShoppingCart size={20} className="group-hover:text-[var(--color-accent)] transition-colors" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] rounded-full gradient-accent text-[9px] font-bold flex items-center justify-center px-1 shadow-lg">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </div>
                <span className="text-[9px] text-[var(--color-text-muted)] hidden sm:block leading-none">Cart</span>
              </Link>

              {/* User Menu / Login */}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex flex-col items-center gap-0.5 w-11 h-11 rounded-xl hover:bg-white/5 transition-all group"
                    id="user-menu-toggle"
                    aria-label="Account"
                  >
                    <div className="w-6 h-6 rounded-full gradient-accent flex items-center justify-center text-xs font-bold overflow-hidden border border-white/10">
                      {profile?.avatar_url
                        ? <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                        : (profile?.full_name?.[0] || user.email?.[0] || 'U').toUpperCase()
                      }
                    </div>
                    <span className="text-[9px] text-[var(--color-text-muted)] hidden sm:block leading-none">Account</span>
                  </button>

                  {/* Dropdown */}
                  {userMenuOpen && (
                    <div className="absolute right-0 top-[calc(100%+8px)] w-64 bg-[var(--color-surface-card)] rounded-2xl shadow-2xl border border-[var(--color-border)] overflow-hidden animate-fadeIn z-50">
                      {/* User info */}
                      <div className="px-4 py-4 bg-[var(--color-primary)] border-b border-[var(--color-border)]">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full gradient-accent flex items-center justify-center font-bold text-sm shrink-0">
                            {(profile?.full_name?.[0] || 'U').toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold truncate">{profile?.full_name || 'User'}</p>
                            <p className="text-xs text-[var(--color-text-muted)] truncate">{user.email}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-sm transition-all">
                          <FiUser size={15} className="text-[var(--color-accent)] shrink-0" /> My Profile
                        </Link>
                        <Link to="/orders" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-sm transition-all">
                          <FiPackage size={15} className="text-[var(--color-accent)] shrink-0" /> My Orders
                        </Link>
                        {isAdmin && (
                          <Link to="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-sm transition-all">
                            <MdDashboard size={15} className="text-[var(--color-accent)] shrink-0" /> Admin Dashboard
                          </Link>
                        )}
                        <div className="border-t border-[var(--color-border)] mt-2 pt-2">
                          <button
                            onClick={signOut}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-red-400 text-sm transition-all w-full"
                          >
                            <FiLogOut size={15} /> Sign Out
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl gradient-accent text-sm font-semibold hover:opacity-90 transition-all shadow-md shadow-[var(--color-accent)]/25 whitespace-nowrap"
                  id="login-link"
                >
                  <FiUser size={15} />
                  <span>Login</span>
                </Link>
              )}

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
                id="mobile-menu-toggle"
                aria-label="Menu"
              >
                {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── BOTTOM ROW: Nav Links + Category Bar (desktop only) ── */}
        <div className={`hidden md:block bg-[var(--color-surface)]/95 backdrop-blur-xl border-b border-white/5 ${scrolled ? 'shadow-sm' : ''}`}>
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex items-center gap-6 h-10">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-xs font-semibold tracking-wide transition-all relative py-1 whitespace-nowrap hover:text-[var(--color-accent)] ${
                  location.pathname === link.path
                    ? 'text-[var(--color-accent)]'
                    : 'text-[var(--color-text-secondary)]'
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <span className="absolute -bottom-[11px] left-0 right-0 h-[2px] bg-[var(--color-accent)] rounded-full" />
                )}
              </Link>
            ))}

            {/* Divider */}
            <span className="w-px h-4 bg-white/10 shrink-0" />

            {/* Category quick links */}
            <div className="flex items-center gap-4 overflow-x-auto scrollbar-none">
              {categories.map(cat => (
                <Link
                  key={cat.name}
                  to={cat.path}
                  className="text-xs text-[var(--color-text-muted)] hover:text-white transition-colors whitespace-nowrap py-1"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── MOBILE MENU ── */}
        {menuOpen && (
          <div className="md:hidden bg-[var(--color-surface)] border-t border-white/5 shadow-2xl animate-fadeIn">
            {/* Mobile search */}
            <div className="px-4 pt-4 pb-3">
              <form onSubmit={handleSearch} className="flex rounded-xl overflow-hidden border border-[var(--color-border)] focus-within:border-[var(--color-accent)] bg-[var(--color-surface-light)] transition-all">
                <FiSearch className="ml-3 self-center text-[var(--color-text-muted)] shrink-0" size={16} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 bg-transparent py-2.5 px-3 text-sm outline-none placeholder:text-[var(--color-text-muted)]"
                />
                <button type="submit" className="bg-[var(--color-accent)] px-4 text-sm font-semibold text-white">Go</button>
              </form>
            </div>

            {/* Nav links */}
            <div className="px-4 pb-3 flex flex-col gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    location.pathname === link.path
                      ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)] border border-[var(--color-accent)]/20'
                      : 'hover:bg-white/5 text-[var(--color-text-secondary)] hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Category pills */}
            <div className="px-4 pb-4 flex flex-wrap gap-2 border-t border-white/5 pt-3">
              {categories.map(cat => (
                <Link
                  key={cat.name}
                  to={cat.path}
                  className="text-xs px-3 py-1.5 rounded-full bg-white/5 text-[var(--color-text-secondary)] hover:bg-[var(--color-accent)]/15 hover:text-[var(--color-accent)] transition-all border border-white/5"
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            {!user && (
              <div className="px-4 pb-4">
                <Link to="/login" className="btn-primary w-full justify-center py-3 text-sm">
                  <FiUser size={16} /> Login / Register
                </Link>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  )
}
