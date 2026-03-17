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
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-fuchsia-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container-custom">
        <div className="max-w-5xl mx-auto">
          <div className="relative group rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] aspect-video bg-black">
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

            {/* Content Top */}
            <div className="absolute top-6 left-6 md:top-10 md:left-10 flex items-center gap-3 animate-fadeInUp">
              <span className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-600/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Featured Campaign
              </span>
            </div>

            {/* Content Bottom */}
            <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-xl animate-fadeInUp">
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-2 drop-shadow-2xl">
                  {video.title}
                </h2>
                <p className="text-gray-300 text-sm md:text-base font-medium opacity-80 line-clamp-2 md:line-clamp-none">
                  Experience the essence of premium style with our latest collection.
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={togglePlay}
                  className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all active:scale-95 shadow-2xl"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <FiPause size={24} /> : <FiPlay size={24} className="ml-1" />}
                </button>
                <button
                  onClick={toggleMute}
                  className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl border flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-2xl ${
                    isMuted 
                      ? 'bg-white/10 border-white/20 text-white/50' 
                      : 'bg-violet-600 border-violet-500 text-white shadow-violet-600/40'
                  }`}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <FiVolumeX size={24} /> : <FiVolume2 size={24} />}
                </button>
              </div>
            </div>

            {/* Playback Progress */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
              <div 
                className="h-full bg-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.8)] transition-all duration-300" 
                style={{ width: isPlaying ? '100%' : '0%', transitionTimingFunction: 'linear' }} 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
