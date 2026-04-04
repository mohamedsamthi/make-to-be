import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiShield } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error(t('auth.toastFillFields'))
      return
    }

    setLoading(true)
    try {
      // 1. Initial sign-in attempt
      let { data, error } = await signIn(email, password)
      
      // 2. Handle "Email not confirmed" error (Bypass it!)
      if (error && error.message?.toLowerCase().includes('email not confirmed')) {
          console.log('[DevBypass] Attempting to auto-confirm user:', email);
          try {
            // Ping our backend (which uses service_role key) to confirm the user instantly
            const res = await fetch('http://localhost:5000/api/auth/confirm-user', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email })
            });
            
            if (res.ok) {
              console.log('[DevBypass] Successfully auto-confirmed user.');
              // 3. Retry sign-in immediately after auto-confirmation
              const retry = await signIn(email, password);
              data = retry.data;
              error = retry.error;
            }
          } catch (bypassErr) {
            console.error('[DevBypass] Failed to reach backend for confirm-bypass:', bypassErr);
          }
      }

      if (error) {
        if (error.message?.toLowerCase().includes('invalid login')) {
          toast.error(t('auth.toastInvalidLogin'))
        } else if (error.message?.toLowerCase().includes('email not confirmed')) {
          toast.error(t('auth.toastConfirmEmail'))
        } else {
          toast.error(error.message || t('auth.toastLoginFailed'))
        }
      } else {
        toast.success(t('auth.toastWelcome'))
        navigate('/')
      }
    } catch (err) {
      toast.error(t('auth.toastGenericError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-16"
      style={{ background: 'linear-gradient(145deg, #000000 0%, #050a05 40%, #0a1a0a 70%, #000000 100%)' }}
    >
      {/* Animated Background Glow Effects */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)' }} />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 70%)' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full pointer-events-none opacity-30"
        style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 60%)' }} />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{ backgroundImage: 'linear-gradient(rgba(34,197,94,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="w-full max-w-[440px] relative z-10">
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
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">{t('auth.welcomeBack')}</h1>
          <p className="text-gray-500 text-sm font-medium">{t('auth.signInSubtitle')}</p>
        </div>

        {/* Form Card */}
        <div className="relative rounded-2xl overflow-hidden"
          style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)', border: '1px solid rgba(34,197,94,0.12)', backdropFilter: 'blur(20px)' }}
        >
          {/* Top accent bar */}
          <div className="h-[2px] w-full" style={{ background: 'linear-gradient(90deg, transparent, #22c55e, transparent)' }} />
          
          <div className="p-8 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                  {t('auth.email')}
                </label>
                <div className="relative group">
                  <FiMail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-green-400 transition-colors duration-200" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none transition-all duration-200 font-medium"
                    style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}
                    onFocus={e => { e.target.style.borderColor = 'rgba(34,197,94,0.4)'; e.target.style.boxShadow = '0 0 0 3px rgba(34,197,94,0.08)' }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none' }}
                    id="login-email"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    {t('auth.password')}
                  </label>
                  <Link to="/forgot-password" className="text-[11px] font-bold text-green-400 hover:text-green-300 transition-colors uppercase tracking-wider">
                    {t('auth.forgot')}
                  </Link>
                </div>
                <div className="relative group">
                  <FiLock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-green-400 transition-colors duration-200" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl py-3.5 pl-12 pr-12 text-sm text-white placeholder-gray-600 focus:outline-none transition-all duration-200 font-medium"
                    style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}
                    onFocus={e => { e.target.style.borderColor = 'rgba(34,197,94,0.4)'; e.target.style.boxShadow = '0 0 0 3px rgba(34,197,94,0.08)' }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none' }}
                    id="login-password"
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
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[52px] rounded-xl text-black font-black text-sm uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2.5 disabled:opacity-50 mt-3 shadow-lg shadow-green-500/15 hover:shadow-green-500/25"
                style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}
                id="login-submit"
              >
                {loading ? (
                  <span className="flex items-center gap-3">
                    <svg className="animate-spin h-5 w-5 border-2 border-black/20 border-t-black rounded-full" viewBox="0 0 24 24"></svg>
                    {t('auth.signingIn')}
                  </span>
                ) : (
                  <>{t('auth.signIn')} <FiArrowRight size={18} /></>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-8 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-center text-sm text-gray-500 font-medium">
                {t('auth.noAccount')}{' '}
                <Link to="/register" className="text-green-400 font-bold hover:text-green-300 transition-colors">
                  {t('auth.createAccount')}
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-8 flex items-center justify-center gap-6">
          <div className="flex items-center gap-1.5 text-gray-600">
            <FiShield size={13} />
            <span className="text-[10px] font-bold uppercase tracking-widest">{t('auth.encrypted')}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-gray-700" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">{t('auth.ssl')}</span>
          <div className="w-1 h-1 rounded-full bg-gray-700" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">{t('auth.secure')}</span>
        </div>
      </div>
    </div>
  )
}
