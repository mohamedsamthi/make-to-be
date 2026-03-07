import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Check active session
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setUser(session.user)
          setProfile(session.user.user_metadata || {})
          // await fetchProfile(session.user.id)
        }
      } catch (error) {
        console.error('Session error:', error)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user)
        setProfile(session.user.user_metadata || {})
      } else {
        setUser(null)
        setProfile(null)
        setIsAdmin(false)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId) => {
    // If not using a profiles table, just rely on user_metadata
    if (user && user.id === userId) {
      setProfile(user.user_metadata || {})
    }
  }

  const updateProfile = async (updates) => {
    const payload = {}
    if (updates.password) payload.password = updates.password
    
    // Update metadata (name, phone, avatar)
    const metaDataToUpdate = {}
    if (updates.fullName !== undefined) metaDataToUpdate.full_name = updates.fullName
    if (updates.phone !== undefined) metaDataToUpdate.phone = updates.phone
    if (updates.avatar_url !== undefined) metaDataToUpdate.avatar_url = updates.avatar_url
    
    if (Object.keys(metaDataToUpdate).length > 0) {
      payload.data = {
         ...(user?.user_metadata || {}),
         ...metaDataToUpdate
      }
    }

    const { data, error } = await supabase.auth.updateUser(payload)
    if (!error && data?.user) {
      setUser(data.user)
      setProfile(data.user.user_metadata || {})
    }
    return { data, error }
  }

  const signUp = async (email, password, fullName, phone) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone }
      }
    })
    return { data, error }
  }

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  }

  const signOut = async () => {
    localStorage.removeItem('adminAuth')
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setIsAdmin(false)
    window.location.href = '/' // Force reload to home page so that name disappears and cache resets
  }

  const value = {
    user,
    profile,
    loading,
    isAdmin,
    signUp,
    signIn,
    signOut,
    fetchProfile,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
