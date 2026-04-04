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

  const getLatestTime = (m) => {
    if (m.chat_history && m.chat_history.length > 0) {
      return new Date(m.chat_history[m.chat_history.length - 1].time).getTime()
    }
    return new Date(m.created_at).getTime()
  }

  const sortedMessages = [...messages].sort((a, b) => getLatestTime(b) - getLatestTime(a))
  
  const filtered = sortedMessages.filter(m =>
    m.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.email?.toLowerCase().includes(search.toLowerCase()) ||
    m.message?.toLowerCase().includes(search.toLowerCase())
  )

  const handleReply = async () => {
    if (!replyText.trim() || !activeMessage) return
    const id = activeMessage.id
    try {
      await replyToMessage(id, replyText)
      setReplyText('')
      // Don't close the chat, so admin can see the reply in history
    } catch (e) {
      // Error handled in context toast
    }
  }

  const handleDelete = (id, e) => {
    e.stopPropagation()
    if (window.confirm('Delete this message permanently?')) {
      deleteMessage(id)
      if (activeMessageId === id) setActiveMessageId(null)
      toast.success('Message deleted')
    }
  }

  const markAsRead = async (id) => {
    const msg = messages.find(m => m.id === id)
    if (msg && msg.status === 'unread') {
      await replyToMessage(id, null) // updates status to 'read'
    }
  }

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6 pb-6 lg:min-h-[calc(100dvh-10rem)] lg:flex-row lg:pb-10">
      {/* Messages List (Left Sidebar) */}
      <div className="flex w-full shrink-0 flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-xl lg:w-96 lg:max-w-md">
        <div className="border-b border-[var(--color-border)] bg-[var(--color-surface-light)] p-4">
          <h1 className="mb-4 flex items-center gap-2 text-lg font-bold font-[var(--font-family-heading)] text-[var(--color-text-primary)]">
            <FiMessageSquare className="shrink-0" aria-hidden /> Support messages
          </h1>
          <div className="relative">
            <FiSearch
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]"
              size={14}
              aria-hidden
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email..."
              className="input-field w-full py-2.5 pl-10 pr-3 text-sm"
            />
          </div>
        </div>

        <div className="custom-scrollbar max-h-[50vh] flex-1 overflow-y-auto lg:max-h-none">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-sm text-[var(--color-text-muted)]">No messages found</div>
          ) : (
            <div className="divide-y divide-[var(--color-border)]">
              {filtered.map(msg => (
                <div 
                  key={msg.id}
                  onClick={() => { setActiveMessageId(msg.id); markAsRead(msg.id); }}
                  className={`relative cursor-pointer p-4 transition-colors hover:bg-[var(--color-surface-light)]/80 ${activeMessageId === msg.id ? 'border-l-4 border-[var(--color-accent)] bg-[var(--color-accent)]/10' : 'border-l-4 border-transparent'}`}
                >
                  <div className="mb-1 flex items-start justify-between">
                    <h3
                      className={`truncate pr-3 text-sm font-bold ${msg.status === 'unread' ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'}`}
                    >
                      {msg.name}
                    </h3>
                    <span className="whitespace-nowrap text-[10px] text-[var(--color-text-muted)]">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p
                    className={`line-clamp-2 text-xs ${msg.status === 'unread' ? 'font-medium text-[var(--color-text-secondary)]' : 'text-[var(--color-text-muted)]'}`}
                  >
                    {msg.message}
                  </p>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex gap-0.5 items-center">
                       {msg.status === 'unread' ? (
                         <FiCheck size={14} className="text-[var(--color-text-muted)]" title="Sent (Unread)" />
                       ) : msg.status === 'read' ? (
                         <div className="flex -space-x-2">
                           <FiCheck size={14} className="text-[var(--color-text-muted)]" />
                           <FiCheck size={14} className="text-[var(--color-text-muted)]" />
                         </div>
                       ) : (
                         <div className="flex -space-x-2" title="Replied">
                           <FiCheck size={14} className="text-emerald-500" />
                           <FiCheck size={14} className="text-emerald-500" />
                         </div>
                       )}
                       <span className={`ml-2 text-[10px] ${msg.status === 'unread' ? 'font-bold text-[var(--color-accent)]' : 'text-[var(--color-text-muted)]'}`}>
                         {msg.status === 'unread' ? 'New' : msg.status.charAt(0).toUpperCase() + msg.status.slice(1)}
                       </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleDelete(msg.id, e)}
                      className="p-1 text-[var(--color-text-muted)] hover:text-red-400"
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
      <div className="flex min-h-[320px] flex-1 flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-xl lg:min-h-0">
        {activeMessage ? (
          <>
            <div className="border-b border-[var(--color-border)] bg-[var(--color-surface-light)] p-5 sm:p-6">
              <h2 className="mb-4 text-xl font-bold text-[var(--color-text-primary)]">{activeMessage.name}</h2>
              <div className="flex flex-wrap gap-3 text-xs">
                <a
                  href={`mailto:${activeMessage.email}`}
                  className="flex items-center gap-2 rounded-lg bg-[var(--color-surface)] px-3 py-2 text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-border)]"
                >
                  <FiMail className="text-[var(--color-accent)]" /> {activeMessage.email}
                </a>
                <a
                  href={`tel:${activeMessage.phone}`}
                  className="flex items-center gap-2 rounded-lg bg-[var(--color-surface)] px-3 py-2 text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-border)]"
                >
                  <FiPhone className="text-emerald-400" /> {activeMessage.phone}
                </a>
                <div className="flex items-center gap-2 rounded-lg bg-[var(--color-surface)] px-3 py-2 text-[var(--color-text-secondary)]">
                  <FiClock className="text-[var(--color-accent)]" /> {new Date(activeMessage.created_at).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="custom-scrollbar flex-1 space-y-6 overflow-y-auto bg-[var(--color-surface)]/50 p-5 sm:p-6">
              {/* If no chat history, show the single legacy message */}
              {!activeMessage.chat_history || activeMessage.chat_history.length === 0 ? (
                <>
                  <div>
                    <p className="mb-2 pl-3 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                      Message from {activeMessage.name}
                    </p>
                    <div className="w-fit max-w-[85%] rounded-2xl rounded-tl-sm border border-[var(--color-border)] bg-[var(--color-surface-card)] p-5 text-sm leading-relaxed text-[var(--color-text-primary)] shadow-sm">
                      {activeMessage.message}
                    </div>
                  </div>

                  {activeMessage.admin_reply && (
                    <div className="flex flex-col items-end">
                      <p className="mb-2 pr-3 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Your answer / note</p>
                      <div className="bg-[var(--color-accent)] p-5 rounded-2xl rounded-tr-sm text-sm text-white shadow-lg shadow-[0_0_25px_rgba(200,230,0,0.25)] w-fit max-w-[85%] leading-relaxed">
                        {activeMessage.admin_reply}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {activeMessage.chat_history.map((chat, idx) => (
                    <div key={idx} className={`flex flex-col ${chat.sender === 'admin' ? 'items-end' : 'items-start'}`}>
                      <p className="mb-1 px-3 text-[9px] font-bold tracking-widest text-[var(--color-text-muted)]">
                        {chat.sender === 'admin' ? 'YOU' : activeMessage.name.toUpperCase()} • {new Date(chat.time).toLocaleString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                      <div className={`p-4 rounded-2xl text-sm leading-relaxed max-w-[85%] ${
                        chat.sender === 'admin' 
                        ? 'bg-[var(--color-accent)] text-white rounded-tr-sm shadow-lg shadow-[0_0_20px_rgba(200,230,0,0.2)]' 
                        : 'rounded-tl-sm border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-primary)]'
                      }`}>
                        {chat.message}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Reply Box */}
            <div className="border-t border-[var(--color-border)] bg-[var(--color-surface-light)] p-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Record note or reply here..."
                  className="input-field min-h-[60px] flex-1 resize-none py-3 text-sm"
                />
                <div className="flex shrink-0 flex-col gap-2 sm:w-40">
                  <button
                    type="button"
                    onClick={handleReply}
                    disabled={!replyText.trim()}
                    className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--color-accent)] px-4 text-xs font-bold text-black transition-colors hover:bg-[var(--color-accent-dark)] disabled:opacity-50"
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
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center text-[var(--color-text-muted)]">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-surface-light)]">
              <FiMessageSquare size={32} className="opacity-50" aria-hidden />
            </div>
            <p className="text-lg font-medium text-[var(--color-text-secondary)]">Select a message</p>
            <p className="mt-1 max-w-xs text-sm">Choose a conversation from the list to read or reply.</p>
          </div>
        )}
      </div>

    </div>
  )
}
