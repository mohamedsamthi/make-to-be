import { useState, useEffect } from 'react'
import { FiPlus, FiTrash2, FiVideo, FiX, FiCheck, FiUpload, FiPlay, FiVolume2, FiVolumeX, FiRefreshCw } from 'react-icons/fi'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

export default function AdminVideoManagePage() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [editVideo, setEditVideo] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    videoFile: null,
    is_active: true,
    original_audio: true
  })

  useEffect(() => {
    fetchVideos()
  }, [])

  const openAdd = () => {
    setEditVideo(null)
    setFormData({ title: '', videoFile: null, is_active: true, original_audio: true })
    setShowForm(true)
  }

  const openEdit = (v) => {
    setEditVideo(v)
    setFormData({ title: v.title, videoFile: null, is_active: v.is_active, original_audio: v.original_audio })
    setShowForm(true)
  }

  const fetchVideos = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('promotional_videos')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setVideos(data || [])
    } catch (err) {
      console.error('Error fetching videos:', err)
      toast.error('Failed to load videos')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (file) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
    const filePath = `videos/${fileName}`

    const { data, error } = await supabase.storage
      .from('promotions')
      .upload(filePath, file)

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from('promotions')
      .getPublicUrl(filePath)

    return publicUrl
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.videoFile && !formData.title) {
      toast.error('Please select a video file')
      return
    }

    setUploading(true)
    try {
      let videoUrl = editVideo ? editVideo.url : ''
      if (formData.videoFile) {
        videoUrl = await handleFileUpload(formData.videoFile)
      }

      if (editVideo) {
        const { error } = await supabase
          .from('promotional_videos')
          .update({
            title: formData.title,
            url: videoUrl,
            is_active: formData.is_active,
            original_audio: formData.original_audio
          })
          .eq('id', editVideo.id)
        if (error) throw error
        toast.success('Video updated!')
      } else {
        const { error } = await supabase
          .from('promotional_videos')
          .insert([{
            title: formData.title || 'Promotional Video',
            url: videoUrl,
            is_active: formData.is_active,
            original_audio: formData.original_audio
          }])
        if (error) throw error
        toast.success('Video uploaded successfully!')
      }
      setShowForm(false)
      setFormData({ title: '', videoFile: null, is_active: true, original_audio: true })
      fetchVideos()
    } catch (err) {
      console.error('Upload error:', err)
      toast.error(err.message || 'Upload failed. Ensure "promotions" bucket exists in Supabase.')
    } finally {
      setUploading(false)
    }
  }

  const toggleStatus = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('promotional_videos')
        .update({ is_active: !currentStatus })
        .eq('id', id)
      
      if (error) throw error
      setVideos(prev => prev.map(v => v.id === id ? { ...v, is_active: !currentStatus } : v))
      toast.success('Status updated')
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

  const toggleAudio = async (id, currentAudio) => {
    try {
      const { error } = await supabase
        .from('promotional_videos')
        .update({ original_audio: !currentAudio })
        .eq('id', id)
      
      if (error) throw error
      setVideos(prev => prev.map(v => v.id === id ? { ...v, original_audio: !currentAudio } : v))
      toast.success('Audio setting updated')
    } catch (err) {
      toast.error('Failed to update audio')
    }
  }

  const handleDelete = async (id, url) => {
    if (!confirm('Are you sure you want to delete this video?')) return

    try {
      // 1. Delete from database
      const { error: dbError } = await supabase
        .from('promotional_videos')
        .delete()
        .eq('id', id)
      
      if (dbError) throw dbError

      // 2. Try to delete from storage if it's a supabase URL
      if (url.includes('storage')) {
        const path = url.split('promotions/').pop()
        await supabase.storage.from('promotions').remove([path])
      }

      setVideos(prev => prev.filter(v => v.id !== id))
      toast.success('Video deleted')
    } catch (err) {
      toast.error('Failed to delete video')
    }
  }

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-[var(--font-family-heading)]">Promo Video Management</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">Manage your high-conversion marketing videos</p>
        </div>
        <button 
          onClick={openAdd} 
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus size={18} /> Upload New Video
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[var(--color-surface-card)] rounded-3xl border border-[var(--color-border)]">
          <FiRefreshCw className="w-10 h-10 text-violet-500 animate-spin mb-4" />
          <p className="text-gray-400 font-medium">Fetching video assets...</p>
        </div>
      ) : videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[var(--color-surface-card)] rounded-3xl border border-[var(--color-border)] text-center px-6">
          <div className="w-20 h-20 rounded-full bg-violet-500/10 flex items-center justify-center mb-6">
            <FiVideo size={32} className="text-violet-500" />
          </div>
          <h3 className="text-xl font-bold mb-2">No Videos Found</h3>
          <p className="text-gray-400 max-w-sm mb-8">Upload your first promotional video to capture customer attention on the homepage.</p>
          <button onClick={() => setShowForm(true)} className="btn-outline">Get Started</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map(video => (
            <div key={video.id} className="bg-[var(--color-surface-card)] rounded-2xl border border-[var(--color-border)] overflow-hidden flex flex-col group">
              <div className="relative aspect-[9/16] bg-black">
                <video 
                  src={video.url} 
                  className="w-full h-full object-cover"
                  muted
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 cursor-pointer hover:scale-110 transition-transform">
                    <FiPlay size={24} fill="white" />
                  </div>
                </div>
                {/* Active Indicator */}
                <div className={`absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${video.is_active ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
                  <span className={`w-2 h-2 rounded-full ${video.is_active ? 'bg-white animate-pulse' : 'bg-white/50'}`} />
                  {video.is_active ? 'Live' : 'Hidden'}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <h4 className="font-bold text-gray-200 mb-4 line-clamp-1">{video.title}</h4>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-medium uppercase tracking-wider">Visibility</span>
                    <button 
                      onClick={() => toggleStatus(video.id, video.is_active)}
                      className={`font-black uppercase tracking-widest transition-colors ${video.is_active ? 'text-emerald-400 hover:text-emerald-300' : 'text-gray-400 hover:text-white'}`}
                    >
                      {video.is_active ? 'ENABLED' : 'DISABLED'}
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-medium uppercase tracking-wider">Audio Playback</span>
                    <button 
                      onClick={() => toggleAudio(video.id, video.original_audio)}
                      className={`flex items-center gap-2 font-black uppercase tracking-widest transition-colors ${video.original_audio ? 'text-violet-400 hover:text-violet-300' : 'text-gray-400 hover:text-white'}`}
                    >
                      {video.original_audio ? <><FiVolume2 /> ORIGINAL</> : <><FiVolumeX /> MUTED</>}
                    </button>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-white/5 flex gap-3">
                  <button 
                    onClick={() => openEdit(video)}
                    className="flex-1 h-10 rounded-xl bg-violet-500/10 text-violet-500 hover:bg-violet-500 hover:text-white transition-all text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    <FiUpload size={14} /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(video.id, video.url)}
                    className="flex-1 h-10 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    <FiTrash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#151230] border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-fadeInUp">
            <div className="flex items-center justify-between px-8 py-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-600/20 flex items-center justify-center text-violet-400">
                  <FiUpload size={20} />
                </div>
                <h3 className="text-xl font-bold font-[var(--font-family-heading)]">
                  {editVideo ? 'Edit Video Asset' : 'New Video Asset'}
                </h3>
              </div>
              <button 
                onClick={() => setShowForm(false)} 
                className="w-10 h-10 rounded-xl hover:bg-white/5 flex items-center justify-center text-gray-400 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">
                  Campaign Title
                </label>
                <input 
                  value={formData.title} 
                  onChange={e => setFormData(p => ({...p, title: e.target.value}))} 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-sm outline-none focus:border-violet-500/50 transition-all font-medium" 
                  placeholder="e.g. Summer Collection 2024" 
                  required 
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">
                  Video File (Max 100MB)
                </label>
                <div className="relative group">
                  <input 
                    type="file" 
                    accept="video/*" 
                    onChange={e => setFormData(p => ({...p, videoFile: e.target.files[0]}))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="w-full py-10 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center group-hover:bg-white/2 group-hover:border-violet-500/30 transition-all">
                    {formData.videoFile ? (
                      <div className="text-center">
                        <FiVideo className="mx-auto text-emerald-500 mb-3" size={32} />
                        <p className="text-sm font-bold text-white mb-1">{formData.videoFile.name}</p>
                        <p className="text-xs text-gray-500">{(formData.videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <FiVideo className="mx-auto text-gray-600 mb-3" size={32} />
                        <p className="text-sm font-bold text-gray-400 mb-1">Click to browse videos</p>
                        <p className="text-xs text-gray-600">MP4, WEBM or MOV preferred</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div 
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${formData.original_audio ? 'bg-violet-600/10 border-violet-500/30 ring-1 ring-violet-500/20' : 'bg-white/2 border-white/5 opacity-60'}`}
                  onClick={() => setFormData(p => ({...p, original_audio: !p.original_audio}))}
                >
                  <div className="flex items-center justify-between mb-2">
                    <FiVolume2 className={formData.original_audio ? 'text-violet-400' : 'text-gray-500'} />
                    <div className={`w-3 h-3 rounded-full ${formData.original_audio ? 'bg-violet-500' : 'bg-gray-700'}`} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Play Audio</p>
                </div>

                <div 
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${formData.is_active ? 'bg-emerald-600/10 border-emerald-500/30 ring-1 ring-emerald-500/20' : 'bg-white/2 border-white/5 opacity-60'}`}
                  onClick={() => setFormData(p => ({...p, is_active: !p.is_active}))}
                >
                  <div className="flex items-center justify-between mb-2">
                    <FiCheck className={formData.is_active ? 'text-emerald-400' : 'text-gray-500'} />
                    <div className={`w-3 h-3 rounded-full ${formData.is_active ? 'bg-emerald-500' : 'bg-gray-700'}`} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Set Active</p>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)} 
                  className="flex-1 h-12 rounded-xl border border-white/10 text-gray-400 font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={uploading}
                  className="flex-1 h-12 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-violet-500/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <FiRefreshCw className="animate-spin" /> Uploading...
                    </>
                  ) : (
                    <>
                      <FiCheck size={18} /> Publish Video
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
