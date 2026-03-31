import { Link } from 'react-router-dom'
import {
  FiTarget,
  FiHeart,
  FiShield,
  FiSend,
  FiArrowRight,
  FiMapPin,
  FiTruck,
  FiStar,
} from 'react-icons/fi'
import { MdVerified } from 'react-icons/md'
import { useProducts } from '../../context/ProductContext'


const values = [
  {
    icon: <FiTarget size={20} />,
    title: 'Our Vision',
    desc: 'To be the leading destination for premium fashion and lifestyle products in Sri Lanka.',
    color: 'from-violet-500/20 to-purple-500/5',
    border: 'border-violet-500/20',
    accent: 'text-violet-400',
  },
  {
    icon: <FiHeart size={20} />,
    title: 'Our Passion',
    desc: 'Every product is chosen with love and care. We live for style and it shows in every detail.',
    color: 'from-pink-500/20 to-rose-500/5',
    border: 'border-pink-500/20',
    accent: 'text-pink-400',
  },
  {
    icon: <FiShield size={20} />,
    title: 'Our Trust',
    desc: '100% authentic products with full quality guarantee. Your satisfaction is our promise.',
    color: 'from-emerald-500/20 to-teal-500/5',
    border: 'border-emerald-500/20',
    accent: 'text-emerald-400',
  },
  {
    icon: <FiSend size={20} />,
    title: 'Our Goal',
    desc: 'Making premium fashion accessible to everyone — because great style has no limits.',
    color: 'from-amber-500/20 to-yellow-500/5',
    border: 'border-amber-500/20',
    accent: 'text-amber-400',
  },
]

// Static values moved inside component or kept if truly static
const whyUs = [

  { icon: <MdVerified size={22} />, title: 'Genuine Products', desc: 'Authentic quality guaranteed' },
  { icon: <FiTruck size={20} />, title: 'Fast Delivery', desc: 'All across Sri Lanka' },
  { icon: <FiShield size={20} />, title: 'Secure Payment', desc: 'Safe bank transfer' },
  { icon: <FiMapPin size={20} />, title: 'Kalmunai Based', desc: 'Sri Lanka trusted store' },
]

const badges = [
  { icon: <MdVerified size={13} />, text: '100% Authentic' },
  { icon: <FiTruck size={13} />, text: 'Island-wide Delivery' },
  { icon: <FiStar size={13} />, text: '4.8★ Rated' },
]

const cx = { maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }

export default function AboutPage() {
  const { products, orders, reviews, profiles } = useProducts()

  const liveStats = [
    { 
      value: (profiles.length + orders.length) > 50 ? `${profiles.length + orders.length}+` : (profiles.length + orders.length), 
      label: 'Happy Customers' 
    },
    { 
      value: products.length > 50 ? `${products.length}+` : products.length, 
      label: 'Products' 
    },
    { 
      value: reviews.length > 0 
        ? `${(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)}★` 
        : '4.8★', 
      label: 'Avg Rating' 
    },
    { value: '100%', label: 'Authentic' },
  ]

  return (
    <div className="relative min-h-screen bg-[var(--color-surface)]">

      {/* ═══════════════════════════
          HERO
      ═══════════════════════════ */}
      <div className="bg-[var(--color-primary)] border-b border-[var(--color-border)]">
        <div style={cx}>

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 pt-6 pb-0 text-xs text-[var(--color-text-muted)] sm:pt-8">
            <Link to="/" className="transition-colors hover:text-[var(--color-accent)]">Home</Link>
            <span>/</span>
            <span className="text-white">About Us</span>
          </nav>

          {/* Hero content */}
          <div className="py-6 sm:py-10 lg:py-12">

            {/* Label */}
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent)] sm:mb-4 sm:text-[11px]">
              Who We Are
            </p>

            {/* Heading */}
            <h1 className="mb-5 font-[var(--font-family-heading)] text-[2.2rem] font-black leading-[1.1] sm:text-5xl lg:text-6xl">
              Reinventing Your
              <br />
              <span className="gradient-text">Style Journey</span>
            </h1>

            {/* Sub text */}
            <p className="mb-8 max-w-lg text-sm leading-7 text-[var(--color-text-secondary)] sm:mb-10 sm:text-[15px] sm:leading-8">
              Welcome to{' '}
              <span className="font-semibold text-[var(--color-accent)]">Make To Be</span>{' '}
              — a premium fashion & lifestyle destination founded in Kalmunai, Sri Lanka.
            </p>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {liveStats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] px-4 py-5 text-center shadow-sm sm:px-5 sm:py-6"
                >
                  <p className="text-xl font-black text-[var(--color-accent)] sm:text-2xl lg:text-3xl">
                    {s.value}
                  </p>
                  <p className="mt-1.5 text-[10px] text-[var(--color-text-muted)] sm:text-xs">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════
          OUR STORY
      ═══════════════════════════ */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div style={cx}>
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">

            {/* Story text */}
            <div>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent)] sm:text-[11px]">
                Our Story
              </p>
              <h2 className="mb-5 font-[var(--font-family-heading)] text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
                Built on Quality,
                <br />
                Driven by Style
              </h2>

              <div className="space-y-4 text-sm leading-8 text-[var(--color-text-secondary)] sm:text-[15px]">
                <p>
                  Founded in Kalmunai, Sri Lanka,{' '}
                  <strong className="font-semibold text-white">Make To Be</strong>{' '}
                  started with a simple vision — to bring the finest global styles to our
                  local community. We believe everyone deserves to look and feel their best.
                </p>
                <p>
                  We handpick every item in our collection, from the intricate details of
                  our designer dresses to the precision engineering of our timepieces. Our
                  commitment to authenticity is what makes us{' '}
                  <span className="font-semibold text-[var(--color-accent)]">Make To Be</span>.
                </p>
              </div>

              {/* Badges */}
              <div className="mt-6 flex flex-wrap gap-2 sm:mt-7 sm:gap-3">
                {badges.map((b) => (
                  <span
                    key={b.text}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/10 px-3 py-1.5 text-[11px] font-medium text-[var(--color-accent-light)] sm:text-xs"
                  >
                    {b.icon} {b.text}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-8">
                <Link
                  to="/products"
                  className="btn-primary inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 hover:scale-105 sm:px-7"
                >
                  Browse Products <FiArrowRight size={15} />
                </Link>
              </div>
            </div>

            {/* Value cards — 1 col mobile, 2 col tablet+ */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              {values.map((item, i) => (
                <div
                  key={i}
                  className={`flex flex-col rounded-2xl border bg-gradient-to-br p-5 transition-all duration-300 hover:-translate-y-1 sm:p-6 ${item.color} ${item.border}`}
                >
                  <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 shadow-md ${item.accent}`}>
                    {item.icon}
                  </div>
                  <h4 className="mb-2 text-sm font-bold text-white">{item.title}</h4>
                  <p className="text-xs leading-6 text-white/65">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════
          MISSION BANNER
      ═══════════════════════════ */}
      <section className="pb-12 sm:pb-16 lg:pb-20">
        <div style={cx}>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-dark)] text-white shadow-xl shadow-[var(--color-accent)]/20">

            {/* Blobs */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full bg-white/5 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-44 w-44 rounded-full bg-black/10 blur-3xl" />

            {/* Content */}
            <div className="relative z-10 px-6 py-10 text-center sm:px-10 sm:py-14 lg:px-16 lg:py-16">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/55 sm:text-[11px]">
                Our Mission
              </p>
              <h2 className="mb-4 font-[var(--font-family-heading)] text-2xl font-black leading-tight sm:mb-5 sm:text-3xl lg:text-4xl">
                Fashion For Everyone
              </h2>
              <p className="mx-auto max-w-lg text-sm leading-7 text-white/80 sm:text-[15px] sm:leading-8">
                "To empower individuals to express their unique identity through curated,
                high-quality fashion and accessories that combine timeless elegance with
                modern trends."
              </p>

              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:mt-8 sm:flex-row">
                <Link
                  to="/products"
                  className="inline-flex w-full max-w-[200px] items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-bold text-[var(--color-accent)] transition-all duration-300 hover:scale-105 hover:bg-white/90 sm:w-auto"
                >
                  Shop Now
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex w-full max-w-[200px] items-center justify-center rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-white/10 sm:w-auto"
                >
                  Get in Touch
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════
          WHY CHOOSE US
      ═══════════════════════════ */}
      <section className="border-y border-[var(--color-border)] bg-[var(--color-primary)] py-10 sm:py-12 lg:py-14">
        <div style={cx}>

          {/* Section title */}
          <p className="mb-8 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)] sm:mb-10 sm:text-[11px]">
            Why Choose Us
          </p>

          {/* 2 cols mobile → 4 cols desktop */}
          <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
            {whyUs.map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="gradient-accent mb-3 flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-lg shadow-purple-500/20 sm:h-12 sm:w-12">
                  {item.icon}
                </div>
                <p className="text-xs font-bold sm:text-sm">{item.title}</p>
                <p className="mt-1.5 text-[11px] leading-5 text-[var(--color-text-muted)] sm:text-xs">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}