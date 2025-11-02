// Composant de test pour vérifier la connexion Supabase
// src/components/debug/SupabaseTest.tsx

'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function SupabaseTest() {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'success' | 'error'>('testing')
  const [projectCount, setProjectCount] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test simple : compter les projets
        const { data, error, count } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true })

        if (error) {
          throw error
        }

        setProjectCount(count || 0)
        setConnectionStatus('success')
      } catch (err) {
        console.error('Erreur de connexion Supabase:', err)
        setError(err instanceof Error ? err.message : 'Erreur inconnue')
        setConnectionStatus('error')
      }
    }

    testConnection()
  }, [])

  return (
    <div className="fixed top-4 right-4 bg-white p-4 rounded-lg shadow-lg border z-50">
      <h3 className="font-bold text-sm mb-2">🔍 Test Supabase</h3>
      
      {connectionStatus === 'testing' && (
        <div className="text-blue-600">
          <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full inline-block mr-2"></div>
          Test en cours...
        </div>
      )}
      
      {connectionStatus === 'success' && (
        <div className="text-green-600">
          ✅ Connexion OK<br/>
          <span className="text-sm">Projets: {projectCount}</span>
        </div>
      )}
      
      {connectionStatus === 'error' && (
        <div className="text-red-600">
          ❌ Erreur<br/>
          <span className="text-xs">{error}</span>
        </div>
      )}
    </div>
  )
}