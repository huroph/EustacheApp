// src/components/layout/AppShell.tsx
'use client'

import { useSidebar } from '@/hooks/useSidebar'
import Header from './Header'
import Sidebar from './Sidebar'
import { cn } from '@/lib/utils'

interface AppShellProps {
  children: React.ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  const { isCollapsed, isMobileOpen, toggleCollapsed, toggleMobile, closeMobile } = useSidebar()

  // Fonction pour gérer le toggle selon la taille d'écran
  const handleToggle = () => {
    // Sur mobile, on utilise le drawer
    if (window.innerWidth < 768) {
      toggleMobile()
    } else {
      // Sur desktop, on utilise le collapse
      toggleCollapsed()
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <Header 
        onToggleSidebar={handleToggle}
        sidebarCollapsed={isCollapsed}
      />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          isCollapsed={isCollapsed}
          isMobileOpen={isMobileOpen}
          onCloseMobile={closeMobile}
        />

        {/* Contenu principal */}
              {/* Contenu principal */}
      <main
        className={cn(
          'transition-all duration-300 pt-16', // pt-16 pour compenser le header sticky
          'md:pl-64', // Largeur sidebar étendue par défaut
          isCollapsed && 'md:pl-16' // Largeur sidebar réduite
        )}
      >
          <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>

      {/* Bouton toggle desktop caché dans le header mais accessible par raccourci */}
      <button
        onClick={toggleCollapsed}
        className="sr-only"
        aria-label="Toggle sidebar with Ctrl+B"
      />
    </div>
  )
}