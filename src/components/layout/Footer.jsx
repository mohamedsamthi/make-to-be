import { Link } from 'react-router-dom'
import { FaWhatsapp, FaEnvelope, FaHeart } from 'react-icons/fa'
import { FiInstagram, FiFacebook, FiArrowUpRight, FiPhone, FiMapPin } from 'react-icons/fi'
import { shopInfo } from '../../data/demoData'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#5b21b6] text-white overflow-hidden mt-10">
      {/* Main Footer */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <h3 className="text-3xl sm:text-4xl font-black leading-none tracking-tighter">
                Make<br />To Be<span className="text-[18px] font-normal align-super ml-1 opacity-70">®</span>
              </h3>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed max-w-[200px]">
              Premium lifestyle store. Quality products delivered to your door.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3 mt-6">
              <a href={shopInfo.socialMedia.whatsapp} target="_blank" rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all hover:scale-105">
                <FaWhatsapp size={18} />
              </a>
              <a href={`mailto:${shopInfo.email}`}
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all hover:scale-105">
                <FaEnvelope size={18} />
              </a>
              <a href={shopInfo.socialMedia.instagram} target="_blank" rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all hover:scale-105">
                <FiInstagram size={18} />
              </a>
              <a href={shopInfo.socialMedia.facebook} target="_blank" rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all hover:scale-105">
                <FiFacebook size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: 'Home', to: '/' },
                { label: 'Products', to: '/products' },
                { label: 'About Us', to: '/about' },
                { label: 'Contact', to: '/contact' },
                { label: 'My Orders', to: '/orders' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-white/80 hover:text-white transition-colors hover:translate-x-1 inline-block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-5">Contact</h4>
            <div className="space-y-3">
              <a href={`mailto:${shopInfo.email}`} className="flex items-start gap-2 text-sm text-white/80 hover:text-white transition-colors">
                <FaEnvelope size={14} className="mt-0.5 shrink-0" />
                <span className="break-all">{shopInfo.email}</span>
              </a>
              <a href={`tel:${shopInfo.phone}`} className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors">
                <FiPhone size={14} className="shrink-0" />
                {shopInfo.phone}
              </a>
              <div className="flex items-start gap-2 text-sm text-white/70 leading-relaxed">
                <FiMapPin size={14} className="mt-0.5 shrink-0" />
                <span>{shopInfo.address}</span>
              </div>
              <a href={shopInfo.location.mapUrl} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors underline underline-offset-4 decoration-white/30">
                See on Map <FiArrowUpRight size={11} />
              </a>
            </div>
          </div>

          {/* Bank Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-5">Payment</h4>
            <div className="space-y-2.5 text-sm">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Bank</p>
                <p className="text-white/90 font-medium">{shopInfo.bankDetails.bankName}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Account Name</p>
                <p className="text-white/90 font-medium">{shopInfo.bankDetails.accountName}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Account Number</p>
                <p className="font-mono font-bold text-amber-300 tracking-wider text-base">{shopInfo.bankDetails.accountNumber}</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-white/10 bg-[#4c1d95]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>© {currentYear} Make To Be. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Built with <FaHeart size={10} className="text-pink-400" /> in Sri Lanka
          </p>
        </div>
      </div>
    </footer>
  )
}
