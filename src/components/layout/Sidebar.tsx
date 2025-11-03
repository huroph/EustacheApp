// src/components/layout/Sidebar.tsx
'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { FileText, Film, Calendar, FolderOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'
import { useCurrentProject } from '@/lib/currentProject-supabase'

interface SidebarProps {
  isCollapsed: boolean
  isMobileOpen: boolean
  onCloseMobile: () => void
}

const navigation = [
  {
    name: 'Dépouillement',
    href: '/breakdown',
    icon: FileText,
  },
  {
    name: 'Séquences',
    href: '/sequences',
    icon: Film,
  },
  {
    name: 'Planning',
    href: '/planning',
    icon: Calendar,
  },
]

export default function Sidebar({ isCollapsed, isMobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { project, sequencesCount, isLoading } = useCurrentProject()

  const handleProjectClick = () => {
    router.push('/projects')
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-4" role="navigation" aria-label="Navigation principale">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          const isDisabled = !project

          return (
            <Link
              key={item.name}
              href={isDisabled ? '/projects' : item.href}
              onClick={onCloseMobile}
              className={cn(
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                isDisabled 
                  ? 'text-gray-500 cursor-not-allowed'
                  : isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white',
                isCollapsed && 'justify-center'
              )}
              aria-label={isCollapsed ? item.name : undefined}
            >
              <Icon
                className={cn(
                  'flex-shrink-0',
                  isDisabled
                    ? 'text-gray-500'
                    : isActive 
                    ? 'text-white' 
                    : 'text-gray-400 group-hover:text-white',
                  isCollapsed ? 'h-6 w-6' : 'mr-3 h-5 w-5'
                )}
              />
              {!isCollapsed && (
                <span className="truncate">{item.name}</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Section bas de sidebar - Projet sélectionné */}
      <div className="p-4">
        {isLoading ? (
          <div className={cn('space-y-2', isCollapsed && 'items-center')}>
            {!isCollapsed && (
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">
                Chargement...
              </div>
            )}
          </div>
        ) : project ? (
          <div
            onClick={handleProjectClick}
            className="cursor-pointer bg-blue-900/30 hover:bg-blue-800/40 border border-blue-700/50 rounded-xl p-4 transition-all duration-300 hover:scale-[1.02]"
          >
            {!isCollapsed && (
              <div className="space-y-2">
                <div className="text-blue-200 text-lg font-medium leading-tight">
                  {project.title}
                </div>
                <div className="text-blue-300/70 text-sm">
                  {sequencesCount} séquences
                </div>
              </div>
            )}
            {isCollapsed && (
              <div className="flex items-center justify-center">
                <FolderOpen className="h-5 w-5 text-blue-200" />
              </div>
            )}
          </div>
        ) : (
          <div
            onClick={handleProjectClick}
            className="cursor-pointer bg-gray-800/50 hover:bg-gray-700/60 border border-gray-600/50 rounded-xl p-4 transition-all duration-300 hover:scale-[1.02]"
          >
            {!isCollapsed && (
              <div className="space-y-2">
                <div className="text-gray-300 text-lg font-medium">
                  Aucun projet
                </div>
                <div className="text-gray-400 text-sm">
                  Cliquez pour sélectionner
                </div>
              </div>
            )}
            {isCollapsed && (
              <div className="flex items-center justify-center">
                <FolderOpen className="h-5 w-5 text-gray-400" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Sidebar desktop */}
      <aside
        className={cn(
          'hidden md:fixed md:top-16 md:bottom-0 md:left-0 md:z-40 md:flex md:flex-col',
          'bg-gray-900 border-r border-gray-800 transition-all duration-300',
          isCollapsed ? 'md:w-16' : 'md:w-64'
        )}
        aria-expanded={!isCollapsed}
      >
        <SidebarContent />
      </aside>

      {/* Overlay mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          aria-hidden="true"
        >
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={onCloseMobile}
          />
        </div>
      )}

      {/* Sidebar mobile */}
      <aside
        className={cn(
          'fixed top-16 bottom-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:hidden',
          'bg-gray-900 border-r border-gray-800',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-expanded={isMobileOpen}
      >
        <SidebarContent />
      </aside>
    </>
  )
}