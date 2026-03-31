import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiPhone, FiArrowRight, FiShield, FiCheck } from 'react-icons/fi'
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

  // Password strength calculation
  const getPasswordStrength = () => {
    const pw = formData.password
    if (!pw) return { label: '', width: '0%', color: '#333' }
    let score = 0
    if (pw.length >= 6) score++
    if (pw.length >= 10) score++
    if (/[A-Z]/.test(pw)) score++
    if (/[0-9]/.test(pw)) score++
    if (/[^A-Za-z0-9]/.test(pw)) score++
    
    if (score <= 1) return { label: 'Weak', width: '20%', color: '#ef4444' }
    if (score <= 2) return { label: 'Fair', width: '40%', color: '#f59e0b' }
    if (score <= 3) return { label: 'Good', width: '60%', color: '#eab308' }
    if (score <= 4) return { label: 'Strong', width: '80%', color: '#22c55e' }
    return { label: 'Very Strong', width: '100%', color: '#16a34a' }
  }

  const pwStrength = getPasswordStrength()

  const inputStyle = {
    background: 'rgba(0,0,0,0.5)',
    border: '1px solid rgba(255,255,255,0.08)'
  }

  const handleFocus = (e) => {
    e.target.style.borderColor = 'rgba(34,197,94,0.4)'
    e.target.style.boxShadow = '0 0 0 3px rgba(34,197,94,0.08)'
  }

  const handleBlur = (e) => {
    e.target.style.borderColor = 'rgba(255,255,255,0.08)'
    e.target.style.boxShadow = 'none'
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-16"
      style={{ background: 'linear-gradient(145deg, #000000 0%, #050a05 40%, #0a1a0a 70%, #000000 100%)' }}
    >
      {/* Background Glow Effects */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)' }} />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 70%)' }} />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{ backgroundImage: 'linear-gradient(rgba(34,197,94,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="w-full max-w-[500px] relative z-10">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-8 group">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl text-black shadow-lg shadow-green-500/20 group-hover:scale-110 group-hover:shadow-green-500/40 transition-all duration-300"
              style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
              M
            </div>
            <span className="text-xl font-black tracking-[0.2em] text-white" style={{ fontFamily: 'var(--font-family-heading)' }}>
              MAKE<span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #22c55e, #4ade80)' }}>TOBE</span>
            </span>
          </Link>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Create Your Account</h1>
          <p className="text-gray-500 text-sm font-medium">Join our community for an exclusive shopping experience</p>
        </div>

        {/* Form Card */}
        <div className="relative rounded-2xl overflow-hidden"
          style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)', border: '1px solid rgba(34,197,94,0.12)', backdropFilter: 'blur(20px)' }}
        >
          {/* Top accent */}
          <div className="h-[2px] w-full" style={{ background: 'linear-gradient(90deg, transparent, #22c55e, transparent)' }} />
          
          <div className="p-8 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                  Full Name <span className="text-green-400">*</span>
                </label>
                <div className="relative group">
                  <FiUser size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-green-400 transition-colors duration-200" />
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none transition-all duration-200 font-medium"
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    required
                  />
                </div>
              </div>

              {/* Email & Phone Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                    Email <span className="text-green-400">*</span>
                  </label>
                  <div className="relative group">
                    <FiMail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-green-400 transition-colors duration-200" />
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@email.com"
                      className="w-full rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none transition-all duration-200 font-medium"
                      style={inputStyle}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                    Phone <span className="text-gray-600 text-[9px]">(Optional)</span>
                  </label>
                  <div className="relative group">
                    <FiPhone size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-green-400 transition-colors duration-200" />
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+94 7X XXX XXXX"
                      className="w-full rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none transition-all duration-200 font-medium"
                      style={inputStyle}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                  Password <span className="text-green-400">*</span>
                </label>
                <div className="relative group">
                  <FiLock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-green-400 transition-colors duration-200" />
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min. 6 characters"
                    className="w-full rounded-xl py-3.5 pl-12 pr-12 text-sm text-white placeholder-gray-600 focus:outline-none transition-all duration-200 font-medium"
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-green-400 transition-colors p-1"
                  >
                    {showPassword ? <FiEyeOff size={17} /> : <FiEye size={17} />}
                  </button>
                </div>
                {/* Password Strength Bar */}
                {formData.password && (
                  <div className="mt-2.5 flex items-center gap-3">
                    <div className="flex-1 h-1.5 rounded-full bg-gray-800 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: pwStrength.width, background: pwStrength.color }}
                      />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: pwStrength.color }}>
                      {pwStrength.label}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                  Confirm Password <span className="text-green-400">*</span>
                </label>
                <div className="relative group">
                  <FiLock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-green-400 transition-colors duration-200" />
                  <input
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    className="w-full rounded-xl py-3.5 pl-12 pr-12 text-sm text-white placeholder-gray-600 focus:outline-none transition-all duration-200 font-medium"
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    required
                  />
                  {formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-400">
                      <FiCheck size={18} />
                    </div>
                  )}
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-red-400 text-[11px] mt-1.5 font-medium">Passwords don't match</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[52px] rounded-xl text-black font-black text-sm uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2.5 disabled:opacity-50 mt-2 shadow-lg shadow-green-500/15 hover:shadow-green-500/25"
                style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}
              >
                {loading ? (
                  <span className="flex items-center gap-3">
                    <svg className="animate-spin h-5 w-5 border-2 border-black/20 border-t-black rounded-full" viewBox="0 0 24 24"></svg>
                    Creating Account...
                  </span>
                ) : (
                  <>Create Account <FiArrowRight size={18} /></>
                )}
              </button>
            </form>

            {/* Sign In Link */}
            <div className="mt-8 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-center text-sm text-gray-500 font-medium">
                Already have an account?{' '}
                <Link to="/login" className="text-green-400 font-bold hover:text-green-300 transition-colors">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex items-center justify-center gap-6">
          <div className="flex items-center gap-1.5 text-gray-600">
            <FiShield size={13} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Encrypted</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-gray-700" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">256-bit SSL</span>
          <div className="w-1 h-1 rounded-full bg-gray-700" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Private</span>
        </div>
      </div>
    </div>
  )
}
