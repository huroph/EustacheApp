// src/app/register/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import RegisterForm from '@/components/auth/RegisterForm'
import { AuthProvider, useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import { Toaster } from 'react-hot-toast'

function RegisterPageContent() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-white text-lg">Chargement...</div>
        </div>
      </div>
    )
  }

  if (user) {
    return null // Redirection en cours
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 px-4 py-8">
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#f9fafb',
            border: '1px solid #374151',
          },
        }}
      />
      
      <div className="w-full max-w-5xl flex items-center gap-12">
        {/* Header à gauche */}
        <div className="flex-1 text-left">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-6">
            <span className="text-3xl">🎬</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Rejoignez Eustache
          </h1>
          <p className="text-lg text-gray-400 mb-8">
            Créez votre compte et commencez à organiser vos productions comme un professionnel.
          </p>
          
          {/* Features Preview */}
          <div className="grid grid-cols-1 gap-4 mb-8">
            <div className="flex items-center text-gray-400">
              <div className="text-2xl mr-4">📋</div>
              <div>
                <div className="font-medium text-white">Gestion de projets</div>
                <div className="text-sm">Organisez tous vos projets en un seul endroit</div>
              </div>
            </div>
            <div className="flex items-center text-gray-400">
              <div className="text-2xl mr-4">🎭</div>
              <div>
                <div className="font-medium text-white">Séquences détaillées</div>
                <div className="text-sm">Planifiez chaque séquence avec précision</div>
              </div>
            </div>
            <div className="flex items-center text-gray-400">
              <div className="text-2xl mr-4">👥</div>
              <div>
                <div className="font-medium text-white">Collaboration équipe</div>
                <div className="text-sm">Travaillez efficacement avec votre équipe</div>
              </div>
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center">
              <span className="text-blue-400 font-bold mr-1">500+</span>
              <span>Réalisateurs</span>
            </div>
            <div className="flex items-center">
              <span className="text-blue-400 font-bold mr-1">1000+</span>
              <span>Projets créés</span>
            </div>
          </div>
        </div>

        {/* Form Container à droite */}
        <div className="flex-none w-96">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 shadow-2xl">
            <RegisterForm />
            
            {/* Footer Links */}
            <div className="mt-8 pt-6 border-t border-gray-700">
              <div className="text-center">
                <span className="text-sm text-gray-400">Déjà un compte ? </span>
                <Link 
                  href="/login" 
                  className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Se connecter
                </Link>
              </div>
            </div>
          </div>

          {/* Terms & Privacy */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              En créant un compte, vous acceptez nos{' '}
              <Link href="/terms" className="hover:text-gray-400 transition-colors underline">
                Conditions d'utilisation
              </Link>
              {' '}et notre{' '}
              <Link href="/privacy" className="hover:text-gray-400 transition-colors underline">
                Politique de confidentialité
              </Link>
            </p>
          </div>
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
