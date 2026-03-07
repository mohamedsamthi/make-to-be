import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const [unconfirmedEmail, setUnconfirmedEmail] = useState('')
  const [resending, setResending] = useState(false)

  const handleResendConfirmation = async () => {
    setResending(true)
    const { error } = await import('../../lib/supabase').then(m =>
      m.supabase.auth.resend({ type: 'signup', email: unconfirmedEmail })
    )
    setResending(false)
    if (error) toast.error('Could not resend email. Try again.')
    else toast.success('Confirmation email sent! Check your inbox.')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)
    setUnconfirmedEmail('')
    try {
      const { data, error } = await signIn(email, password)
      if (error) {
        // Email not confirmed — show helpful message
        if (error.message?.toLowerCase().includes('email not confirmed') ||
            error.message?.toLowerCase().includes('not confirmed')) {
          setUnconfirmedEmail(email)
          toast.error('Please confirm your email first.', { duration: 5000 })
        } else if (error.message?.toLowerCase().includes('invalid login')) {
          toast.error('Incorrect email or password.')
        } else {
          toast.error(error.message || 'Login failed. Please try again.')
        }
      } else {
        toast.success('Welcome back! 🎉')
        navigate('/')
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-20 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fadeInUp">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center font-bold text-xl">M</div>
          </Link>
          <h1 className="text-3xl font-bold font-[var(--font-family-heading)] mb-2">Welcome Back</h1>
          <p className="text-[var(--color-text-secondary)]">Sign in to your account to continue</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-5">

          {/* Email not confirmed warning */}
          {unconfirmedEmail && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-sm">
              <p className="font-semibold text-amber-400 mb-1">📧 Email Not Confirmed</p>
              <p className="text-amber-300/80 text-xs mb-3 leading-relaxed">
                Your account (<strong>{unconfirmedEmail}</strong>) needs email verification.
                Check your inbox (and spam folder) for a confirmation link.
              </p>
              <button
                type="button"
                onClick={handleResendConfirmation}
                disabled={resending}
                className="text-xs font-semibold px-4 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors disabled:opacity-50"
              >
                {resending ? 'Sending...' : '📩 Resend Confirmation Email'}
              </button>
            </div>
          )}

          <div>
            <label className="text-sm text-[var(--color-text-secondary)] mb-1.5 block">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="input-field pl-10"
                id="login-email"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-[var(--color-text-secondary)] mb-1.5 block">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field pl-10 pr-10"
                id="login-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-white"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center py-3.5 text-base disabled:opacity-50"
            id="login-submit"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          <p className="text-center text-sm text-[var(--color-text-secondary)]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[var(--color-accent)] font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </form>

        <p className="text-center text-xs text-[var(--color-text-muted)] mt-6">
          You can also browse products without an account
        </p>
      </div>
    </div>
  )
}
