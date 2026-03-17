import { Link } from 'react-router-dom'
import { FaWhatsapp, FaEnvelope, FaHeart } from 'react-icons/fa'
import { FiInstagram, FiFacebook, FiPhone, FiMapPin } from 'react-icons/fi'
import { shopInfo } from '../../data/demoData'

export default function Footer() {
  const year = new Date().getFullYear()

  const quickLinks = [
    { label: 'Home',      to: '/' },
    { label: 'Products',  to: '/products' },
    { label: 'About Us',  to: '/about' },
    { label: 'Contact',   to: '/contact' },
    { label: 'My Orders', to: '/orders' },
  ]

  const categories = [
    { label: 'Watches',      to: '/products?category=watches' },
    { label: 'Dresses',      to: '/products?category=dresses' },
    { label: 'Shoes',        to: '/products?category=shoes' },
    { label: 'Accessories',  to: '/products?category=accessories' },
    { label: '🔥 Hot Deals', to: '/products?discount=true' },
  ]

  const socials = [
    { href: shopInfo.socialMedia.whatsapp,  icon: <FaWhatsapp size={18} />,  label: 'WhatsApp' },
    { href: `mailto:${shopInfo.email}`,     icon: <FaEnvelope size={18} />,  label: 'Email' },
    { href: shopInfo.socialMedia.instagram, icon: <FiInstagram size={18} />, label: 'Instagram' },
    { href: shopInfo.socialMedia.facebook,  icon: <FiFacebook size={18} />,  label: 'Facebook' },
  ]

  return (
    <footer className="bg-[var(--color-primary)] text-gray-300 border-t border-white/5">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16">
          
          {/* ── Brand Section ── */}
          <div className="space-y-6">
            <Link to="/" className="inline-block group">
              <span className="text-2xl font-black text-white tracking-tighter uppercase italic">
                MAKE <span className="text-[var(--color-accent-light)]">TO BE</span>
              </span>
            </Link>
            <p className="text-xs uppercase font-black tracking-widest leading-relaxed text-[var(--color-text-muted)] opacity-60">
              Premium pieces curated for the modern individual. Experience luxury delivered island-wide.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              {socials.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white hover:text-[var(--color-surface)] flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div className="lg:pl-8">
            <h3 className="text-white font-black mb-6 uppercase tracking-widest text-[10px]">Portal</h3>
            <ul className="space-y-4">
              {quickLinks.map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-[var(--color-text-muted)] hover:text-white transition-colors text-[10px] uppercase font-black tracking-widest opacity-60 hover:opacity-100">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Categories ── */}
          <div>
            <h3 className="text-white font-black mb-6 uppercase tracking-widest text-[10px]">Collections</h3>
            <ul className="space-y-4">
              {categories.map(c => (
                <li key={c.to}>
                  <Link to={c.to} className="text-[var(--color-text-muted)] hover:text-white transition-colors text-[10px] uppercase font-black tracking-widest opacity-60 hover:opacity-100">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact Info & Payment ── */}
          <div className="space-y-6">
            <h3 className="text-white font-black mb-2 uppercase tracking-widest text-[10px]">Direct</h3>
            <div className="space-y-4">
              <a href={`tel:${shopInfo.phone}`} className="flex items-center gap-3 text-[10px] text-[var(--color-text-muted)] hover:text-white transition-colors font-black uppercase tracking-widest">
                <FiPhone size={14} className="text-[var(--color-accent-light)]" />
                {shopInfo.phone}
              </a>
              <a href={`mailto:${shopInfo.email}`} className="flex items-center gap-3 text-[10px] text-[var(--color-text-muted)] hover:text-white transition-colors font-black uppercase tracking-widest">
                <FaEnvelope size={13} className="text-[var(--color-accent-light)]" />
                <span className="break-all">{shopInfo.email}</span>
              </a>
            </div>

            {/* Compact Bank Card */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 relative overflow-hidden">
              <p className="text-[8px] uppercase tracking-[0.2em] text-gray-500 mb-2.5 font-black">Bank Credentials</p>
              <div className="flex items-center justify-between gap-2">
                <div>
                   <p className="text-xs text-white font-black uppercase tracking-tight">{shopInfo.bankDetails.bankName}</p>
                   <p className="text-[10px] text-[var(--color-text-muted)] font-mono font-bold mt-1 tracking-wider">{shopInfo.bankDetails.accountNumber}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Copyright Bar ── */}
      <div className="border-t border-white/5 bg-black/20">
        <div className="container-custom py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[9px] uppercase font-black tracking-[0.2em] text-gray-500">
            © {year} MAKE TO BE. Crafting Luxury.
          </p>
          <p className="flex items-center gap-2 text-[9px] uppercase font-black tracking-[0.2em] text-gray-500">
            Design <FaHeart size={10} className="text-rose-500 animate-pulse" /> Sri Lanka
          </p>
        </div>
      </div>
    </footer>
  )
}