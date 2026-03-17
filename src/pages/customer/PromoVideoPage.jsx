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
    <div className="min-h-screen bg-[#151230] pt-8 pb-20">
      <div className="container-custom">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-violet-400 hover:text-white transition-colors mb-4 group">
              <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Home
            </Link>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-[var(--font-family-heading)]">
              Style <span className="gradient-text">Inspiration</span>
            </h1>
            <p className="text-gray-400 mt-2">Exclusive look at our latest collections and premium arrivals.</p>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <div className="px-4 py-2 rounded-xl bg-violet-600/10 border border-violet-600/20 text-violet-300 text-xs font-bold uppercase tracking-widest">
              {activeVideos.length} Videos Available
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Video Display */}
          <div className="lg:col-span-2">
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl border border-white/5 group">
              {mainVideoId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${mainVideoId}?autoplay=1&rel=0`}
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
                <div className="w-full h-full flex items-center justify-center flex-col p-10 text-center">
                  <FiYoutube size={64} className="text-red-500 mb-4" />
                  <p className="text-white font-bold text-lg">Unable to play this video format directly.</p>
                  <a href={selectedVideo.url} target="_blank" rel="noreferrer" className="mt-4 btn-primary">
                    Watch on Provider
                  </a>
                </div>
              )}
            </div>

            <div className="mt-8 glass p-6 sm:p-10 rounded-3xl border border-white/10">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl sm:text-3xl font-black text-white">{selectedVideo.title}</h2>
                <div className="flex items-center gap-2">
                  <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/5">
                    <FiShare2 size={18} />
                  </button>
                  <a href="https://wa.me/94759028379" target="_blank" rel="noreferrer" 
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-bold hover:scale-105 transition-all shadow-lg shadow-emerald-500/20">
                    <FiMessageCircle size={18} /> Inquire Now
                  </a>
                </div>
              </div>
              <p className="text-gray-400 text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
                {selectedVideo.description || 'No description provided for this video.'}
              </p>
            </div>
          </div>

          {/* Video List Sidebar */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-violet-400 flex items-center gap-2">
              <FiPlay size={14} /> More To Watch
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
              {activeVideos.map((video) => {
                const vidId = getYoutubeVideoId(video.url)
                const thumb = vidId ? `https://img.youtube.com/vi/${vidId}/mqdefault.jpg` : (video.thumbnail_url || '/placeholder-video.jpg')
                const isSelected = selectedVideo?.id === video.id

                return (
                  <button
                    key={video.id}
                    onClick={() => setSelectedVideo(video)}
                    className={`flex gap-4 p-3 rounded-2xl border transition-all text-left w-full group ${
                      isSelected 
                        ? 'bg-violet-600/20 border-violet-500/50 shadow-lg shadow-violet-500/10' 
                        : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="relative w-32 h-20 rounded-xl overflow-hidden shrink-0">
                      <img src={thumb} alt={video.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
                        <div className={`p-1.5 rounded-full ${isSelected ? 'bg-violet-500 text-white' : 'bg-white/20 text-white backdrop-blur-sm'}`}>
                          <FiPlay size={10} fill="currentColor" />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <h4 className={`text-sm font-bold truncate mb-1 ${isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                        {video.title}
                      </h4>
                      <p className="text-[10px] text-gray-500 line-clamp-2 leading-tight uppercase tracking-tighter">
                        {new Date(video.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* CTA Box */}
            <div className="rounded-3xl bg-gradient-to-br from-violet-600 to-fuchsia-600 p-8 text-white relative overflow-hidden group shadow-2xl shadow-violet-500/20">
               <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl transition-transform group-hover:scale-150" />
               <div className="relative z-10">
                 <h4 className="text-xl font-black mb-2">Love what you see?</h4>
                 <p className="text-sm text-white/80 mb-6">Check out our latest arrivals and get island-wide delivery!</p>
                 <Link to="/products" className="inline-flex w-full items-center justify-center p-3 rounded-xl bg-white text-[#151230] font-black text-sm hover:bg-gray-100 transition-colors shadow-xl">
                   Shop Collections
                 </Link>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
