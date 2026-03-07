import { Link } from 'react-router-dom'
import { FaWhatsapp, FaEnvelope, FaHeart } from 'react-icons/fa'
import { FiInstagram, FiFacebook, FiArrowRight, FiArrowUpRight } from 'react-icons/fi'
import { shopInfo } from '../../data/demoData'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#111111] text-white overflow-hidden mt-10">
      {/* Top Banner Section (White background) */}
      <div className="bg-white text-black py-16 sm:py-24 relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          
          <div className="flex items-center gap-6">
            <Link to="/contact" className="hidden md:flex text-xs font-bold uppercase tracking-[0.2em] text-black/60 hover:text-black flex-col items-start leading-tight transition-colors">
              <span>Heard</span>
              <span>Enough? <FiArrowRight className="inline ml-1 mb-0.5" /></span>
            </Link>
          </div>

          <div className="text-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg">
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-medium tracking-tighter" style={{ fontFamily: 'var(--font-family-heading)' }}>
              Contact us
            </h2>
            <div className="h-1 lg:h-1.5 w-[50%] xs:w-[70%] sm:w-[90%] bg-[#ccff00] mt-1 sm:mt-2 mx-auto" />
          </div>

          <Link to="/contact" className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#ccff00] text-black hover:bg-black hover:text-[#ccff00] flex items-center justify-center transition-all duration-300 ml-auto z-10 hover:scale-105 shadow-xl shrink-0">
            <FiArrowRight size={28} strokeWidth={2.5} />
          </Link>
          
        </div>
      </div>

      {/* Main Footer Section (Black background) */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand - Far Left */}
          <div className="lg:pr-10">
            <h3 className="text-4xl sm:text-5xl font-medium leading-[1.1] font-[var(--font-family-heading)] tracking-tight mb-2">
              Make<br />To Be<span className="text-[18px] font-normal align-top ml-1">®</span>
            </h3>
            {/* Using a subtle opacity for the text just like the agency brand reference */}
          </div>

          {/* Location details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-6">SRI LANKA</h4>
            <div className="flex flex-col gap-1 text-[13px] font-medium leading-relaxed tracking-wide text-white/90">
              <a href={shopInfo.socialMedia.email} className="hover:text-[#ccff00] transition-colors underline decoration-white/30 underline-offset-4">{shopInfo.email}</a>
              <a href={`tel:${shopInfo.phone}`} className="mt-1 hover:text-[#ccff00] transition-colors">{shopInfo.phone}</a>
              <p className="mt-3 leading-[1.6] max-w-[200px]">{shopInfo.address}</p>
              
              <a href={shopInfo.location.mapUrl} target="_blank" rel="noreferrer" className="mt-8 text-[11px] font-bold uppercase tracking-widest hover:text-[#ccff00] transition-colors flex items-center gap-1 underline decoration-white/30 underline-offset-4 w-fit">
                SEE ON MAP <FiArrowUpRight size={13} className="mb-0.5" />
              </a>
            </div>
          </div>

          {/* Bank Details (replacing BUENOS AIRES col) */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-6">BANK DETAILS</h4>
            <div className="flex flex-col gap-1 text-[13px] font-medium leading-relaxed tracking-wide text-white/90">
              <a href="#" className="hover:text-[#ccff00] transition-colors underline decoration-white/30 underline-offset-4 mb-2">Online Payments</a>
              <p className="mt-1"><span className="text-white/50 mb-0.5 block text-[10px] uppercase font-bold tracking-widest">Bank</span>{shopInfo.bankDetails.bankName}</p>
              <p className="mt-1"><span className="text-white/50 mb-0.5 block text-[10px] uppercase font-bold tracking-widest">A/C Name</span>{shopInfo.bankDetails.accountName}</p>
              <p className="mt-1"><span className="text-white/50 mb-0.5 block text-[10px] uppercase font-bold tracking-widest">A/C Number</span></p>
              <p className="font-mono text-sm tracking-wider">{shopInfo.bankDetails.accountNumber}</p>
            </div>
          </div>

          {/* Socials & Newsletter */}
          <div className="flex flex-col justify-between h-full space-y-12 lg:space-y-0">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-white/50 mb-4 leading-relaxed">
                WANT TO GET EXCLUSIVE<br />OFFERS?
              </h4>
              <Link to="/register" className="text-[11px] font-bold uppercase tracking-widest hover:text-[#ccff00] transition-colors flex items-center gap-1 underline decoration-white/30 underline-offset-4 w-fit">
                SIGN UP FOR FREE <FiArrowRight size={13} className="mb-0.5" />
              </Link>
            </div>
            
            <div className="mt-auto">
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-white/90 mb-5">FOLLOW US</h4>
              <div className="flex gap-6 items-center flex-wrap">
                <a href={shopInfo.socialMedia.whatsapp} target="_blank" rel="noreferrer" className="text-white hover:text-[#ccff00] transition-colors border border-transparent hover:border-[#ccff00]/30 rounded-full p-2 -m-2">
                  <FaWhatsapp size={20} />
                </a>
                <a href={shopInfo.socialMedia.email} target="_blank" rel="noreferrer" className="text-white hover:text-[#ccff00] transition-colors border border-transparent hover:border-[#ccff00]/30 rounded-full p-2 -m-2">
                  <FaEnvelope size={20} />
                </a>
                <a href="#" className="text-white hover:text-[#ccff00] transition-colors border border-transparent hover:border-[#ccff00]/30 rounded-full p-2 -m-2">
                  <FiInstagram size={20} />
                </a>
                <a href="#" className="text-white hover:text-[#ccff00] transition-colors border border-transparent hover:border-[#ccff00]/30 rounded-full p-2 -m-2">
                  <FiFacebook size={20} />
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Copyright Bar */}
      <div className="border-t border-white/10 bg-[#0a0a0a]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-white/40 tracking-wide">
          <p className="hover:text-white/70 transition-colors">© {currentYear} Make To Be. All rights reserved.</p>
          <p className="flex items-center gap-1.5 hover:text-[#ccff00] transition-colors cursor-default">
            Built with <FaHeart size={10} className="text-[#ccff00] mt-0.5" /> in SRI LANKA
          </p>
        </div>
      </div>

    </footer>
  )
}
