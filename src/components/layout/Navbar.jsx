import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FiShoppingCart, FiSearch, FiUser, FiMenu, FiX, FiLogOut, FiPackage } from 'react-icons/fi'
import { MdDashboard } from 'react-icons/md'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

export default function Navbar() {
  const [scrolled, setScrolled]         = useState(false)
  const [menuOpen, setMenuOpen]         = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen]     = useState(false)
  const [searchQuery, setSearchQuery]   = useState('')
  const { user, isAdmin, signOut, profile } = useAuth()
  const { cartCount } = useCart()
  const navigate   = useNavigate()
  const location   = useLocation()
  const userMenuRef = useRef(null)
  const searchRef   = useRef(null)

  const isAdminPage = location.pathname.startsWith('/admin')
  if (isAdminPage) return null

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close everything on route change
  useEffect(() => {
    setMenuOpen(false)
    setUserMenuOpen(false)
    setSearchOpen(false)
  }, [location])

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setSearchOpen(false)
    }
  }

  const navLinks = [
    { name: 'Home',     path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About',    path: '/about' },
    { name: 'Contact',  path: '/contact' },
  ]

  const categories = [
    { name: 'Watches',     path: '/products?category=watches' },
    { name: 'Dresses',     path: '/products?category=dresses' },
    { name: 'Shoes',       path: '/products?category=shoes' },
    { name: 'Accessories', path: '/products?category=accessories' },
    { name: '🔥 Hot Deals', path: '/products?discount=true' },
  ]

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 ${scrolled ? 'shadow-xl shadow-black/20' : ''}`}>

        {/* ─────────────────────────────────────────────────────────
            TOP ROW — Logo | [Search desktop only] | Icons
        ───────────────────────────────────────────────────────── */}
        <div className="bg-[var(--color-primary)] border-b border-white/5">
          <div className="max-w-[1280px] mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center gap-2 sm:gap-4">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0 group" aria-label="Home">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl gradient-accent flex items-center justify-center font-black text-base sm:text-lg shadow-md group-hover:scale-105 transition-transform">
                M
              </div>
              <span className="hidden sm:block font-black text-base leading-tight font-[var(--font-family-heading)]">
                Make To Be
              </span>
            </Link>

            {/* Desktop Search (hidden on mobile) */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 items-center rounded-xl overflow-hidden border border-[var(--color-border)] focus-within:border-[var(--color-accent)] focus-within:shadow-[0_0_0_2px_rgba(124,58,237,0.2)] bg-[var(--color-surface-light)] transition-all"
              id="navbar-search-form"
            >
              <FiSearch className="ml-3 shrink-0 text-[var(--color-text-muted)]" size={15} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search watches, dresses, shoes..."
                className="flex-1 bg-transparent py-2.5 px-2.5 text-sm text-white placeholder:text-[var(--color-text-muted)] outline-none"
                id="search-input-desktop"
              />
              <button
                type="submit"
                className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] text-white px-5 py-2.5 text-sm font-semibold transition-colors shrink-0"
              >
                Search
              </button>
            </form>

            {/* Right Actions */}
            <div className="flex items-center gap-1 sm:gap-2 ml-auto">

              {/* Mobile Search icon */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all"
                aria-label="Search"
              >
                <FiSearch size={19} />
              </button>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all"
                id="cart-link"
                aria-label="Cart"
              >
                <FiShoppingCart size={19} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] rounded-full gradient-accent text-[9px] font-bold flex items-center justify-center px-0.5 shadow">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              {/* Account / Login */}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl gradient-accent flex items-center justify-center font-bold text-sm hover:opacity-90 transition-all overflow-hidden border border-white/10"
                    id="user-menu-toggle"
                    aria-label="Account"
                  >
                    {profile?.avatar_url
                      ? <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                      : (profile?.full_name?.[0] || user.email?.[0] || 'U').toUpperCase()
                    }
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-[calc(100%+8px)] w-60 bg-[var(--color-surface-card)] rounded-2xl shadow-2xl border border-[var(--color-border)] overflow-hidden animate-fadeIn z-50">
                      <div className="px-4 py-3.5 bg-[var(--color-primary)] border-b border-[var(--color-border)]">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full gradient-accent flex items-center justify-center font-bold text-sm shrink-0">
                            {(profile?.full_name?.[0] || 'U').toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold truncate">{profile?.full_name || 'User'}</p>
                            <p className="text-[11px] text-[var(--color-text-muted)] truncate">{user.email}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-sm transition-all">
                          <FiUser size={14} className="text-[var(--color-accent)] shrink-0" /> My Profile
                        </Link>
                        <Link to="/orders" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-sm transition-all">
                          <FiPackage size={14} className="text-[var(--color-accent)] shrink-0" /> My Orders
                        </Link>
                        {isAdmin && (
                          <Link to="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-sm transition-all">
                            <MdDashboard size={14} className="text-[var(--color-accent)] shrink-0" /> Admin Dashboard
                          </Link>
                        )}
                        <div className="border-t border-[var(--color-border)] mt-2 pt-2">
                          <button
                            onClick={signOut}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-red-400 text-sm transition-all w-full"
                          >
                            <FiLogOut size={14} /> Sign Out
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl gradient-accent text-xs sm:text-sm font-semibold hover:opacity-90 transition-all shadow-md shadow-[var(--color-accent)]/20 whitespace-nowrap"
                  id="login-link"
                >
                  <FiUser size={14} />
                  <span className="hidden xs:inline sm:inline">Login</span>
                </Link>
              )}

              {/* Hamburger — mobile only */}
              <button
                onClick={() => { setMenuOpen(!menuOpen); setSearchOpen(false) }}
                className="md:hidden w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all ml-0.5"
                id="mobile-menu-toggle"
                aria-label="Menu"
              >
                {menuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────
            BOTTOM ROW — Nav links + Category bar (desktop only)
        ───────────────────────────────────────────────────────── */}
        <div className="hidden md:block bg-[var(--color-surface)]/95 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex items-center gap-6 h-10 overflow-x-auto scrollbar-none">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-xs font-semibold tracking-wide transition-all relative py-1 whitespace-nowrap hover:text-[var(--color-accent)] shrink-0 ${
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
            <span className="w-px h-4 bg-white/10 shrink-0" />
            {categories.map(cat => (
              <Link
                key={cat.name}
                to={cat.path}
                className="text-xs text-[var(--color-text-muted)] hover:text-white transition-colors whitespace-nowrap py-1 shrink-0"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────
            MOBILE: Slide-down Search Bar (when icon pressed)
        ───────────────────────────────────────────────────────── */}
        {searchOpen && (
          <div className="md:hidden bg-[var(--color-primary)] border-t border-white/5 px-3 py-3 animate-fadeIn">
            <form onSubmit={handleSearch} className="flex rounded-xl overflow-hidden border border-[var(--color-border)] focus-within:border-[var(--color-accent)] bg-[var(--color-surface-light)] transition-all">
              <FiSearch className="ml-3 self-center text-[var(--color-text-muted)] shrink-0" size={15} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 bg-transparent py-2.5 px-2.5 text-sm outline-none placeholder:text-[var(--color-text-muted)]"
                autoFocus
                id="search-input-mobile"
              />
              <button type="submit" className="bg-[var(--color-accent)] px-4 text-sm font-semibold text-white">
                Go
              </button>
            </form>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────
            MOBILE MENU — slides down when hamburger pressed
        ───────────────────────────────────────────────────────── */}
        {menuOpen && (
          <div className="md:hidden bg-[var(--color-surface)] border-t border-white/5 shadow-2xl animate-fadeIn">
            {/* Nav links */}
            <div className="px-3 pt-3 pb-2 flex flex-col gap-0.5">
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
            <div className="px-3 pb-3 pt-2 border-t border-white/5 flex flex-wrap gap-2">
              <p className="w-full text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] mb-1">Categories</p>
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

            {/* Login CTA if not logged in */}
            {!user && (
              <div className="px-3 pb-3">
                <Link to="/login" className="btn-primary w-full justify-center py-3 text-sm">
                  <FiUser size={15} /> Login / Register
                </Link>
              </div>
            )}
          </div>
        )}

      </header>
    </>
  )
}
