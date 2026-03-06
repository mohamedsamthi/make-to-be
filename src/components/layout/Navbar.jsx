import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FiShoppingCart, FiSearch, FiUser, FiMenu, FiX, FiLogOut, FiPackage } from 'react-icons/fi'
import { MdDashboard } from 'react-icons/md'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { user, isAdmin, signOut, profile } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()
  const location = useLocation()

  // Hide navbar on admin pages
  const isAdminPage = location.pathname.startsWith('/admin')
  if (isAdminPage) return null

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setUserMenuOpen(false)
  }, [location])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Contact', path: '/contact' }
  ]

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0f0f23]/95 backdrop-blur-xl shadow-lg shadow-black/20 py-3'
            : 'bg-[#0f0f23]/80 backdrop-blur-md py-4'
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
              M
            </div>
            <div>
              <h1 className="text-lg font-bold font-[var(--font-family-heading)] leading-none">
                Make To Be
              </h1>
              <p className="text-[10px] text-[var(--color-text-muted)] leading-none tracking-wider uppercase mt-0.5">
                Premium Shop
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-all duration-300 hover:text-[var(--color-accent)] relative py-1 ${
                  location.pathname === link.path
                    ? 'text-[var(--color-accent)]'
                    : 'text-[var(--color-text-secondary)]'
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-[var(--color-accent)] rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-10 h-10 rounded-xl glass-light flex items-center justify-center hover:bg-[var(--color-accent)]/20 transition-all"
              id="search-toggle"
            >
              <FiSearch size={18} />
            </button>

            {/* Cart */}
            <Link
              to="/cart"
              className="w-10 h-10 rounded-xl glass-light flex items-center justify-center hover:bg-[var(--color-accent)]/20 transition-all relative"
              id="cart-link"
            >
              <FiShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 rounded-full gradient-accent text-[10px] font-bold flex items-center justify-center px-1">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center text-sm font-bold hover:opacity-90 transition-all"
                  id="user-menu-toggle"
                >
                  {profile?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-13 w-60 glass rounded-2xl p-2 animate-fadeIn shadow-2xl border border-white/10">
                    <div className="px-4 py-3 border-b border-white/5">
                      <p className="text-sm font-semibold">{profile?.full_name || 'User'}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{user.email}</p>
                    </div>
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/5 text-sm transition-all mt-1">
                      <FiUser size={16} /> My Profile
                    </Link>
                    <Link to="/orders" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/5 text-sm transition-all">
                      <FiPackage size={16} /> My Orders
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/5 text-sm transition-all">
                        <MdDashboard size={16} /> Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={signOut}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-red-500/10 text-red-400 text-sm transition-all w-full mt-1"
                    >
                      <FiLogOut size={16} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-accent text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-[var(--color-accent)]/20"
                id="login-link"
              >
                <FiUser size={16} />
                <span className="hidden sm:inline">Login</span>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-10 h-10 rounded-xl glass-light flex items-center justify-center"
              id="mobile-menu-toggle"
            >
              {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        {/* Search Bar Dropdown */}
        {searchOpen && (
          <div className="absolute top-full left-0 right-0 p-4 glass animate-fadeIn border-t border-white/5">
            <form onSubmit={handleSearch} className="max-w-[1280px] mx-auto px-4 flex gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search watches, dresses, accessories..."
                className="input-field flex-1"
                autoFocus
                id="search-input"
              />
              <button type="submit" className="btn-primary px-6" id="search-submit">
                <FiSearch size={18} /> Search
              </button>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 glass animate-fadeIn p-4 border-t border-white/5">
            <div className="max-w-[1280px] mx-auto px-4 flex flex-col gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    location.pathname === link.path
                      ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                      : 'hover:bg-white/5 text-[var(--color-text-secondary)]'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {!user && (
                <Link to="/login" className="btn-primary justify-center mt-3 py-3">
                  <FiUser size={16} /> Login / Register
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Click outside to close menus */}
      {(userMenuOpen || menuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setUserMenuOpen(false)
            setMenuOpen(false)
          }}
        />
      )}
    </>
  )
}
