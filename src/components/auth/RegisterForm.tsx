// src/components/auth/RegisterForm.tsx
'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'

const ROLES = [
  { value: 'director', label: 'Réalisateur' },
  { value: 'producer', label: 'Producteur' },
  { value: 'assistant', label: 'Assistant réalisateur' },
  { value: 'scriptwriter', label: 'Scénariste' },
  { value: 'other', label: 'Autre' },
]

export default function RegisterForm() {
  const { register } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState(ROLES[0].value)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await register(email, password, role)
      // Supabase envoie un email de confirmation si configuré.
      router.push('/')
    } catch (err: any) {
      setError(err.message || 'Erreur durant l\'inscription')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="mb-2">
        <label className="block text-sm text-gray-300">Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full mt-1 p-2 rounded bg-gray-800 text-white"
          required
        />
      </div>

      <div className="mb-2">
        <label className="block text-sm text-gray-300">Mot de passe</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full mt-1 p-2 rounded bg-gray-800 text-white"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm text-gray-300">Rôle</label>
        <select
          value={role}
          onChange={e => setRole(e.target.value)}
          className="w-full mt-1 p-2 rounded bg-gray-800 text-white">
          {ROLES.map(r => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </div>

      {error && <div className="text-sm text-red-400 mb-2">{error}</div>}

      <Button type="submit" disabled={loading}>
        {loading ? 'Inscription…' : 'S\'inscrire'}
      </Button>
    </form>
  )
}
