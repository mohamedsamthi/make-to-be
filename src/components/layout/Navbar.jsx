import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  FiShoppingCart,
  FiSearch,
  FiUser,
  FiMenu,
  FiX,
  FiLogOut,
  FiPackage,
  FiPlay,
  FiHeart,
  FiSun,
  FiMoon,
  FiHome,
  FiShoppingBag,
  FiInfo,
  FiFileText,
  FiMail,
  FiWatch,
  FiMessageSquare,
} from 'react-icons/fi'
import { MdDashboard, MdCheckroom, MdLayers, MdLocalOffer } from 'react-icons/md'
import { FaShoePrints } from 'react-icons/fa'
import { announcementPromoSubtitle } from '../../utils/promoDescription'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useProducts } from '../../context/ProductContext'
import { useTheme } from '../../context/ThemeContext'
import { useLanguage } from '../../context/LanguageContext'
import LanguageSwitcher from '../common/LanguageSwitcher'
import NavbarSearch from './NavbarSearch'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  const { user, isAdmin, signOut, profile } = useAuth()
  const { cartCount } = useCart()
  const { theme, toggleTheme } = useTheme()
  const { t } = useLanguage()
  const { promotions, promotionalVideos, favorites } = useProducts()

  const activePromo = promotions?.find(p => p.active)
  const { orders, messages } = useProducts()
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

  const afterSearchSubmit = useCallback(() => {
    setMobileSearchOpen(false)
    setMenuOpen(false)
  }, [])

  const navLinks = useMemo(
    () => [
      { name: t('nav.home'), path: '/', Icon: FiHome },
      { name: t('nav.products'), path: '/products', Icon: FiShoppingBag },
      { name: t('nav.promoVideo'), path: '/promo-video', Icon: FiPlay, promoDot: true },
      { name: t('nav.about'), path: '/about', Icon: FiInfo },
      { name: t('nav.forms'), path: '/forms', Icon: FiFileText },
      { name: t('nav.contact'), path: '/contact', Icon: FiMail },
    ],
    [t]
  )

  const categories = useMemo(
    () => [
      { name: t('categories.watches'), path: '/products?category=watches', Icon: FiWatch },
      { name: t('categories.dresses'), path: '/products?category=dresses', Icon: MdCheckroom },
      { name: t('categories.shoes'), path: '/products?category=shoes', Icon: FaShoePrints },
      { name: t('categories.accessories'), path: '/products?category=accessories', Icon: MdLayers },
      { name: t('categories.sales'), path: '/products?discount=true', highlight: true, Icon: MdLocalOffer },
    ],
    [t]
  )

  const isActiveRoute = (path) => {
    if (!path.includes('?')) {
      if (path === '/') return location.pathname === '/'
      return location.pathname === path
    }
    const [pathname, qs] = path.split('?')
    if (location.pathname !== pathname) return false
    const want = new URLSearchParams(qs)
    const have = new URLSearchParams(location.search)
    for (const [k, v] of want.entries()) {
      if (have.get(k) !== v) return false
    }
    return true
  }

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="fixed top-0 left-0 right-0 h-10 bg-[var(--color-surface-light)] text-[var(--color-text-primary)] text-[10px] sm:text-xs py-2 text-center font-black tracking-widest uppercase z-[60] border-b border-[var(--color-border)] flex items-center justify-center">
        {activePromo ? (
          <div className="flex max-w-[100vw] items-center justify-center gap-2 px-3">
            <span className="truncate">{activePromo.title}</span>
            <span className="hidden w-1 h-1 shrink-0 rounded-full bg-[var(--color-accent)] opacity-40 sm:block" />
            <span className="truncate text-[var(--color-text-muted)]">
              {announcementPromoSubtitle(activePromo.description, t('announcement.ownerName'))}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span>{t('announcement.islandWide')}</span>
            <span className="w-1 h-1 rounded-full bg-[var(--color-accent)] opacity-40" />
            <span className="text-[var(--color-text-muted)]">{t('announcement.freeShip')}</span>
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
        <div className="container-custom overflow-visible">
          <div className="flex min-w-0 items-center justify-between gap-3 overflow-visible h-16 sm:h-20 sm:gap-4 lg:gap-8">
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

            {/* Desktop Search — isolated component for smoother typing */}
            <div className="hidden min-w-0 flex-1 justify-center px-2 lg:flex">
              <NavbarSearch variant="desktop" resetToken={location.pathname} />
            </div>

            {/* Right side: Mobile Search, User, Cart */}
            <div className="flex min-w-0 shrink-0 items-center gap-1 overflow-visible sm:gap-2 lg:gap-3">
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
                    type="button"
                    onClick={() => setUserMenuOpen((prev) => !prev)}
                    title={profile?.full_name || user?.email || t('userMenu.account')}
                    aria-label={t('userMenu.account')}
                    className="flex items-center rounded-xl border border-transparent p-1.5 transition-all hover:border-[var(--color-border)] hover:bg-[var(--color-surface-light)] group"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-primary-light)] text-xs font-black text-[var(--color-text-primary)] shadow-sm">
                      {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        (profile?.full_name?.[0] || user.email?.[0] || 'U').toUpperCase()
                      )}
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
                          <FiUser size={16} /> {t('userMenu.myProfile')}
                        </Link>
                        <Link
                          to="/orders"
                          className="flex items-center gap-3 px-4 py-3 text-[10px] uppercase tracking-widest font-black text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-accent)]/10 rounded-xl transition-colors"
                        >
                          <FiPackage size={16} /> {t('userMenu.myOrders')}
                        </Link>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-3 px-4 py-3 text-[10px] uppercase tracking-widest font-black text-amber-500 hover:text-amber-400 hover:bg-amber-500/5 rounded-xl transition-colors"
                          >
                            <MdDashboard size={16} /> {t('userMenu.adminPanel')}
                          </Link>
                        )}
                        <div className="border-t border-[var(--color-border)] my-1 mx-2" />
                        <button
                          onClick={signOut}
                          className="w-full flex items-center gap-3 px-4 py-3 text-[10px] uppercase tracking-widest font-black text-red-500 hover:bg-red-500/5 rounded-xl transition-colors"
                        >
                          <FiLogOut size={16} /> {t('userMenu.endSession')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  title={t('userMenu.signIn')}
                  aria-label={t('userMenu.signIn')}
                  className="hidden items-center justify-center rounded-xl p-2.5 text-[var(--color-text-muted)] transition-all hover:bg-[var(--color-surface-light)] hover:text-[var(--color-text-primary)] sm:flex"
                >
                  <FiUser size={20} />
                </Link>
              )}

              <div className="max-w-[min(11rem,calc(100vw-8rem))] min-w-0 sm:max-w-[12.5rem]">
                <LanguageSwitcher />
              </div>

              {/* Theme Toggle */}
              <button
                onClick={(e) => toggleTheme(e)}
                className="p-2.5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-light)] rounded-xl transition-all"
                title={theme === 'dark' ? t('userMenu.themeLight') : t('userMenu.themeDark')}
              >
                {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
              </button>

              {/* Wishlist Link */}
              <Link
                to="/wishlist"
                className="group relative flex items-center justify-center rounded-xl border border-transparent p-2.5 transition-all hover:border-[var(--color-border)] hover:bg-[var(--color-surface-light)]"
                title={t('userMenu.wishlistTitle')}
                aria-label={t('userMenu.wishlistTitle')}
              >
                <FiHeart
                  size={20}
                  className={`transition-colors ${favorites.length > 0 ? 'fill-rose-500 text-rose-500' : 'text-[var(--color-text-muted)] group-hover:text-rose-500'}`}
                />
                {favorites.length > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-[var(--color-surface)] bg-rose-600 px-1 text-[9px] font-black text-white shadow-lg">
                    {favorites.length}
                  </span>
                )}
              </Link>

              {/* Cart Link */}
              <Link
                to="/cart"
                title={`${t('userMenu.bag')} — ${t('userMenu.bagItems', { n: cartCount > 99 ? '99+' : cartCount })}`}
                aria-label={`${t('userMenu.bag')}, ${t('userMenu.bagItems', { n: cartCount > 99 ? '99+' : cartCount })}`}
                className="group relative flex items-center justify-center rounded-xl border border-transparent p-2.5 transition-all hover:border-[var(--color-border)] hover:bg-[var(--color-surface-light)]"
              >
                <FiShoppingCart size={20} className="text-[var(--color-text-muted)] transition-colors group-hover:text-[var(--color-text-primary)]" />
                {cartCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-[var(--color-surface)] bg-[var(--color-text-primary)] px-1 text-[9px] font-black text-[var(--color-primary)] shadow-sm">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>

              {/* Unread Message Notification */}
              {hasNewMsgs && (
                <Link
                  to={latestMessageOrder ? `/orders?id=${latestMessageOrder.id}&tab=chat` : `/profile?tab=support`}
                  title={`${t('userMenu.new')}: ${t('userMenu.alert')}`}
                  aria-label={`${t('userMenu.new')}: ${t('userMenu.alert')}`}
                  className="group relative flex animate-pulse items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10 p-2.5 transition-all"
                >
                  <FiMessageSquare size={20} className="text-rose-400 transition-colors group-hover:text-white" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Desktop nav — icons only (labels via title / aria-label) */}
        <div className="hidden border-t border-[var(--color-border)] bg-[var(--color-surface)] lg:block">
          <div className="container-custom flex h-11 items-center gap-4 sm:gap-6">
            <nav
              className="flex items-center gap-1 border-r border-[var(--color-border)] pr-4 sm:gap-2 sm:pr-6"
              aria-label={t('mobileMenu.navigation')}
            >
              {navLinks.map((link) => {
                const Icon = link.Icon
                const active = isActiveRoute(link.path)
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    title={link.name}
                    aria-label={link.name}
                    className={`relative flex items-center justify-center rounded-xl p-2.5 transition-all ${
                      active
                        ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)]'
                        : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-light)] hover:text-[var(--color-text-primary)]'
                    }`}
                  >
                    <Icon size={20} strokeWidth={2} aria-hidden />
                    {link.promoDot && promotionalVideos.length > 0 && (
                      <span
                        className="absolute right-1 top-1 h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-accent)]"
                        aria-hidden
                      />
                    )}
                  </Link>
                )
              })}
            </nav>

            <nav className="flex flex-1 flex-wrap items-center gap-1 sm:gap-2" aria-label={t('mobileMenu.collections')}>
              {categories.map((cat) => {
                const Icon = cat.Icon
                const active = isActiveRoute(cat.path)
                return (
                  <Link
                    key={cat.path}
                    to={cat.path}
                    title={cat.name}
                    aria-label={cat.name}
                    className={`relative flex items-center justify-center rounded-xl p-2.5 transition-all ${
                      cat.highlight
                        ? active
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'text-amber-500 hover:bg-amber-500/10 hover:text-amber-400'
                        : active
                          ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)]'
                          : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-light)] hover:text-[var(--color-text-primary)]'
                    }`}
                  >
                    <Icon size={20} className={cat.highlight ? '' : ''} aria-hidden />
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Mobile Search Expandable */}
        {mobileSearchOpen && (
          <div className="relative z-50 border-t border-[var(--color-border)] bg-[var(--color-surface-card)] p-3 shadow-xl sm:p-4 lg:hidden">
            <NavbarSearch
              variant="mobile"
              resetToken={location.pathname}
              onAfterSubmit={afterSearchSubmit}
            />
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

        <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">
          <h2 className="sr-only">{t('mobileMenu.navigation')}</h2>
          <div className="mb-8 grid grid-cols-4 gap-2">
            {navLinks.map((link) => {
              const Icon = link.Icon
              const active = isActiveRoute(link.path)
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  title={link.name}
                  aria-label={link.name}
                  onClick={() => setMenuOpen(false)}
                  className={`relative flex aspect-square items-center justify-center rounded-xl border border-[var(--color-border)] transition-all ${
                    active
                      ? 'border-[var(--color-accent)]/50 bg-[var(--color-accent)]/15 text-[var(--color-accent)]'
                      : 'bg-[var(--color-surface-light)] text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/30 hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  <Icon size={22} strokeWidth={2} aria-hidden />
                  {link.promoDot && promotionalVideos.length > 0 && (
                    <span
                      className="absolute right-1 top-1 h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-accent)]"
                      aria-hidden
                    />
                  )}
                  <span className="sr-only">{link.name}</span>
                </Link>
              )
            })}
          </div>

          <h2 className="sr-only">{t('mobileMenu.collections')}</h2>
          <div className="grid grid-cols-4 gap-2">
            {categories.map((cat) => {
              const Icon = cat.Icon
              const active = isActiveRoute(cat.path)
              return (
                <Link
                  key={cat.path}
                  to={cat.path}
                  title={cat.name}
                  aria-label={cat.name}
                  onClick={() => setMenuOpen(false)}
                  className={`relative flex aspect-square items-center justify-center rounded-xl border border-[var(--color-border)] transition-all ${
                    cat.highlight
                      ? active
                        ? 'border-amber-500/50 bg-amber-500/15 text-amber-400'
                        : 'bg-amber-500/5 text-amber-500 hover:bg-amber-500/15'
                      : active
                        ? 'border-[var(--color-accent)]/50 bg-[var(--color-accent)]/15 text-[var(--color-accent)]'
                        : 'bg-[var(--color-surface-light)] text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/30 hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  <Icon size={22} className={cat.highlight ? '' : ''} aria-hidden />
                  <span className="sr-only">{cat.name}</span>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Mobile Auth Footer */}
        <div className="space-y-4 border-t border-[var(--color-border)] bg-[var(--color-surface-light)] p-6">
          <div className="flex justify-center">
            <LanguageSwitcher
              menuPlacement="above"
              className="w-full max-w-xs justify-center"
            />
          </div>
          {!user ? (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              title={t('userMenu.signIn')}
              aria-label={t('userMenu.signIn')}
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-accent)] text-black transition-all hover:opacity-90 active:scale-95"
            >
              <FiUser size={22} aria-hidden />
            </Link>
          ) : (
            <div className="flex items-center justify-center gap-3">
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                title={t('mobileMenu.accountInfo')}
                aria-label={t('mobileMenu.accountInfo')}
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--color-border)] text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent)]/40 hover:text-[var(--color-text-primary)]"
              >
                <FiUser size={20} aria-hidden />
              </Link>
              <Link
                to="/orders"
                onClick={() => setMenuOpen(false)}
                title={t('userMenu.myOrders')}
                aria-label={t('userMenu.myOrders')}
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--color-border)] text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent)]/40 hover:text-[var(--color-text-primary)]"
              >
                <FiPackage size={20} aria-hidden />
              </Link>
              <button
                type="button"
                onClick={() => {
                  signOut()
                  setMenuOpen(false)
                }}
                title={t('mobileMenu.exitAccount')}
                aria-label={t('mobileMenu.exitAccount')}
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/30 text-red-500 transition-colors hover:bg-red-500/10"
              >
                <FiLogOut size={20} aria-hidden />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}