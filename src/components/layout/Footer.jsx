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
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* ── Brand Section ── */}
          <div className="space-y-6 lg:pr-4">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-extrabold text-white tracking-tight">
                Make To Be<span className="text-violet-500">.</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400 max-w-xs">
              Premium lifestyle store. Quality products delivered to your door across Sri Lanka.
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
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-violet-600 hover:text-white flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-500/30"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-gray-400 hover:text-violet-400 hover:translate-x-1 inline-block transition-all duration-200 text-sm">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Categories ── */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Shop Categories</h3>
            <ul className="space-y-3">
              {categories.map(c => (
                <li key={c.to}>
                  <Link to={c.to} className="text-gray-400 hover:text-violet-400 hover:translate-x-1 inline-block transition-all duration-200 text-sm">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact Info & Payment ── */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Get In Touch</h3>
            <div className="space-y-4 mb-8">
              <a href={`mailto:${shopInfo.email}`} className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors group">
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center shrink-0 group-hover:bg-violet-600/20">
                  <FaEnvelope size={14} className="text-violet-400 group-hover:text-violet-300" />
                </div>
                <span className="break-all">{shopInfo.email}</span>
              </a>
              <a href={`tel:${shopInfo.phone}`} className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors group">
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center shrink-0 group-hover:bg-violet-600/20">
                  <FiPhone size={14} className="text-violet-400 group-hover:text-violet-300" />
                </div>
                {shopInfo.phone}
              </a>
              <div className="flex items-start gap-3 text-sm text-gray-400 group">
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-violet-600/20">
                  <FiMapPin size={14} className="text-violet-400 group-hover:text-violet-300" />
                </div>
                <span className="pt-1">{shopInfo.address}</span>
              </div>
            </div>

            {/* Bank Info Card */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-gray-800 to-gray-800/50 border border-gray-700/50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-violet-500/10 rounded-full blur-2xl group-hover:bg-violet-500/20 transition-all"></div>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">Bank Payment Details</p>
              <p className="text-sm text-gray-200 font-medium">{shopInfo.bankDetails.bankName}</p>
              <p className="text-xs text-gray-400 mb-3">{shopInfo.bankDetails.accountName}</p>
              <div className="bg-gray-900/80 px-3 py-2 rounded-lg inline-block border border-gray-700">
                <p className="font-mono font-bold text-violet-400 text-sm tracking-widest">
                  {shopInfo.bankDetails.accountNumber}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Copyright Bar ── */}
      <div className="border-t border-gray-800 bg-black/30">
        <div className="max-w-[1280px] mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-gray-500">
            © {year} Make To Be. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500">
            Made with <FaHeart size={12} className="text-red-500 animate-pulse" /> in Sri Lanka
          </p>
        </div>
      </div>
    </footer>
  )
}