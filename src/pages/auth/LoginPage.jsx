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
    <div className="min-h-screen bg-[var(--color-surface)] flex items-center justify-center relative overflow-hidden pt-20 pb-12 px-4">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-lg max-h-lg bg-fuchsia-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-fadeInUp">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center font-bold text-2xl text-white shadow-lg shadow-violet-500/30 group-hover:scale-110 transition-transform">
              M
            </div>
            <span className="text-xl font-black font-[var(--font-family-heading)] tracking-wider">
              MAKE<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">TOBE</span>
            </span>
          </Link>
          <h1 className="text-3xl font-black font-[var(--font-family-heading)] text-white mb-2 tracking-wide">
            Welcome Back
          </h1>
          <p className="text-gray-400 text-sm">
            Please enter your details to sign in
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-[#1e1c3a]/80 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500" />
          
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email not confirmed warning */}
            {unconfirmedEmail && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-sm animate-pulse">
                <p className="font-bold text-amber-400 mb-1 flex items-center gap-2">
                  <FiMail /> Verification Needed
                </p>
                <p className="text-amber-200/80 text-xs mb-3 leading-relaxed">
                  Your account (<strong>{unconfirmedEmail}</strong>) is not verified. Check your inbox to confirm.
                </p>
                <button
                  type="button"
                  onClick={handleResendConfirmation}
                  disabled={resending}
                  className="w-full text-xs font-bold py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {resending ? 'Sending Email...' : 'Resend Confirmation Email'}
                </button>
              </div>
            )}

            {/* Email Input */}
            <div>
              <label className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-2 block">
                Email Address
              </label>
              <div className="relative group/input">
                <FiMail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-violet-400 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                  id="login-email"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-widest">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-violet-400 font-semibold hover:text-white transition-colors">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative group/input">
                <FiLock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-violet-400 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                  id="login-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors p-1"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-violet-500/25 transition-all text-sm sm:text-base flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed mt-2"
              id="login-submit"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" viewBox="0 0 24 24"></svg>
                  Signing In...
                </span>
              ) : (
                <>Sign In</>
              )}
            </button>
          </form>

          {/* Footer inside card */}
          <div className="mt-8 text-center border-t border-white/10 pt-6">
            <p className="text-sm text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-white font-bold hover:text-violet-400 transition-colors underline underline-offset-4 decoration-violet-500/50">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Global Footer */}
        <p className="text-center text-xs text-gray-500 mt-8 font-medium">
          Protected by modern security • Fast & Secure
        </p>
      </div>
    </div>
  )
}
