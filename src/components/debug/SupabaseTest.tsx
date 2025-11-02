'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Button from '@/components/ui/Button'

export default function SupabaseTest() {
  const [status, setStatus] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const testConnection = async () => {
    setIsLoading(true)
    setStatus('Test de connexion...')
    
    try {
      const { data, error } = await supabase.from('projects').select('count').limit(1)
      if (error) throw error
      setStatus('✅ Connexion Supabase OK')
    } catch (error) {
      setStatus(`❌ Erreur connexion: ${error}`)
    }
    setIsLoading(false)
  }

  const testDecorsTable = async () => {
    setIsLoading(true)
    setStatus('Test table decors...')
    
    try {
      const { data, error } = await supabase.from('decors').select('*').limit(5)
      if (error) {
        setStatus(`❌ Erreur table decors: ${error.message}`)
      } else {
        setStatus(`✅ Table decors OK - ${data.length} enregistrements trouvés`)
      }
    } catch (error) {
      setStatus(`❌ Erreur: ${error}`)
    }
    setIsLoading(false)
  }

  const testScenesTable = async () => {
    setIsLoading(true)
    setStatus('Test table scenes...')
    
    try {
      const { data, error } = await supabase.from('scenes').select('*').limit(5)
      if (error) {
        setStatus(`❌ Erreur table scenes: ${error.message}`)
      } else {
        setStatus(`✅ Table scenes OK - ${data.length} enregistrements trouvés`)
      }
    } catch (error) {
      setStatus(`❌ Erreur: ${error}`)
    }
    setIsLoading(false)
  }

  return (
    <div className="bg-red-600 p-4 rounded-lg text-white space-y-3 border-2 border-yellow-400">
      <h3 className="font-bold text-lg">🔧 DIAGNOSTIC SUPABASE</h3>
      
      <div className="space-y-2">
        <Button onClick={testConnection} disabled={isLoading} className="w-full">
          1. Tester connexion
        </Button>
        
        <Button onClick={testDecorsTable} disabled={isLoading} className="w-full">
          2. Tester table decors
        </Button>
        
        <Button onClick={testScenesTable} disabled={isLoading} className="w-full">
          3. Tester table scenes
        </Button>
      </div>

      {status && (
        <div className={`p-3 rounded font-mono text-sm ${
          status.includes('❌') ? 'bg-red-900' : 'bg-green-900'
        }`}>
          {status}
        </div>
      )}
      
      {isLoading && (
        <div className="text-center">Chargement...</div>
      )}
    </div>
  )
}