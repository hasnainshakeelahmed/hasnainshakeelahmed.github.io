import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) {
      setRole(null)
      setLoading(false)
      return
    }
    supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        setRole(data?.role ?? 'user')
        setLoading(false)
      })
  }, [user])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setRole(null)
  }

  const isAdmin = role === 'admin' || role === 'super_admin'

  return (
    <AuthContext.Provider value={{ user, role, isAdmin, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
