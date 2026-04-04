import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiShoppingBag, FiTruck, FiShield, FiStar, FiChevronLeft, FiChevronRight, FiWatch } from 'react-icons/fi'
import { FaWhatsapp, FaStar, FaQuoteLeft, FaShoePrints } from 'react-icons/fa'
import { MdLocalOffer, MdVerified, MdCheckroom, MdLayers } from 'react-icons/md'
import ProductCard from '../../components/product/ProductCard'
import FeaturedVideo from '../../components/home/FeaturedVideo'
import { shopInfo } from '../../data/demoData'
import { useProducts } from '../../context/ProductContext'
import { useLanguage } from '../../context/LanguageContext'
import { parsePromoDescription } from '../../utils/promoDescription'

const getYoutubeVideoId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export default function HomePage() {
  const { t, messages } = useLanguage()
  const { products, featuredProducts, discountedProducts, categories, reviews, promotions, orders, profiles } = useProducts()

  const stats = useMemo(
    () => [
      {
        value: products.length > 50 ? `${products.length}+` : products.length,
        label: t('home.statsProducts'),
      },
      {
        value:
          profiles.length + orders.length > 50
            ? `${profiles.length + orders.length}+`
            : profiles.length + orders.length,
        label: t('home.statsCustomers'),
      },
      {
        value:
          reviews.length > 0
            ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
            : '4.8',
        label: t('home.statsRating'),
      },
    ],
    [products.length, profiles.length, orders.length, reviews, t]
  )

  const categoryQuickLinks = useMemo(
    () => [
      { label: t('home.quickWatches'), emoji: '⌚', color: 'from-[var(--color-accent)]/20 to-[var(--color-accent)]/5', path: '/products?category=watches' },
      { label: t('home.quickDresses'), emoji: '👗', color: 'from-orange-600/20 to-orange-600/5', path: '/products?category=dresses' },
      { label: t('home.quickShoes'), emoji: '👟', color: 'from-amber-600/20 to-amber-600/5', path: '/products?category=shoes' },
      { label: t('home.quickAllDeals'), emoji: '🔥', color: 'from-orange-600/20 to-red-600/5', path: '/products?discount=true' },
    ],
    [t]
  )

  const whyItems = useMemo(() => {
    const list = messages.homeWhy
    if (!Array.isArray(list)) return []
    const icons = [
      <MdVerified key="0" size={28} />,
      <FiTruck key="1" size={28} />,
      <FiShield key="2" size={28} />,
      <FiStar key="3" size={28} />,
    ]
    return list.map((item, i) => ({ ...item, icon: icons[i] }))
  }, [messages.homeWhy])

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
  const { text: promoTextRaw, mediaUrl: promoMediaRaw } = parsePromoDescription(
    activePromo?.description || ''
  )
  let promoText = promoTextRaw
  let promoMedia = promoMediaRaw

  const videoId = getYoutubeVideoId(promoMedia);
  const isDirectVideo = promoMedia?.match(/\.(mp4|webm|ogg)$/i);

  return (
    <div className="min-w-0 max-w-full overflow-x-clip">
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden pt-4 pb-10 lg:pt-10 lg:pb-16">
        {/* Background */}
        <div className="absolute inset-0 bg-[var(--color-surface)]" />

        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="animate-fadeInUp">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-light mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">{t('home.badge')}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black font-[var(--font-family-heading)] leading-tight mb-4 text-[var(--color-text-primary)]">
                {t('home.heroTitle1')}
                <br />
                {t('home.heroTitle2')}
                <br />
                {t('home.heroTitle3')}{' '}
                <span className="text-[var(--color-accent)]">{t('home.heroBrand')}</span>
              </h1>

              <p className="text-base text-[var(--color-text-secondary)] mb-6 max-w-lg leading-relaxed opacity-90">
                {t('home.heroDesc')}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Link to="/products" className="btn-primary px-6 py-3 text-sm justify-center sm:justify-start">
                  <FiShoppingBag size={18} /> {t('home.shopNow')} <FiArrowRight size={16} />
                </Link>
                <a href={shopInfo.socialMedia.whatsapp} target="_blank" rel="noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white border-2 border-white text-black font-black hover:bg-gray-100 transition-all text-sm shadow-xl shadow-white/5">
                  <FaWhatsapp size={18} /> {t('home.whatsappUs')}
                </a>
              </div>

              <div className="flex flex-wrap gap-5 justify-start">
                {stats.map((stat, i) => (
                  <div key={i} className="border-l border-[var(--color-border)] pl-4 first:border-0 first:pl-0">
                    <p className="text-xl font-black text-[var(--color-text-primary)] tracking-tight">{stat.value}</p>
                    <p className="text-[10px] text-[var(--color-text-muted)] font-bold uppercase tracking-widest">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Featured Product Showcase */}
            <div className="hidden lg:block animate-slideInRight">
              <div className="relative">
                <div className="relative bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl p-6 overflow-hidden">
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
          <div className="text-center mb-16">
            <p className="text-[var(--color-accent)] text-xs font-black uppercase tracking-[0.2em] mb-3">{t('home.collectionsLabel')}</p>
            <h2 className="text-3xl sm:text-5xl font-black font-[var(--font-family-heading)] tracking-tight">{t('home.shopByCategory')}</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => {
              // Icon mapping
              const Icon = {
                watches: FiWatch,
                dresses: MdCheckroom,
                accessories: MdLayers,
                shoes: FaShoePrints
              }[cat.slug] || FiShoppingBag;

              return (
                <Link
                  key={cat.id}
                  to={`/products?category=${cat.slug}`}
                  className="group relative overflow-hidden rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/80 transition-all duration-500 p-8 text-center flex flex-col items-center"
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-[var(--color-accent)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  
                  <div className="w-20 h-20 rounded-2xl bg-[var(--color-surface-light)] border border-[var(--color-border)] flex items-center justify-center mb-6 group-hover:bg-[var(--color-accent)] group-hover:border-transparent transition-all duration-500">
                    <Icon size={32} className="text-[var(--color-accent)] group-hover:text-black transition-colors duration-500" />
                  </div>

                  <h3 className="text-xl font-black mb-1 text-[var(--color-text-primary)] uppercase tracking-tight">
                    {(() => {
                      const ck = `categories.${cat.slug}`
                      const lab = t(ck)
                      return lab === ck ? cat.name : lab
                    })()}
                  </h3>
                  <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">
                    {t('home.categoryCollections', { n: cat.product_count })}
                  </p>
                  
                  <div className="mt-4 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[var(--color-accent)] opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    {t('home.discoverNow')} <FiArrowRight size={12} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="section-padding bg-[var(--color-surface-light)]">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[var(--color-gold)] text-sm font-semibold uppercase tracking-widest mb-2">⭐ {t('home.handpicked')}</p>
              <h2 className="text-3xl sm:text-4xl font-bold font-[var(--font-family-heading)] text-[var(--color-text-primary)]">{t('home.featuredProducts')}</h2>
            </div>
            <Link to="/products" className="hidden sm:flex items-center gap-2 text-sm text-[var(--color-accent)] font-medium hover:gap-3 transition-all">
              {t('home.viewAll')} <FiArrowRight size={16} />
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
              {t('home.viewAllProducts')} <FiArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== PROMOTION BANNER ===== */}
      <section className="section-padding overflow-hidden">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[var(--color-accent)] text-xs font-bold uppercase tracking-widest mb-1">🎯 {t('home.specialOffers')}</p>
              <h2 className="text-2xl sm:text-3xl font-bold font-[var(--font-family-heading)]">{t('home.bestDeals')}</h2>
            </div>
            <Link to="/products?discount=true" className="hidden sm:flex items-center gap-1 text-sm text-[var(--color-accent)] font-medium hover:gap-2 transition-all">
              {t('home.allDeals')} <FiArrowRight size={14} />
            </Link>
          </div>

          {/* Main Banner Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* === HERO PROMO BANNER === */}
            <div className={`lg:col-span-2 relative rounded-2xl overflow-hidden min-h-[300px] sm:min-h-[360px] flex ${promoMedia ? 'flex-col md:flex-row' : 'items-end'}`}>
              
              {promoMedia ? (
                <>
                  {/* Split Layout: Left Side Info */}
                  <div className="flex-1 p-6 sm:p-10 flex flex-col justify-center bg-[var(--color-surface-card)] z-10 relative border-r border-[var(--color-border)]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-accent)]/10 rounded-full blur-[80px] pointer-events-none" />
                    
                    <div className="inline-flex flex-wrap items-center gap-2 mb-4">
                      <span className="px-3 py-1 rounded-full bg-[var(--color-accent)]/20 border border-[var(--color-accent)]/30 text-[var(--color-accent-light)] text-xs font-black tracking-widest uppercase">
                        {t('home.featuredOffer')}
                      </span>
                      {activePromo?.discount_percentage > 0 && (
                        <span className="px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-black shadow-lg shadow-amber-500/30">
                          🔥{' '}
                          {t('productCard.percentOff', { n: activePromo.discount_percentage }).replace(/^-/, '')}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--color-text-primary)] leading-tight mb-4 font-[var(--font-family-heading)]">
                      {activePromo?.title}
                    </h3>
                    <p className="text-[var(--color-text-muted)] text-sm sm:text-base mb-8 leading-relaxed max-w-sm">
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
                    <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[var(--color-surface-card)] to-transparent hidden md:block" />
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
                      <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-[var(--color-accent)] text-white text-xs font-bold shadow-lg shadow-[var(--color-accent)]/30">
                        🔥 {t('home.promoLimitedPill', { n: activePromo.discount_percentage })}
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
                    {t('home.shopOffer')} <FiArrowRight />
                  </Link>
                </div>

                {/* Promo dots */}
                <div className="flex gap-2 mt-8">
                  {sortedPromos.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPromo(i)}
                      className={`h-1.5 rounded-full transition-all duration-500 ${i === currentPromo ? 'bg-white w-8' : 'bg-white/30 w-3'}`}
                      aria-label={t('home.promoDot', { n: i + 1 })}
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
                    <p className="text-white/70 text-[10px] font-semibold uppercase tracking-widest mb-0.5">{t('home.miniWatches')}</p>
                    <p className="text-white font-bold text-base leading-tight">{t('home.miniWatchesDeal')}</p>
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
                    <p className="text-white/70 text-[10px] font-semibold uppercase tracking-widest mb-0.5">{t('home.miniFootwear')}</p>
                    <p className="text-white font-bold text-base leading-tight">{t('home.miniNewArrivals')}</p>
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
            {categoryQuickLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br ${item.color} border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 hover:bg-[var(--color-accent)]/10 transition-all group`}
              >
                <span className="text-2xl">{item.emoji}</span>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-light)] transition-colors">{item.label}</p>
                  <p className="text-[10px] text-[var(--color-text-muted)]">{t('home.shopNowArrow')}</p>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ===== DEALS & DISCOUNTS ===== */}
      <section className="section-padding bg-[var(--color-surface-light)]">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[var(--color-accent)] text-sm font-semibold uppercase tracking-widest mb-2">🔥 {t('home.hotDeals')}</p>
              <h2 className="text-3xl sm:text-4xl font-bold font-[var(--font-family-heading)] text-[var(--color-text-primary)]">{t('home.discountedProducts')}</h2>
            </div>
            <Link to="/products?discount=true" className="hidden sm:flex items-center gap-2 text-sm text-[var(--color-accent)] font-medium hover:gap-3 transition-all">
              {t('home.viewAllDeals')} <FiArrowRight size={16} />
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
            <p className="text-[var(--color-accent)] text-sm font-semibold uppercase tracking-widest mb-2">{t('home.whyUs')}</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-[var(--font-family-heading)]">{t('home.whyTitle')}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyItems.map((item, i) => (
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
      <section className="section-padding bg-[var(--color-surface-light)]">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-[var(--color-gold)] text-sm font-semibold uppercase tracking-widest mb-2">{t('home.testimonials')}</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-[var(--font-family-heading)] text-[var(--color-text-primary)]">{t('home.whatCustomersSay')}</h2>
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
                    <p className="text-sm font-semibold">{review.user_name || t('common.user')}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{t('home.verifiedBuyer')}</p>
                  </div>
                </div>
                {review.admin_reply && (
                  <div className="mt-4 pl-4 border-l-2 border-[var(--color-accent)]">
                    <p className="text-xs text-[var(--color-text-muted)] mb-1">{t('home.replyFrom')}</p>
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
                {t('home.ctaTitle1')}
                <br />
                <span className="gradient-text">{t('home.ctaTitle2')}</span>
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-8 max-w-md leading-relaxed">
                {t('home.ctaDesc')}
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/products" className="btn-primary text-base px-8 py-3.5">
                  <FiShoppingBag size={20} /> {t('home.startShopping')}
                </Link>
                <a href={shopInfo.socialMedia.whatsapp} target="_blank" rel="noreferrer"
                  className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white text-black font-black hover:bg-gray-100 transition-all text-sm shadow-xl shadow-white/5">
                  <FaWhatsapp size={20} /> {t('home.contactUs')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
