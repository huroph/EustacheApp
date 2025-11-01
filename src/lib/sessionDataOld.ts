// Données temporaires pour la session - stockage en mémoire
// Ces données seront perdues au rechargement de la page

export interface Decor {
  id: string
  title: string
  address: string
  manoir: 'Intérieur' | 'Extérieur'
  status: 'A validé' | 'En attente' | 'Validé' | 'Reporté'
  createdAt: Date
}

export interface Scene {
  id: string
  numero: string
  decorId: string // Lié au décor
  status: 'A validé' | 'En attente' | 'Validé' | 'Reporté'
  description?: string
  dureeEstimee?: string
  createdAt: Date
}

export interface SequenceFormData {
  id: string
  code: string
  title: string
  colorId: string
  status: 'A validé' | 'En attente' | 'Validé' | 'Reporté'
  location: string
  summary: string
  preMintage: string
  ett: string
  effet: 'JOUR' | 'NUIT'
  type: 'INT' | 'EXT'
  decors: Decor[]
  scenes: Scene[]
  createdAt: Date
  updatedAt: Date
}

// Stockage en mémoire pour la session
class SessionDataStore {
  private sequences: SequenceFormData[] = []
  private currentSequenceId: string | null = null

  // Données initiales
  constructor() {
    this.initializeData()
  }

  private initializeData() {
    const defaultDecors: Decor[] = [
      {
        id: 'decor-1',
        title: 'Salon moderne',
        address: 'Studio A',
        manoir: 'Intérieur',
        status: 'A validé',
        createdAt: new Date()
      },
      {
        id: 'decor-2',
        title: 'Rue parisienne',
        address: 'Ext. Paris 15e',
        manoir: 'Extérieur',
        status: 'A validé',
        createdAt: new Date()
      },
      {
        id: 'decor-3',
        title: 'Bureau direction',
        address: 'Tour Montparnasse',
        manoir: 'Intérieur',
        status: 'A validé',
        createdAt: new Date()
      }
    ]

    const defaultScenes: Scene[] = [
      {
        id: 'scene-1',
        numero: 'SQ-001',
        decorId: 'decor-1',
        status: 'A validé',
        description: 'Scène d\'ouverture',
        dureeEstimee: '05:30',
        createdAt: new Date()
      },
      {
        id: 'scene-2',
        numero: 'SQ-002',
        decorId: 'decor-2',
        status: 'A validé',
        description: 'Poursuite en extérieur',
        dureeEstimee: '08:15',
        createdAt: new Date()
      }
    ]

    const defaultSequence: SequenceFormData = {
      id: 'seq-1',
      code: 'SEQ-1',
      title: 'Confrontation dans la rue',
      colorId: 'blue',
      status: 'A validé',
      location: '',
      summary: '',
      preMintage: '00:00',
      ett: '00:00',
      effet: 'JOUR',
      type: 'INT',
      decors: defaultDecors,
      scenes: defaultScenes,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.sequences = [defaultSequence]
    this.currentSequenceId = defaultSequence.id
  }

  // CRUD pour Séquences
  createSequence(data: Omit<SequenceFormData, 'id' | 'createdAt' | 'updatedAt' | 'decors' | 'scenes'>): SequenceFormData {
    const newSequence: SequenceFormData = {
      ...data,
      id: `seq-${Date.now()}`,
      decors: [],
      scenes: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.sequences.push(newSequence)
    this.currentSequenceId = newSequence.id
    return newSequence
  }

  getSequences(): SequenceFormData[] {
    return [...this.sequences]
  }

  getSequence(id: string): SequenceFormData | null {
    return this.sequences.find(seq => seq.id === id) || null
  }

  getCurrentSequence(): SequenceFormData | null {
    if (!this.currentSequenceId) return null
    return this.getSequence(this.currentSequenceId)
  }

  updateSequence(id: string, data: Partial<Omit<SequenceFormData, 'id' | 'createdAt' | 'updatedAt'>>): SequenceFormData | null {
    const index = this.sequences.findIndex(seq => seq.id === id)
    if (index === -1) return null

    this.sequences[index] = {
      ...this.sequences[index],
      ...data,
      updatedAt: new Date()
    }
    return this.sequences[index]
  }

  deleteSequence(id: string): boolean {
    const index = this.sequences.findIndex(seq => seq.id === id)
    if (index === -1) return false

    this.sequences.splice(index, 1)
    if (this.currentSequenceId === id) {
      this.currentSequenceId = this.sequences[0]?.id || null
    }
    return true
  }

  setCurrentSequence(id: string): boolean {
    const sequence = this.getSequence(id)
    if (!sequence) return false
    this.currentSequenceId = id
    return true
  }

  // CRUD pour Décors
  createDecor(sequenceId: string, data: Omit<Decor, 'id' | 'createdAt'>): Decor | null {
    const sequence = this.getSequence(sequenceId)
    if (!sequence) return null

    const newDecor: Decor = {
      ...data,
      id: `decor-${Date.now()}`,
      createdAt: new Date()
    }

    sequence.decors.push(newDecor)
    sequence.updatedAt = new Date()
    return newDecor
  }

  getDecors(sequenceId: string): Decor[] {
    const sequence = this.getSequence(sequenceId)
    return sequence?.decors || []
  }

  updateDecor(sequenceId: string, decorId: string, data: Partial<Omit<Decor, 'id' | 'createdAt'>>): Decor | null {
    const sequence = this.getSequence(sequenceId)
    if (!sequence) return null

    const index = sequence.decors.findIndex(decor => decor.id === decorId)
    if (index === -1) return null

    sequence.decors[index] = { ...sequence.decors[index], ...data }
    sequence.updatedAt = new Date()
    return sequence.decors[index]
  }

  deleteDecor(sequenceId: string, decorId: string): boolean {
    const sequence = this.getSequence(sequenceId)
    if (!sequence) return false

    const index = sequence.decors.findIndex(decor => decor.id === decorId)
    if (index === -1) return false

    // Supprimer aussi les scènes liées à ce décor
    sequence.scenes = sequence.scenes.filter(scene => scene.decorId !== decorId)
    sequence.decors.splice(index, 1)
    sequence.updatedAt = new Date()
    return true
  }

  // CRUD pour Scènes
  createScene(sequenceId: string, data: Omit<Scene, 'id' | 'createdAt'>): Scene | null {
    const sequence = this.getSequence(sequenceId)
    if (!sequence) return null

    // Vérifier que le décor existe
    const decorExists = sequence.decors.some(decor => decor.id === data.decorId)
    if (!decorExists) return null

    const newScene: Scene = {
      ...data,
      id: `scene-${Date.now()}`,
      createdAt: new Date()
    }

    sequence.scenes.push(newScene)
    sequence.updatedAt = new Date()
    return newScene
  }

  getScenes(sequenceId: string): Scene[] {
    const sequence = this.getSequence(sequenceId)
    return sequence?.scenes || []
  }

  getScenesWithDecors(sequenceId: string): (Scene & { decor?: Decor })[] {
    const sequence = this.getSequence(sequenceId)
    if (!sequence) return []

    return sequence.scenes.map(scene => ({
      ...scene,
      decor: sequence.decors.find(decor => decor.id === scene.decorId)
    }))
  }

  updateScene(sequenceId: string, sceneId: string, data: Partial<Omit<Scene, 'id' | 'createdAt'>>): Scene | null {
    const sequence = this.getSequence(sequenceId)
    if (!sequence) return null

    const index = sequence.scenes.findIndex(scene => scene.id === sceneId)
    if (index === -1) return null

    // Si on change le decorId, vérifier qu'il existe
    if (data.decorId) {
      const decorExists = sequence.decors.some(decor => decor.id === data.decorId)
      if (!decorExists) return null
    }

    sequence.scenes[index] = { ...sequence.scenes[index], ...data }
    sequence.updatedAt = new Date()
    return sequence.scenes[index]
  }

  deleteScene(sequenceId: string, sceneId: string): boolean {
    const sequence = this.getSequence(sequenceId)
    if (!sequence) return false

    const index = sequence.scenes.findIndex(scene => scene.id === sceneId)
    if (index === -1) return false

    sequence.scenes.splice(index, 1)
    sequence.updatedAt = new Date()
    return true
  }
}

// Instance singleton pour la session
export const sessionStore = new SessionDataStore()