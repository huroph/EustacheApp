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
    <div className="h-screen bg-gray-900 overflow-hidden flex flex-col">
      {/* Header */}
      <Header 
        onToggleSidebar={handleToggle}
        sidebarCollapsed={isCollapsed}
      />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          isCollapsed={isCollapsed}
          isMobileOpen={isMobileOpen}
          onCloseMobile={closeMobile}
        />

        {/* Contenu principal */}
        <main
          className={cn(
            'flex-1 transition-all duration-300 overflow-hidden',
            'md:ml-64', // Marge sidebar étendue par défaut
            isCollapsed && 'md:ml-16' // Marge sidebar réduite
          )}
        >
          <div className="h-full w-full overflow-hidden">
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