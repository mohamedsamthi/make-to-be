import { Link } from 'react-router-dom'
import { FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaPhone, FaHeart } from 'react-icons/fa'
import { FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi'
import { shopInfo } from '../../data/demoData'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[var(--color-primary)] border-t border-[var(--color-border)]">
      {/* Main Footer */}
      <div className="container-custom section-padding pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center font-bold text-lg">
                M
              </div>
              <div>
                <h3 className="text-lg font-bold font-[var(--font-family-heading)]">Make To Be</h3>
                <p className="text-[10px] text-[var(--color-text-muted)] tracking-wider uppercase">Premium Shop</p>
              </div>
            </Link>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">
              Your premium shopping destination for watches, dresses, and accessories. Quality you can trust, style you deserve.
            </p>
            <div className="flex gap-3">
              <a href={shopInfo.socialMedia.whatsapp} target="_blank" rel="noreferrer"
                className="w-9 h-9 rounded-xl glass-light flex items-center justify-center hover:bg-green-500/20 hover:text-green-400 transition-all">
                <FaWhatsapp size={18} />
              </a>
              <a href={shopInfo.socialMedia.email}
                className="w-9 h-9 rounded-xl glass-light flex items-center justify-center hover:bg-[var(--color-accent)]/20 hover:text-[var(--color-accent)] transition-all">
                <FaEnvelope size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-[var(--color-text-secondary)]">Quick Links</h4>
            <div className="flex flex-col gap-2.5">
              {[
                { name: 'Home', path: '/' },
                { name: 'All Products', path: '/products' },
                { name: 'Watches', path: '/products?category=watches' },
                { name: 'Dresses', path: '/products?category=dresses' },
                { name: 'Accessories', path: '/products?category=accessories' },
                { name: 'Contact Us', path: '/contact' }
              ].map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-[var(--color-text-secondary)]">Contact</h4>
            <div className="flex flex-col gap-3">
              <a href={`tel:${shopInfo.phone}`} className="flex items-start gap-3 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors">
                <FaPhone size={14} className="mt-1 shrink-0" />
                {shopInfo.phone}
              </a>
              <a href={shopInfo.socialMedia.whatsapp} target="_blank" rel="noreferrer"
                className="flex items-start gap-3 text-sm text-[var(--color-text-muted)] hover:text-green-400 transition-colors">
                <FaWhatsapp size={14} className="mt-1 shrink-0" />
                WhatsApp Us
              </a>
              <a href={shopInfo.socialMedia.email}
                className="flex items-start gap-3 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors">
                <FaEnvelope size={14} className="mt-1 shrink-0" />
                {shopInfo.email}
              </a>
              <div className="flex items-start gap-3 text-sm text-[var(--color-text-muted)]">
                <FaMapMarkerAlt size={14} className="mt-1 shrink-0" />
                {shopInfo.address}
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-[var(--color-text-secondary)]">Payment</h4>
            <div className="glass-light rounded-2xl p-4">
              <p className="text-xs text-[var(--color-text-muted)] mb-2">Bank Transfer Details:</p>
              <div className="space-y-1.5">
                <p className="text-sm"><span className="text-[var(--color-text-muted)]">Bank:</span> {shopInfo.bankDetails.bankName}</p>
                <p className="text-sm"><span className="text-[var(--color-text-muted)]">Name:</span> {shopInfo.bankDetails.accountName}</p>
                <p className="text-sm font-mono font-bold text-[var(--color-gold)]">{shopInfo.bankDetails.accountNumber}</p>
                <p className="text-sm"><span className="text-[var(--color-text-muted)]">Branch:</span> {shopInfo.bankDetails.branch}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[var(--color-border)]">
        <div className="container-custom py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[var(--color-text-muted)]">
            © {currentYear} Make To Be. All rights reserved.
          </p>
          <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-1">
            Made with <FaHeart className="text-[var(--color-accent)]" size={10} /> in Kalmunai, Sri Lanka
          </p>
        </div>
      </div>
    </footer>
  )
}
