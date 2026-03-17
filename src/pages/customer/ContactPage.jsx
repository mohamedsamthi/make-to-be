import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaWhatsapp, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'
import { FiSend, FiUser, FiMail, FiSmartphone, FiMessageSquare, FiClock, FiExternalLink, FiShield } from 'react-icons/fi'
import { shopInfo } from '../../data/demoData'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import { useProducts } from '../../context/ProductContext'

import { useAuth } from '../../context/AuthContext'
import { supabaseData } from '../../lib/supabase'

// Verification Code Generator
const generateCode = () => Math.floor(1000 + Math.random() * 9000).toString()

export default function ContactPage() {
  const { profile } = useAuth()
  const { sendMessage } = useProducts()
  const [targetCode, setTargetCode] = useState(generateCode)
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', mobile: '', email: '', message: '', captcha: ''
  })
  const [loading, setLoading] = useState(false)

  // Pre-fill user data
  useEffect(() => {
    if (profile) {
      const names = profile.full_name?.split(' ') || []
      setFormData(prev => ({
        ...prev,
        firstName: names[0] || '',
        lastName: names.slice(1).join(' ') || '',
        email: profile.email || '',
        mobile: profile.phone || ''
      }))
    }
  }, [profile])

  const update = (key) => (e) => setFormData(p => ({ ...p, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.captcha !== targetCode) {
      toast.error('Incorrect verification code. Please try again.')
      setTargetCode(generateCode()) // Refresh code
      setFormData(prev => ({ ...prev, captcha: '' }))
      return
    }
    setLoading(true)
    
    await sendMessage({
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      phone: formData.mobile,
      message: formData.message
    })

    Swal.fire({
      title: 'Message Sent! 🎉',
      text: "We have received your message and will get back to you within 24 hours.",
      icon: 'success',
      confirmButtonText: 'Great!',
      confirmButtonColor: '#8b5cf6',
      background: '#1e1c3a',
      color: '#fff',
      customClass: {
        popup: 'border border-white/10 rounded-2xl',
        confirmButton: 'rounded-xl font-bold tracking-wide'
      }
    })

    setFormData({ firstName: '', lastName: '', mobile: '', email: '', message: '', captcha: '' })
    setTargetCode(generateCode())
    setLoading(false)
  }

  const contactInfo = [
    {
      icon: <FaPhone size={20} />,
      title: 'Phone Number',
      value: shopInfo.phone,
      sub: 'Call us anytime',
      href: `tel:${shopInfo.phone}`,
      color: 'bg-blue-500/15 text-blue-400',
    },
    {
      icon: <FaEnvelope size={20} />,
      title: 'Email Address',
      value: shopInfo.email,
      sub: 'We reply within 24 hrs',
      href: `mailto:${shopInfo.email}`,
      color: 'bg-[var(--color-accent)]/15 text-[var(--color-accent-light)]',
    },
    {
      icon: <FaMapMarkerAlt size={20} />,
      title: 'Our Location',
      value: shopInfo.address,
      sub: 'Visit our store',
      href: shopInfo.location?.mapUrl,
      color: 'bg-amber-500/15 text-amber-400',
    },
    {
      icon: <FiClock size={20} />,
      title: 'Working Hours',
      value: 'Mon–Sat: 9AM – 8PM',
      sub: 'Sun: 10AM – 5PM',
      href: null,
      color: 'bg-emerald-500/15 text-emerald-400',
    },
  ]

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pb-20">
      
      {/* ── HEADER WITH MODERN GRADIENT ── */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#151230] to-[var(--color-surface)] border-b border-white/5 pt-12 pb-16 lg:pt-20 lg:pb-32">
        {/* Abstract Backgrounds */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl" />
        
        <div className="container-custom relative z-10">
          <nav className="text-xs text-gray-400 flex items-center gap-2 mb-6">
            <Link to="/" className="hover:text-violet-400 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-100 font-medium">Contact Support</span>
          </nav>
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[10px] font-bold uppercase tracking-widest mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" /> Always here to help
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-5xl font-black font-[var(--font-family-heading)] text-white mb-4 leading-tight">
              Let's Start a <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Conversation</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-400 max-w-xl leading-relaxed">
              Have a question about a product, need help with an order, or just want to say hi? We'd love to hear from you. We respond to all inquiries within 24 hours.
            </p>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="container-custom -mt-12 relative z-20">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* ── LEFT: CONTACT INFO (5 columns on LG) ── */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            
            {/* 2×2 Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
              {contactInfo.map((item, i) => (
                <div
                  key={i}
                  role={item.href ? 'link' : 'article'}
                  onClick={() => item.href && window.open(item.href, '_blank')}
                  className={`group relative flex flex-col gap-4 p-5 rounded-2xl bg-[#1e1c3a]/80 backdrop-blur-md border border-white/5 transition-all overflow-hidden ${item.href ? 'cursor-pointer hover:-translate-y-1 hover:border-white/20 hover:shadow-xl hover:shadow-black/20 hover:bg-[#25224a]' : ''}`}
                >
                  <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-10 transition-opacity group-hover:opacity-30 ${item.color.split(' ')[0]}`} />
                  
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-white/10 shadow-inner ${item.color} relative z-10`}>
                    {item.icon}
                  </div>
                  <div className="relative z-10 min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">{item.title}</p>
                    <p className="text-sm font-semibold text-white leading-snug break-all">{item.value}</p>
                    <p className="text-[11px] text-gray-500 mt-1">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp CTA card */}
            <a
              href={shopInfo.socialMedia.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="relative p-6 rounded-2xl bg-gradient-to-br from-emerald-600/20 to-emerald-900/10 border border-emerald-500/20 overflow-hidden group hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/10 transition-all"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors" />
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/40 shrink-0 group-hover:scale-110 transition-transform">
                  <FaWhatsapp size={28} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-base text-white">Chat on WhatsApp</p>
                  <p className="text-xs text-emerald-400/80 mt-1">Get an instant response ⚡</p>
                </div>
                <div className="ml-auto w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors">
                  <FiExternalLink size={16} className="text-emerald-300" />
                </div>
              </div>
            </a>

            {/* Payment card */}
            <div className="p-6 rounded-2xl bg-[#1e1c3a]/80 backdrop-blur-md border border-white/5 overflow-hidden relative">
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl" />
              <div className="flex justify-between items-center mb-5 relative z-10">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">💳 Bank Transfer</p>
                <div className="px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase">
                  Secure
                </div>
              </div>
              
              <div className="space-y-3 relative z-10">
                {[
                  { label: 'Bank',    value: shopInfo.bankDetails.bankName },
                  { label: 'Name',    value: shopInfo.bankDetails.accountName },
                  { label: 'Branch',  value: shopInfo.bankDetails.branch },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between text-sm py-1 border-b border-white/5 last:border-0 last:pb-0">
                    <span className="text-gray-400">{row.label}</span>
                    <span className="font-medium text-gray-200">{row.value}</span>
                  </div>
                ))}
                <div className="mt-4 pt-4 border-t border-white/10 bg-black/20 -mx-6 -mb-6 p-6">
                  <p className="text-xs text-gray-400 mb-1">Account Number</p>
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-mono font-bold text-amber-400 text-lg tracking-widest">{shopInfo.bankDetails.accountNumber}</p>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(shopInfo.bankDetails.accountNumber)
                        toast.success('Account number copied to clipboard!')
                      }}
                      className="text-[10px] text-gray-400 hover:text-white uppercase font-bold tracking-wider px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ── RIGHT: CONTACT FORM (7 columns on LG) ── */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="bg-[#151230] border border-white/10 rounded-2xl lg:rounded-3xl shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500" />
              
              <div className="p-6 sm:p-8 lg:p-10">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Send us a direct message</h2>
                  <p className="text-sm text-gray-400">Fill out the form below and our team will get back to you within 24 hours.</p>
                </div>

                <div className="space-y-6">
                  {/* First + Last Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                    <div>
                      <label className="text-xs font-semibold text-gray-300 uppercase tracking-widest mb-2 block">
                        First Name <span className="text-violet-500">*</span>
                      </label>
                      <div className="relative group/input">
                        <FiUser size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-violet-500 transition-colors" />
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={update('firstName')}
                          placeholder="John"
                          className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                          required
                          id="contact-firstname"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-300 uppercase tracking-widest mb-2 block">
                        Last Name <span className="text-violet-500">*</span>
                      </label>
                      <div className="relative group/input">
                        <FiUser size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-violet-500 transition-colors" />
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={update('lastName')}
                          placeholder="Doe"
                          className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                          required
                          id="contact-lastname"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mobile + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                    <div>
                      <label className="text-xs font-semibold text-gray-300 uppercase tracking-widest mb-2 block">
                        Mobile Number <span className="text-violet-500">*</span>
                      </label>
                      <div className="relative group/input">
                        <FiSmartphone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-violet-500 transition-colors" />
                        <input
                          type="tel"
                          value={formData.mobile}
                          onChange={update('mobile')}
                          placeholder="+94 7X XXX XXXX"
                          className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                          required
                          id="contact-mobile"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-300 uppercase tracking-widest mb-2 block">
                        Email Address <span className="text-violet-500">*</span>
                      </label>
                      <div className="relative group/input">
                        <FiMail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-violet-500 transition-colors" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={update('email')}
                          placeholder="contact@maketobe.com"
                          className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                          required
                          id="contact-email"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="text-xs font-semibold text-gray-300 uppercase tracking-widest mb-2 block">
                      Your Message <span className="text-violet-500">*</span>
                    </label>
                    <div className="relative group/input">
                      <FiMessageSquare size={18} className="absolute left-4 top-4 text-gray-500 group-focus-within/input:text-violet-500 transition-colors" />
                      <textarea
                        value={formData.message}
                        onChange={update('message')}
                        placeholder="Tell us what you need help with..."
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all resize-none min-h-[140px]"
                        required
                        id="contact-message"
                      />
                    </div>
                  </div>

                  {/* Anti-spam */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                        <FiShield size={20} className="text-violet-400" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-1">Security Check</p>
                        <p className="text-sm text-gray-400">
                          Type the code: <span className="text-white font-black tracking-widest mx-1 bg-white/5 px-2 py-0.5 rounded border border-white/10">{targetCode}</span>
                        </p>
                      </div>
                    </div>
                    <div className="relative shrink-0">
                      <input
                        type="text"
                        value={formData.captcha}
                        onChange={update('captcha')}
                        placeholder="Type Code"
                        className="w-full sm:w-32 bg-black/40 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-center text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all font-mono tracking-widest"
                        required
                        id="contact-captcha"
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold text-sm sm:text-base py-4 rounded-xl shadow-lg shadow-violet-500/25 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                    id="contact-submit"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" viewBox="0 0 24 24"></svg>
                        Sending your message...
                      </span>
                    ) : (
                      <>
                        Send Message 
                        <FiSend size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>
                  
                  <p className="text-[11px] text-center text-gray-500 max-w-sm mx-auto">
                    By submitting this form, you acknowledge our Privacy Policy. Your details are safe and never shared.
                  </p>
                </div>
              </div>
            </form>
          </div>

        </div>
      </div>

    </div>
  )
}
