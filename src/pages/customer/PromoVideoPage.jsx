import { useState, useEffect } from 'react'
import { FiPlay, FiShare2, FiArrowLeft, FiYoutube, FiMessageCircle } from 'react-icons/fi'
import { MdVideoLibrary } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { useProducts } from '../../context/ProductContext'

const getYoutubeVideoId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export default function PromoVideoPage() {
  const { promotionalVideos } = useProducts()
  const activeVideos = promotionalVideos.filter(v => v.is_active !== false)
  const [selectedVideo, setSelectedVideo] = useState(activeVideos[0] || null)

  useEffect(() => {
    if (!selectedVideo && activeVideos.length > 0) {
      setSelectedVideo(activeVideos[0])
    }
  }, [activeVideos, selectedVideo])

  if (activeVideos.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center container-custom">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
          <MdVideoLibrary size={40} className="text-gray-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">No Promo Videos Yet</h2>
        <p className="text-gray-400 text-center max-w-md mb-8">
          Check back later for exclusive product showcases and style inspirations!
        </p>
        <Link to="/" className="btn-primary">
          Explore Products
        </Link>
      </div>
    )
  }

  const mainVideoId = getYoutubeVideoId(selectedVideo?.url)
  const isDirectVideo = selectedVideo?.url?.match(/\.(mp4|webm|ogg)$/i)

  return (
    <div className="bg-[var(--color-surface)] py-8 lg:py-12">
      <div className="container-custom">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-l-4 border-[var(--color-accent)] pl-6">
          <div className="animate-fadeInUp">
            <Link to="/" className="inline-flex items-center gap-2 text-[var(--color-accent-light)] hover:text-white transition-all mb-3 font-bold text-xs uppercase tracking-widest group">
              <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Store
            </Link>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-[var(--font-family-heading)] tracking-tight">
              Cinematic <span className="gradient-text">Showcase</span>
            </h1>
            <p className="text-[var(--color-text-secondary)] mt-2 text-base max-w-2xl font-medium opacity-80">Explore our premium collections through exclusive video content and style inspirations.</p>
          </div>
          
          <div className="hidden lg:block shrink-0">
             <div className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent-light)]">
                  <FiPlay size={20} fill="currentColor" />
                </div>
                <div>
                   <p className="text-white font-bold text-sm leading-none mb-1">{activeVideos.length} Premium Videos</p>
                   <p className="text-[var(--color-text-muted)] text-[10px] uppercase font-black tracking-widest leading-none">Style Library</p>
                </div>
             </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Main Video Display */}
          <div className="lg:col-span-8">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/5 group">
              {mainVideoId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${mainVideoId}?autoplay=1&rel=0&modestbranding=1`}
                  className="absolute inset-0 w-full h-full"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              ) : isDirectVideo ? (
                <video 
                  src={selectedVideo.url} 
                  controls 
                  autoPlay 
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center flex-col p-10 text-center bg-[var(--color-surface-card)]">
                  <FiYoutube size={48} className="text-red-500 mb-4" />
                  <p className="text-white font-bold text-xl mb-1">Video Unavailable</p>
                  <p className="text-[var(--color-text-muted)] mb-6 max-w-sm text-sm">This video format is currently not supported for direct playback in our cinema player.</p>
                  <a href={selectedVideo.url} target="_blank" rel="noreferrer" className="btn-primary px-8">
                    Watch on Provider
                  </a>
                </div>
              )}
            </div>

            <div className="mt-8 glass p-6 sm:p-10 rounded-2xl border border-white/5 relative overflow-hidden">
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">{selectedVideo.title}</h2>
                  <p className="text-[var(--color-accent-light)] font-bold uppercase text-[10px] tracking-widest">Featured Presentation</p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="h-11 w-11 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--color-text-muted)] hover:text-white transition-all border border-white/10 flex items-center justify-center">
                    <FiShare2 size={18} />
                  </button>
                  <a href={`https://wa.me/${shopInfo.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" 
                    className="flex items-center justify-center gap-2 px-6 h-11 rounded-xl bg-[var(--color-success)] text-white font-bold text-xs hover:brightness-110 transition-all shadow-lg shadow-emerald-500/20 uppercase tracking-widest">
                    <FiMessageCircle size={18} /> Inquire Now
                  </a>
                </div>
              </div>
              <div className="h-px w-full bg-white/5 mb-6" />
              <p className="text-[var(--color-text-secondary)] text-sm sm:text-base leading-relaxed font-medium opacity-90">
                {selectedVideo.description || 'Step into the world of Make To Be. This exclusive showcase highlights our commitment to premium quality and timeless style.'}
              </p>
            </div>
          </div>

          {/* Video List Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-black uppercase tracking-widest text-[var(--color-accent-light)] flex items-center gap-2">
                <FiPlay size={14} fill="currentColor" /> Playlist
              </h3>
              <span className="text-[9px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">{activeVideos.length} Videos</span>
            </div>
            
            <div className="space-y-3 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
              {activeVideos.map((video) => {
                const vidId = getYoutubeVideoId(video.url)
                const thumb = vidId ? `https://img.youtube.com/vi/${vidId}/mqdefault.jpg` : (video.thumbnail_url || '/placeholder-video.jpg')
                const isSelected = selectedVideo?.id === video.id

                return (
                  <button
                    key={video.id}
                    onClick={() => {
                        setSelectedVideo(video);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`flex gap-3 p-3 rounded-xl border transition-all text-left w-full group relative overflow-hidden ${
                      isSelected 
                        ? 'bg-[var(--color-accent)]/10 border-[var(--color-accent)]/30' 
                        : 'bg-white/5 border-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="relative w-28 h-16 rounded-lg overflow-hidden shrink-0">
                      <img src={thumb} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-all">
                        <div className={`p-1.5 rounded-full transition-all ${isSelected ? 'bg-[var(--color-accent)] text-white' : 'bg-white/20 text-white opacity-0 group-hover:opacity-100'}`}>
                          <FiPlay size={10} fill="currentColor" />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <h4 className={`text-xs font-bold truncate mb-1 transition-colors ${isSelected ? 'text-white' : 'text-[var(--color-text-muted)] group-hover:text-white'}`}>
                        {video.title || 'Untitled Campaign'}
                      </h4>
                      <span className={`text-[9px] font-black uppercase tracking-widest ${isSelected ? 'text-[var(--color-accent-light)]' : 'text-gray-600'}`}>
                        {isSelected ? 'Now Playing' : 'Watch Next'}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* CTA Box */}
            <div className="rounded-2xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-dark)] p-8 text-white relative overflow-hidden group shadow-xl shadow-indigo-500/10">
               <div className="relative z-10">
                 <h4 className="text-xl font-black mb-2 tracking-tight">Eager to shop?</h4>
                 <p className="text-xs text-white/80 mb-6 font-medium leading-relaxed">Discover our full catalog of premium watches and designer collections.</p>
                 <Link to="/products" className="inline-flex w-full h-11 items-center justify-center rounded-xl bg-white text-[var(--color-surface)] font-black text-[10px] hover:bg-gray-100 transition-all shadow-lg uppercase tracking-widest">
                   Browse Store
                 </Link>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
