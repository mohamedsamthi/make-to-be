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
        toast.success('Welcome Admin! 🔥')
        navigate('/admin')
      } else {
        toast.error('Invalid username or password')
      }
      setLoading(false)
    }, 800)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--color-surface)]"
      style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(233,69,96,0.08) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(245,166,35,0.06) 0%, transparent 50%)' }}
    >
      <div className="w-full max-w-md animate-fadeInUp">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl gradient-accent flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-[var(--color-accent)]/30">
            <FiShield size={36} />
          </div>
          <h1 className="text-3xl font-black font-[var(--font-family-heading)] mb-2">Admin Panel</h1>
          <p className="text-[var(--color-text-secondary)] text-sm">Make To Be - Control Center</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-5 border border-white/5">
          <div>
            <label className="text-sm font-medium text-[var(--color-text-secondary)] mb-2 block">Username</label>
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={18} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                className="input-field pl-12 py-3.5"
                id="admin-username"
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--color-text-secondary)] mb-2 block">Password</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="input-field pl-12 pr-12 py-3.5"
                id="admin-password"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-white transition-colors"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center py-3.5 text-base font-bold disabled:opacity-50 shadow-lg shadow-[var(--color-accent)]/20"
            id="admin-login-submit"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Signing In...
              </span>
            ) : (
              <>
                <FiShield size={20} /> Sign In to Admin
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors">
            ← Back to Shop
          </Link>
        </div>
      </div>
    </div>
  )
}
