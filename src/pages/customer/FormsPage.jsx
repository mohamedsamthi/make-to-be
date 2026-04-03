import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import PageShell from '../../components/ui/PageShell'
import FormField from '../../components/ui/FormField'
import TouchButton from '../../components/ui/TouchButton'

const inputClass =
  'w-full min-h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-light)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-colors focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30'

const selectClass = `${inputClass} appearance-none bg-[var(--color-surface-light)]`

/**
 * Forms demo page — mobile-first: single column on small screens; at md+ two cards
 * sit in a CSS Grid so the primary form and newsletter stay readable without horizontal scroll.
 */
export default function FormsPage() {
  const [inquiry, setInquiry] = useState({
    name: '',
    email: '',
    topic: 'general',
    message: '',
  })
  const [inquiryErrors, setInquiryErrors] = useState({})
  const [newsletter, setNewsletter] = useState({ email: '' })
  const [newsError, setNewsError] = useState('')

  const validateInquiry = () => {
    const e = {}
    if (!inquiry.name.trim()) e.name = 'Please enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiry.email.trim())) e.email = 'Enter a valid email.'
    if (!inquiry.message.trim() || inquiry.message.trim().length < 10) {
      e.message = 'Message should be at least 10 characters.'
    }
    setInquiryErrors(e)
    return Object.keys(e).length === 0
  }

  const submitInquiry = (ev) => {
    ev.preventDefault()
    if (!validateInquiry()) {
      toast.error('Please fix the highlighted fields.')
      return
    }
    toast.success('Thanks — this is a demo; use Contact for real messages.')
    setInquiry({ name: '', email: '', topic: 'general', message: '' })
    setInquiryErrors({})
  }

  const submitNewsletter = (ev) => {
    ev.preventDefault()
    const em = newsletter.email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      setNewsError('Enter a valid email.')
      return
    }
    setNewsError('')
    toast.success("You're subscribed (demo).")
    setNewsletter({ email: '' })
  }

  return (
    <div className="section-padding pb-24">
      <PageShell>
        <header className="mb-10 max-w-2xl">
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-accent)]">
            Forms & input patterns
          </p>
          <h1 className="text-fluid-2xl mb-3 font-black tracking-tight">
            Responsive forms
          </h1>
          <p className="text-fluid-base text-[var(--color-text-secondary)]">
            Touch-sized controls, clear focus states, and a layout that stacks on phones and
            splits into two columns from the medium breakpoint upward.
          </p>
          <Link
            to="/contact"
            className="mt-4 inline-flex min-h-11 items-center text-sm font-bold text-[var(--color-accent)] underline-offset-4 hover:underline"
          >
            Need the live contact form? Go to Contact →
          </Link>
        </header>

        {/* Grid: 1 col default (mobile-first); 2 cols from md — avoids cramped side-by-side fields on narrow viewports */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10 lg:gap-12">
          <section
            className="glass rounded-2xl border border-[var(--color-border)] p-6 sm:p-8"
            aria-labelledby="inquiry-heading"
          >
            <h2 id="inquiry-heading" className="text-fluid-lg mb-6 font-black">
              Quick inquiry
            </h2>
            <form onSubmit={submitInquiry} className="flex flex-col gap-5" noValidate>
              <FormField id="inquiry-name" label="Full name" error={inquiryErrors.name}>
                <input
                  name="name"
                  autoComplete="name"
                  value={inquiry.name}
                  onChange={(c) => setInquiry((s) => ({ ...s, name: c.target.value }))}
                  className={inputClass}
                  placeholder="Alex Perera"
                />
              </FormField>
              <FormField
                id="inquiry-email"
                label="Email"
                hint="We never send spam."
                error={inquiryErrors.email}
              >
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={inquiry.email}
                  onChange={(c) => setInquiry((s) => ({ ...s, email: c.target.value }))}
                  className={inputClass}
                  placeholder="you@example.com"
                />
              </FormField>
              <FormField id="inquiry-topic" label="Topic">
                <select
                  name="topic"
                  value={inquiry.topic}
                  onChange={(c) => setInquiry((s) => ({ ...s, topic: c.target.value }))}
                  className={selectClass}
                >
                  <option value="general">General</option>
                  <option value="order">Order help</option>
                  <option value="wholesale">Wholesale</option>
                </select>
              </FormField>
              <FormField id="inquiry-message" label="Message" error={inquiryErrors.message}>
                <textarea
                  name="message"
                  rows={4}
                  value={inquiry.message}
                  onChange={(c) => setInquiry((s) => ({ ...s, message: c.target.value }))}
                  className={`${inputClass} min-h-[120px] resize-y`}
                  placeholder="How can we help?"
                />
              </FormField>
              <TouchButton
                type="submit"
                className="mt-2 w-full bg-[var(--color-accent)] text-black hover:bg-[var(--color-accent-dark)] sm:w-auto"
              >
                Send (demo)
              </TouchButton>
            </form>
          </section>

          <section
            className="glass rounded-2xl border border-[var(--color-border)] p-6 sm:p-8"
            aria-labelledby="news-heading"
          >
            <h2 id="news-heading" className="text-fluid-lg mb-6 font-black">
              Newsletter
            </h2>
            <p className="mb-6 text-sm text-[var(--color-text-secondary)]">
              Compact pattern for email capture; full-width submit on mobile matches thumb reach.
            </p>
            <form onSubmit={submitNewsletter} className="flex flex-col gap-5" noValidate>
              <FormField id="news-email" label="Email" error={newsError}>
                <input
                  type="email"
                  name="newsletter-email"
                  autoComplete="email"
                  value={newsletter.email}
                  onChange={(c) => {
                    setNewsletter({ email: c.target.value })
                    setNewsError('')
                  }}
                  className={inputClass}
                  placeholder="you@example.com"
                />
              </FormField>
              <TouchButton
                type="submit"
                className="w-full border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-surface-light)]"
              >
                Subscribe
              </TouchButton>
            </form>
          </section>
        </div>
      </PageShell>
    </div>
  )
}
