// src/app/login/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import LoginForm from '@/components/auth/LoginForm'
import { AuthProvider, useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import { Toaster } from 'react-hot-toast'

function LoginPageContent() {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 px-4">
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
      
      <div className="w-full max-w-4xl flex items-center gap-12">
        {/* Header à gauche */}
        <div className="flex-1 text-left">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-6">
            <span className="text-3xl">🎬</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Bon retour !
          </h1>
          <p className="text-lg text-gray-400 mb-6">
            Connectez-vous à votre compte Eustache et reprenez le contrôle de vos productions.
          </p>
          <div className="space-y-3 text-gray-400">
            <div className="flex items-center">
              <span className="text-blue-400 mr-3">✓</span>
              Gestion complète de vos projets
            </div>
            <div className="flex items-center">
              <span className="text-blue-400 mr-3">✓</span>
              Organisation des séquences et décors
            </div>
            <div className="flex items-center">
              <span className="text-blue-400 mr-3">✓</span>
              Collaboration en équipe
            </div>
          </div>
        </div>

        {/* Form Container à droite */}
        <div className="flex-none w-96">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 shadow-2xl">
            <LoginForm />
            
            {/* Footer Links */}
            <div className="mt-8 pt-6 border-t border-gray-700">
              <div className="text-center space-y-4">
                <div>
                  <span className="text-sm text-gray-400">Pas encore de compte ? </span>
                  <Link 
                    href="/register" 
                    className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Créer un compte
                  </Link>
                </div>
                
                <div className="text-xs text-gray-500">
                  <Link 
                    href="/forgot-password" 
                    className="hover:text-gray-400 transition-colors"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 flex items-center justify-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Connexion sécurisée SSL
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginPageContent />
    </AuthProvider>
  )
}
