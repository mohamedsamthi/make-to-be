import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiShoppingBag, FiTruck, FiShield, FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { FaWhatsapp, FaStar, FaQuoteLeft } from 'react-icons/fa'
import { MdLocalOffer, MdVerified } from 'react-icons/md'
import ProductCard from '../../components/product/ProductCard'
import { shopInfo } from '../../data/demoData'
import { useProducts } from '../../context/ProductContext'

export default function HomePage() {
  const { featuredProducts, discountedProducts, categories, reviews, promotions } = useProducts()
  const [currentPromo, setCurrentPromo] = useState(0)

  // Auto rotate promotions
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPromo(prev => (prev + 1) % promotions.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div>
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-surface)] via-[var(--color-primary)] to-[var(--color-surface)]" />
          <div className="absolute top-20 right-10 w-96 h-96 bg-[var(--color-accent)]/10 rounded-full blur-3xl animate-pulse-soft" />
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-[var(--color-gold)]/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative z-10 pt-24 pb-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="animate-fadeInUp">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light mb-6">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs font-medium text-[var(--color-text-secondary)]">Now Open for Online Orders</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-[var(--font-family-heading)] leading-tight mb-6">
                Discover Your
                <br />
                <span className="gradient-text">Perfect Style</span>
                <br />
                at <span className="text-[var(--color-accent)]">Make To Be</span>
              </h1>

              <p className="text-lg text-[var(--color-text-secondary)] mb-8 max-w-lg leading-relaxed">
                Premium watches, designer dresses, and luxury accessories.
                Shop from Kalmunai's finest collection with exclusive deals and doorstep delivery.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <Link to="/products" className="btn-primary text-base px-8 py-3.5">
                  <FiShoppingBag size={20} /> Shop Now <FiArrowRight size={18} />
                </Link>
                <a href={shopInfo.socialMedia.whatsapp} target="_blank" rel="noreferrer"
                  className="btn-outline text-base px-8 py-3.5 border-green-500 text-green-400 hover:bg-green-500 hover:text-white">
                  <FaWhatsapp size={20} /> WhatsApp Us
                </a>
              </div>

              {/* Stats */}
              <div className="flex gap-8">
                {[
                  { value: '500+', label: 'Products' },
                  { value: '2K+', label: 'Happy Customers' },
                  { value: '4.8', label: 'Avg Rating' }
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <p className="text-2xl font-bold gradient-text">{stat.value}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Featured Product Showcase */}
            <div className="hidden lg:block animate-slideInRight">
              <div className="relative">
                <div className="absolute inset-0 gradient-accent rounded-3xl blur-3xl opacity-20 animate-pulse-soft" />
                <div className="relative glass rounded-3xl p-6 overflow-hidden">
                  <div className="grid grid-cols-2 gap-4">
                    {featuredProducts.slice(0, 4).map((product, i) => (
                      <Link
                        key={product.id}
                        to={`/products/${product.id}`}
                        className="group relative aspect-square rounded-2xl overflow-hidden"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      >
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="text-xs font-semibold truncate">{product.name}</p>
                          <p className="text-xs text-[var(--color-accent)]">
                            LKR {(product.discount_price || product.price).toLocaleString()}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-6 h-10 rounded-full border-2 border-[var(--color-text-muted)] flex items-start justify-center p-1.5">
            <div className="w-1.5 h-3 rounded-full bg-[var(--color-accent)] animate-pulse" />
          </div>
        </div>
      </section>

      {/* ===== SCROLLING PROMOTIONS BAR ===== */}
      <section className="py-3 bg-[var(--color-accent)] overflow-hidden">
        <div className="animate-scroll-left whitespace-nowrap">
          {[...Array(3)].map((_, repeat) => (
            <span key={repeat} className="inline-block">
              {promotions.map((promo, i) => (
                <span key={i} className="inline-flex items-center gap-3 mx-8 text-sm font-semibold">
                  <MdLocalOffer size={16} />
                  {promo.title} - {promo.description}
                  <span className="mx-4">•</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-[var(--color-accent)] text-sm font-semibold uppercase tracking-widest mb-2">Browse</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-[var(--font-family-heading)]">Shop by Category</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                className="group relative overflow-hidden rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 card-hover p-8 text-center"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <span className="text-5xl mb-4 block">{cat.icon}</span>
                  <h3 className="text-xl font-bold mb-1">{cat.name}</h3>
                  <p className="text-sm text-[var(--color-text-muted)]">{cat.product_count} Products</p>
                  <span className="inline-flex items-center gap-1 mt-4 text-sm text-[var(--color-accent)] font-medium opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                    Explore <FiArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="section-padding bg-[var(--color-primary)]">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[var(--color-gold)] text-sm font-semibold uppercase tracking-widest mb-2">⭐ Handpicked</p>
              <h2 className="text-3xl sm:text-4xl font-bold font-[var(--font-family-heading)]">Featured Products</h2>
            </div>
            <Link to="/products" className="hidden sm:flex items-center gap-2 text-sm text-[var(--color-accent)] font-medium hover:gap-3 transition-all">
              View All <FiArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, i) => (
              <div key={product.id} className="animate-fadeInUp" style={{ animationDelay: `${i * 0.1}s` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <div className="sm:hidden text-center mt-8">
            <Link to="/products" className="btn-outline">
              View All Products <FiArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== PROMOTION BANNER ===== */}
      <section className="section-padding overflow-hidden">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[var(--color-accent)] text-xs font-bold uppercase tracking-widest mb-1">🎯 Special Offers</p>
              <h2 className="text-2xl sm:text-3xl font-bold font-[var(--font-family-heading)]">Today's Best Deals</h2>
            </div>
            <Link to="/products?discount=true" className="hidden sm:flex items-center gap-1 text-sm text-[var(--color-accent)] font-medium hover:gap-2 transition-all">
              All Deals <FiArrowRight size={14} />
            </Link>
          </div>

          {/* Main Banner Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* === HERO PROMO BANNER === */}
            <div className="lg:col-span-2 relative rounded-2xl overflow-hidden min-h-[300px] sm:min-h-[360px] flex items-end">
              {/* Background Image with overlay */}
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80"
                  alt="Sale Banner"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#1e1b4b]/95 via-[#1e1b4b]/70 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1e1b4b]/80 via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="relative z-10 p-6 sm:p-10 w-full max-w-lg">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-[var(--color-accent)] text-white text-xs font-bold shadow-lg shadow-[var(--color-accent)]/30">
                  🔥 {promotions[currentPromo]?.discount_percentage}% OFF — LIMITED TIME
                </div>

                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-3 font-[var(--font-family-heading)]">
                  {promotions[currentPromo]?.title}
                </h3>
                <p className="text-white/70 text-sm sm:text-base mb-6 leading-relaxed max-w-sm">
                  {promotions[currentPromo]?.description}
                </p>

                <div className="flex flex-wrap gap-3 items-center">
                  <Link to="/products?discount=true" className="btn-primary px-7 py-3 group text-sm">
                    Shop Now <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link to="/products" className="px-6 py-3 rounded-xl border border-white/30 text-white text-sm font-medium hover:bg-white/10 transition-all">
                    View All
                  </Link>
                </div>

                {/* Promo dots */}
                <div className="flex gap-2 mt-8">
                  {promotions.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPromo(i)}
                      className={`h-1.5 rounded-full transition-all duration-500 ${i === currentPromo ? 'bg-white w-8' : 'bg-white/30 w-3'}`}
                      aria-label={`Promo ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* === RIGHT: Mini Promo Cards === */}
            <div className="flex flex-col gap-4">
              {/* Mini Banner 1 */}
              <div className="relative rounded-2xl overflow-hidden h-[168px] flex items-end group cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"
                  alt="Watches Sale"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <Link to="/products?category=watches" className="relative z-10 p-4 w-full flex items-end justify-between">
                  <div>
                    <p className="text-white/70 text-[10px] font-semibold uppercase tracking-widest mb-0.5">Watches</p>
                    <p className="text-white font-bold text-base leading-tight">Up to 40% Off</p>
                  </div>
                  <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:bg-[var(--color-accent)] transition-all">
                    <FiArrowRight size={14} className="text-white" />
                  </span>
                </Link>
              </div>

              {/* Mini Banner 2 */}
              <div className="relative rounded-2xl overflow-hidden h-[168px] flex items-end group cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"
                  alt="Shoes Sale"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <Link to="/products?category=shoes" className="relative z-10 p-4 w-full flex items-end justify-between">
                  <div>
                    <p className="text-white/70 text-[10px] font-semibold uppercase tracking-widest mb-0.5">Footwear</p>
                    <p className="text-white font-bold text-base leading-tight">New Arrivals</p>
                  </div>
                  <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:bg-[var(--color-accent)] transition-all">
                    <FiArrowRight size={14} className="text-white" />
                  </span>
                </Link>
              </div>
            </div>

          </div>

          {/* Bottom: Mini Category Quick Links */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            {[
              { label: 'Watches', emoji: '⌚', color: 'from-violet-600/20 to-purple-600/5', path: '/products?category=watches' },
              { label: 'Dresses', emoji: '👗', color: 'from-pink-600/20 to-rose-600/5', path: '/products?category=dresses' },
              { label: 'Shoes',   emoji: '👟', color: 'from-blue-600/20 to-indigo-600/5', path: '/products?category=shoes' },
              { label: 'All Deals', emoji: '🔥', color: 'from-amber-600/20 to-orange-600/5', path: '/products?discount=true' },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br ${item.color} border border-white/5 hover:border-[var(--color-accent)]/30 hover:bg-[var(--color-accent)]/10 transition-all group`}
              >
                <span className="text-2xl">{item.emoji}</span>
                <div>
                  <p className="text-sm font-semibold text-white group-hover:text-[var(--color-accent-light)] transition-colors">{item.label}</p>
                  <p className="text-[10px] text-white/50">Shop now →</p>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ===== DEALS & DISCOUNTS ===== */}
      <section className="section-padding bg-[var(--color-primary)]">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[var(--color-accent)] text-sm font-semibold uppercase tracking-widest mb-2">🔥 Hot Deals</p>
              <h2 className="text-3xl sm:text-4xl font-bold font-[var(--font-family-heading)]">Discounted Products</h2>
            </div>
            <Link to="/products?discount=true" className="hidden sm:flex items-center gap-2 text-sm text-[var(--color-accent)] font-medium hover:gap-3 transition-all">
              View All Deals <FiArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {discountedProducts.slice(0, 4).map((product, i) => (
              <div key={product.id} className="animate-fadeInUp" style={{ animationDelay: `${i * 0.1}s` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-[var(--color-accent)] text-sm font-semibold uppercase tracking-widest mb-2">Why Us</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-[var(--font-family-heading)]">Why Choose Make To Be?</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <MdVerified size={32} />, title: 'Authentic Products', desc: '100% genuine products with quality guarantee' },
              { icon: <FiTruck size={32} />, title: 'Fast Delivery', desc: 'Quick delivery across Sri Lanka' },
              { icon: <FiShield size={32} />, title: 'Secure Payment', desc: 'Safe bank transfer payment method' },
              { icon: <FiStar size={32} />, title: 'Top Rated', desc: '4.8★ average rating from 2000+ customers' }
            ].map((item, i) => (
              <div
                key={i}
                className="text-center p-6 rounded-2xl glass-light card-hover"
              >
                <div className="w-16 h-16 rounded-2xl gradient-accent flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CUSTOMER REVIEWS ===== */}
      <section className="section-padding bg-[var(--color-primary)]">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-[var(--color-gold)] text-sm font-semibold uppercase tracking-widest mb-2">Testimonials</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-[var(--font-family-heading)]">What Customers Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.filter(r => r.rating >= 4).slice(0, 3).map((review, i) => (
              <div key={review.id} className="p-6 rounded-2xl glass-light card-hover relative">
                <FaQuoteLeft className="text-[var(--color-accent)]/20 absolute top-4 right-4" size={30} />
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <FaStar key={j} size={14} className={j < review.rating ? 'text-[var(--color-gold)]' : 'text-[var(--color-text-muted)]'} />
                  ))}
                </div>
                <p className="text-sm text-[var(--color-text-secondary)] mb-4 leading-relaxed">"{review.comment}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-accent flex items-center justify-center font-bold text-sm">
                    {review.user_name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{review.user_name}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">Verified Buyer</p>
                  </div>
                </div>
                {review.admin_reply && (
                  <div className="mt-4 pl-4 border-l-2 border-[var(--color-accent)]">
                    <p className="text-xs text-[var(--color-text-muted)] mb-1">Reply from Make To Be:</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">{review.admin_reply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="rounded-3xl glass p-10 sm:p-16 relative overflow-hidden">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-[var(--color-accent)]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-[var(--color-gold)]/10 rounded-full blur-3xl" />
            <div className="relative z-10 flex flex-col items-center text-center">
              <h2 className="text-3xl sm:text-4xl font-black mb-4 font-[var(--font-family-heading)]">
                Ready to Upgrade<br />
                <span className="gradient-text">Your Style?</span>
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-8 max-w-md leading-relaxed">
                Browse our collection of premium watches, dresses, and accessories. Order now and get free delivery!
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/products" className="btn-primary text-base px-8 py-3.5">
                  <FiShoppingBag size={20} /> Start Shopping
                </Link>
                <a href={shopInfo.socialMedia.whatsapp} target="_blank" rel="noreferrer"
                  className="btn-outline text-base px-8 py-3.5">
                  <FaWhatsapp size={20} /> Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
