// src/components/layout/Header.tsx
'use client'

import {  Menu, Search, LogOut } from 'lucide-react'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

interface HeaderProps {
  onToggleSidebar: () => void
  sidebarCollapsed: boolean
}

const getRoleLabel = (role: string | null): string => {
  switch (role) {
    case 'director': return 'Réalisateur'
    case 'producer': return 'Producteur'
    case 'assistant': return 'Assistant réalisateur'
    case 'scriptwriter': return 'Scénariste'
    case 'other': return 'Autre'
    default: return '—'
  }
}

export default function Header({ onToggleSidebar, sidebarCollapsed }: HeaderProps) {
  const { user, role, logout } = useAuth()
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gray-900 border-gray-800">
      <div className="flex h-16 items-center px-4">
        {/* Bouton toggle sidebar */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          aria-label={sidebarCollapsed ? 'Étendre la sidebar' : 'Réduire la sidebar'}
          aria-pressed={sidebarCollapsed}
          className="mr-4"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Titre de la page */}
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-white">
            EustacheApp
          </h1>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Barre de recherche (mock) */}
        <div className="relative hidden md:flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-64 pl-10 pr-4 py-2 text-sm bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled
          />
        </div>

        <div className="ml-4 flex items-center space-x-3 text-sm text-gray-200">
         
            <>
              <div className="text-right">
                <div className="font-medium text-white">{user.email}</div>
                <div className="text-xs text-gray-400">{getRoleLabel(role)}</div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => logout()} aria-label="Se déconnecter">
               {/* icon desconnexion de lucide */}
                <LogOut className="h-5 w-5" />

              </Button>
            </>
         
        </div>
      </div>
    </header>
  )
}