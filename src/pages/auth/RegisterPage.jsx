import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiPhone, FiCheckCircle, FiArrowLeft } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [step, setStep] = useState(1) // 1 = form, 2 = OTP verification
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [otpCode, setOtpCode] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signUp, verifyOtp, resendConfirmation } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // Step 1: Submit sign up form
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
        // Supabase automatically sends confirmation email
        toast.success('Verification code sent to your email! 📧')
        setStep(2)
      }
    } catch (err) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (!otpCode || otpCode.length < 6) {
      toast.error('Please enter the 6-digit code')
      return
    }

    setLoading(true)
    try {
      const { data, error } = await verifyOtp(formData.email, otpCode)
      if (error) {
        toast.error(error.message || 'Invalid or expired code. Try again.')
      } else {
        toast.success('Email verified! Welcome to Make To Be! 🎉')
        navigate('/')
      }
    } catch (err) {
      toast.error('Verification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Resend OTP
  const handleResend = async () => {
    setLoading(true)
    try {
      const { error } = await resendConfirmation(formData.email)
      if (error) toast.error('Failed to resend. Try again.')
      else toast.success('New verification code sent! Check your inbox.')
    } catch (err) {
      toast.error('Failed to resend email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface)] flex items-center justify-center relative overflow-hidden pt-24 pb-16 px-4">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-lg max-h-lg bg-fuchsia-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg relative z-10 animate-fadeInUp">
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
            {step === 1 ? 'Create Account' : 'Verify Email'}
          </h1>
          <p className="text-gray-400 text-sm">
            {step === 1 
              ? 'Join Make To Be for an exclusive experience' 
              : `We sent a 6-digit code to ${formData.email}`
            }
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-[#1e1c3a]/80 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500" />
          
          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-8">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${step >= 1 ? 'bg-violet-600 text-white' : 'bg-white/5 text-gray-500'}`}>
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">1</span>
              Details
            </div>
            <div className="h-px flex-1 bg-white/10" />
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${step >= 2 ? 'bg-emerald-600 text-white' : 'bg-white/5 text-gray-500'}`}>
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">2</span>
              Verify
            </div>
          </div>

          {step === 1 ? (
            /* ===== STEP 1: Registration Form ===== */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name Input */}
              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-2 block">
                  Full Name <span className="text-violet-500">*</span>
                </label>
                <div className="relative group/input">
                  <FiUser size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-violet-400 transition-colors" />
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Email Input */}
                <div>
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-2 block">
                    Email <span className="text-violet-500">*</span>
                  </label>
                  <div className="relative group/input">
                    <FiMail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-violet-400 transition-colors" />
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@email.com"
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Phone Input */}
                <div>
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-2 block">
                    Phone
                  </label>
                  <div className="relative group/input">
                    <FiPhone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-violet-400 transition-colors" />
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+94 7X XXX XXXX"
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-2 block">
                  Password <span className="text-violet-500">*</span>
                </label>
                <div className="relative group/input">
                  <FiLock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-violet-400 transition-colors" />
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 6 characters"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
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

              {/* Confirm Password Input */}
              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-2 block">
                  Confirm Password <span className="text-violet-500">*</span>
                </label>
                <div className="relative group/input">
                  <FiLock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-violet-400 transition-colors" />
                  <input
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat password"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-violet-500/25 transition-all text-sm sm:text-base flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" viewBox="0 0 24 24"></svg>
                      Sending Verification...
                    </span>
                  ) : (
                    <>Create Account & Verify Email</>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* ===== STEP 2: OTP Verification ===== */
            <form onSubmit={handleVerifyOtp} className="space-y-6 animate-fadeInUp">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/30 flex items-center justify-center mb-4">
                  <FiMail size={36} className="text-emerald-400" />
                </div>
                <h2 className="text-xl font-black text-white mb-2">Check Your Email</h2>
                <p className="text-sm text-gray-400 leading-relaxed max-w-xs mx-auto">
                  We sent a <strong className="text-emerald-400">6-digit verification code</strong> to <br/>
                  <strong className="text-white">{formData.email}</strong>
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-2 block text-center">
                  Enter Verification Code
                </label>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 text-2xl font-mono font-black text-center text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 transition-all tracking-[0.5em] letter-spacing-widest"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={loading || otpCode.length < 6}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" viewBox="0 0 24 24"></svg>
                    Verifying...
                  </span>
                ) : (
                  <><FiCheckCircle size={20} /> Verify & Complete Sign Up</>
                )}
              </button>

              <div className="flex items-center justify-between pt-2">
                <button 
                  type="button" 
                  onClick={() => setStep(1)} 
                  className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  <FiArrowLeft size={14} /> Back
                </button>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={loading}
                  className="text-sm text-violet-400 hover:text-white font-bold transition-colors disabled:opacity-50"
                >
                  Resend Code
                </button>
              </div>
            </form>
          )}

          {/* Footer inside card */}
          <div className="mt-8 text-center border-t border-white/10 pt-6">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-white font-bold hover:text-violet-400 transition-colors underline underline-offset-4 decoration-violet-500/50">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Global Footer */}
        <p className="text-center text-xs text-gray-500 mt-8 font-medium max-w-sm mx-auto">
          By creating an account, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}
