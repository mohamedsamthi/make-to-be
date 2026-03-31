import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiMail, FiArrowLeft } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const { resetPasswordForEmail } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    setLoading(true)
    try {
      const { error } = await resetPasswordForEmail(email)
      if (error) {
        toast.error(error.message || 'Failed to send reset link.')
      } else {
        setIsSent(true)
        toast.success('Password reset link sent! Check your inbox.')
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface)] flex items-center justify-center relative overflow-hidden pt-20 pb-12 px-4">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[var(--color-accent)]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-lg max-h-lg bg-[var(--color-accent)]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-fadeInUp">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-14 h-14 rounded-2xl bg-[var(--color-accent)] flex items-center justify-center font-black text-2xl text-black shadow-lg shadow-[var(--color-accent)]/30 group-hover:scale-110 transition-transform">
              M
            </div>
          </Link>
          <h1 className="text-3xl font-black font-[var(--font-family-heading)] text-white mb-2 tracking-wide">
            Reset Password
          </h1>
          <p className="text-gray-400 text-sm font-medium">
            Enter your email to receive a secure reset link
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-[var(--color-surface-card)] backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-[var(--color-accent)]" />
          
          {isSent ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                <FiMail size={32} />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Check Your Email</h2>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                We've sent a password reset link to <br/> <strong className="text-white">{email}</strong>
              </p>
              <button
                onClick={() => setIsSent(false)}
                className="text-sm font-bold text-[var(--color-accent)] hover:text-white transition-colors underline underline-offset-4"
              >
                Try a different email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-2 block">
                  Email Address
                </label>
                <div className="relative group/input">
                  <FiMail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-[var(--color-accent)] transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all font-medium"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-light)] text-black font-black py-4 rounded-xl shadow-lg shadow-[var(--color-accent)]/20 transition-all text-sm sm:text-base flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 border-2 border-black/30 border-t-black rounded-full" viewBox="0 0 24 24"></svg>
                    Sending Link...
                  </span>
                ) : (
                  <>Send Reset Link</>
                )}
              </button>
            </form>
          )}

          {/* Footer inside card */}
          <div className="mt-8 text-center border-t border-white/10 pt-6">
            <Link to="/login" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[var(--color-accent-light)] transition-colors group">
              <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
