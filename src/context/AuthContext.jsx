import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, supabaseData } from '../lib/supabase'
import toast from 'react-hot-toast'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  // Helper: fetch or create profile from profiles table
  const loadProfile = async (authUser) => {
    if (!authUser) return null
    try {
      const { data: prof, error } = await supabaseData
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (!error && prof) {
        setProfile(prof)
        setIsAdmin(prof.role === 'admin' || localStorage.getItem('adminAuth') === 'true')
        return prof
      } else {
        // Profile doesn't exist yet, create it
        const newProfile = {
          id: authUser.id,
          email: authUser.email,
          full_name: authUser.user_metadata?.full_name || '',
          phone: authUser.user_metadata?.phone || '',
          avatar_url: authUser.user_metadata?.avatar_url || '',
          role: 'customer',
          status: 'active'
        }
        await supabaseData.from('profiles').upsert([newProfile])
        setProfile(newProfile)
        setIsAdmin(localStorage.getItem('adminAuth') === 'true')
        return newProfile
      }
    } catch (err) {
      // If profiles table doesn't exist, fallback to user_metadata
      console.warn('Profile fetch failed, using metadata:', err)
      const fallback = authUser.user_metadata || {}
      setProfile(fallback)
      setIsAdmin(localStorage.getItem('adminAuth') === 'true')
      return fallback
    }
  }

  useEffect(() => {
    let mounted = true

    // Check active session
    const getSession = async () => {
      try {
        // Safety timeout of 5 seconds
        const sessionPromise = supabase.auth.getSession()
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Auth Timeout')), 5000))
        
        const { data: { session } } = await Promise.race([sessionPromise, timeoutPromise])
        if (!mounted) return
        
        if (session?.user) {
          setUser(session.user)
          const prof = await loadProfile(session.user)
          
          // Block inactive users
          if (prof?.status === 'inactive') {
            await supabase.auth.signOut()
            setUser(null)
            setProfile(null)
            setIsAdmin(false)
            localStorage.removeItem('adminAuth')
          }
        }
      } catch (error) {
        console.error('Session error:', error)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return

      // Skip profile loading on sign out
      if (event === 'SIGNED_OUT') {
        setUser(null)
        setProfile(null)
        setIsAdmin(false)
        setLoading(false)
        return
      }

      // Only process if we have a real session change
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          setUser(session.user)
          await loadProfile(session.user)
        }
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  // Real-time status monitor
  useEffect(() => {
    if (!user) return

    const channel = supabaseData
      .channel(`profile-status-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`
        },
        (payload) => {
          if (payload.new && payload.new.status === 'inactive') {
            toast.error('Your account has been deactivated. Please contact support.')
            signOut()
          }
        }
      )
      .subscribe()

    return () => {
      supabaseData.removeChannel(channel)
    }
  }, [user])

  const fetchProfile = async (userId) => {
    if (user && user.id === userId) {
      await loadProfile(user)
    }
  }

  const updateProfile = async (updates) => {
    const payload = {}
    if (updates.password) payload.password = updates.password
    
    const metaDataToUpdate = {}
    if (updates.fullName !== undefined) metaDataToUpdate.full_name = updates.fullName
    if (updates.phone !== undefined) metaDataToUpdate.phone = updates.phone
    if (updates.avatar_url !== undefined) metaDataToUpdate.avatar_url = updates.avatar_url
    if (updates.avatarUrl !== undefined) metaDataToUpdate.avatar_url = updates.avatarUrl
    
    if (Object.keys(metaDataToUpdate).length > 0) {
      payload.data = {
         ...(user?.user_metadata || {}),
         ...metaDataToUpdate
      }
    }

    const { data, error } = await supabase.auth.updateUser(payload)
    if (!error && data?.user) {
      setUser(data.user)
      // Use data.user.id for immediate reliability
      if (data.user.id) {
        await supabaseData.from('profiles').update(metaDataToUpdate).eq('id', data.user.id)
      }
      await loadProfile(data.user)
    }
    return { data, error }
  }

  // Sign up with email + password
  const signUp = async (email, password, fullName, phone) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone },
        emailRedirectTo: `${window.location.origin}/login`
      }
    })
    return { data, error }
  }

  // Standard email+password sign-in
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  }

  // Magic link / OTP sign-in
  const signInWithOtp = async (email) => {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/`
      }
    })
    return { data, error }
  }

  // Verify OTP code
  const verifyOtp = async (email, token) => {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email'
    })
    return { data, error }
  }

  // Resend confirmation email
  const resendConfirmation = async (email) => {
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email
    })
    return { data, error }
  }

  const resetPasswordForEmail = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { data, error }
  }

  const signOut = async () => {
    try {
      localStorage.removeItem('adminAuth')
      setUser(null)
      setProfile(null)
      setIsAdmin(false)
      await supabase.auth.signOut()
    } catch (err) {
      console.error('Sign out error:', err)
    }
    window.location.href = '/'
  }

  const value = {
    user,
    profile,
    loading,
    isAdmin,
    signUp,
    signIn,
    signInWithOtp,
    verifyOtp,
    resendConfirmation,
    signOut,
    fetchProfile,
    updateProfile,
    resetPasswordForEmail
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
