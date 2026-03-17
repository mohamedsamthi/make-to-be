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
    <section className="py-12 lg:py-20 relative overflow-hidden bg-[#0a0a1a]">
      <div className="container-custom">
        <div className="relative group rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl shadow-violet-500/10 aspect-[16/9] md:aspect-[21/9] bg-black">
          {/* Video Element */}
          <video
            ref={videoRef}
            src={video.url}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-1000"
          />

          {/* Overlay Content */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
            {/* Title & Badge */}
            <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 max-w-lg animate-fadeInUp">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-violet-600 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-violet-600/30">
                  New Campaign
                </span>
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              </div>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-none mb-4">
                {video.title}
              </h2>
            </div>

            {/* Controls */}
            <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all active:scale-95 shadow-xl"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <FiPause size={20} /> : <FiPlay size={20} className="ml-1" />}
              </button>
              <button
                onClick={toggleMute}
                className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl border flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-xl ${
                  isMuted 
                    ? 'bg-white/10 border-white/20 text-white/60' 
                    : 'bg-violet-600 border-violet-500 text-white shadow-violet-600/30'
                }`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <FiVolumeX size={20} /> : <FiVolume2 size={20} />}
              </button>
            </div>
          </div>

          {/* Playback Progress (Subtle bar at bottom) */}
          <div className="absolute bottom-0 left-0 h-1 bg-violet-600 shadow-[0_0_15px_rgba(124,58,237,0.5)] transition-all duration-300" 
            style={{ width: isPlaying ? '100%' : '0%', transitionTimingFunction: 'linear' }} 
          />
        </div>
      </div>
    </section>
  )
}
