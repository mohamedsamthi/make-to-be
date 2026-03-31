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
    
    // Validate captcha
    if (formData.captcha.trim() !== targetCode) {
      toast.error('Incorrect verification code. Please try again.')
      setTargetCode(generateCode())
      setFormData(prev => ({ ...prev, captcha: '' }))
      return
    }

    setLoading(true)
    
    try {
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
        confirmButtonColor: 'var(--color-accent)',
        background: 'var(--color-surface-card)',
        color: 'var(--color-text-primary)',
        customClass: {
          popup: 'border border-[var(--color-border)] rounded-2xl',
          confirmButton: 'rounded-xl font-bold tracking-wide text-black'
        }
      })

      // Reset form on success
      setFormData({ firstName: '', lastName: '', mobile: '', email: '', message: '', captcha: '' })
      setTargetCode(generateCode())
    } catch (err) {
      console.error('Contact form error:', err)
      toast.error(err.message || 'Failed to send message. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const contactInfo = [
    {
      icon: <FaPhone size={20} />,
      title: 'Phone Number',
      value: shopInfo.phone,
      sub: 'Call us anytime',
      href: `tel:${shopInfo.phone}`,
    },
    {
      icon: <FaEnvelope size={20} />,
      title: 'Email Address',
      value: shopInfo.email,
      sub: 'We reply within 24 hrs',
      href: `mailto:${shopInfo.email}`,
    },
    {
      icon: <FaMapMarkerAlt size={20} />,
      title: 'Our Location',
      value: shopInfo.address,
      sub: 'Visit our store',
      href: shopInfo.location?.mapUrl,
    },
    {
      icon: <FiClock size={20} />,
      title: 'Working Hours',
      value: 'Mon–Sat: 9AM – 8PM',
      sub: 'Sun: 10AM – 5PM',
      href: null,
    },
  ]

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pb-20">
      
      {/* ── HEADER WITH MINIMAL STYLING ── */}
      <div className="relative overflow-hidden bg-[var(--color-surface)] border-b border-[var(--color-border)] pt-8 pb-12 lg:pt-16 lg:pb-24">
        {/* Abstract Backgrounds */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[var(--color-accent)]/5 rounded-full blur-[120px] opacity-70" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-[var(--color-accent)]/5 rounded-full blur-[100px] opacity-70" />
        
        <div className="container-custom relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-surface-light)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-[10px] font-black uppercase tracking-widest mb-6">
              <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" /> Always here to help
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-[var(--font-family-heading)] text-[var(--color-text-primary)] mb-6 tracking-tight uppercase">
              Let's Start a <br className="hidden sm:block" />
              <span className="text-[var(--color-accent)]">Conversation</span>
            </h1>
            <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[var(--color-text-muted)] max-w-xl mx-auto leading-relaxed">
              Have a question about a product, need help with an order, or just want to say hi? We'd love to hear from you. We respond to all inquiries within 24 hours.
            </p>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="container-custom mt-12 relative z-20">
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
                  className={`group relative flex flex-col gap-4 p-6 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] transition-all overflow-hidden ${item.href ? 'cursor-pointer hover:-translate-y-1 hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-surface-light)] hover:shadow-2xl' : ''}`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-[var(--color-border)] bg-[var(--color-surface-light)] group-hover:bg-[var(--color-accent)] group-hover:border-[var(--color-accent)] transition-all`}>
                    <span className="text-[var(--color-text-primary)] group-hover:text-black transition-colors">{item.icon}</span>
                  </div>
                  <div className="relative z-10 min-w-0 flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-1.5">{item.title}</p>
                    <p className="text-sm font-black text-[var(--color-text-primary)] leading-snug break-all uppercase tracking-tight">{item.value}</p>
                    <p className="text-[10px] font-bold text-[var(--color-text-muted)] mt-1 uppercase tracking-widest opacity-80">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp CTA card */}
            <a
              href={shopInfo.socialMedia.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="relative p-6 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/80 transition-all group flex items-center gap-4 mt-2 hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-surface-light)] group-hover:bg-[var(--color-accent)] border border-[var(--color-border)] group-hover:border-[var(--color-accent)] flex items-center justify-center shrink-0 transition-all">
                <FaWhatsapp size={24} className="text-[var(--color-text-primary)] group-hover:text-black transition-colors" />
              </div>
              <div>
                <p className="font-black text-sm uppercase tracking-tight text-[var(--color-text-primary)]">Chat on WhatsApp</p>
                <p className="text-[10px] font-bold text-[var(--color-text-muted)] mt-1 uppercase tracking-widest">Fast Response ⚡</p>
              </div>
              <div className="ml-auto w-10 h-10 rounded-xl bg-[var(--color-surface-light)] group-hover:bg-black/10 text-[var(--color-text-muted)] group-hover:text-black flex items-center justify-center border border-[var(--color-border)] group-hover:border-transparent transition-all">
                <FiExternalLink size={16} />
              </div>
            </a>

            {/* Payment card */}
            <div className="p-6 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] relative mt-2">
              <div className="flex justify-between items-center mb-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">Bank Transfer</p>
                <div className="px-3 py-1 rounded bg-[var(--color-surface-light)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-[10px] font-black uppercase tracking-widest">
                  Secure
                </div>
              </div>
              
              <div className="space-y-4">
                {[
                  { label: 'Bank',    value: shopInfo.bankDetails.bankName },
                  { label: 'Name',    value: shopInfo.bankDetails.accountName },
                  { label: 'Branch',  value: shopInfo.bankDetails.branch },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between text-sm py-2 border-b border-[var(--color-border)] last:border-0 last:pb-0">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">{row.label}</span>
                    <span className="font-black text-[var(--color-text-primary)] uppercase tracking-tight">{row.value}</span>
                  </div>
                ))}
                <div className="mt-4 pt-4 border-t border-[var(--color-border)] bg-[var(--color-surface-light)] rounded-xl p-5 border border-transparent">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Account Number</p>
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-mono font-black text-[var(--color-text-primary)] text-sm sm:text-lg tracking-widest">{shopInfo.bankDetails.accountNumber}</p>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(shopInfo.bankDetails.accountNumber)
                        toast.success('Account number copied to clipboard!')
                      }}
                      className="text-[10px] text-[var(--color-text-primary)] hover:text-black uppercase font-black tracking-widest px-4 py-2 rounded-lg bg-[var(--color-surface-card)] hover:bg-[var(--color-accent)] border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-all"
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
              className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-10"
            >
              <div className="mb-10">
                <h2 className="text-2xl font-black font-[var(--font-family-heading)] text-[var(--color-text-primary)] uppercase tracking-tight mb-2">Send a Message</h2>
                <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Fill out the form below and our team will get back to you within 24 hours.</p>
              </div>

              <div className="space-y-6">
                {/* First + Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                  <div>
                    <label className="text-[10px] font-black text-[var(--color-text-primary)] uppercase tracking-widest mb-2 block">
                      First Name <span className="text-[var(--color-accent)]">*</span>
                    </label>
                    <div className="relative group/input">
                      <FiUser size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] group-focus-within/input:text-[var(--color-accent)] transition-colors" />
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={update('firstName')}
                        placeholder="John"
                        className="w-full bg-[var(--color-surface-light)] border border-[var(--color-border)] rounded-xl py-3.5 pl-12 pr-4 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]/30 transition-all font-bold"
                        required
                        id="contact-firstname"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-[var(--color-text-primary)] uppercase tracking-widest mb-2 block">
                      Last Name <span className="text-[var(--color-accent)]">*</span>
                    </label>
                    <div className="relative group/input">
                      <FiUser size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] group-focus-within/input:text-[var(--color-accent)] transition-colors" />
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={update('lastName')}
                        placeholder="Doe"
                        className="w-full bg-[var(--color-surface-light)] border border-[var(--color-border)] rounded-xl py-3.5 pl-12 pr-4 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]/30 transition-all font-bold"
                        required
                        id="contact-lastname"
                      />
                    </div>
                  </div>
                </div>

                {/* Mobile + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                  <div>
                    <label className="text-[10px] font-black text-[var(--color-text-primary)] uppercase tracking-widest mb-2 block">
                      Mobile Number <span className="text-[var(--color-accent)]">*</span>
                    </label>
                    <div className="relative group/input">
                      <FiSmartphone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] group-focus-within/input:text-[var(--color-accent)] transition-colors" />
                      <input
                        type="tel"
                        value={formData.mobile}
                        onChange={update('mobile')}
                        placeholder="+94 7X XXX XXXX"
                        className="w-full bg-[var(--color-surface-light)] border border-[var(--color-border)] rounded-xl py-3.5 pl-12 pr-4 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]/30 transition-all font-bold"
                        required
                        id="contact-mobile"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-[var(--color-text-primary)] uppercase tracking-widest mb-2 block">
                      Email Address <span className="text-[var(--color-accent)]">*</span>
                    </label>
                    <div className="relative group/input">
                      <FiMail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] group-focus-within/input:text-[var(--color-accent)] transition-colors" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={update('email')}
                        placeholder="contact@example.com"
                        className="w-full bg-[var(--color-surface-light)] border border-[var(--color-border)] rounded-xl py-3.5 pl-12 pr-4 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]/30 transition-all font-bold"
                        required
                        id="contact-email"
                      />
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="text-[10px] font-black text-[var(--color-text-primary)] uppercase tracking-widest mb-2 block">
                    Your Message <span className="text-[var(--color-accent)]">*</span>
                  </label>
                  <div className="relative group/input">
                    <FiMessageSquare size={18} className="absolute left-4 top-4 text-[var(--color-text-muted)] group-focus-within/input:text-[var(--color-accent)] transition-colors" />
                    <textarea
                      value={formData.message}
                      onChange={update('message')}
                      placeholder="Tell us what you need help with..."
                      className="w-full bg-[var(--color-surface-light)] border border-[var(--color-border)] rounded-xl py-3.5 pl-12 pr-4 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]/30 transition-all font-bold resize-none min-h-[140px]"
                      required
                      id="contact-message"
                    />
                  </div>
                </div>

                {/* Anti-spam */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-[var(--color-surface-light)] border border-[var(--color-border)]">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center shrink-0">
                      <FiShield size={20} className="text-[var(--color-text-primary)]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-[var(--color-text-primary)] uppercase tracking-widest mb-1">Security Check</p>
                      <p className="text-xs font-bold text-[var(--color-text-muted)]">
                        Enter code: <span className="text-[var(--color-text-primary)] font-black tracking-widest mx-1 bg-[var(--color-surface-card)] px-2 py-1 rounded border border-[var(--color-border)]">{targetCode}</span>
                      </p>
                    </div>
                  </div>
                  <div className="relative shrink-0">
                    <input
                      type="text"
                      value={formData.captcha}
                      onChange={update('captcha')}
                      placeholder="Type Code"
                      className="w-full sm:w-32 bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-xl py-3 px-3 text-sm text-center text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]/30 transition-all font-mono font-black tracking-widest"
                      required
                      id="contact-captcha"
                    />
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] text-black font-black text-sm sm:text-base py-4 rounded-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-widest"
                  id="contact-submit"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 border-2 border-black/30 border-t-black rounded-full" viewBox="0 0 24 24"></svg>
                      Sending...
                    </span>
                  ) : (
                    <>
                      Send Message 
                      <FiSend size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
                
                <p className="text-[10px] text-center font-bold uppercase tracking-widest text-[var(--color-text-muted)] opacity-70 max-w-sm mx-auto">
                  By submitting this form, you acknowledge our Privacy Policy.
                </p>
              </div>
            </form>
          </div>

        </div>
      </div>

    </div>
  )
}
