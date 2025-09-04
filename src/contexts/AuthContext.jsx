import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // ⚠️ PROTECTED FUNCTION - DO NOT MODIFY OR ADD ASYNC OPERATIONS
  // This is a Supabase auth state change listener that must remain synchronous
  const handleAuthStateChange = (event, session) => {
    // SYNC OPERATIONS ONLY - NO ASYNC/AWAIT ALLOWED
    if (session?.user) {
      setUser(session?.user)
      // Fetch user profile separately
      fetchUserProfile(session?.user?.id)
    } else {
      setUser(null)
      setUserProfile(null)
    }
    setLoading(false)
  }

  // Separate async function for fetching user profile
  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.select('*')?.eq('id', userId)?.single()

      if (error) {
        console.error('Error fetching user profile:', error)
        return
      }

      setUserProfile(data)
    } catch (error) {
      console.error('Error in fetchUserProfile:', error)
    }
  }

  useEffect(() => {
    // Get initial session - Use Promise chain
    supabase?.auth?.getSession()?.then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session?.user)
          fetchUserProfile(session?.user?.id)
        }
        setLoading(false)
      })

    const { data: { subscription } } = supabase?.auth?.onAuthStateChange(handleAuthStateChange)

    return () => subscription?.unsubscribe()
  }, [])

  // Sign in with email/password
  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase?.auth?.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Sign up - Only admins can create accounts
  const signUp = async (userData) => {
    try {
      const { data, error } = await supabase?.auth?.signUp({
        email: userData?.email,
        password: userData?.password,
        options: {
          data: {
            full_name: userData?.full_name,
            role: userData?.role || 'employee',
          }
        }
      })

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase?.auth?.signOut()
      if (error) throw error
      
      setUser(null)
      setUserProfile(null)
      
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  // Request password change (requires admin approval)
  const requestPasswordChange = async (currentPassword, newPassword, reason = '') => {
    try {
      if (!user?.id) {
        throw new Error('Usuario no autenticado')
      }

      // Hash passwords (in production, this should be done server-side)
      const { data, error } = await supabase?.from('password_change_requests')?.insert({
          user_id: user?.id,
          current_password_hash: currentPassword, // In production, hash this
          new_password_hash: newPassword, // In production, hash this
          reason,
        })?.select()?.single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Admin function to approve password change
  const approvePasswordChange = async (requestId, approved, adminNotes = '') => {
    try {
      if (userProfile?.role !== 'admin') {
        throw new Error('Solo los administradores pueden aprobar cambios de contraseña')
      }

      const { data, error } = await supabase?.from('password_change_requests')?.update({
          request_status: approved ? 'approved' : 'rejected',
          reviewed_by: user?.id,
          reviewed_at: new Date()?.toISOString(),
          admin_notes: adminNotes,
        })?.eq('id', requestId)?.select()?.single()

      if (error) throw error

      // If approved, update the actual password
      if (approved) {
        // In production, implement server-side password update
        console.log('Password change approved - implement server-side update')
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Admin function to create users
  const createUser = async (userData) => {
    try {
      if (userProfile?.role !== 'admin') {
        throw new Error('Solo los administradores pueden crear usuarios')
      }

      const result = await signUp(userData)
      return result
    } catch (error) {
      return { data: null, error }
    }
  }

  // Check if user is admin
  const isAdmin = () => {
    return userProfile?.role === 'admin'
  }

  // Check if user is manager or admin
  const isManagerOrAdmin = () => {
    return ['admin', 'manager']?.includes(userProfile?.role)
  }

  const value = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
    requestPasswordChange,
    approvePasswordChange,
    createUser,
    isAdmin,
    isManagerOrAdmin,
    fetchUserProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}