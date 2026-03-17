import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiShoppingBag, FiTruck, FiShield, FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { FaWhatsapp, FaStar, FaQuoteLeft } from 'react-icons/fa'
import { MdLocalOffer, MdVerified } from 'react-icons/md'
import ProductCard from '../../components/product/ProductCard'
import FeaturedVideo from '../../components/home/FeaturedVideo'
import { shopInfo } from '../../data/demoData'
import { useProducts } from '../../context/ProductContext'

const getYoutubeVideoId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export default function HomePage() {
  const { products, featuredProducts, discountedProducts, categories, reviews, promotions, orders, profiles } = useProducts()
  
  // Calculate real stats
  const stats = [
    { 
      value: products.length > 50 ? `${products.length}+` : products.length, 
      label: 'Products' 
    },
    { 
      value: (profiles.length + orders.length) > 50 ? `${profiles.length + orders.length}+` : (profiles.length + orders.length), 
      label: 'Happy Customers' 
    },
    { 
      value: reviews.length > 0 
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
        : '4.8', 
      label: 'Avg Rating' 
    }
  ]

  const [currentPromo, setCurrentPromo] = useState(0)

  // Auto rotate promotions
  // Auto rotate promotions disabled per user request to allow video viewing without interruption
  // Users can still manual navigate using the dots
  /* 
  useEffect(() => {
    if (promotions.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentPromo(prev => (prev + 1) % promotions.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [promotions.length])
  */

  // Prioritize video promotions to show first
  const sortedPromos = [...promotions].sort((a, b) => {
    let aMedia = '';
    let bMedia = '';
    
    try {
      const aData = JSON.parse(a.description || '{}');
      aMedia = typeof aData === 'object' ? aData.mediaUrl || '' : '';
    } catch(e) {}
    
    try {
      const bData = JSON.parse(b.description || '{}');
      bMedia = typeof bData === 'object' ? bData.mediaUrl || '' : '';
    } catch(e) {}

    const aIsVideo = getYoutubeVideoId(aMedia) || aMedia?.match(/\.(mp4|webm|ogg)$/i);
    const bIsVideo = getYoutubeVideoId(bMedia) || bMedia?.match(/\.(mp4|webm|ogg)$/i);
    
    if (aIsVideo && !bIsVideo) return -1;
    if (!aIsVideo && bIsVideo) return 1;
    return 0;
  });

  const activePromo = sortedPromos[currentPromo]
  let promoText = activePromo?.description || ''
  let promoMedia = ''
  try {
     const parsed = JSON.parse(promoText)
     if (parsed && typeof parsed === 'object') {
        promoText = parsed.text || ''
        promoMedia = parsed.mediaUrl || ''
     }
  } catch(e) {}

  const videoId = getYoutubeVideoId(promoMedia);
  const isDirectVideo = promoMedia?.match(/\.(mp4|webm|ogg)$/i);

  return (
    <div>
      {/* ===== HERO SECTION ===== */}
      <section className="relative pt-8 pb-16 lg:pt-16 lg:pb-24 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-surface)] via-[var(--color-primary)] to-[var(--color-surface)]" />
          <div className="absolute top-20 right-10 w-96 h-96 bg-[var(--color-accent)]/10 rounded-full blur-3xl animate-pulse-soft" />
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-[var(--color-gold)]/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative z-10">
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

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Link to="/products" className="btn-primary px-7 py-3 text-sm sm:text-base justify-center sm:justify-start">
                  <FiShoppingBag size={18} /> Shop Now <FiArrowRight size={16} />
                </Link>
                <a href={shopInfo.socialMedia.whatsapp} target="_blank" rel="noreferrer"
                  className="flex items-center justify-center gap-2 px-7 py-3 rounded-xl border-2 border-emerald-500 text-emerald-400 font-semibold hover:bg-emerald-500 hover:text-white transition-all text-sm sm:text-base">
                  <FaWhatsapp size={18} /> WhatsApp Us
                </a>
              </div>

              <div className="flex flex-wrap gap-6 justify-start">
                {stats.map((stat, i) => (

                  <div key={i}>
                    <p className="text-xl sm:text-2xl font-bold gradient-text">{stat.value}</p>
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
      
      {/* ===== FEATURED VIDEO ===== */}
      <FeaturedVideo />

      {/* ===== PROMOTION BADGES BAR ===== */}
      {promotions.filter(p => p.active).length > 0 && (
        <section className="py-3 bg-[var(--color-accent)] border-y border-white/10">
          <div className="container-custom flex flex-wrap justify-center gap-x-12 gap-y-2">
            {promotions.filter(p => p.active).map((promo, i) => (
              <span key={i} className="inline-flex items-center gap-3 text-sm font-black uppercase tracking-wider">
                <MdLocalOffer className="text-amber-300" size={16} />
                {promo.title}: <span className="text-white/80 font-bold">
                  {(() => {
                    try {
                      const d = JSON.parse(promo.description);
                      return d.text || promo.description;
                    } catch(e) {
                      return promo.description;
                    }
                  })()}
                </span>
              </span>
            ))}
          </div>
        </section>
      )}

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
            <div className={`lg:col-span-2 relative rounded-2xl overflow-hidden min-h-[300px] sm:min-h-[360px] flex ${promoMedia ? 'flex-col md:flex-row' : 'items-end'}`}>
              
              {promoMedia ? (
                <>
                  {/* Split Layout: Left Side Info */}
                  <div className="flex-1 p-6 sm:p-10 flex flex-col justify-center bg-gradient-to-br from-[#1e1c3a] to-[#151230] z-10 relative border-r border-white/5">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/20 rounded-full blur-[80px] pointer-events-none" />
                    
                    <div className="inline-flex flex-wrap items-center gap-2 mb-4">
                      <span className="px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs font-black tracking-widest uppercase">
                        Featured Offer
                      </span>
                      {activePromo?.discount_percentage > 0 && (
                        <span className="px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-black shadow-lg shadow-amber-500/30">
                          🔥 {activePromo.discount_percentage}% OFF
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4 font-[var(--font-family-heading)]">
                      {activePromo?.title}
                    </h3>
                    <p className="text-gray-400 text-sm sm:text-base mb-8 leading-relaxed max-w-sm">
                      {promoText}
                    </p>
                  </div>

                  {/* Right Side Media */}
                  <div className="md:w-1/2 relative bg-black min-h-[250px] md:min-h-[full]">
                    {videoId ? (
                       <iframe 
                         src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0`}
                         className="w-full h-full absolute inset-0 object-cover"
                         allow="autoplay; encrypted-media"
                       />
                    ) : isDirectVideo ? (
                       <video src={promoMedia} autoPlay loop muted playsInline className="w-full h-full absolute inset-0 object-cover" />
                    ) : (
                       <img src={promoMedia} alt="Promo" className="w-full h-full absolute inset-0 object-cover" />
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent md:hidden" />
                    <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#151230] to-transparent hidden md:block" />
                  </div>
                </>
              ) : (
                <>
                  {/* Fallback Single Output Layout */}
                  <div className="absolute inset-0">
                    <img
                      src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80"
                      alt="Sale Banner"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1e1c3a]/95 via-[#1e1c3a]/80 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 p-6 sm:p-10 w-full max-w-lg">
                    {activePromo?.discount_percentage > 0 && (
                      <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-violet-600 text-white text-xs font-bold shadow-lg shadow-violet-600/30">
                        🔥 {activePromo.discount_percentage}% OFF — LIMITED TIME
                      </div>
                    )}
                    <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-3 font-[var(--font-family-heading)]">
                      {activePromo?.title}
                    </h3>
                    <p className="text-gray-300 text-sm sm:text-base mb-6 leading-relaxed max-w-sm">
                      {promoText}
                    </p>
                  </div>
                </>
              )}

              {/* Action Buttons overlay for both layouts */}
              <div className={`absolute z-20 ${promoMedia ? 'bottom-6 left-6 md:left-10' : 'bottom-6 left-6 sm:bottom-10 sm:left-10'}`}>
                <div className="flex flex-wrap gap-3 items-center">
                  <Link to="/products?discount=true" className="bg-white text-gray-900 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors shadow-lg shadow-white/20 text-sm">
                    Shop Offer <FiArrowRight />
                  </Link>
                </div>

                {/* Promo dots */}
                <div className="flex gap-2 mt-8">
                  {sortedPromos.map((_, i) => (
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
              { icon: <MdVerified size={28} />, title: 'Authentic Products', desc: '100% genuine products with quality guarantee' },
              { icon: <FiTruck size={28} />, title: 'Fast Delivery', desc: 'Quick delivery across Sri Lanka' },
              { icon: <FiShield size={28} />, title: 'Secure Payment', desc: 'Safe bank transfer payment method' },
              { icon: <FiStar size={28} />, title: 'Top Rated', desc: '4.8★ average rating from 2000+ customers' }
            ].map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center p-7 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/40 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[var(--color-accent)]/10"
              >
                {/* Icon box - centered */}
                <div className="w-14 h-14 rounded-2xl gradient-accent flex items-center justify-center mb-5 text-white shadow-lg shadow-[var(--color-accent)]/30">
                  {item.icon}
                </div>
                <h3 className="text-base font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{item.desc}</p>
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
                    {review.user_name ? review.user_name[0].toUpperCase() : 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{review.user_name || 'User'}</p>
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
