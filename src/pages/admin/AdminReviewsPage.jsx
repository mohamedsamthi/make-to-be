import { useState } from 'react'
import { FaStar } from 'react-icons/fa'
import { FiSend } from 'react-icons/fi'
import { useProducts } from '../../context/ProductContext'
import toast from 'react-hot-toast'

export default function AdminReviewsPage() {
  const { reviews, products, replyToReview } = useProducts()
  const [replyText, setReplyText] = useState({})

  const handleReply = (reviewId) => {
    if (!replyText[reviewId]?.trim()) {
      toast.error('Please enter a reply')
      return
    }
    replyToReview(reviewId, replyText[reviewId])
    setReplyText(prev => ({ ...prev, [reviewId]: '' }))
    toast.success('Reply sent! ✅')
  }

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-[var(--font-family-heading)]">Review Management</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">{reviews.length} total reviews</p>
      </div>

      <div className="space-y-4">
        {reviews.map(review => {
          const product = products.find(p => p.id === review.product_id)
          return (
            <div key={review.id} className="p-5 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)]">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-accent flex items-center justify-center font-bold text-sm shrink-0">
                    {review.user_name ? review.user_name[0].toUpperCase() : 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{review.user_name || 'User'}</p>
                    <p className="text-[11px] text-[var(--color-text-muted)]">{review.created_at}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex gap-0.5 justify-end mb-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} size={12} className={i < review.rating ? 'text-[var(--color-gold)]' : 'text-[var(--color-text-muted)]'} />
                    ))}
                  </div>
                  {product && <p className="text-xs text-[var(--color-accent)]">{product.name}</p>}
                </div>
              </div>
              <p className="text-sm text-[var(--color-text-secondary)] mb-4">{review.comment}</p>
              {review.admin_reply ? (
                <div className="ml-4 pl-4 border-l-2 border-[var(--color-accent)] bg-[var(--color-accent)]/5 rounded-r-xl p-3">
                  <p className="text-xs text-[var(--color-accent)] font-semibold mb-1">Your Reply:</p>
                  <p className="text-sm text-[var(--color-text-secondary)]">{review.admin_reply}</p>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    value={replyText[review.id] || ''}
                    onChange={e => setReplyText(prev => ({ ...prev, [review.id]: e.target.value }))}
                    placeholder="Write a reply..."
                    className="input-field flex-1 text-sm"
                  />
                  <button onClick={() => handleReply(review.id)} className="btn-primary px-4">
                    <FiSend size={16} />
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
