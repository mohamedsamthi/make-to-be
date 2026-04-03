import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  FiShoppingCart,
  FiSearch,
  FiUser,
  FiMenu,
  FiX,
  FiLogOut,
  FiPackage,
  FiChevronRight,
  FiPlay,
  FiHeart,
  FiSun,
  FiMoon
} from 'react-icons/fi'
import { MdDashboard, MdVideoLibrary } from 'react-icons/md'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useProducts } from '../../context/ProductContext'
import { useTheme } from '../../context/ThemeContext'
import { FiMessageSquare } from 'react-icons/fi'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const { user, isAdmin, signOut, profile } = useAuth()
  const { cartCount } = useCart()
  const { theme, toggleTheme } = useTheme()
  const { promotions, promotionalVideos, favorites } = useProducts()

  const activePromo = promotions?.find(p => p.active)
  const { orders, messages } = useProducts()
  const navigate = useNavigate()
  const location = useLocation()
  const userMenuRef = useRef(null)

  // Calculate incoming messages from admin (Order Chat)
  const incomingOrderMessages = orders.filter(o => {
    const isOwner = (o.customer_email === user?.email || (o.customer_phone === profile?.phone))
    if (!isOwner) return false
    
    const meta = o.items.find(i => i.is_sales_data)
    const chat = meta?.chat_history || []
    return chat.length > 0 && chat[chat.length - 1].sender === 'admin' && !chat[chat.length - 1].readByUser
  })

  // Calculate incoming messages from admin (Contact Support)
  const incomingSupportMessages = messages.filter(m => {
    return (m.email === user?.email || m.phone === profile?.phone) && m.status === 'replied' && !m.readByUser
  })

  const hasNewMsgs = incomingOrderMessages.length > 0 || incomingSupportMessages.length > 0
  const latestMessageOrder = incomingOrderMessages[0]
  const latestMessageSupport = incomingSupportMessages[0]

  // Hide navbar on admin pages
  const isAdminPage = location.pathname.startsWith('/admin') || location.pathname === '/admin-login'
  if (isAdminPage) return null

  // Scroll visibility logic
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrolled(currentScrollY > 20)
      
      if (currentScrollY > lastScrollY && currentScrollY > 150) {
        // Scrolling down
        setVisible(false)
      } else {
        // Scrolling up
        setVisible(true)
      }
      setLastScrollY(currentScrollY)
    }

    const handleMouseMove = (e) => {
      if (e.clientY < 50) {
        setVisible(true)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [lastScrollY])

  // Close menus when route changes
  useEffect(() => {
    setMenuOpen(false)
    setUserMenuOpen(false)
    setMobileSearchOpen(false)
    setVisible(true) // Ensure visible on route change
  }, [location.pathname, location.search])

  // Close user dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    const query = searchQuery.trim()
    if (!query) return
    navigate(`/products?search=${encodeURIComponent(query)}`)
    setSearchQuery('')
    setMobileSearchOpen(false)
    setMenuOpen(false)
  }

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Promo Video', path: '/promo-video', icon: <FiPlay size={14} className="text-[var(--color-accent)]" /> },
    { name: 'About Us', path: '/about' },
    { name: 'Forms', path: '/forms' },
    { name: 'Contact', path: '/contact' },
  ]

  const categories = [
    { name: 'Watches', path: '/products?category=watches' },
    { name: 'Dresses', path: '/products?category=dresses' },
    { name: 'Shoes', path: '/products?category=shoes' },
    { name: 'Accessories', path: '/products?category=accessories' },
    { name: '🔥 SALES', path: '/products?discount=true', highlight: true },
  ]

  const isActivePath = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname === path
  }

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="fixed top-0 left-0 right-0 h-10 bg-[var(--color-surface-light)] text-[var(--color-text-primary)] text-[10px] sm:text-xs py-2 text-center font-black tracking-widest uppercase z-[60] border-b border-[var(--color-border)] flex items-center justify-center">
        {activePromo ? (
          <div className="flex items-center gap-2">
            <span>{activePromo.title}</span>
            <span className="w-1 h-1 rounded-full bg-[var(--color-accent)] opacity-40" />
            <span className="text-[var(--color-text-muted)]">
              {(() => {
                try {
                  const d = JSON.parse(activePromo.description);
                  return d.text || activePromo.description;
                } catch(e) {
                  return activePromo.description;
                }
              })()}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span>Island-wide Delivery</span>
            <span className="w-1 h-1 rounded-full bg-[var(--color-accent)] opacity-40" />
            <span className="text-[var(--color-text-muted)]">Free shipping on orders Rs. 10,000+</span>
          </div>
        )}
      </div>

      <header
        className={`fixed top-10 left-0 right-0 z-50 w-full transition-all duration-500 transform ${
          visible ? 'translate-y-0' : '-translate-y-[calc(100%+40px)]'
        } ${
          scrolled 
            ? 'bg-[var(--color-surface)]/98 backdrop-blur-2xl border-b border-[var(--color-border)] shadow-xl' 
            : 'bg-[var(--color-surface)] border-b border-[var(--color-border)]'
        }`}
      >
        {/* Main Header Row */}
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4 lg:gap-8">
            {/* Logo + Mobile Menu Button */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setMenuOpen(true)}
                className="lg:hidden p-2 -ml-2 text-[var(--color-text-primary)] hover:bg-[var(--color-surface-light)] rounded-xl transition-all"
              >
                <FiMenu size={24} />
              </button>

              <Link to="/" className="flex items-center gap-2 group">
                <img src="/favicon.png" alt="Make To Be" className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl object-cover" />
                <span className="font-black text-xl sm:text-2xl tracking-tighter text-[var(--color-text-primary)] hidden sm:block font-[var(--font-family-heading)]">
                   MAKE <span className="text-[var(--color-accent)]">TO BE</span>
                </span>
              </Link>
            </div>

            {/* Desktop Search Bar */}
            <form
              onSubmit={handleSearch}
              className="hidden lg:flex flex-1 max-w-2xl relative group/search"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search premium pieces..."
                className="w-full bg-[var(--color-surface-light)] border border-[var(--color-border)] rounded-l-xl py-3 pl-5 pr-4 text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-all z-20"
              />
              <button
                type="submit"
                className="bg-[var(--color-accent)] text-black hover:bg-[var(--color-accent-dark)] px-7 rounded-r-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2"
              >
                <FiSearch size={16} /> Search
              </button>
            </form>

            {/* Right side: Mobile Search, User, Cart */}
            <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 shrink-0">
              {/* Mobile Search Toggle */}
              <button
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="lg:hidden p-2.5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-light)] rounded-xl transition-colors"
              >
                <FiSearch size={22} />
              </button>

              {/* User Menu / Login */}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen((prev) => !prev)}
                    className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-2 rounded-xl hover:bg-[var(--color-surface-light)] border border-transparent hover:border-[var(--color-border)] transition-all group"
                  >
                    <div className="w-9 h-9 rounded-full bg-[var(--color-primary-light)] text-[var(--color-text-primary)] flex items-center justify-center font-black text-xs overflow-hidden shadow-sm border border-[var(--color-border)]">
                      {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt="avatar" className="h-full w-full object-cover" />
                      ) : (
                        (profile?.full_name?.[0] || user.email?.[0] || 'U').toUpperCase()
                      )}
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-[9px] uppercase font-black tracking-widest text-[var(--color-accent)] leading-none mb-0.5">Account</p>
                      <p className="text-xs font-black text-[var(--color-text-primary)] truncate max-w-[100px]">
                        {profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'User'}
                      </p>
                    </div>
                  </button>

                  {/* User Dropdown */}
                  {userMenuOpen && (
                    <div className="absolute left-1/2 -translate-x-1/2 md:left-auto md:right-0 md:translate-x-0 mt-2 w-[calc(100vw-2rem)] max-w-[280px] sm:w-64 bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl shadow-3xl overflow-hidden z-50 animate-fadeInUp">
                      <div className="p-2">
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-4 py-3 text-[10px] uppercase tracking-widest font-black text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-accent)]/10 rounded-xl transition-colors"
                        >
                          <FiUser size={16} /> My Profile
                        </Link>
                        <Link
                          to="/orders"
                          className="flex items-center gap-3 px-4 py-3 text-[10px] uppercase tracking-widest font-black text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-accent)]/10 rounded-xl transition-colors"
                        >
                          <FiPackage size={16} /> My Orders
                        </Link>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-3 px-4 py-3 text-[10px] uppercase tracking-widest font-black text-amber-500 hover:text-amber-400 hover:bg-amber-500/5 rounded-xl transition-colors"
                          >
                            <MdDashboard size={16} /> Admin Panel
                          </Link>
                        )}
                        <div className="border-t border-[var(--color-border)] my-1 mx-2" />
                        <button
                          onClick={signOut}
                          className="w-full flex items-center gap-3 px-4 py-3 text-[10px] uppercase tracking-widest font-black text-red-500 hover:bg-red-500/5 rounded-xl transition-colors"
                        >
                          <FiLogOut size={16} /> End Session
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] px-4 py-2.5 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-[var(--color-surface-light)] transition-all"
                >
                  <FiUser size={18} />
                  Sign In
                </Link>
              )}

              {/* Theme Toggle */}
              <button
                onClick={(e) => toggleTheme(e)}
                className="p-2.5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-light)] rounded-xl transition-all"
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              >
                {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
              </button>

              {/* Wishlist Link */}
              <Link
                to="/wishlist"
                className="relative flex items-center gap-2.5 p-2 sm:px-4 sm:py-2.5 hover:bg-[var(--color-surface-light)] border border-transparent hover:border-[var(--color-border)] rounded-xl transition-all group"
                title="Your Wishlist"
              >
                <div className="relative">
                  <FiHeart size={20} className={`transition-colors ${favorites.length > 0 ? 'text-rose-500 fill-rose-500' : 'text-[var(--color-text-muted)] group-hover:text-rose-500'}`} />
                  {favorites.length > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] bg-rose-600 text-white text-[9px] font-black rounded-full flex items-center justify-center px-1 shadow-lg border-2 border-[var(--color-surface)]">
                      {favorites.length}
                    </span>
                  )}
                </div>
                <div className="hidden sm:block text-left ml-1">
                  <span className="text-[8px] uppercase font-black tracking-widest text-rose-500 block leading-none mb-0.5">Saved</span>
                  <span className="text-xs font-black text-[var(--color-text-primary)] leading-none block">Wishlist</span>
                </div>
              </Link>

              {/* Cart Link */}
              <Link
                to="/cart"
                className="relative flex items-center gap-2.5 p-2 sm:px-4 sm:py-2.5 hover:bg-[var(--color-surface-light)] border border-transparent hover:border-[var(--color-border)] rounded-xl transition-all group"
              >
                <div className="relative">
                  <FiShoppingCart size={20} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)] transition-colors" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] bg-[var(--color-text-primary)] text-[var(--color-primary)] text-[9px] font-black rounded-full flex items-center justify-center px-1 shadow-sm border-2 border-[var(--color-surface)]">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </div>
                <div className="hidden sm:block text-left ml-1">
                  <span className="text-[8px] uppercase font-black tracking-widest text-[var(--color-accent)] block leading-none mb-0.5">Bag</span>
                  <span className="text-xs font-black text-[var(--color-text-primary)] leading-none block">{cartCount} Items</span>
                </div>
              </Link>

              {/* Unread Message Notification */}
              {hasNewMsgs && (
                <Link
                  to={latestMessageOrder ? `/orders?id=${latestMessageOrder.id}&tab=chat` : `/profile?tab=support`}
                  className="relative flex items-center gap-2.5 p-2 sm:px-4 sm:py-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl transition-all group animate-pulse"
                >
                  <FiMessageSquare size={20} className="text-rose-400 group-hover:text-white transition-colors" />
                  <div className="hidden md:block text-left ml-1">
                    <span className="text-[8px] uppercase font-black tracking-widest text-rose-500 block leading-none mb-0.5">New</span>
                    <span className="text-xs font-black text-[var(--color-text-primary)] leading-none block">Alert</span>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Category Navigation */}
        <div className="hidden lg:block border-t border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="container-custom flex items-center h-12 gap-10">
            <div className="flex items-center gap-8 border-r border-[var(--color-border)] pr-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                    isActivePath(link.path)
                      ? 'text-[var(--color-text-primary)]'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  {link.icon}
                  {link.name}
                  {link.path === '/promo-video' && promotionalVideos.length > 0 && (
                    <span className="w-1.5 h-1.5 bg-[var(--color-accent)] rounded-full animate-pulse" />
                  )}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-8">
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  to={cat.path}
                  className={`text-[10px] font-black uppercase tracking-widest transition-all ${
                    cat.highlight
                      ? 'text-[var(--color-accent)] hover:text-[var(--color-accent-light)]'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  {cat.highlight && <span className="mr-1">🔥</span>}
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Search Expandable */}
        {mobileSearchOpen && (
          <div className="lg:hidden border-t border-[var(--color-border)] bg-[var(--color-surface-card)] p-4 shadow-xl z-50 relative">
            <form onSubmit={handleSearch} className="flex group/mobsearch">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 bg-[var(--color-surface-light)] border border-[var(--color-border)] rounded-l-xl py-3 px-5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-all z-10"
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-[var(--color-accent)] text-black px-6 rounded-r-xl font-black text-xs uppercase tracking-widest"
                >
                  Search
                </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Sidebar Drawer */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-[60] lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 w-[300px] bg-[var(--color-surface)] z-[70] transform transition-transform duration-300 lg:hidden shadow-2xl flex flex-col border-r border-[var(--color-border)] ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
           <span className="font-black text-2xl tracking-tighter text-[var(--color-text-primary)]">
             MAKE <span className="text-[var(--color-accent)]">TO BE</span>
           </span>
          <button
            onClick={() => setMenuOpen(false)}
            className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-surface-light)] transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-8 px-6 custom-scrollbar">
          <div className="mb-10">
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-6">
              Menu Navigation
            </p>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center justify-between py-3 text-xs font-black uppercase tracking-widest transition-all mb-4 ${
                  isActivePath(link.path)
                    ? 'text-[var(--color-text-primary)]'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                <span className="flex items-center gap-3">
                  {link.icon || <FiChevronRight size={14} className="opacity-40" />}
                  {link.name}
                </span>
                <FiChevronRight
                  size={14}
                  className={isActivePath(link.path) ? 'text-[var(--color-accent-light)]' : 'opacity-20'}
                />
              </Link>
            ))}
          </div>

          <div className="mb-10">
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-6">
              Shop Collections
            </p>
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={cat.path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center py-3 text-xs font-black uppercase tracking-widest transition-all mb-4 ${
                  cat.highlight
                    ? 'text-[var(--color-accent)]'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                {cat.highlight && <span className="mr-2">🔥</span>}
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Auth Footer */}
        <div className="p-6 border-t border-[var(--color-border)] bg-[var(--color-surface-light)]">
          {!user ? (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-3 w-full bg-[var(--color-accent)] text-black py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all"
            >
              <FiUser size={18} /> Sign In
            </Link>
          ) : (
            <div className="space-y-4">
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-4 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] font-black text-xs uppercase tracking-widest transition-colors"
              >
                <FiUser size={18} /> Account Info
              </Link>
              <Link
                to="/orders"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-4 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] font-black text-xs uppercase tracking-widest transition-colors"
              >
                <FiPackage size={18} /> My Orders
              </Link>
              <button
                onClick={() => { signOut(); setMenuOpen(false) }}
                className="flex items-center gap-4 w-full text-red-500 hover:text-red-400 font-black text-xs uppercase tracking-widest transition-colors"
              >
                <FiLogOut size={18} /> Exit Account
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}