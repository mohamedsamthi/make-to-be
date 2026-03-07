import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaWhatsapp, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'
import { FiSend, FiUser, FiMail, FiSmartphone, FiMessageSquare, FiClock, FiExternalLink, FiShield } from 'react-icons/fi'
import { shopInfo } from '../../data/demoData'
import toast from 'react-hot-toast'

// Simple math-based spam protection
function useAntiSpam() {
  const a = Math.floor(Math.random() * 9) + 1
  const b = Math.floor(Math.random() * 9) + 1
  return { a, b, answer: a + b }
}

export default function ContactPage() {
  const [spam] = useState(useAntiSpam)
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', mobile: '', email: '', message: '', captcha: ''
  })
  const [loading, setLoading] = useState(false)

  const update = (key) => (e) => setFormData(p => ({ ...p, [key]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (parseInt(formData.captcha) !== spam.answer) {
      toast.error('Incorrect spam check answer. Please try again.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      toast.success("Message sent! We'll get back to you soon. 🎉")
      setFormData({ firstName: '', lastName: '', mobile: '', email: '', message: '', captcha: '' })
      setLoading(false)
    }, 1000)
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
    <div className="min-h-screen bg-[var(--color-surface)]">

      {/* ── HEADER ── */}
      <div className="bg-[var(--color-primary)] border-b border-[var(--color-border)]">
        <div className="container-custom py-10 sm:py-14">
          <nav className="text-xs text-[var(--color-text-muted)] flex items-center gap-2 mb-4">
            <Link to="/" className="hover:text-[var(--color-accent)] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Contact</span>
          </nav>
          <div className="max-w-xl">
            <p className="text-[var(--color-accent)] text-xs font-bold uppercase tracking-widest mb-2">Get In Touch</p>
            <h1 className="text-3xl sm:text-4xl font-black font-[var(--font-family-heading)] mb-3">Contact Us</h1>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              Have a question or need help with your order? We're here for you. Reach out via form, WhatsApp, or email — we respond fast!
            </p>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="container-custom py-10 sm:py-14">
        <div className="grid lg:grid-cols-5 gap-8 items-start">

          {/* ── LEFT: CONTACT INFO (2-col) ── */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* 2×2 Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              {contactInfo.map((item, i) => (
                <div
                  key={i}
                  role={item.href ? 'link' : 'article'}
                  onClick={() => item.href && window.open(item.href, '_blank')}
                  className={`flex flex-col gap-3 p-4 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 transition-all ${item.href ? 'cursor-pointer hover:-translate-y-0.5' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-1">{item.title}</p>
                    <p className="text-xs font-semibold text-white leading-snug break-all">{item.value}</p>
                    <p className="text-[10px] text-[var(--color-text-muted)] mt-1">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp CTA card */}
            <a
              href={shopInfo.socialMedia.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 hover:bg-emerald-500/15 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0 group-hover:scale-105 transition-transform">
                <FaWhatsapp size={24} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-sm text-white">Chat on WhatsApp</p>
                <p className="text-xs text-emerald-400 mt-0.5">Fastest response ⚡ Usually within minutes</p>
              </div>
              <FiExternalLink size={16} className="text-emerald-400 ml-auto shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
            </a>

            {/* Payment card */}
            <div className="p-5 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-4">💳 Bank Payment Details</p>
              <div className="space-y-2.5">
                {[
                  { label: 'Bank',    value: shopInfo.bankDetails.bankName },
                  { label: 'Name',    value: shopInfo.bankDetails.accountName },
                  { label: 'Branch',  value: shopInfo.bankDetails.branch },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between text-sm">
                    <span className="text-[var(--color-text-muted)]">{row.label}</span>
                    <span className="font-medium text-white">{row.value}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-[var(--color-border)]">
                  <p className="text-[10px] text-[var(--color-text-muted)] mb-1">Account Number</p>
                  <p className="font-mono font-bold text-amber-400 text-base tracking-wider">{shopInfo.bankDetails.accountNumber}</p>
                </div>
              </div>
            </div>

          </div>

          {/* ── RIGHT: CONTACT FORM ── */}
          <div className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden"
            >
              {/* Form Header */}
              <div className="px-6 sm:px-8 py-6 border-b border-[var(--color-border)] bg-[var(--color-primary)]">
                <h2 className="text-lg font-bold font-[var(--font-family-heading)]">Send Us a Message</h2>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">Fill out the form and we'll get back to you shortly.</p>
              </div>

              <div className="p-6 sm:p-8 space-y-5">
                {/* First + Last Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2 block">
                      First Name <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <FiUser size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={update('firstName')}
                        placeholder="John"
                        className="input-field pl-10 text-sm"
                        required
                        id="contact-firstname"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2 block">
                      Last Name <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <FiUser size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={update('lastName')}
                        placeholder="Doe"
                        className="input-field pl-10 text-sm"
                        required
                        id="contact-lastname"
                      />
                    </div>
                  </div>
                </div>

                {/* Mobile + Email */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2 block">
                      Mobile Number <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <FiSmartphone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                      <input
                        type="tel"
                        value={formData.mobile}
                        onChange={update('mobile')}
                        placeholder="+94 7X XXX XXXX"
                        className="input-field pl-10 text-sm"
                        required
                        id="contact-mobile"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2 block">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <FiMail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={update('email')}
                        placeholder="john@email.com"
                        className="input-field pl-10 text-sm"
                        required
                        id="contact-email"
                      />
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2 block">
                    Message <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <FiMessageSquare size={15} className="absolute left-3.5 top-3.5 text-[var(--color-text-muted)]" />
                    <textarea
                      value={formData.message}
                      onChange={update('message')}
                      placeholder="Tell us how we can help you..."
                      className="input-field pl-10 min-h-[120px] resize-none text-sm"
                      required
                      id="contact-message"
                    />
                  </div>
                </div>

                {/* Anti-spam */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)]">
                  <FiShield size={18} className="text-[var(--color-accent)] shrink-0" />
                  <div className="flex items-center gap-3 flex-1 flex-wrap">
                    <p className="text-sm text-[var(--color-text-secondary)] whitespace-nowrap">
                      Spam check: What is <strong className="text-white">{spam.a} + {spam.b}</strong>?
                    </p>
                    <input
                      type="number"
                      value={formData.captcha}
                      onChange={update('captcha')}
                      placeholder="Answer"
                      className="input-field w-24 text-sm py-2 text-center"
                      required
                      id="contact-captcha"
                    />
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full justify-center py-3.5 text-sm font-bold disabled:opacity-60 disabled:cursor-not-allowed"
                  id="contact-submit"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <>
                      <FiSend size={17} /> Send Message
                    </>
                  )}
                </button>

                <p className="text-[10px] text-center text-[var(--color-text-muted)]">
                  By submitting this form, you agree to our privacy policy. We never share your data.
                </p>
              </div>
            </form>
          </div>

        </div>
      </div>

    </div>
  )
}
