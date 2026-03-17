import { Link } from 'react-router-dom'
import { FaWhatsapp, FaEnvelope, FaHeart } from 'react-icons/fa'
import { FiInstagram, FiFacebook } from 'react-icons/fi'
import { shopInfo } from '../../data/demoData'

export default function Footer() {
  const year = new Date().getFullYear()

  const quickLinks = [
    { label: 'Shop All',      to: '/products' },
    { label: 'Hot Deals',     to: '/products?discount=true' },
    { label: 'My Orders',     to: '/orders' },
    { label: 'About Us',      to: '/about' },
    { label: 'Contact',       to: '/contact' },
  ]

  const categories = [
    { label: 'Watches',      to: '/products?category=watches' },
    { label: 'Dresses',      to: '/products?category=dresses' },
    { label: 'Shoes',        to: '/products?category=shoes' },
    { label: 'Accessories',  to: '/products?category=accessories' },
  ]

  const socials = [
    { href: shopInfo.socialMedia.whatsapp,  icon: <FaWhatsapp size={20} />,  label: 'WhatsApp' },
    { href: shopInfo.socialMedia.instagram, icon: <FiInstagram size={20} />, label: 'Instagram' },
    { href: shopInfo.socialMedia.facebook,  icon: <FiFacebook size={20} />,  label: 'Facebook' },
    { href: `mailto:${shopInfo.email}`,     icon: <FaEnvelope size={20} />,  label: 'Email' },
  ]

  return (
    <footer className="bg-[var(--color-surface)] border-t border-[var(--color-border)]">
      <div className="container-custom pt-16 pb-12 lg:pt-24 lg:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* ── Brand Section (4 columns on LG) ── */}
          <div className="lg:col-span-4 flex flex-col items-start pr-0 lg:pr-10">
            <Link to="/" className="inline-block group mb-6">
              <span className="text-3xl font-black text-[var(--color-text-primary)] tracking-tight uppercase font-[var(--font-family-heading)]">
                MAKE <span className="text-[var(--color-accent)]">TO BE</span>
              </span>
            </Link>
            <p className="text-[11px] font-bold uppercase tracking-widest leading-relaxed text-[var(--color-text-muted)] mb-8 max-w-sm">
              Premium pieces curated for the modern individual. Experience luxury delivered island-wide. Our commitment is unmatched quality.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3">
              {socials.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="w-12 h-12 rounded-xl bg-[var(--color-surface-light)] hover:bg-[var(--color-accent)] border border-[var(--color-border)] hover:border-transparent text-[var(--color-text-primary)] hover:text-black flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Portal Links (3 columns on LG) ── */}
          <div className="lg:col-span-3 lg:pl-10">
            <h3 className="text-[var(--color-text-primary)] font-black mb-8 uppercase tracking-[0.2em] text-xs">Navigation</h3>
            <ul className="space-y-5">
              {quickLinks.map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="group flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors text-[10px] uppercase font-black tracking-widest">
                    <span className="w-1 h-1 rounded-full bg-[var(--color-text-muted)] group-hover:bg-[var(--color-accent)] opacity-50 group-hover:opacity-100 transition-colors" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Collections (3 columns on LG) ── */}
          <div className="lg:col-span-3">
            <h3 className="text-[var(--color-text-primary)] font-black mb-8 uppercase tracking-[0.2em] text-xs">Collections</h3>
            <ul className="space-y-5">
              {categories.map(c => (
                <li key={c.to}>
                  <Link to={c.to} className="group flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors text-[10px] uppercase font-black tracking-widest">
                    <span className="w-1 h-1 rounded-full bg-[var(--color-text-muted)] group-hover:bg-[var(--color-accent)] opacity-50 group-hover:opacity-100 transition-colors" />
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Direct Contact & Payment (2 columns on LG) ── */}
          <div className="lg:col-span-2">
            <h3 className="text-[var(--color-text-primary)] font-black mb-8 uppercase tracking-[0.2em] text-xs">Support</h3>
            <div className="space-y-5 mb-8">
              <a href={`tel:${shopInfo.phone}`} className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
                <span className="block text-[8px] text-[var(--color-accent)] mb-1">Call Us</span>
                {shopInfo.phone}
              </a>
              <a href={`mailto:${shopInfo.email}`} className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors break-words">
                <span className="block text-[8px] text-[var(--color-accent)] mb-1">Email Us</span>
                {shopInfo.email}
              </a>
            </div>

            {/* Bank Card (Extremely minimal) */}
            <div className="pt-4 border-t border-[var(--color-border)]">
              <p className="text-[8px] uppercase tracking-[0.2em] text-[var(--color-accent)] mb-3 font-black">Bank Payment</p>
              <p className="text-[10px] text-[var(--color-text-primary)] font-black uppercase tracking-tight">{shopInfo.bankDetails.bankName}</p>
              <p className="text-[11px] text-[var(--color-text-muted)] font-mono font-bold mt-1 tracking-widest">{shopInfo.bankDetails.accountNumber}</p>
            </div>
          </div>

        </div>
      </div>

      {/* ── Copyright Bar ── */}
      <div className="border-t border-[var(--color-border)] bg-[var(--color-surface-light)]">
        <div className="container-custom py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[9px] uppercase font-black tracking-[0.2em] text-[var(--color-text-muted)]">
            © {year} MAKE TO BE. Crafting Luxury.
          </p>
          <p className="flex items-center gap-2 text-[9px] uppercase font-black tracking-[0.2em] text-[var(--color-text-muted)]">
            Design <FaHeart size={10} className="text-[var(--color-accent)] animate-pulse" /> Sri Lanka
          </p>
        </div>
      </div>
    </footer>
  )
}