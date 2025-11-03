// src/hooks/useAuth.tsx
'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import * as AuthService from '@/lib/services/auth'

type AuthContextValue = {
  user: any | null
  role: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<any>
  register: (email: string, password: string, role: string) => Promise<any>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let mounted = true

    async function init() {
      const { data } = await supabase.auth.getSession()
      const sessUser = data.session?.user ?? null
      if (!mounted) return
      setUser(sessUser)
      setRole((sessUser && (sessUser.user_metadata as any)?.role) || null)
      setLoading(false)
    }

    init()

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      const u = session?.user ?? null
      setUser(u)
      setRole((u && (u.user_metadata as any)?.role) || null)
      setLoading(false)
    })

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string) => {
    const res = await AuthService.signIn(email, password)
    if (res.error) throw res.error
    // session will be picked up by onAuthStateChange
    return res
  }

  const register = async (email: string, password: string, role: string) => {
    const res = await AuthService.signUp(email, password, role)
    if (res.error) throw res.error
    return res
  }

  const logout = async () => {
    await AuthService.signOut()
    setUser(null)
    setRole(null)
    router.push('/')
  }

  return (
    <AuthContext.Provider value={{ user, role, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
