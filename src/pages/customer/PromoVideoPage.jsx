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
    <div className="min-h-screen bg-[#0a0a1a] pt-12 pb-24">
      <div className="container-custom max-w-7xl mx-auto">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 border-l-4 border-violet-500 pl-6">
          <div className="animate-fadeInUp">
            <Link to="/" className="inline-flex items-center gap-2 text-violet-400 hover:text-white transition-all mb-4 font-bold text-sm uppercase tracking-widest group">
              <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Store
            </Link>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white font-[var(--font-family-heading)] tracking-tight">
              Cinematic <span className="gradient-text">Showcase</span>
            </h1>
            <p className="text-gray-400 mt-3 text-lg max-w-2xl font-medium opacity-80">Explore our premium collections through exclusive video content and style inspirations.</p>
          </div>
          
          <div className="hidden lg:block shrink-0">
             <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-violet-600/20 flex items-center justify-center text-violet-400">
                  <FiPlay size={20} fill="currentColor" />
                </div>
                <div>
                   <p className="text-white font-bold text-sm leading-none mb-1">{activeVideos.length} High-Quality Videos</p>
                   <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest leading-none">Style Library</p>
                </div>
             </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Main Video Display */}
          <div className="lg:col-span-8">
            <div className="relative aspect-video rounded-[2.5rem] overflow-hidden bg-black shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] border border-white/10 group">
              {mainVideoId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${mainVideoId}?autoplay=1&rel=0&modestbranding=1`}
                  className="w-full h-full"
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
                <div className="w-full h-full flex items-center justify-center flex-col p-10 text-center bg-gradient-to-br from-[#1a1835] to-[#0a0a1a]">
                  <FiYoutube size={64} className="text-red-500 mb-6 drop-shadow-xl" />
                  <p className="text-white font-black text-2xl mb-2">Video Unavailable</p>
                  <p className="text-gray-400 mb-8 max-w-md">This video format is currently not supported for direct playback in our cinematic player.</p>
                  <a href={selectedVideo.url} target="_blank" rel="noreferrer" className="btn-primary px-10">
                    Watch on Provider
                  </a>
                </div>
              )}
            </div>

            <div className="mt-12 glass p-8 sm:p-12 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
              {/* Background Decor */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 rounded-full blur-[80px] pointer-events-none" />
              
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">{selectedVideo.title}</h2>
                  <p className="text-violet-400 font-bold uppercase text-xs tracking-[0.3em]">Featured Presentation</p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="flex-1 sm:flex-none h-12 w-12 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/10 flex items-center justify-center">
                    <FiShare2 size={20} />
                  </button>
                  <a href="https://wa.me/94759028379" target="_blank" rel="noreferrer" 
                    className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-sm hover:scale-[1.02] transition-all shadow-xl shadow-emerald-500/20 uppercase tracking-widest">
                    <FiMessageCircle size={20} /> Inquire Now
                  </a>
                </div>
              </div>
              <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent mb-8" />
              <p className="text-gray-400 text-lg leading-relaxed whitespace-pre-wrap font-medium opacity-90">
                {selectedVideo.description || 'Step into the world of Make To Be. This exclusive showcase highlights our commitment to premium quality and timeless style. For more details about the items shown in this video, feel free to contact our style experts.'}
              </p>
            </div>
          </div>

          {/* Video List Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-violet-400 flex items-center gap-3">
                <FiPlay size={16} fill="currentColor" /> Playlist
              </h3>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{activeVideos.length} Videos</span>
            </div>
            
            <div className="space-y-4 max-h-[850px] overflow-y-auto pr-3 custom-scrollbar">
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
                    className={`flex gap-4 p-4 rounded-2xl border transition-all text-left w-full group relative overflow-hidden ${
                      isSelected 
                        ? 'bg-violet-600/10 border-violet-500/50 shadow-xl shadow-violet-500/5' 
                        : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                    }`}
                  >
                    {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-violet-500" />}
                    
                    <div className="relative w-32 h-20 rounded-xl overflow-hidden shrink-0 shadow-lg">
                      <img src={thumb} alt={video.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all">
                        <div className={`p-2 rounded-full transition-all ${isSelected ? 'bg-violet-500 text-white scale-110' : 'bg-white/20 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100'}`}>
                          <FiPlay size={12} fill="currentColor" />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center min-w-0 pr-2">
                      <h4 className={`text-sm font-black truncate mb-1.5 transition-colors ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                        {video.title || 'Untitled Campaign'}
                      </h4>
                      <div className="flex items-center gap-2">
                         <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${isSelected ? 'bg-violet-500/20 text-violet-400' : 'bg-white/5 text-gray-500'}`}>
                           {isSelected ? 'Now Playing' : 'Watch Next'}
                         </span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* CTA Box */}
            <div className="rounded-[2.5rem] bg-gradient-to-br from-violet-600 to-fuchsia-600 p-10 text-white relative overflow-hidden group shadow-[0_20px_50px_rgba(124,58,237,0.3)]">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl transition-transform duration-1000 group-hover:scale-150" />
               <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/10 rounded-full blur-3xl" />
               
               <div className="relative z-10">
                 <h4 className="text-2xl font-black mb-3 tracking-tight">Eager to shop?</h4>
                 <p className="text-sm text-white/80 mb-8 font-medium leading-relaxed">Discover our full catalog of premium watches and designer collections.</p>
                 <Link to="/products" className="inline-flex w-full h-14 items-center justify-center rounded-2xl bg-white text-[#0a0a1a] font-black text-sm hover:bg-gray-100 transition-all shadow-xl active:scale-95 uppercase tracking-widest">
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
