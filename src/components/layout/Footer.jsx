import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  FaWhatsapp,
  FaEnvelope,
  FaHeart,
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcPaypal,
  FaCcDiscover,
  FaCcApplePay,
} from 'react-icons/fa'
import { FiInstagram, FiFacebook, FiShield } from 'react-icons/fi'
import { shopInfo } from '../../data/demoData'
import { useLanguage } from '../../context/LanguageContext'

/** Shared tile for payment / trust badges — consistent height, theme-aware */
function PaymentTile({ children, label, className = '' }) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`flex h-11 min-w-[4.5rem] shrink-0 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-card)] px-3 shadow-sm transition-colors hover:border-[var(--color-accent)]/40 ${className}`.trim()}
    >
      {children}
    </div>
  )
}

export default function Footer() {
  const { t } = useLanguage()
  const year = new Date().getFullYear()

  const quickLinks = useMemo(
    () => [
      { label: t('footer.shopAll'), to: '/products' },
      { label: t('footer.hotDeals'), to: '/products?discount=true' },
      { label: t('footer.myOrders'), to: '/orders' },
      { label: t('nav.about'), to: '/about' },
      { label: t('nav.forms'), to: '/forms' },
      { label: t('nav.contact'), to: '/contact' },
    ],
    [t]
  )

  const categories = useMemo(
    () => [
      { label: t('categories.watches'), to: '/products?category=watches' },
      { label: t('categories.dresses'), to: '/products?category=dresses' },
      { label: t('categories.shoes'), to: '/products?category=shoes' },
      { label: t('categories.accessories'), to: '/products?category=accessories' },
    ],
    [t]
  )

  const socials = useMemo(
    () => [
      { href: shopInfo.socialMedia.whatsapp, icon: <FaWhatsapp size={20} />, label: t('footer.socialWhatsapp') },
      { href: shopInfo.socialMedia.instagram, icon: <FiInstagram size={20} />, label: t('footer.socialInstagram') },
      { href: shopInfo.socialMedia.facebook, icon: <FiFacebook size={20} />, label: t('footer.socialFacebook') },
      { href: `mailto:${shopInfo.email}`, icon: <FaEnvelope size={20} />, label: t('footer.socialEmail') },
    ],
    [t]
  )

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
              {t('footer.tagline')}
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
            <h3 className="text-[var(--color-text-primary)] font-black mb-8 uppercase tracking-[0.2em] text-xs">{t('footer.navigation')}</h3>
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
            <h3 className="text-[var(--color-text-primary)] font-black mb-8 uppercase tracking-[0.2em] text-xs">{t('footer.collections')}</h3>
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
            <h3 className="text-[var(--color-text-primary)] font-black mb-8 uppercase tracking-[0.2em] text-xs">{t('footer.support')}</h3>
            <div className="space-y-5 mb-8">
              <a href={`tel:${shopInfo.phone}`} className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
                <span className="block text-[8px] text-[var(--color-accent)] mb-1">{t('footer.callUs')}</span>
                {shopInfo.phone}
              </a>
              <a href={`mailto:${shopInfo.email}`} className="block text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors break-words">
                <span className="block text-[8px] text-[var(--color-accent)] mb-1">{t('footer.emailUs')}</span>
                {shopInfo.email}
              </a>
            </div>

            {/* Bank Card (Extremely minimal) */}
            <div className="pt-4 border-t border-[var(--color-border)]">
              <p className="text-[8px] uppercase tracking-[0.2em] text-[var(--color-accent)] mb-3 font-black">{t('footer.bankPayment')}</p>
              <p className="text-[10px] text-[var(--color-text-primary)] font-black uppercase tracking-tight">{shopInfo.bankDetails.bankName}</p>
              <p className="text-[11px] text-[var(--color-text-muted)] font-mono font-bold mt-1 tracking-widest">{shopInfo.bankDetails.accountNumber}</p>
            </div>
          </div>

        </div>
      </div>

      {/* ── Payment methods & trust ── */}
      <div className="border-t border-[var(--color-border)] bg-[var(--color-surface-light)]/60">
        <div className="container-custom py-10 lg:py-12">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
            <div className="min-w-0 flex-1">
              <h3 className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-[var(--color-text-primary)]">
                {t('footer.paymentMethods')}
              </h3>
              <p className="mb-4 max-w-xl text-[11px] leading-relaxed text-[var(--color-text-muted)]">
                {t('footer.paymentBlurb')}
              </p>
              <ul
                className="flex flex-wrap items-center gap-2 sm:gap-3"
                aria-label={t('footer.acceptedMethodsAria')}
              >
                <li>
                  <PaymentTile label={t('footer.cashOnDelivery')}>
                    <span className="whitespace-pre-line text-center text-[8px] font-black uppercase leading-tight tracking-tight text-[var(--color-accent)]">
                      {t('footer.cashOnDeliveryShort')}
                    </span>
                  </PaymentTile>
                </li>
                <li>
                  <PaymentTile label="Visa">
                    <FaCcVisa className="h-8 w-auto text-[#1A1F71]" aria-hidden />
                  </PaymentTile>
                </li>
                <li>
                  <PaymentTile label="Mastercard">
                    <FaCcMastercard className="h-8 w-auto text-[#EB001B]" aria-hidden />
                  </PaymentTile>
                </li>
                <li>
                  <PaymentTile label="American Express">
                    <FaCcAmex className="h-8 w-auto text-[#006FCF]" aria-hidden />
                  </PaymentTile>
                </li>
                <li>
                  <PaymentTile label="PayPal">
                    <FaCcPaypal className="h-8 w-auto text-[#003087]" aria-hidden />
                  </PaymentTile>
                </li>
                <li>
                  <PaymentTile label="Discover">
                    <FaCcDiscover className="h-8 w-auto text-[#FF6000]" aria-hidden />
                  </PaymentTile>
                </li>
                <li>
                  <PaymentTile label="Apple Pay">
                    <FaCcApplePay className="h-8 w-auto text-[var(--color-text-primary)]" aria-hidden />
                  </PaymentTile>
                </li>
                <li>
                  <PaymentTile label={t('footer.easyInstallments')}>
                    <span className="whitespace-pre-line px-0.5 text-center text-[7px] font-black uppercase leading-tight tracking-tight text-[var(--color-text-secondary)]">
                      {t('footer.easyInstallmentsShort')}
                    </span>
                  </PaymentTile>
                </li>
              </ul>
            </div>

            <div className="shrink-0 lg:max-w-xs lg:text-right">
              <h3 className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-[var(--color-text-primary)] lg:text-right">
                {t('footer.verifiedBy')}
              </h3>
              <div
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] px-4 py-3 shadow-sm"
                role="img"
                aria-label={t('footer.trustBadgeAria')}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent)]/15 text-[var(--color-accent)]">
                  <FiShield className="h-5 w-5" aria-hidden />
                </span>
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-accent)]">
                    {t('footer.secureCheckout')}
                  </p>
                  <p className="mt-0.5 text-[9px] font-bold uppercase tracking-wide text-[var(--color-text-muted)]">
                    {t('footer.sslPci')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Copyright Bar ── */}
      <div className="border-t border-[var(--color-border)] bg-[var(--color-surface-light)]">
        <div className="container-custom py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[9px] uppercase font-black tracking-[0.2em] text-[var(--color-text-muted)]">
            {t('footer.copyright', { year })}
          </p>
          <p className="flex items-center gap-2 text-[9px] uppercase font-black tracking-[0.2em] text-[var(--color-text-muted)]">
            {t('footer.design')}{' '}
            <FaHeart size={10} className="text-[var(--color-accent)] animate-pulse" aria-hidden />{' '}
            {t('footer.sriLanka')}
          </p>
        </div>
      </div>
    </footer>
  )
}