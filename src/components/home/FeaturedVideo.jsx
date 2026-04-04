import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react'
import { FiVolume2, FiVolumeX, FiPlay, FiPause } from 'react-icons/fi'
import { supabase } from '../../lib/supabase'
import { useProducts } from '../../context/ProductContext'
import { useLanguage } from '../../context/LanguageContext'
import { Link } from 'react-router-dom'
import { applyMuteState } from '../../utils/mediaMute'

export default function FeaturedVideo() {
  const { t } = useLanguage()
  const [video, setVideo] = useState(null)
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)
  const videoRef = useRef(null)
  const isMutedRef = useRef(isMuted)
  isMutedRef.current = isMuted
  const { products = [] } = useProducts() || {}

  const syncMutedFromElement = useCallback(() => {
    const el = videoRef.current
    if (!el) return
    const next = el.muted || el.volume === 0
    setIsMuted((prev) => (prev === next ? prev : next))
  }, [])

  useEffect(() => {
    const fetchActiveVideo = async () => {
      const { data } = await supabase
        .from('promotional_videos')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (data) {
        setVideo(data)
        setIsMuted(!data.original_audio)
      }
    }
    fetchActiveVideo()
  }, [])

  // After paint / when source or mute flag changes: keep the element in lockstep with React state.
  useLayoutEffect(() => {
    applyMuteState(videoRef.current, isMuted)
  }, [isMuted, video?.url])

  const toggleMute = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsMuted((prev) => {
      const next = !prev
      // Apply immediately so audio stops before the next frame (avoids "ghost" sound after mute).
      applyMuteState(videoRef.current, next)
      return next
    })
  }, [])

  const togglePlay = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    const el = videoRef.current
    if (!el) return
    if (el.paused) {
      el.play().catch(() => {})
    } else {
      el.pause()
    }
  }, [])

  const syncPlayingFromVideo = useCallback(() => {
    const el = videoRef.current
    if (!el) return
    setIsPlaying(!el.paused)
  }, [])

  if (!video) return null

  const promotedProducts = Array.isArray(video.promoted_products)
    ? products.filter((p) => video.promoted_products.includes(p.id))
    : []

  return (
    <section className="relative overflow-hidden bg-[var(--color-surface)] py-10 lg:py-14">
      <div className="pointer-events-none absolute top-0 right-0 h-[min(500px,80vw)] w-[min(500px,80vw)] rounded-full bg-[var(--color-accent)]/5 blur-[120px]" />

      <div className="container-custom">
        <div className="mx-auto max-w-4xl">
          <div className="group relative aspect-video overflow-hidden rounded-2xl border border-[var(--color-border)] bg-black shadow-2xl sm:rounded-3xl">
            <video
              ref={videoRef}
              src={video.url}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="h-full w-full object-cover transition-transform duration-[2000ms] group-hover:scale-[1.02]"
              onPlay={(e) => {
                applyMuteState(e.currentTarget, isMutedRef.current)
                syncPlayingFromVideo()
              }}
              onPause={syncPlayingFromVideo}
              onPlaying={(e) => applyMuteState(e.currentTarget, isMutedRef.current)}
              onVolumeChange={syncMutedFromElement}
              onLoadedMetadata={(e) => {
                applyMuteState(e.currentTarget, isMutedRef.current)
                syncPlayingFromVideo()
              }}
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />

            <div className="absolute left-5 top-5 animate-fadeInUp md:left-8 md:top-8">
              <span className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-white backdrop-blur-md">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-accent-light)]" />
                {t('home.featuredPieceBadge')}
              </span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-6 p-5 md:bottom-8 md:left-8 md:right-8 md:flex-row md:items-end md:justify-between md:p-0 md:pb-8 md:pl-8 md:pr-8">
              <div className="max-w-lg animate-fadeInUp">
                <h2 className="mb-2 text-xl font-black leading-tight tracking-tighter text-white drop-shadow-2xl sm:text-2xl md:text-3xl">
                  {video.title}
                </h2>
                <p className="line-clamp-2 text-[10px] font-black uppercase leading-relaxed tracking-widest text-white/50">
                  {t('home.featuredVideoTagline')}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white backdrop-blur-xl transition-all hover:bg-white hover:text-[var(--color-surface)] active:scale-95 sm:h-12 sm:w-12"
                  title={isPlaying ? 'Pause' : 'Play'}
                  aria-label={isPlaying ? 'Pause video' : 'Play video'}
                >
                  {isPlaying ? <FiPause size={20} /> : <FiPlay size={20} className="ml-0.5" />}
                </button>
                <button
                  type="button"
                  onClick={toggleMute}
                  className={`flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border transition-all active:scale-95 sm:h-12 sm:w-12 ${
                    isMuted
                      ? 'border-white/10 bg-white/5 text-zinc-300'
                      : 'border-white bg-white text-[var(--color-surface)]'
                  }`}
                  title={isMuted ? 'Unmute' : 'Mute'}
                  aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                  aria-pressed={isMuted}
                >
                  {isMuted ? <FiVolumeX size={20} aria-hidden /> : <FiVolume2 size={20} aria-hidden />}
                </button>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 h-1 w-full bg-white/5">
              <div
                className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-300"
                style={{
                  width: isPlaying ? '100%' : '0%',
                  transitionTimingFunction: 'linear',
                }}
              />
            </div>
          </div>
        </div>
        {promotedProducts.length > 0 && (
          <div className="mx-auto mt-6 max-w-4xl">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                {t('home.featuredInThisVideo')}
              </p>
            </div>
            <div className="custom-scrollbar -mx-2 flex gap-4 overflow-x-auto px-2 pb-1 pt-1">
              {promotedProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="group flex min-w-[160px] max-w-[180px] flex-col overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] text-left transition-transform hover:-translate-y-1 hover:border-[var(--color-accent)]/60"
                >
                  <div className="h-28 w-full overflow-hidden bg-black">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-1 p-3">
                    <p className="line-clamp-2 text-xs font-semibold text-[var(--color-text-primary)]">
                      {product.name}
                    </p>
                    <p className="text-[11px] font-bold text-[var(--color-accent)]">
                      LKR {Number(product.discount_price || product.price || 0).toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
