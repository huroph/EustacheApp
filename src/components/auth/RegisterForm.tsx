// src/components/auth/RegisterForm.tsx
'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'
import { EyeIcon, EyeSlashIcon, EnvelopeIcon, LockClosedIcon, UserIcon } from '@heroicons/react/24/outline'

const ROLES = [
  { value: 'director', label: 'Réalisateur', icon: '🎬' },
  { value: 'producer', label: 'Producteur', icon: '💼' },
  { value: 'assistant', label: 'Assistant réalisateur', icon: '📋' },
  { value: 'scriptwriter', label: 'Scénariste', icon: '✍️' },
  { value: 'other', label: 'Autre', icon: '👤' },
]

export default function RegisterForm() {
  const { register } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState(ROLES[0].value)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
    confirmPassword?: string
  }>({})

  const validateForm = () => {
    const newErrors: {email?: string, password?: string, confirmPassword?: string} = {}
    
    // Validation email
    if (!email) {
      newErrors.email = 'L\'email est requis'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Format d\'email invalide'
    }
    
    // Validation mot de passe
    if (!password) {
      newErrors.password = 'Le mot de passe est requis'
    } else if (password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'
    }
    
    // Validation confirmation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'La confirmation est requise'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs du formulaire')
      return
    }

    setLoading(true)
    const loadingToast = toast.loading('Création de votre compte...')
    
    try {
      await register(email, password, role)
      toast.success('Compte créé avec succès ! Bienvenue 🎉', { id: loadingToast })
      router.push('/')
    } catch (err: any) {
      toast.error(err.message || 'Erreur durant l\'inscription', { id: loadingToast })
    } finally {
      setLoading(false)
    }
  }

  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^a-zA-Z\d]/.test(password)) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength(password)
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500']
  const strengthLabels = ['Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort']

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
      {/* Email Field */}
      <div className="space-y-2">
        <label 
          htmlFor="register-email" 
          className="block text-sm font-medium text-gray-300"
        >
          Adresse email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            id="register-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (errors.email) setErrors({...errors, email: undefined})
            }}
            className={`
              w-full pl-10 pr-3 py-3 rounded-lg bg-gray-800 border text-white placeholder-gray-400
              focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors
              ${errors.email 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-600 hover:border-gray-500'
              }
            `}
            placeholder="votre@email.com"
            aria-describedby={errors.email ? "register-email-error" : undefined}
            aria-invalid={errors.email ? "true" : "false"}
          />
        </div>
        {errors.email && (
          <p id="register-email-error" role="alert" className="text-sm text-red-400 flex items-center">
            <span className="mr-1">⚠️</span>
            {errors.email}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label 
          htmlFor="register-password" 
          className="block text-sm font-medium text-gray-300"
        >
          Mot de passe
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            id="register-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (errors.password) setErrors({...errors, password: undefined})
            }}
            className={`
              w-full pl-10 pr-12 py-3 rounded-lg bg-gray-800 border text-white placeholder-gray-400
              focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors
              ${errors.password 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-600 hover:border-gray-500'
              }
            `}
            placeholder="••••••••"
            aria-describedby={errors.password ? "register-password-error" : "password-help"}
            aria-invalid={errors.password ? "true" : "false"}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
            ) : (
              <EyeIcon className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
        
        {/* Password Strength Indicator */}
        {password && (
          <div className="space-y-2">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-gray-400">
              Force: <span className={`${passwordStrength >= 3 ? 'text-green-400' : 'text-yellow-400'}`}>
                {strengthLabels[passwordStrength - 1] || 'Très faible'}
              </span>
            </p>
          </div>
        )}
        
        {errors.password && (
          <p id="register-password-error" role="alert" className="text-sm text-red-400 flex items-center">
            <span className="mr-1">⚠️</span>
            {errors.password}
          </p>
        )}
        
        {!errors.password && (
          <p id="password-help" className="text-xs text-gray-400">
            Au moins 8 caractères avec majuscule, minuscule et chiffre
          </p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <label 
          htmlFor="confirm-password" 
          className="block text-sm font-medium text-gray-300"
        >
          Confirmer le mot de passe
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            id="confirm-password"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value)
              if (errors.confirmPassword) setErrors({...errors, confirmPassword: undefined})
            }}
            className={`
              w-full pl-10 pr-12 py-3 rounded-lg bg-gray-800 border text-white placeholder-gray-400
              focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors
              ${errors.confirmPassword 
                ? 'border-red-500 focus:ring-red-500' 
                : confirmPassword && password === confirmPassword
                ? 'border-green-500 focus:ring-green-500'
                : 'border-gray-600 hover:border-gray-500'
              }
            `}
            placeholder="••••••••"
            aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
            aria-invalid={errors.confirmPassword ? "true" : "false"}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
            aria-label={showConfirmPassword ? "Masquer la confirmation" : "Afficher la confirmation"}
          >
            {showConfirmPassword ? (
              <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
            ) : (
              <EyeIcon className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
        {confirmPassword && password === confirmPassword && (
          <p className="text-sm text-green-400 flex items-center">
            <span className="mr-1">✅</span>
            Les mots de passe correspondent
          </p>
        )}
        {errors.confirmPassword && (
          <p id="confirm-password-error" role="alert" className="text-sm text-red-400 flex items-center">
            <span className="mr-1">⚠️</span>
            {errors.confirmPassword}
          </p>
        )}
      </div>

      {/* Role Field */}
      <div className="space-y-2">
        <label 
          htmlFor="role" 
          className="block text-sm font-medium text-gray-300"
        >
          Votre rôle dans la production
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <select
            id="role"
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full pl-10 pr-3 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white 
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors
                       hover:border-gray-500 appearance-none cursor-pointer"
          >
            {ROLES.map((r) => (
              <option key={r.value} value={r.value} className="bg-gray-800">
                {r.icon} {r.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button 
        type="submit" 
        disabled={loading || !email || !password || !confirmPassword || Object.keys(errors).length > 0}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Création du compte...
          </span>
        ) : (
          'Créer mon compte'
        )}
      </Button>
    </form>
  )
}
