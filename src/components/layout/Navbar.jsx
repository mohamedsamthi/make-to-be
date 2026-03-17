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
  FiChevronRight
} from 'react-icons/fi'
import { MdDashboard } from 'react-icons/md'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useProducts } from '../../context/ProductContext'
import { FiMessageSquare } from 'react-icons/fi'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const { user, isAdmin, signOut, profile } = useAuth()
  const { cartCount } = useCart()
  const { promotions } = useProducts()

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

  // Scroll shadow effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menus when route changes
  useEffect(() => {
    setMenuOpen(false)
    setUserMenuOpen(false)
    setMobileSearchOpen(false)
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
    { name: 'About Us', path: '/about' },
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
      <div className="bg-gradient-to-r from-violet-900 to-fuchsia-900 text-violet-100 text-[10px] sm:text-xs py-2 text-center font-bold tracking-widest uppercase shadow-md relative z-[60]">
        {activePromo ? (
          <>
            {activePromo.title} • <span className="text-amber-300">
              {(() => {
                try {
                  const d = JSON.parse(activePromo.description);
                  return d.text || activePromo.description;
                } catch(e) {
                  return activePromo.description;
                }
              })()}
            </span>
          </>
        ) : (
          <>
            Island-wide Delivery • <span className="text-amber-300">Free shipping on orders over Rs. 10,000!</span>
          </>
        )}
      </div>

      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled 
            ? 'bg-[#151230]/90 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]' 
            : 'bg-[#151230] border-b border-white/5'
        }`}
      >
        {/* Main Header Row */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4 lg:gap-8">
            {/* Logo + Mobile Menu Button */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setMenuOpen(true)}
                className="lg:hidden p-2 -ml-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              >
                <FiMenu size={24} />
              </button>

              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white rounded-xl flex items-center justify-center font-black text-xl sm:text-2xl shadow-lg shadow-violet-500/30 group-hover:scale-105 transition-transform">
                  M
                </div>
                <span className="font-black text-xl sm:text-2xl tracking-wider text-white hidden sm:block font-[var(--font-family-heading)]">
                  MAKE<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">TOBE</span>
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
                placeholder="Search watches, dresses, shoes..."
                className="w-full bg-black/40 border border-white/10 rounded-l-xl py-3 pl-5 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all z-10"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white px-7 rounded-r-xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-violet-500/25 group-focus-within/search:shadow-violet-500/40"
              >
                <FiSearch size={18} />
              </button>
            </form>

            {/* Right side: Mobile Search, User, Cart */}
            <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 shrink-0">
              {/* Mobile Search Toggle */}
              <button
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="lg:hidden p-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              >
                <FiSearch size={22} />
              </button>

              {/* User Menu / Login */}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen((prev) => !prev)}
                    className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white flex items-center justify-center font-bold text-sm overflow-hidden shadow-lg group-hover:shadow-violet-500/30 transition-shadow">
                      {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt="avatar" className="h-full w-full object-cover" />
                      ) : (
                        (profile?.full_name?.[0] || user.email?.[0] || 'U').toUpperCase()
                      )}
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-[10px] uppercase font-bold tracking-widest text-violet-400 leading-none mb-0.5">Welcome</p>
                      <p className="text-sm font-bold text-white truncate max-w-[100px]">
                        {profile?.full_name?.split(' ')[0] || user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'User'}
                      </p>
                    </div>
                  </button>

                  {/* User Dropdown */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-[#1e1c3a] backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-fadeInUp">
                      <div className="p-2">
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                        >
                          <FiUser size={18} className="text-violet-400" /> My Profile
                        </Link>
                        <Link
                          to="/orders"
                          className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                        >
                          <FiPackage size={18} className="text-violet-400" /> My Orders
                        </Link>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-amber-400 hover:text-amber-300 hover:bg-amber-400/10 rounded-xl transition-colors"
                          >
                            <MdDashboard size={18} /> Admin Dashboard
                          </Link>
                        )}
                        <div className="border-t border-white/10 my-1 mx-2" />
                        <button
                          onClick={signOut}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl transition-colors"
                        >
                          <FiLogOut size={18} /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:flex items-center gap-2 text-gray-300 hover:text-white px-4 py-2.5 font-bold text-sm rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                >
                  <FiUser size={18} className="text-violet-400" />
                  Sign In
                </Link>
              )}

              {/* Cart Link */}
              <Link
                to="/cart"
                className="relative flex items-center gap-2.5 p-2 sm:px-4 sm:py-2.5 hover:bg-white/5 rounded-xl transition-colors group border border-transparent hover:border-white/10"
              >
                <div className="relative">
                  <FiShoppingCart size={22} className="text-gray-300 group-hover:text-violet-400 transition-colors" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-[20px] h-[20px] bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1.5 shadow-lg shadow-violet-500/50 border border-[#151230]">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </div>
                <div className="hidden sm:block text-left ml-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-violet-400 block leading-none mb-0.5">Cart</span>
                  <span className="text-sm font-bold text-white leading-none block">{cartCount} Items</span>
                </div>
              </Link>

              {/* Unread Message Notification */}
              {hasNewMsgs && (
                <Link
                  to={latestMessageOrder ? `/orders?id=${latestMessageOrder.id}&tab=chat` : `/profile?tab=support`}
                  className="relative flex items-center gap-2.5 p-2 sm:px-4 sm:py-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl transition-all hover:bg-amber-500 hover:text-white group animate-pulse"
                  title="New message from Admin"
                >
                  <div className="relative">
                    <FiMessageSquare size={22} className="text-amber-400 group-hover:text-white transition-colors" />
                    <span className="absolute -top-1.5 -right-2 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-[#151230]" />
                  </div>
                  <div className="hidden md:block text-left ml-1">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500 group-hover:text-amber-100 block leading-none mb-0.5 animate-bounce">New Msg</span>
                    <span className="text-sm font-bold leading-none block">Support</span>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Category Navigation */}
        <div className="hidden lg:block border-t border-white/5 bg-[#1e1c3a]/50 backdrop-blur-md">
          <div className="max-w-[1280px] mx-auto px-8 flex items-center h-12 gap-10">
            <div className="flex items-center gap-8 border-r border-white/10 pr-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-bold uppercase tracking-wider transition-all hover:-translate-y-0.5 ${
                    isActivePath(link.path)
                      ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]'
                      : 'text-gray-400 hover:text-violet-400'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-8">
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  to={cat.path}
                  className={`text-sm font-bold uppercase tracking-wider transition-all hover:-translate-y-0.5 ${
                    cat.highlight
                      ? 'text-amber-400 hover:text-amber-300 flex items-center gap-1.5 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]'
                      : 'text-gray-400 hover:text-fuchsia-400'
                  }`}
                >
                  {cat.highlight && <span className="text-lg">🔥</span>}
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Search Expandable */}
        {mobileSearchOpen && (
          <div className="lg:hidden border-t border-white/10 bg-[#1e1c3a] p-4 shadow-2xl animate-fadeInUp">
            <form onSubmit={handleSearch} className="flex group/mobsearch">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 bg-black/40 border border-white/10 rounded-l-xl py-3 px-5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all z-10"
                autoFocus
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white px-6 rounded-r-xl font-bold shadow-lg shadow-violet-500/25 transition-all"
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
          className="fixed inset-0 bg-[#151230]/80 z-[60] lg:hidden backdrop-blur-md transition-opacity"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 w-[300px] bg-[#1a1738] z-[70] transform transition-transform duration-300 lg:hidden shadow-[10px_0_30px_rgba(0,0,0,0.5)] flex flex-col border-r border-white/5 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <span className="font-black text-2xl tracking-wider text-white font-[var(--font-family-heading)]">
            MAKE<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">TOBE</span>
          </span>
          <button
            onClick={() => setMenuOpen(false)}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 custom-scrollbar">
          <div className="px-5 mb-8">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 px-1">
              Navigation
            </p>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center justify-between px-5 py-3.5 rounded-xl text-sm font-bold transition-all mb-1.5 ${
                  isActivePath(link.path)
                    ? 'bg-violet-600/20 text-white border border-violet-500/30 shadow-lg shadow-violet-500/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {link.name}
                <FiChevronRight
                  size={16}
                  className={isActivePath(link.path) ? 'text-violet-400' : 'text-gray-600'}
                />
              </Link>
            ))}
          </div>

          <div className="px-5">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 px-1">
              Categories
            </p>
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={cat.path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center px-5 py-3.5 rounded-xl text-sm font-bold transition-all mb-1.5 border border-transparent ${
                  cat.highlight
                    ? 'text-amber-400 hover:bg-amber-400/10 hover:border-amber-400/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/10'
                }`}
              >
                {cat.highlight && <span className="mr-3 text-lg drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]">🔥</span>}
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Auth Footer */}
        <div className="p-5 border-t border-white/5 bg-black/20 backdrop-blur-md">
          {!user ? (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-violet-500/25"
            >
              <FiUser size={20} /> Sign In
            </Link>
          ) : (
            <div className="space-y-2">
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3.5 px-5 py-3.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 font-bold transition-colors border border-transparent hover:border-white/10"
              >
                <FiUser size={18} className="text-violet-400" /> My Account
              </Link>
              <Link
                to="/orders"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3.5 px-5 py-3.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 font-bold transition-colors border border-transparent hover:border-white/10"
              >
                <FiPackage size={18} className="text-violet-400" /> My Orders
              </Link>
              <button
                onClick={() => { signOut(); setMenuOpen(false) }}
                className="flex items-center gap-3.5 px-5 py-3.5 w-full rounded-xl text-red-400 hover:text-red-300 hover:bg-red-400/10 font-bold transition-colors border border-transparent hover:border-red-500/10"
              >
                <FiLogOut size={18} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}