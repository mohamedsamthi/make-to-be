import { Link } from 'react-router-dom'
import { FiTarget, FiHeart, FiShield, FiSend, FiArrowRight, FiMapPin, FiTruck, FiStar } from 'react-icons/fi'
import { MdVerified } from 'react-icons/md'
import { shopInfo } from '../../data/demoData'

const values = [
  {
    icon: <FiTarget size={22} />,
    title: 'Our Vision',
    desc: 'To be the leading destination for premium fashion and lifestyle products in Sri Lanka.',
    color: 'from-violet-500/20 to-purple-500/5',
    border: 'border-violet-500/20',
  },
  {
    icon: <FiHeart size={22} />,
    title: 'Our Passion',
    desc: 'Every product is chosen with love and care. We live for style and it shows in every detail.',
    color: 'from-pink-500/20 to-rose-500/5',
    border: 'border-pink-500/20',
  },
  {
    icon: <FiShield size={22} />,
    title: 'Our Trust',
    desc: '100% authentic products with full quality guarantee. Your satisfaction is our promise.',
    color: 'from-emerald-500/20 to-teal-500/5',
    border: 'border-emerald-500/20',
  },
  {
    icon: <FiSend size={22} />,
    title: 'Our Goal',
    desc: 'Making premium fashion accessible to everyone — because great style has no limits.',
    color: 'from-amber-500/20 to-yellow-500/5',
    border: 'border-amber-500/20',
  },
]

const stats = [
  { value: '2,000+', label: 'Happy Customers' },
  { value: '500+', label: 'Products' },
  { value: '4.8★', label: 'Average Rating' },
  { value: '100%', label: 'Authentic' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)]">

      {/* ── HERO BANNER ── */}
      <div className="bg-[var(--color-primary)] border-b border-[var(--color-border)]">
        <div className="container-custom py-12 sm:py-16">
          <nav className="text-xs text-[var(--color-text-muted)] flex items-center gap-2 mb-5">
            <Link to="/" className="hover:text-[var(--color-accent)] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">About Us</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-xl">
              <p className="text-[var(--color-accent)] text-xs font-bold uppercase tracking-widest mb-3">Who We Are</p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-[var(--font-family-heading)] leading-tight mb-4">
                Reinventing Your<br />
                <span className="gradient-text">Style Journey</span>
              </h1>
              <p className="text-[var(--color-text-secondary)] text-sm sm:text-base leading-relaxed">
                Welcome to <span className="text-[var(--color-accent)] font-semibold">Make To Be</span> — a premium fashion & lifestyle destination founded in Kalmunai, Sri Lanka.
              </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3 lg:shrink-0">
              {stats.map(stat => (
                <div key={stat.label} className="text-center p-4 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)]">
                  <p className="text-xl sm:text-2xl font-black text-[var(--color-accent)]">{stat.value}</p>
                  <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── OUR STORY + VALUE CARDS ── */}
      <section className="container-custom py-12 sm:py-16">
        <div className="grid lg:grid-cols-2 gap-10 items-start">

          {/* Left — Story Text */}
          <div>
            <p className="text-[var(--color-accent)] text-xs font-bold uppercase tracking-widest mb-3">Our Story</p>
            <h2 className="text-2xl sm:text-3xl font-bold font-[var(--font-family-heading)] mb-5">
              Built on Quality,<br />Driven by Style
            </h2>
            <div className="space-y-3 text-sm text-[var(--color-text-secondary)] leading-relaxed">
              <p>
                Founded in Kalmunai, Sri Lanka, <strong className="text-white">Make To Be</strong> started with a simple vision — to bring the finest global styles to our local community. We believe everyone deserves to look and feel their best.
              </p>
              <p>
                We handpick every item in our collection, from the intricate details of our designer dresses to the precision engineering of our timepieces. Our commitment to authenticity is what makes us <em className="text-[var(--color-accent)] not-italic font-semibold">Make To Be</em>.
              </p>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3 mt-6">
              {[
                { icon: <MdVerified size={16} />, text: '100% Authentic' },
                { icon: <FiTruck size={15} />, text: 'Island-wide Delivery' },
                { icon: <FiStar size={15} />, text: '4.8★ Rated' },
              ].map(b => (
                <span key={b.text} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[var(--color-accent)]/10 text-[var(--color-accent-light)] border border-[var(--color-accent)]/20">
                  {b.icon} {b.text}
                </span>
              ))}
            </div>

            <Link to="/products" className="btn-primary mt-8 inline-flex">
              Browse Products <FiArrowRight size={16} />
            </Link>
          </div>

          {/* Right — 2×2 Value Cards */}
          <div className="grid grid-cols-2 gap-4">
            {values.map((item, i) => (
              <div
                key={i}
                className={`flex flex-col p-5 rounded-2xl bg-gradient-to-br ${item.color} border ${item.border} hover:-translate-y-1 transition-all duration-300`}
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4 text-white">
                  {item.icon}
                </div>
                <h4 className="font-bold text-sm text-white mb-1.5">{item.title}</h4>
                <p className="text-xs text-white/70 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── MISSION BANNER ── */}
      <section className="container-custom pb-12 sm:pb-16">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-dark)] p-8 sm:p-12 text-white text-center shadow-xl shadow-[var(--color-accent)]/20">
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-3">Our Mission</p>
            <h2 className="text-2xl sm:text-3xl font-black font-[var(--font-family-heading)] mb-4 leading-tight">
              Fashion For Everyone
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-white/80 max-w-lg mx-auto">
              "To empower individuals to express their unique identity through curated, high-quality fashion and accessories that combine timeless elegance with modern trends."
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-7">
              <Link to="/products" className="px-6 py-2.5 rounded-xl bg-white text-[var(--color-accent)] font-bold text-sm hover:bg-white/90 transition-colors">
                Shop Now
              </Link>
              <Link to="/contact" className="px-6 py-2.5 rounded-xl border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-colors">
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US — HORIZONTAL STRIP ── */}
      <section className="bg-[var(--color-primary)] border-y border-[var(--color-border)] py-10">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { icon: <MdVerified size={24} />, title: 'Genuine Products', desc: 'Authentic quality guaranteed' },
              { icon: <FiTruck size={22} />, title: 'Fast Delivery', desc: 'All across Sri Lanka' },
              { icon: <FiShield size={22} />, title: 'Secure Payment', desc: 'Safe bank transfer' },
              { icon: <FiMapPin size={22} />, title: 'Kalmunai Based', desc: 'Sri Lanka trusted store' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-2.5">
                <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center text-white shadow-md shadow-[var(--color-accent)]/20">
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-bold">{item.title}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
