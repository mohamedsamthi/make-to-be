import { useState } from 'react'
import { FiMessageSquare, FiSearch, FiTrash2, FiCheck, FiMail, FiPhone, FiClock, FiSend } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { useProducts } from '../../context/ProductContext'
import toast from 'react-hot-toast'

export default function AdminMessagesPage() {
  const { messages = [], replyToMessage, deleteMessage } = useProducts()
  const [search, setSearch] = useState('')
  const [activeMessageId, setActiveMessageId] = useState(null)
  const [replyText, setReplyText] = useState('')

  const activeMessage = messages.find(m => m.id === activeMessageId)

  const sortedMessages = [...messages].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  
  const filtered = sortedMessages.filter(m =>
    m.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.email?.toLowerCase().includes(search.toLowerCase()) ||
    m.message?.toLowerCase().includes(search.toLowerCase())
  )

  const handleReply = () => {
    if (!replyText.trim() || !activeMessage) return
    replyToMessage(activeMessage.id, replyText)
    toast.success('Reply saved and marked as read!')
    setReplyText('')
    setActiveMessage(null)
  }

  const handleDelete = (id, e) => {
    e.stopPropagation()
    if (window.confirm('Delete this message permanently?')) {
      deleteMessage(id)
      if (activeMessageId === id) setActiveMessageId(null)
      toast.success('Message deleted')
    }
  }

  const markAsRead = (msg) => {
    if (msg.status === 'unread') {
      replyToMessage(msg.id, null) // updates status to Replied or Read
    }
  }

  return (
    <div className="max-w-[1400px] mx-auto pb-10 flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
      
      {/* Messages List (Left Sidebar) */}
      <div className="w-full lg:w-96 flex flex-col bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden shrink-0 shadow-xl">
        <div className="p-4 border-b border-[var(--color-border)] bg-black/20">
          <h1 className="text-lg font-bold font-[var(--font-family-heading)] flex items-center gap-2 mb-4">
            <FiMessageSquare /> Support Messages
          </h1>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="Search by name, email..." 
              className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-9 pr-3 text-sm focus:border-violet-500 transition-all outline-none text-white" 
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">No messages found</div>
          ) : (
            <div className="divide-y divide-[var(--color-border)]">
              {filtered.map(msg => (
                <div 
                  key={msg.id}
                  onClick={() => { setActiveMessageId(msg.id); markAsRead(msg); }}
                  className={`p-4 cursor-pointer transition-colors relative hover:bg-white/5 ${activeMessageId === msg.id ? 'bg-violet-500/10 border-l-4 border-violet-500' : 'border-l-4 border-transparent'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`text-sm font-bold truncate pr-3 ${msg.status === 'unread' ? 'text-white' : 'text-gray-300'}`}>
                      {msg.name}
                    </h3>
                    <span className="text-[10px] text-gray-500 whitespace-nowrap">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className={`text-xs line-clamp-2 ${msg.status === 'unread' ? 'text-gray-300 font-medium' : 'text-gray-500'}`}>
                    {msg.message}
                  </p>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex gap-2">
                       {msg.status === 'unread' && <span className="w-2 h-2 rounded-full bg-red-500 mt-1" />}
                       {msg.status === 'replied' && <FiCheck size={14} className="text-emerald-500" />}
                    </div>
                    <button 
                      onClick={(e) => handleDelete(msg.id, e)}
                      className="text-gray-500 hover:text-red-400 p-1"
                    >
                      <FiTrash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Message Details (Right Content) */}
      <div className="flex-1 bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-xl flex flex-col">
        {activeMessage ? (
          <>
            <div className="p-6 border-b border-[var(--color-border)] bg-black/20">
              <h2 className="text-xl font-bold text-white mb-4">{activeMessage.name}</h2>
              <div className="flex flex-wrap gap-4 text-xs">
                <a href={`mailto:${activeMessage.email}`} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors">
                  <FiMail className="text-violet-400" /> {activeMessage.email}
                </a>
                <a href={`tel:${activeMessage.phone}`} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors">
                  <FiPhone className="text-emerald-400" /> {activeMessage.phone}
                </a>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-gray-300">
                  <FiClock className="text-blue-400" /> {new Date(activeMessage.created_at).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-[#151230]/50 space-y-6">
              {/* Customer Message */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 pl-3">Message from {activeMessage.name}</p>
                <div className="bg-[#1e1c3a] border border-white/10 p-5 rounded-2xl rounded-tl-sm text-sm text-gray-200 shadow-sm w-fit max-w-[85%] leading-relaxed">
                  {activeMessage.message}
                </div>
              </div>

              {/* Admin Reply History */}
              {activeMessage.admin_reply && (
                <div className="flex flex-col items-end">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 pr-3">Your Answer / Note</p>
                  <div className="bg-violet-600 p-5 rounded-2xl rounded-tr-sm text-sm text-white shadow-lg shadow-violet-500/20 w-fit max-w-[85%] leading-relaxed">
                    {activeMessage.admin_reply}
                  </div>
                </div>
              )}
            </div>

            {/* Reply Box */}
            <div className="p-4 border-t border-[var(--color-border)] bg-black/20">
              <div className="flex gap-3">
                <textarea
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Record note or reply here..."
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-violet-500 outline-none resize-none h-[60px]"
                />
                <div className="flex flex-col gap-2 shrink-0">
                  <button 
                    onClick={handleReply}
                    disabled={!replyText.trim()}
                    className="flex-1 px-4 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <FiSend size={14} /> Save Note
                  </button>
                  <a 
                    href={`https://wa.me/${activeMessage.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${activeMessage.name},\nRegarding your query: "${activeMessage.message.slice(0, 30)}..."\n\n`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 px-4 rounded-lg bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white border border-[#25D366]/30 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <FaWhatsapp size={14} /> Reply WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <FiMessageSquare size={32} className="opacity-50" />
            </div>
            <p className="font-medium text-lg text-gray-400">Select a message</p>
            <p className="text-sm">Choose a message from the list to read or reply.</p>
          </div>
        )}
      </div>

    </div>
  )
}
