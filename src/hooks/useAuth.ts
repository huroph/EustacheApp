// Hook pour récupérer l'utilisateur actuel
// src/hooks/useAuth.ts

'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Récupérer la session initiale
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        console.log('useAuth - Session récupérée:', session)
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('Erreur lors de la récupération de la session:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getSession()

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('useAuth - Auth state changed:', session?.user)
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  console.log('useAuth - Retour:', { user, userId: user?.id })

  return { user, isLoading, userId: user?.id ?? null }
}
