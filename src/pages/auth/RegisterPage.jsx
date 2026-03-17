import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiPhone } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.fullName || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields')
      return
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const { data, error } = await signUp(formData.email, formData.password, formData.fullName, formData.phone)
      if (error) {
        if (error.message?.toLowerCase().includes('already registered')) {
          toast.error('This email is already registered. Try logging in.')
        } else {
          toast.error(error.message || 'Registration failed')
        }
      } else {
        toast.success('Registration successful! Please sign in to continue. 🎉')
        navigate('/login')
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center relative overflow-hidden pt-24 pb-16 px-4">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-fuchsia-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-lg max-h-lg bg-fuchsia-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg relative z-10 animate-fadeInUp">
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
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Create Account</h1>
          <p className="text-gray-500 text-sm font-medium">Join our community for an exclusive shopping experience</p>
        </div>

        {/* Form Container */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-60" />
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Input */}
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">
                Full Name <span className="text-violet-500 font-bold">*</span>
              </label>
              <div className="relative group/input">
                <FiUser size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/input:text-violet-400 transition-colors" />
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="name"
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-violet-500/50 transition-all font-medium"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Email Input */}
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">
                  Email <span className="text-violet-500 font-bold">*</span>
                </label>
                <div className="relative group/input">
                  <FiMail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/input:text-violet-400 transition-colors" />
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-violet-500/50 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              {/* Phone Input */}
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">
                  Phone
                </label>
                <div className="relative group/input">
                  <FiPhone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/input:text-violet-400 transition-colors" />
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+94"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-violet-500/50 transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">
                Password <span className="text-violet-500 font-bold">*</span>
              </label>
              <div className="relative group/input">
                <FiLock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/input:text-violet-400 transition-colors" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-violet-500/50 transition-all font-medium"
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

            {/* Confirm Password Input */}
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">
                Confirm Password <span className="text-violet-500 font-bold">*</span>
              </label>
              <div className="relative group/input">
                <FiLock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/input:text-violet-400 transition-colors" />
                <input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-violet-500/50 transition-all font-medium"
                  required
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-violet-500/10 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-3">
                    <svg className="animate-spin h-5 w-5 border-2 border-white/20 border-t-white rounded-full" viewBox="0 0 24 24"></svg>
                    Creating...
                  </span>
                ) : (
                  <>Create Account</>
                )}
              </button>
            </div>
          </form>

          {/* Footer inside card */}
          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <p className="text-xs text-gray-500 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-white font-bold hover:text-violet-400 transition-colors uppercase tracking-widest text-[10px] ml-1">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Global Footer */}
        <p className="text-center text-[10px] text-gray-600 mt-10 uppercase tracking-widest font-medium">
          Premium Shopping Experience • Secure Data
        </p>
      </div>
    </div>
  )
}
