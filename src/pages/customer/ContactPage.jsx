import { FaWhatsapp, FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock } from 'react-icons/fa'
import { FiSend, FiExternalLink } from 'react-icons/fi'
import { shopInfo } from '../../data/demoData'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    toast.success('Message sent! We\'ll get back to you soon.')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="pt-20 min-h-screen">
      {/* Header */}
      <div className="bg-[var(--color-primary)] py-12">
        <div className="container-custom text-center">
          <p className="text-[var(--color-accent)] text-sm font-semibold uppercase tracking-widest mb-2">Get in Touch</p>
          <h1 className="text-4xl font-bold font-[var(--font-family-heading)] mb-3">Contact Us</h1>
          <p className="text-[var(--color-text-secondary)] max-w-md mx-auto">
            Have questions? We'd love to hear from you! Reach out via WhatsApp for fastest response.
          </p>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Cards */}
          <div className="space-y-6">
            <a href={shopInfo.socialMedia.whatsapp} target="_blank" rel="noreferrer"
              className="flex items-center gap-4 p-5 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] card-hover group">
              <div className="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 group-hover:bg-green-500 group-hover:text-white transition-all shrink-0">
                <FaWhatsapp size={24} />
              </div>
              <div>
                <h3 className="font-semibold mb-0.5">WhatsApp</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">{shopInfo.whatsapp}</p>
                <p className="text-xs text-green-400 mt-1">Fastest response ⚡</p>
              </div>
            </a>

            <a href={shopInfo.socialMedia.email}
              className="flex items-center gap-4 p-5 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] card-hover group">
              <div className="w-14 h-14 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center text-[var(--color-accent)] group-hover:gradient-accent group-hover:text-white transition-all shrink-0">
                <FaEnvelope size={24} />
              </div>
              <div>
                <h3 className="font-semibold mb-0.5">Email</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">{shopInfo.email}</p>
              </div>
            </a>

            <a href={`tel:${shopInfo.phone}`}
              className="flex items-center gap-4 p-5 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] card-hover group">
              <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all shrink-0">
                <FaPhone size={24} />
              </div>
              <div>
                <h3 className="font-semibold mb-0.5">Phone</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">{shopInfo.phone}</p>
              </div>
            </a>

            <div className="flex items-center gap-4 p-5 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)]">
              <div className="w-14 h-14 rounded-xl bg-[var(--color-gold)]/10 flex items-center justify-center text-[var(--color-gold)] shrink-0">
                <FaMapMarkerAlt size={24} />
              </div>
              <div>
                <h3 className="font-semibold mb-0.5">Location</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">{shopInfo.address}</p>
                <a href={shopInfo.location.mapUrl} target="_blank" rel="noreferrer"
                  className="text-xs text-[var(--color-accent)] flex items-center gap-1 mt-1 hover:underline">
                  View on Map <FiExternalLink size={12} />
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)]">
              <div className="w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
                <FaClock size={24} />
              </div>
              <div>
                <h3 className="font-semibold mb-0.5">Business Hours</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">Mon - Sat: 9:00AM - 8:00PM</p>
                <p className="text-sm text-[var(--color-text-secondary)]">Sun: 10:00AM - 5:00PM</p>
              </div>
            </div>

            {/* Bank Details */}
            <div className="p-5 rounded-2xl glass-light">
              <h3 className="font-semibold mb-3">💳 Payment Details</h3>
              <div className="space-y-1.5">
                <p className="text-sm"><span className="text-[var(--color-text-muted)]">Bank:</span> {shopInfo.bankDetails.bankName}</p>
                <p className="text-sm"><span className="text-[var(--color-text-muted)]">Name:</span> {shopInfo.bankDetails.accountName}</p>
                <p className="text-sm font-mono font-bold text-[var(--color-gold)]">{shopInfo.bankDetails.accountNumber}</p>
                <p className="text-sm"><span className="text-[var(--color-text-muted)]">Branch:</span> {shopInfo.bankDetails.branch}</p>
              </div>
            </div>
          </div>

          {/* Contact Form + Map */}
          <div className="lg:col-span-2 space-y-8">
            {/* Map */}
            <div className="rounded-2xl overflow-hidden h-64 bg-[var(--color-surface-card)] border border-[var(--color-border)]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15843.88!2d81.8167!3d7.4167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae515a8e1c2a3d1%3A0x!2sKalmunai%2C+Sri+Lanka!5e0!3m2!1sen!2s!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Make To Be Location"
              />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)]">
              <h3 className="text-xl font-bold mb-6 font-[var(--font-family-heading)]">Send us a Message</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm text-[var(--color-text-secondary)] mb-1.5 block">Your Name</label>
                  <input value={formData.name} onChange={e => setFormData(p => ({...p, name: e.target.value}))} className="input-field" required />
                </div>
                <div>
                  <label className="text-sm text-[var(--color-text-secondary)] mb-1.5 block">Your Email</label>
                  <input type="email" value={formData.email} onChange={e => setFormData(p => ({...p, email: e.target.value}))} className="input-field" required />
                </div>
              </div>
              <div className="mb-4">
                <label className="text-sm text-[var(--color-text-secondary)] mb-1.5 block">Subject</label>
                <input value={formData.subject} onChange={e => setFormData(p => ({...p, subject: e.target.value}))} className="input-field" required />
              </div>
              <div className="mb-6">
                <label className="text-sm text-[var(--color-text-secondary)] mb-1.5 block">Message</label>
                <textarea value={formData.message} onChange={e => setFormData(p => ({...p, message: e.target.value}))} className="input-field min-h-[120px] resize-none" required />
              </div>
              <button type="submit" className="btn-primary">
                <FiSend size={18} /> Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
