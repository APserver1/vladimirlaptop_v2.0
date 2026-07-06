import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('vladimir_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        console.warn('Error fetching profile:', error.message)
        return null
      }
      return data
    } catch (err) {
      console.warn('Profile fetch exception:', err)
      return null
    }
  }

  useEffect(() => {
    let mounted = true

    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!mounted) return
        setUser(session?.user ?? null)
        if (session?.user) {
          const p = await fetchProfile(session.user.id)
          if (mounted) setProfile(p)
        }
      } catch (err) {
        console.warn('Auth init error:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        const p = await fetchProfile(session.user.id)
        setProfile(p)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [])

  const signUp = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    })
    if (!error && data?.user) {
      // Profile is auto-created by DB trigger, but upsert in case
      await supabase.from('vladimir_profiles').upsert({
        id: data.user.id,
        email,
        full_name: fullName,
        avatar_url: null,
        role: 'user',
      })
    }
    return { data, error }
  }

  const signIn = async (email, password) => {
    return await supabase.auth.signInWithPassword({ email, password })
  }

  const signOut = async () => {
    return await supabase.auth.signOut()
  }

  const updateProfile = async (updates) => {
    if (!user) return { error: new Error('No user logged in') }
    const { error } = await supabase
      .from('vladimir_profiles')
      .update(updates)
      .eq('id', user.id)
    if (!error) {
      setProfile((prev) => ({ ...prev, ...updates }))
    }
    return { error }
  }

  // Upload avatar to the existing 'profiles' bucket
  const uploadAvatar = async (file) => {
    if (!user) return { url: null, error: new Error('No user logged in') }
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const fileName = `${user.id}/${Date.now()}.${ext}`

      const { error: upErr } = await supabase.storage
        .from('profiles')
        .upload(fileName, file, { upsert: true, contentType: file.type })

      if (upErr) throw upErr

      const { data: pub } = supabase.storage.from('profiles').getPublicUrl(fileName)
      const url = pub.publicUrl

      const { error: dbErr } = await supabase
        .from('vladimir_profiles')
        .update({ avatar_url: url })
        .eq('id', user.id)

      if (dbErr) throw dbErr

      setProfile((prev) => ({ ...prev, avatar_url: url }))
      return { url, error: null }
    } catch (err) {
      console.error('Avatar upload error:', err)
      return { url: null, error: err }
    }
  }

  const value = {
    user,
    profile,
    loading,
    isAdmin: profile?.role === 'admin',
    signUp,
    signIn,
    signOut,
    updateProfile,
    uploadAvatar,
    refreshProfile: async () => {
      if (user) {
        const p = await fetchProfile(user.id)
        setProfile(p)
      }
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
