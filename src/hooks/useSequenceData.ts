// src/hooks/useSequenceData.ts
'use client'

import { useState, useEffect } from 'react'
import { useRoles } from './useRoles'
import { useCostumes } from './useCostumes'
import { useAccessoires } from './useAccessoires'
import { useEffetsSpeciaux } from './useEffetsSpeciaux'
import { useEquipesTechniques } from './useEquipesTechniques'
import { useMaterielSon } from './useMaterielSon'
import { useMachinerie } from './useMachinerie'

interface SequenceData {
  roles: any[]
  costumes: any[]
  accessoires: any[]
  effetsSpeciaux: any[]
  equipesTechniques: any[]
  materielSon: any[]
  machinerie: any[]
  isLoading: boolean
  error: string | null
}

export function useSequenceData(sequenceId?: string): SequenceData {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Tous nos hooks existants - seulement si sequenceId existe
  const rolesData = useRoles(sequenceId || '')
  const costumesData = useCostumes(sequenceId || '')
  const accessoiresData = useAccessoires(sequenceId || '')
  const effetsSpeciauxData = useEffetsSpeciaux(sequenceId || '')
  const equipesTechniquesData = useEquipesTechniques(sequenceId || '')
  const materielSonData = useMaterielSon(sequenceId || '')
  const machinerieData = useMachinerie(sequenceId || '')

  useEffect(() => {
    // Si pas de sequenceId, pas de chargement
    if (!sequenceId) {
      setIsLoading(false)
      return
    }

    // Calculer l'état de chargement global
    const allLoading = [
      rolesData.isLoading,
      costumesData.isLoading,
      accessoiresData.isLoading,
      effetsSpeciauxData.loading,
      equipesTechniquesData.loading,
      materielSonData.loading,
      machinerieData.loading
    ]

    const stillLoading = allLoading.some(loading => loading)
    setIsLoading(stillLoading)

    // Calculer les erreurs globales
    const allErrors = [
      rolesData.error,
      costumesData.error,
      accessoiresData.error,
      effetsSpeciauxData.error,
      equipesTechniquesData.error,
      materielSonData.error,
      machinerieData.error
    ].filter(Boolean)

    if (allErrors.length > 0) {
      setError(allErrors.join(', '))
    } else {
      setError(null)
    }
  }, [
    sequenceId,
    rolesData.isLoading,
    costumesData.isLoading,
    accessoiresData.isLoading,
    effetsSpeciauxData.loading,
    equipesTechniquesData.loading,
    materielSonData.loading,
    machinerieData.loading,
    rolesData.error,
    costumesData.error,
    accessoiresData.error,
    effetsSpeciauxData.error,
    equipesTechniquesData.error,
    materielSonData.error,
    machinerieData.error
  ])

  return {
    roles: rolesData.roles || [],
    costumes: costumesData.costumes || [],
    accessoires: accessoiresData.accessoires || [],
    effetsSpeciaux: effetsSpeciauxData.effetsSpeciaux || [],
    equipesTechniques: equipesTechniquesData.equipesTechniques || [],
    materielSon: materielSonData.materielSon || [],
    machinerie: machinerieData.machinerie || [],
    isLoading,
    error
  }
}