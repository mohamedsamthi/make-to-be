import { useState, useRef, useEffect } from 'react'
import { FiVolume2, FiVolumeX, FiPlay, FiPause } from 'react-icons/fi'
import { supabase } from '../../lib/supabase'

export default function FeaturedVideo() {
  const [video, setVideo] = useState(null)
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)
  const videoRef = useRef(null)

  useEffect(() => {
    const fetchActiveVideo = async () => {
      const { data, error } = await supabase
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

  const toggleMute = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsMuted(!isMuted)
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
    }
  }

  const togglePlay = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  if (!video) return null

  return (
    <section className="py-8 lg:py-12 relative overflow-hidden bg-[var(--color-surface)]">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-accent)]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <div className="relative group rounded-3xl overflow-hidden border border-[var(--color-border)] shadow-3xl aspect-video bg-black">
            {/* Video Element */}
            <video
              ref={videoRef}
              src={video.url}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

            {/* Content Top */}
            <div className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-3 animate-fadeInUp">
              <span className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-[0.2em] border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-light)] animate-pulse" />
                Featured Piece
              </span>
            </div>

            {/* Content Bottom */}
            <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-lg animate-fadeInUp">
                <h2 className="text-xl md:text-3xl font-black text-white tracking-tighter leading-none mb-3 drop-shadow-2xl">
                  {video.title}
                </h2>
                <p className="text-[var(--color-text-muted)] text-[10px] uppercase font-black tracking-widest opacity-60 line-clamp-2 leading-relaxed">
                  Experience the essence of premium craftsmanship and timeless style in motion.
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4 shrink-0">
                <button
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 text-white flex items-center justify-center hover:bg-white hover:text-[var(--color-surface)] transition-all active:scale-95"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <FiPause size={20} /> : <FiPlay size={20} className="ml-1" />}
                </button>
                <button
                  onClick={toggleMute}
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all active:scale-95 ${
                    isMuted 
                      ? 'bg-white/5 border-white/10 text-gray-400' 
                      : 'bg-white border-white text-[var(--color-surface)]'
                  }`}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <FiVolumeX size={20} /> : <FiVolume2 size={20} />}
                </button>
              </div>
            </div>

            {/* Playback Progress */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
              <div 
                className="h-full bg-white transition-all duration-300 shadow-[0_0_10px_rgba(255,255,255,0.5)]" 
                style={{ width: isPlaying ? '100%' : '0%', transitionTimingFunction: 'linear' }} 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
