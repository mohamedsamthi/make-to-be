import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Check if there is a hash or query param from supabase or if user is actually in a recovery session
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      // Note: During password recovery, supabase signs the user in and establishes a session.
      // If there's no session and no access_token in the URL, they shouldn't be here.
      if (!session && !location.hash.includes('access_token')) {
        toast.error('Invalid or expired password reset link.')
        navigate('/login')
      }
    }
    checkSession()
  }, [navigate, location])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      
      if (error) {
        toast.error(error.message || 'Failed to update password')
      } else {
        toast.success('Password updated successfully! 🎉')
        navigate('/') // They are already signed in after updating password
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
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center font-bold text-2xl text-white shadow-lg shadow-violet-500/30 mb-6">
            M
          </div>
          <h1 className="text-3xl font-black font-[var(--font-family-heading)] text-white mb-2 tracking-wide">
            Update Password
          </h1>
          <p className="text-gray-400 text-sm">
            Please enter your new password below
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-[#1e1c3a]/80 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500" />
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Password Input */}
            <div>
              <label className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-2 block">
                New Password
              </label>
              <div className="relative group/input">
                <FiLock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-violet-400 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                Confirm New Password
              </label>
              <div className="relative group/input">
                <FiLock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-violet-400 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-violet-500/25 transition-all text-sm sm:text-base flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" viewBox="0 0 24 24"></svg>
                  Updating...
                </span>
              ) : (
                <>Update Password</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
