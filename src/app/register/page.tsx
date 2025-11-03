// src/app/register/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import RegisterForm from '@/components/auth/RegisterForm'
import { AuthProvider, useAuth } from '@/hooks/useAuth'
import Link from 'next/link'

function RegisterPageContent() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/')
    }
  }, [user, loading, router])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-white">Chargement...</div>
    </div>
  }

  if (user) {
    return null // Redirection en cours
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="p-6 rounded bg-gray-800 shadow">
        <h2 className="text-xl font-semibold text-white mb-4">S'inscrire</h2>
        <RegisterForm />
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-400">Déjà un compte ? </span>
          <Link href="/login" className="text-sm text-blue-400 hover:underline">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <AuthProvider>
      <RegisterPageContent />
    </AuthProvider>
  )
}
