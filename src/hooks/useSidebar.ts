// src/hooks/useSidebar.ts
'use client'

import { useState, useEffect, useCallback } from 'react'

export function useSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Charger l'état depuis localStorage au montage
  useEffect(() => {
    const stored = localStorage.getItem('sidebar-collapsed')
    if (stored !== null) {
      setIsCollapsed(JSON.parse(stored))
    }
  }, [])

  // Sauvegarder l'état dans localStorage
  const toggleCollapsed = useCallback(() => {
    setIsCollapsed(prev => {
      const newState = !prev
      localStorage.setItem('sidebar-collapsed', JSON.stringify(newState))
      return newState
    })
  }, [])

  const toggleMobile = useCallback(() => {
    setIsMobileOpen(prev => !prev)
  }, [])

  const closeMobile = useCallback(() => {
    setIsMobileOpen(false)
  }, [])

  // Raccourci clavier Ctrl/Cmd + B
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault()
        toggleCollapsed()
      }
    }

    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [toggleCollapsed])

  return {
    isCollapsed,
    isMobileOpen,
    toggleCollapsed,
    toggleMobile,
    closeMobile,
  }
}