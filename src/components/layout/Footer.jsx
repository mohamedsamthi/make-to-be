import { Link } from 'react-router-dom'
import { FaWhatsapp, FaEnvelope, FaHeart } from 'react-icons/fa'
import { FiInstagram, FiFacebook, FiArrowRight, FiArrowUpRight } from 'react-icons/fi'
import { shopInfo } from '../../data/demoData'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#ff248a] text-white overflow-hidden mt-10">
      {/* Top Banner Section (White background) */}
      <div className="bg-white text-black py-16 sm:py-24 relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex text-xs font-bold uppercase tracking-[0.2em] text-black/60 flex-col items-start leading-tight">
              <span>Heard</span>
              <span>Enough? <FiArrowRight className="inline ml-1 mb-0.5" /></span>
            </div>
          </div>

          <div className="text-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg">
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-medium tracking-tighter" style={{ fontFamily: 'var(--font-family-heading)' }}>
              Contact us
            </h2>
            <div className="h-1 lg:h-1.5 w-[50%] xs:w-[70%] sm:w-[90%] bg-black/90 mt-1 sm:mt-2 mx-auto" />
          </div>

          <Link to="/contact" className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-black flex items-center justify-center transition-all duration-300 ml-auto z-10 hover:scale-105 shadow-xl shrink-0 group">
            <FiArrowRight size={32} strokeWidth={2.5} className="text-white group-hover:text-[#ff248a] transition-colors" />
          </Link>
          
        </div>
      </div>

      {/* Main Footer Section (Pink background) */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand - Far Left */}
          <div className="lg:pr-10">
            <h3 className="text-4xl sm:text-5xl font-black leading-[1.1] font-[var(--font-family-heading)] tracking-tight mb-2">
              Make<br />To Be<span className="text-[18px] font-normal align-top ml-1">®</span>
            </h3>
          </div>

          {/* Location details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-6">SRI LANKA</h4>
            <div className="flex flex-col gap-1 text-[13px] font-medium leading-relaxed tracking-wide text-white">
              <a href={`mailto:${shopInfo.email}`} className="hover:text-black transition-colors underline decoration-white/30 underline-offset-4">{shopInfo.email}</a>
              <a href={`tel:${shopInfo.phone}`} className="mt-1 hover:text-black transition-colors">{shopInfo.phone}</a>
              <p className="mt-3 leading-[1.6] max-w-[200px] text-white/90">{shopInfo.address}</p>
              
              <a href={shopInfo.location.mapUrl} target="_blank" rel="noreferrer" className="mt-8 text-[11px] font-bold uppercase tracking-widest hover:text-black transition-colors flex items-center gap-1 underline decoration-white/30 underline-offset-4 w-fit">
                SEE ON MAP <FiArrowUpRight size={13} className="mb-0.5" />
              </a>
            </div>
          </div>

          {/* Bank Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-6">BANK DETAILS</h4>
            <div className="flex flex-col gap-1 text-[13px] font-medium leading-relaxed tracking-wide text-white">
              <span className="mb-2 opacity-80">Online Payments</span>
              <p className="mt-1"><span className="text-white/50 mb-0.5 block text-[10px] uppercase font-bold tracking-widest">Bank</span>{shopInfo.bankDetails.bankName}</p>
              <p className="mt-1"><span className="text-white/50 mb-0.5 block text-[10px] uppercase font-bold tracking-widest">A/C Name</span>{shopInfo.bankDetails.accountName}</p>
              <p className="mt-1"><span className="text-white/50 mb-0.5 block text-[10px] uppercase font-bold tracking-widest">A/C Number</span></p>
              <p className="font-mono text-sm tracking-wider">{shopInfo.bankDetails.accountNumber}</p>
            </div>
          </div>

          {/* Follow blocks */}
          <div className="flex flex-col justify-end">
            <div className="lg:mt-auto">
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-white/90 mb-6">FOLLOW US</h4>
              <div className="flex gap-6 items-center flex-wrap">
                <a href={shopInfo.socialMedia.whatsapp} target="_blank" rel="noreferrer" className="text-white hover:text-black transition-colors p-2 -m-2">
                  <FaWhatsapp size={20} />
                </a>
                <a href={`mailto:${shopInfo.email}`} target="_blank" rel="noreferrer" className="text-white hover:text-black transition-colors p-2 -m-2">
                  <FaEnvelope size={20} />
                </a>
                <a href={shopInfo.socialMedia.instagram} target="_blank" rel="noreferrer" className="text-white hover:text-black transition-colors p-2 -m-2">
                  <FiInstagram size={20} />
                </a>
                <a href={shopInfo.socialMedia.facebook} target="_blank" rel="noreferrer" className="text-white hover:text-black transition-colors p-2 -m-2">
                  <FiFacebook size={20} />
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Copyright Bar */}
      <div className="border-t border-white/10 bg-[#e01b7a]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-white/50 tracking-wide">
          <p>© {currentYear} Make To Be. All rights reserved.</p>
          <p className="flex items-center gap-1.5 cursor-default">
            Built with <FaHeart size={10} className="text-white" /> in SRI LANKA
          </p>
        </div>
      </div>

    </footer>
  )
}
