'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  EyeIcon, 
  EyeSlashIcon, 
  UserIcon 
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const ROLES = [
  { value: 'producer', label: 'Producteur/trice', icon: '🎬' },
  { value: 'director', label: 'Réalisateur/trice', icon: '🎭' },
  { value: 'assistant', label: 'Assistant/e', icon: '🤝' },
  { value: 'actor', label: 'Comédien/ne', icon: '🎭' },
  { value: 'technician', label: 'Technicien/ne', icon: '🔧' },
  { value: 'other', label: 'Autre', icon: '👤' }
]

export function RegisterForm() {
  const { register } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState(ROLES[0].value)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Track field states for "Reward Early, Punish Late" pattern
  const [fieldStates, setFieldStates] = useState<{
    email: { hasError: boolean, wasTouched: boolean, isValid: boolean }
    password: { hasError: boolean, wasTouched: boolean, isValid: boolean }
    confirmPassword: { hasError: boolean, wasTouched: boolean, isValid: boolean }
  }>({
    email: { hasError: false, wasTouched: false, isValid: false },
    password: { hasError: false, wasTouched: false, isValid: false },
    confirmPassword: { hasError: false, wasTouched: false, isValid: false }
  })
  
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
    confirmPassword?: string
  }>({})

  // Validation functions
  const validateEmail = (value: string) => {
    if (!value) return 'L\'email est requis'
    if (!/\S+@\S+\.\S+/.test(value)) return 'Format d\'email invalide'
    return null
  }

  const validatePassword = (value: string) => {
    if (!value) return 'Le mot de passe est requis'
    if (value.length < 8) return 'Le mot de passe doit contenir au moins 8 caractères'
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
      return 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'
    }
    return null
  }

  const validateConfirmPassword = (value: string, passwordValue: string) => {
    if (!value) return 'La confirmation est requise'
    if (value !== passwordValue) return 'Les mots de passe ne correspondent pas'
    return null
  }

  // Handle field changes with "Reward Early, Punish Late" logic
  const handleEmailChange = (value: string) => {
    setEmail(value)
    
    const error = validateEmail(value)
    const isValid = !error
    
    // REWARD EARLY: If field had an error and is now valid, clear error immediately
    if (fieldStates.email.hasError && isValid) {
      setErrors(prev => ({ ...prev, email: undefined }))
      setFieldStates(prev => ({
        ...prev,
        email: { ...prev.email, hasError: false, isValid: true }
      }))
    }
    // Update validity state for submit button
    else if (!fieldStates.email.hasError) {
      setFieldStates(prev => ({
        ...prev,
        email: { ...prev.email, isValid }
      }))
    }
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    
    const error = validatePassword(value)
    const isValid = !error
    
    // REWARD EARLY: If field had an error and is now valid, clear error immediately
    if (fieldStates.password.hasError && isValid) {
      setErrors(prev => ({ ...prev, password: undefined }))
      setFieldStates(prev => ({
        ...prev,
        password: { ...prev.password, hasError: false, isValid: true }
      }))
    }
    // Update validity state
    else if (!fieldStates.password.hasError) {
      setFieldStates(prev => ({
        ...prev,
        password: { ...prev.password, isValid }
      }))
    }

    // Also check confirm password if it was entered
    if (confirmPassword && fieldStates.confirmPassword.wasTouched) {
      const confirmError = validateConfirmPassword(confirmPassword, value)
      const confirmIsValid = !confirmError
      
      if (fieldStates.confirmPassword.hasError && confirmIsValid) {
        setErrors(prev => ({ ...prev, confirmPassword: undefined }))
        setFieldStates(prev => ({
          ...prev,
          confirmPassword: { ...prev.confirmPassword, hasError: false, isValid: true }
        }))
      }
    }
  }

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value)
    
    const error = validateConfirmPassword(value, password)
    const isValid = !error
    
    // REWARD EARLY: If field had an error and is now valid, clear error immediately
    if (fieldStates.confirmPassword.hasError && isValid) {
      setErrors(prev => ({ ...prev, confirmPassword: undefined }))
      setFieldStates(prev => ({
        ...prev,
        confirmPassword: { ...prev.confirmPassword, hasError: false, isValid: true }
      }))
    }
    // Update validity state
    else if (!fieldStates.confirmPassword.hasError) {
      setFieldStates(prev => ({
        ...prev,
        confirmPassword: { ...prev.confirmPassword, isValid }
      }))
    }
  }

  // PUNISH LATE: Validate on blur (when user leaves field)
  const handleEmailBlur = () => {
    if (!email) return // Don't validate empty fields on blur
    
    const error = validateEmail(email)
    setFieldStates(prev => ({
      ...prev,
      email: { hasError: !!error, wasTouched: true, isValid: !error }
    }))
    
    if (error) {
      setErrors(prev => ({ ...prev, email: error }))
    }
  }

  const handlePasswordBlur = () => {
    if (!password) return // Don't validate empty fields on blur
    
    const error = validatePassword(password)
    setFieldStates(prev => ({
      ...prev,
      password: { hasError: !!error, wasTouched: true, isValid: !error }
    }))
    
    if (error) {
      setErrors(prev => ({ ...prev, password: error }))
    }
  }

  const handleConfirmPasswordBlur = () => {
    if (!confirmPassword) return // Don't validate empty fields on blur
    
    const error = validateConfirmPassword(confirmPassword, password)
    setFieldStates(prev => ({
      ...prev,
      confirmPassword: { hasError: !!error, wasTouched: true, isValid: !error }
    }))
    
    if (error) {
      setErrors(prev => ({ ...prev, confirmPassword: error }))
    }
  }

  // Final validation on submit
  const validateOnSubmit = () => {
    const newErrors: {email?: string, password?: string, confirmPassword?: string} = {}
    
    const emailError = validateEmail(email)
    const passwordError = validatePassword(password)
    const confirmError = validateConfirmPassword(confirmPassword, password)
    
    if (emailError) newErrors.email = emailError
    if (passwordError) newErrors.password = passwordError
    if (confirmError) newErrors.confirmPassword = confirmError
    
    setErrors(newErrors)
    
    // Update field states
    setFieldStates({
      email: { hasError: !!emailError, wasTouched: true, isValid: !emailError },
      password: { hasError: !!passwordError, wasTouched: true, isValid: !passwordError },
      confirmPassword: { hasError: !!confirmError, wasTouched: true, isValid: !confirmError }
    })
    
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateOnSubmit()) {
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

  // Check if form is valid for submit button
  const isFormValid = fieldStates.email.isValid && 
                     fieldStates.password.isValid && 
                     fieldStates.confirmPassword.isValid &&
                     email && password && confirmPassword

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
            onChange={(e) => handleEmailChange(e.target.value)}
            onBlur={handleEmailBlur}
            className={`
              w-full pl-10 pr-3 py-3 rounded-lg bg-gray-800 border text-white placeholder-gray-400
              focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors
              ${errors.email 
                ? 'border-red-500 focus:ring-red-500' 
                : fieldStates.email.isValid && email
                ? 'border-green-500 focus:ring-green-500'
                : 'border-gray-600 hover:border-gray-500'
              }
            `}
            placeholder="votre@email.com"
            aria-describedby={errors.email ? "register-email-error" : undefined}
            aria-invalid={errors.email ? "true" : "false"}
          />
          {fieldStates.email.isValid && email && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <span className="text-green-400">✓</span>
            </div>
          )}
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
            onChange={(e) => handlePasswordChange(e.target.value)}
            onBlur={handlePasswordBlur}
            className={`
              w-full pl-10 pr-12 py-3 rounded-lg bg-gray-800 border text-white placeholder-gray-400
              focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors
              ${errors.password 
                ? 'border-red-500 focus:ring-red-500' 
                : fieldStates.password.isValid && password
                ? 'border-green-500 focus:ring-green-500'
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
        
        {/* Password Strength Indicator - Only show when typing */}
        {password && !fieldStates.password.hasError && (
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
        
        {!errors.password && !password && (
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
            onChange={(e) => handleConfirmPasswordChange(e.target.value)}
            onBlur={handleConfirmPasswordBlur}
            className={`
              w-full pl-10 pr-12 py-3 rounded-lg bg-gray-800 border text-white placeholder-gray-400
              focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors
              ${errors.confirmPassword 
                ? 'border-red-500 focus:ring-red-500'
                : fieldStates.confirmPassword.isValid && confirmPassword
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
          {fieldStates.confirmPassword.isValid && confirmPassword && (
            <div className="absolute inset-y-0 right-12 pr-3 flex items-center">
              <span className="text-green-400">✓</span>
            </div>
          )}
        </div>
        {fieldStates.confirmPassword.isValid && confirmPassword && !errors.confirmPassword && (
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
        disabled={loading || !isFormValid}
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