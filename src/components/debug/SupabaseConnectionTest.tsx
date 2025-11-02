// src/components/debug/SupabaseConnectionTest.tsx
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { testSupabaseConnection } from '@/utils/test-connection'

export default function SupabaseConnectionTest() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [details, setDetails] = useState('')

  const runTest = async () => {
    try {
      setStatus('loading')
      setMessage('Test en cours...')
      
      // Test détaillé
      const result = await testSupabaseConnection()
      
      if (result) {
        setStatus('success')
        setMessage('✅ Connexion Supabase OK')
      } else {
        setStatus('error')
        setMessage('❌ Erreur connexion')
      }
    } catch (error: any) {
      setStatus('error')
      setMessage(`❌ Erreur: ${error.message || error}`)
      console.error('Erreur de connexion Supabase:', error)
    }
  }

  useEffect(() => {
    runTest()
  }, [])

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg z-50 max-w-xs">
      <div className="flex items-center space-x-2 mb-2">
        {status === 'loading' && <span>🔄</span>}
        {status === 'success' && <span>✅</span>}
        {status === 'error' && <span>❌</span>}
        <span className="text-sm">{message}</span>
      </div>
      <button 
        onClick={runTest}
        className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded"
      >
        Retester
      </button>
    </div>
  )
}