import { Link } from 'react-router-dom'
import { FaWhatsapp, FaEnvelope, FaHeart } from 'react-icons/fa'
import { FiInstagram, FiFacebook, FiPhone } from 'react-icons/fi'
import { shopInfo } from '../../data/demoData'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { label: 'Home', to: '/' },
    { label: 'Products', to: '/products' },
    { label: 'About Us', to: '/about' },
    { label: 'Contact', to: '/contact' },
    { label: 'My Orders', to: '/orders' },
  ]

  const categories = [
    { label: 'Watches', to: '/products?category=watches' },
    { label: 'Dresses', to: '/products?category=dresses' },
    { label: 'Shoes', to: '/products?category=shoes' },
    { label: 'Accessories', to: '/products?category=accessories' },
    { label: 'Hot Deals 🔥', to: '/products?discount=true' },
  ]

  return (
    <footer className="bg-[#5b21b6] text-white mt-10">

      {/* ── Main Content ── */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">

          {/* Brand — full width on mobile */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block mb-3">
              <span className="text-2xl font-black tracking-tight leading-none">Make To Be</span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-4 max-w-[220px]">
              Premium lifestyle store. Quality products delivered to your door across Sri Lanka.
            </p>
            {/* Social Row */}
            <div className="flex items-center gap-2">
              {[
                { href: shopInfo.socialMedia.whatsapp, icon: <FaWhatsapp size={16} />, label: 'WhatsApp' },
                { href: `mailto:${shopInfo.email}`, icon: <FaEnvelope size={15} />, label: 'Email' },
                { href: shopInfo.socialMedia.instagram, icon: <FiInstagram size={16} />, label: 'Instagram' },
                { href: shopInfo.socialMedia.facebook, icon: <FiFacebook size={16} />, label: 'Facebook' },
              ].map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/25 flex items-center justify-center transition-all hover:scale-105"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-white/75 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-4">Categories</h4>
            <ul className="space-y-2.5">
              {categories.map(cat => (
                <li key={cat.to}>
                  <Link to={cat.to} className="text-sm text-white/75 hover:text-white transition-colors">
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Payment */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-4">Contact & Payment</h4>
            <div className="space-y-2.5 text-sm">
              <a href={`mailto:${shopInfo.email}`} className="flex items-center gap-2 text-white/75 hover:text-white transition-colors">
                <FaEnvelope size={13} className="shrink-0" />
                <span className="break-all">{shopInfo.email}</span>
              </a>
              <a href={`tel:${shopInfo.phone}`} className="flex items-center gap-2 text-white/75 hover:text-white transition-colors">
                <FiPhone size={13} className="shrink-0" />
                {shopInfo.phone}
              </a>
            </div>

            {/* Bank info */}
            <div className="mt-5 p-3 rounded-xl bg-white/10 border border-white/10">
              <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Bank Payment</p>
              <p className="text-xs text-white/70 mb-0.5">{shopInfo.bankDetails.bankName}</p>
              <p className="text-xs text-white/70 mb-1">{shopInfo.bankDetails.accountName}</p>
              <p className="font-mono font-bold text-amber-300 text-sm tracking-wider">{shopInfo.bankDetails.accountNumber}</p>
            </div>
          </div>

        </div>
      </div>

      {/* ── Copyright Bar ── */}
      <div className="border-t border-white/10 bg-[#4c1d95] py-4 px-4 sm:px-6">
        <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <p>© {currentYear} Make To Be · All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <FaHeart size={9} className="text-pink-400 mx-0.5" /> in Sri Lanka
          </p>
        </div>
      </div>

    </footer>
  )
}
