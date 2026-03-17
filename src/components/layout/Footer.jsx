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
    <footer className="bg-[#0f111a] text-gray-300 border-t border-white/5">
      <div className="max-w-[1280px] mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* ── Brand Section ── */}
          <div className="space-y-4">
            <Link to="/" className="inline-block group">
              <span className="text-xl font-black text-white tracking-tighter">
                MAKE TO BE<span className="text-violet-500">.</span>
              </span>
            </Link>
            <p className="text-[13px] leading-relaxed text-gray-400 max-w-xs">
              Premium lifestyle store. Quality products delivered island-wide across Sri Lanka.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {socials.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-violet-600 hover:text-white flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div className="lg:pl-8">
            <h3 className="text-white font-bold mb-4 uppercase tracking-[0.2em] text-[10px]">Links</h3>
            <ul className="space-y-2">
              {quickLinks.map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-gray-400 hover:text-violet-400 transition-colors text-xs font-medium">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Categories ── */}
          <div>
            <h3 className="text-white font-bold mb-4 uppercase tracking-[0.2em] text-[10px]">Shop</h3>
            <ul className="space-y-2">
              {categories.map(c => (
                <li key={c.to}>
                  <Link to={c.to} className="text-gray-400 hover:text-violet-400 transition-colors text-xs font-medium">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact Info & Payment ── */}
          <div className="space-y-4">
            <h3 className="text-white font-bold mb-2 uppercase tracking-[0.2em] text-[10px]">Contact</h3>
            <div className="space-y-2.5">
              <a href={`tel:${shopInfo.phone}`} className="flex items-center gap-2.5 text-xs text-gray-400 hover:text-white transition-colors group">
                <FiPhone size={14} className="text-violet-400" />
                {shopInfo.phone}
              </a>
              <a href={`mailto:${shopInfo.email}`} className="flex items-center gap-2.5 text-xs text-gray-400 hover:text-white transition-colors group">
                <FaEnvelope size={13} className="text-violet-400" />
                <span className="break-all">{shopInfo.email}</span>
              </a>
            </div>

            {/* Compact Bank Card */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 relative overflow-hidden">
              <p className="text-[9px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Bank Info</p>
              <div className="flex items-center justify-between gap-2">
                <div>
                   <p className="text-[11px] text-gray-200 font-bold">{shopInfo.bankDetails.bankName}</p>
                   <p className="text-[10px] text-gray-500 font-mono">{shopInfo.bankDetails.accountNumber}</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <FiMapPin size={12} className="text-violet-400" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Copyright Bar ── */}
      <div className="border-t border-white/5 bg-black/40">
        <div className="max-w-[1280px] mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-gray-500 font-medium">
            © {year} MAKE TO BE. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium tracking-wide">
            Made with <FaHeart size={10} className="text-red-500/80 animate-pulse" /> in Sri Lanka
          </p>
        </div>
      </div>
    </footer>
  )
}