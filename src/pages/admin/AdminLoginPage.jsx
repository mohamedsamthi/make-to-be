import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FiUser, FiLock, FiEye, FiEyeOff, FiShield } from 'react-icons/fi'
import toast from 'react-hot-toast'

// Admin credentials
const ADMIN_USERNAME = 'samthi'
const ADMIN_PASSWORD = '5099'

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!username || !password) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)
    setTimeout(() => {
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        localStorage.setItem('adminAuth', JSON.stringify({ username, loggedIn: true, loginTime: Date.now() }))
        toast.success('Welcome back, Admin! 🔥')
        navigate('/admin')
      } else {
        toast.error('Invalid credentials. Please try again.')
      }
      setLoading(false)
    }, 1200)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0a0a1a] relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-violet-600/10 rounded-full blur-[120px] animate-pulse-soft" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-fuchsia-600/10 rounded-full blur-[120px] animate-pulse-soft" style={{ animationDelay: '2s' }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <Link to="/" className="inline-block group mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white shadow-2xl shadow-violet-500/20 group-hover:scale-110 transition-transform duration-500 rotate-3">
              <FiShield size={32} />
            </div>
          </Link>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2 uppercase tracking-widest font-[var(--font-family-heading)]">
            Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Portal</span>
          </h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em]">Authorized Access Only</p>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-50" />
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Username</label>
              <div className="relative group/input">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/input:text-violet-400 transition-colors" size={18} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin_id"
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-violet-500/50 transition-all font-medium"
                  id="admin-username"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Password</label>
              <div className="relative group/input">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/input:text-violet-400 transition-colors" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-violet-500/50 transition-all font-medium"
                  id="admin-password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors p-1"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-violet-500/10 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
              id="admin-login-submit"
            >
              {loading ? (
                <span className="flex items-center gap-3">
                  <svg className="animate-spin h-5 w-5 border-2 border-white/20 border-t-white rounded-full" viewBox="0 0 24 24"></svg>
                  Verifying...
                </span>
              ) : (
                <>
                  <FiShield size={20} /> Authentication
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-white/5">
            <Link to="/" className="text-[10px] font-black text-gray-500 hover:text-violet-400 transition-colors uppercase tracking-widest flex items-center justify-center gap-2">
              <span className="w-1 h-1 rounded-full bg-gray-500" /> Public Interface
            </Link>
          </div>
        </div>
        
        <p className="text-center mt-10 text-[9px] text-gray-600 uppercase tracking-[0.3em] font-medium">
          Make To Be Management System • v2.0
        </p>
      </div>
    </div>
  )
}
