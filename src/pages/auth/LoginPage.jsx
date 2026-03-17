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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const { data, error } = await signIn(email, password)
      if (error) {
        if (error.message?.toLowerCase().includes('invalid login')) {
          toast.error('Incorrect email or password.')
        } else if (error.message?.toLowerCase().includes('email not confirmed')) {
          toast.error('Please check your email to confirm your account.')
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
    <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center relative overflow-hidden pt-24 pb-16 px-4">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-fuchsia-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo / Header */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center font-bold text-2xl text-white shadow-lg shadow-violet-500/30 group-hover:scale-110 transition-transform">
              M
            </div>
            <span className="text-xl font-black font-[var(--font-family-heading)] tracking-[0.2em] text-white">
              MAKE<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">TOBE</span>
            </span>
          </Link>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-gray-500 text-sm font-medium">Please enter your credentials to access your account</p>
        </div>

        {/* Form Container */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-60" />
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">
                Email Address
              </label>
              <div className="relative group/input">
                <FiMail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/input:text-violet-400 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-violet-500/50 transition-all font-medium"
                  id="login-email"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Password
                </label>
                <Link to="/forgot-password" alt="Forgot" className="text-[10px] font-black text-violet-400 hover:text-white transition-colors uppercase tracking-widest">
                  Forgot?
                </Link>
              </div>
              <div className="relative group/input">
                <FiLock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/input:text-violet-400 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-violet-500/50 transition-all font-medium"
                  id="login-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors p-1"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-violet-500/10 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 mt-2"
              id="login-submit"
            >
              {loading ? (
                <span className="flex items-center gap-3">
                  <svg className="animate-spin h-5 w-5 border-2 border-white/20 border-t-white rounded-full" viewBox="0 0 24 24"></svg>
                  Authenticating...
                </span>
              ) : (
                <>Sign In</>
              )}
            </button>
          </form>

          {/* Footer inside card */}
          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <p className="text-xs text-gray-500 font-medium">
              New to Make To Be?{' '}
              <Link to="/register" className="text-white font-bold hover:text-violet-400 transition-colors uppercase tracking-widest text-[10px] ml-1">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Global Footer */}
        <p className="text-center text-[10px] text-gray-600 mt-10 uppercase tracking-widest font-medium">
          Fast • Secure • Exclusive
        </p>
      </div>
    </div>
  )
}
