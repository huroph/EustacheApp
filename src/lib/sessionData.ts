// Interfaces de base
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

export interface Role {
  id: string
  type: 'Principale' | 'Secondaire' | 'Figurant' | 'Voix Off'
  nomRole: string
  interpreteNom: string
  interpretePrenom: string
  genre: 'Masculin' | 'Féminin' | 'Autre'
  agePersonnage: string
  apparence: string
  description: string
  notesSequence: string
  // Contact
  adresse: string
  email: string
  telephone: string
  // Doublure
  doublureNom?: string
  doublurePrenom?: string
  doublureType?: 'Image' | 'Voix' | 'Cascades'
  doublureAdresse?: string
  doublureEmail?: string
  doublureTelephone?: string
  doublureNotes?: string
  createdAt: Date
}

export interface Costume {
  id: string
  nomCostume: string
  roleId?: string // Assigné à un rôle (optionnel)
  statut: 'A validé' | 'En attente' | 'Validé' | 'Reporté'
  notesCostume: string
  createdAt: Date
}

export interface Accessoire {
  id: string
  nomAccessoire: string
  roleId?: string // Assigné à un rôle (optionnel)
  statut: 'A validé' | 'En attente' | 'Validé' | 'Reporté'
  notesAccessoire: string
  createdAt: Date
}

export interface EffetSpecial {
  id: string
  nom: string
  statut: 'En attente' | 'A validé' | 'Validé' | 'Reporté'
  description: string
  createdAt: Date
}

export interface EquipeTechnique {
  id: string
  nom: string
  prenom: string
  type: 'Ingénieur son' | 'Opérateur confirmé' | 'Assistant' | 'Technicien' | 'Superviseur'
  sequences: string[] // IDs des séquences assignées
  notes: string
  createdAt: Date
}

export interface MaterielSon {
  id: string
  nom: string
  statut: 'A validé' | 'En attente' | 'Validé' | 'Reporté'
  referentId: string // ID de l'équipe technique référente
  notes: string
  createdAt: Date
}

export interface Machinerie {
  id: string
  nom: string
  statut: 'A validé' | 'En attente' | 'Validé' | 'Reporté'
  referentId: string // ID de l'équipe technique référente
  notes: string
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
  createdAt: Date
  updatedAt: Date
}

class SessionDataStore {
  private sequences: SequenceFormData[] = []
  private decors: Record<string, Decor[]> = {} // sequenceId -> Decor[]
  private scenes: Record<string, Scene[]> = {} // sequenceId -> Scene[]
  private roles: Record<string, Role[]> = {} // sequenceId -> Role[]
  private costumes: Record<string, Costume[]> = {} // sequenceId -> Costume[]
  private accessoires: Record<string, Accessoire[]> = {} // sequenceId -> Accessoire[]
  private effetsSpeciaux: Record<string, EffetSpecial[]> = {} // sequenceId -> EffetSpecial[]
  private equipesTechniques: EquipeTechnique[] = [] // Global, pas par séquence
  private materielSon: Record<string, MaterielSon[]> = {} // sequenceId -> MaterielSon[]
  private machineries: Record<string, Machinerie[]> = {} // sequenceId -> Machinerie[]
  private currentSequenceId: string | null = null
  private listeners: Set<() => void> = new Set()

  constructor() {
    this.load()
    // fallback to defaults if nothing in session
    if (!this.sequences || this.sequences.length === 0) {
      this.initializeData()
      this.save()
    }
  }

  private initializeData() {
    // Créer une séquence par défaut
    const defaultSequence: SequenceFormData = {
      id: 'seq-1',
      code: 'SEQ-1',
      title: 'Confrontation dans la rue',
      colorId: 'blue',
      status: 'A validé',
      location: 'Studio A, Paris',
      summary: 'Une scène d\'action intense dans les rues de Paris',
      preMintage: '02:30',
      ett: '01:45',
      effet: 'JOUR',
      type: 'EXT',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.sequences = [defaultSequence]
    this.currentSequenceId = defaultSequence.id

    // Ajouter des décors et scènes par défaut pour la séquence exemple
    this.decors[defaultSequence.id] = [
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
      }
    ]

    this.scenes[defaultSequence.id] = [
      {
        id: 'scene-1',
        numero: '1',
        decorId: 'decor-1',
        status: 'A validé',
        description: 'Introduction des personnages',
        dureeEstimee: '05:30',
        createdAt: new Date()
      },
      {
        id: 'scene-2',
        numero: '2',
        decorId: 'decor-2',
        status: 'En attente',
        description: 'Poursuite dans la rue',
        dureeEstimee: '08:15',
        createdAt: new Date()
      }
    ]

    this.roles[defaultSequence.id] = [
      {
        id: 'role-1',
        type: 'Principale',
        nomRole: 'Claire Dubois',
        interpreteNom: 'Martin',
        interpretePrenom: 'Justine',
        genre: 'Féminin',
        agePersonnage: '38 ans',
        apparence: 'Médecin urgentiste brillant mais tourmenté par un drame personne',
        description: 'Médecin urgentiste brillant mais tourmenté par un drame personne',
        notesSequence: 'Médecin urgentiste brillant mais tourmenté par un drame personne',
        adresse: '39 rue des long prets 94100, PARIS',
        email: 'Claire.DUBOIS@gmail.com',
        telephone: '+33070707007',
        doublureNom: 'Bonner',
        doublurePrenom: 'Fleurs',
        doublureType: 'Image',
        doublureAdresse: '39 rue des long prets 94100, PARIS',
        doublureEmail: 'Claire.DUBOIS@gmail.com',
        doublureTelephone: '+33070707007',
        doublureNotes: 'Médecin urgentiste brillant mais tourmenté par un drame personne',
        createdAt: new Date()
      }
    ]

    this.costumes[defaultSequence.id] = [
      {
        id: 'costume-1',
        nomCostume: 'Robe noire',
        roleId: 'role-1', // Assigné à Claire Dubois
        statut: 'A validé',
        notesCostume: 'Médecin urgentiste brillant mais tourmenté par un drame personne',
        createdAt: new Date()
      }
    ]

    this.accessoires[defaultSequence.id] = [
      {
        id: 'accessoire-1',
        nomAccessoire: 'Bague',
        roleId: 'role-1', // Assigné à Claire Dubois
        statut: 'A validé',
        notesAccessoire: 'Médecin urgentiste brillant mais tourmenté par un drame personne',
        createdAt: new Date()
      }
    ]

    this.effetsSpeciaux[defaultSequence.id] = [
      {
        id: 'effet-1',
        nom: 'Explosion',
        statut: 'A validé',
        description: 'Explosion dans la rue avec fumée et débris',
        createdAt: new Date()
      }
    ]

    this.equipesTechniques = [
      {
        id: 'equipe-1',
        nom: 'Rodriguez',
        prenom: 'Paul',
        type: 'Ingénieur son',
        sequences: ['seq-1'], // Assigné à la séquence par défaut
        notes: '',
        createdAt: new Date()
      },
      {
        id: 'equipe-2',
        nom: 'Frenin',
        prenom: 'Jacob',
        type: 'Opérateur confirmé',
        sequences: ['seq-1'],
        notes: '',
        createdAt: new Date()
      }
    ]

    this.materielSon[defaultSequence.id] = [
      {
        id: 'materiel-1',
        nom: 'Perche Rode NTG3',
        statut: 'A validé',
        referentId: 'equipe-1', // Paul Rodriguez
        notes: '',
        createdAt: new Date()
      }
    ]

    this.machineries[defaultSequence.id] = [
      {
        id: 'machinerie-1',
        nom: 'Steadicam',
        statut: 'A validé',
        referentId: 'equipe-2', // Jacob Frenin
        notes: '',
        createdAt: new Date()
      }
    ]
  }

  // Persist in sessionStorage
  private save() {
    try {
      const payload = {
        sequences: this.sequences,
        decors: this.decors,
        scenes: this.scenes,
        roles: this.roles,
        costumes: this.costumes,
        accessoires: this.accessoires,
        effetsSpeciaux: this.effetsSpeciaux,
        equipesTechniques: this.equipesTechniques,
        materielSon: this.materielSon,
        machineries: this.machineries,
        currentSequenceId: this.currentSequenceId
      }
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.setItem('eustache.sessionData', JSON.stringify(payload))
      }
      // notify subscribers that data changed
      this.notifyChange()
    } catch (e) {
      // ignore
      console.warn('sessionStore.save error', e)
    }
  }

  private notifyChange() {
    try {
      this.listeners.forEach((fn) => {
        try { fn() } catch (e) { /* ignore individual listener errors */ }
      })
    } catch (e) {
      // ignore
    }
  }

  private load() {
    try {
      if (typeof window === 'undefined' || !window.sessionStorage) return
      const raw = window.sessionStorage.getItem('eustache.sessionData')
      if (!raw) return
      const parsed = JSON.parse(raw)
      // basic validation
      if (parsed && Array.isArray(parsed.sequences)) {
        // Support legacy payloads where decors/scenes were nested inside sequences
        this.decors = {}
        this.scenes = {}
        this.roles = {}
        this.costumes = {}
        this.accessoires = {}
        this.effetsSpeciaux = {}
        this.materielSon = {}
        this.machineries = {}

        // Normalize sequences and extract decors/scenes per sequence
        this.sequences = parsed.sequences.map((s: any) => {
          const seqId = s.id
          // if sequence contains nested decors/scenes, move them out
          if (Array.isArray(s.decors) && s.decors.length > 0) {
            this.decors[seqId] = s.decors.map((d: any) => ({ ...d, createdAt: new Date(d.createdAt) }))
          }
          if (Array.isArray(s.scenes) && s.scenes.length > 0) {
            this.scenes[seqId] = s.scenes.map((sc: any) => ({ ...sc, createdAt: new Date(sc.createdAt) }))
          }
          if (Array.isArray(s.roles) && s.roles.length > 0) {
            this.roles[seqId] = s.roles.map((r: any) => ({ ...r, createdAt: new Date(r.createdAt) }))
          }
          if (Array.isArray(s.costumes) && s.costumes.length > 0) {
            this.costumes[seqId] = s.costumes.map((c: any) => ({ ...c, createdAt: new Date(c.createdAt) }))
          }
          if (Array.isArray(s.accessoires) && s.accessoires.length > 0) {
            this.accessoires[seqId] = s.accessoires.map((a: any) => ({ ...a, createdAt: new Date(a.createdAt) }))
          }
          if (Array.isArray(s.effetsSpeciaux) && s.effetsSpeciaux.length > 0) {
            this.effetsSpeciaux[seqId] = s.effetsSpeciaux.map((e: any) => ({ ...e, createdAt: new Date(e.createdAt) }))
          }
          if (Array.isArray(s.materielSon) && s.materielSon.length > 0) {
            this.materielSon[seqId] = s.materielSon.map((m: any) => ({ ...m, createdAt: new Date(m.createdAt) }))
          }
          if (Array.isArray(s.machineries) && s.machineries.length > 0) {
            this.machineries[seqId] = s.machineries.map((ma: any) => ({ ...ma, createdAt: new Date(ma.createdAt) }))
          }

          // fallback to parsed.decors / parsed.scenes / parsed.roles / parsed.costumes / parsed.accessoires / parsed.effetsSpeciaux / parsed.materielSon / parsed.machineries maps
          if (!this.decors[seqId] && parsed.decors && parsed.decors[seqId]) {
            this.decors[seqId] = (parsed.decors[seqId] || []).map((d: any) => ({ ...d, createdAt: new Date(d.createdAt) }))
          }
          if (!this.scenes[seqId] && parsed.scenes && parsed.scenes[seqId]) {
            this.scenes[seqId] = (parsed.scenes[seqId] || []).map((sc: any) => ({ ...sc, createdAt: new Date(sc.createdAt) }))
          }
          if (!this.roles[seqId] && parsed.roles && parsed.roles[seqId]) {
            this.roles[seqId] = (parsed.roles[seqId] || []).map((r: any) => ({ ...r, createdAt: new Date(r.createdAt) }))
          }
          if (!this.costumes[seqId] && parsed.costumes && parsed.costumes[seqId]) {
            this.costumes[seqId] = (parsed.costumes[seqId] || []).map((c: any) => ({ ...c, createdAt: new Date(c.createdAt) }))
          }
          if (!this.accessoires[seqId] && parsed.accessoires && parsed.accessoires[seqId]) {
            this.accessoires[seqId] = (parsed.accessoires[seqId] || []).map((a: any) => ({ ...a, createdAt: new Date(a.createdAt) }))
          }
          if (!this.effetsSpeciaux[seqId] && parsed.effetsSpeciaux && parsed.effetsSpeciaux[seqId]) {
            this.effetsSpeciaux[seqId] = (parsed.effetsSpeciaux[seqId] || []).map((e: any) => ({ ...e, createdAt: new Date(e.createdAt) }))
          }
          if (!this.materielSon[seqId] && parsed.materielSon && parsed.materielSon[seqId]) {
            this.materielSon[seqId] = (parsed.materielSon[seqId] || []).map((m: any) => ({ ...m, createdAt: new Date(m.createdAt) }))
          }
          if (!this.machineries[seqId] && parsed.machineries && parsed.machineries[seqId]) {
            this.machineries[seqId] = (parsed.machineries[seqId] || []).map((ma: any) => ({ ...ma, createdAt: new Date(ma.createdAt) }))
          }

          return {
            id: s.id,
            code: s.code,
            title: s.title,
            colorId: s.colorId,
            status: s.status,
            location: s.location,
            summary: s.summary,
            preMintage: s.preMintage,
            ett: s.ett,
            effet: s.effet,
            type: s.type,
            createdAt: new Date(s.createdAt),
            updatedAt: new Date(s.updatedAt)
          }
        })

        // Load équipes techniques (global)
        if (parsed.equipesTechniques && Array.isArray(parsed.equipesTechniques)) {
          this.equipesTechniques = parsed.equipesTechniques.map((e: any) => ({ 
            ...e, 
            createdAt: new Date(e.createdAt) 
          }))
        } else {
          this.equipesTechniques = []
        }

        // ensure decors/scenes/roles/costumes/accessoires/effetsSpeciaux/materielSon/machineries maps exist for each sequence
        this.sequences.forEach((seq) => {
          if (!this.decors[seq.id]) this.decors[seq.id] = []
          if (!this.scenes[seq.id]) this.scenes[seq.id] = []
          if (!this.roles[seq.id]) this.roles[seq.id] = []
          if (!this.costumes[seq.id]) this.costumes[seq.id] = []
          if (!this.accessoires[seq.id]) this.accessoires[seq.id] = []
          if (!this.effetsSpeciaux[seq.id]) this.effetsSpeciaux[seq.id] = []
          if (!this.materielSon[seq.id]) this.materielSon[seq.id] = []
          if (!this.machineries[seq.id]) this.machineries[seq.id] = []
        })

        this.currentSequenceId = parsed.currentSequenceId || (this.sequences[0] && this.sequences[0].id) || null
      }
    } catch (e) {
      console.warn('sessionStore.load error', e)
    }
  }

  // === CRUD SÉQUENCES ===
  createSequence(data: Omit<SequenceFormData, 'id' | 'createdAt' | 'updatedAt'>): SequenceFormData {
    const newSequence: SequenceFormData = {
      ...data,
      id: `seq-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    this.sequences.push(newSequence)
    this.currentSequenceId = newSequence.id
    
    // Initialiser les collections pour cette séquence
    this.decors[newSequence.id] = []
    this.scenes[newSequence.id] = []
    this.roles[newSequence.id] = []
    this.costumes[newSequence.id] = []
    this.accessoires[newSequence.id] = []
    this.save()
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

  setCurrentSequence(id: string): void {
    if (this.getSequence(id)) {
      this.currentSequenceId = id
      this.save()
    }
  }

  updateSequence(id: string, updates: Partial<Omit<SequenceFormData, 'id' | 'createdAt'>>): SequenceFormData | null {
    const sequence = this.getSequence(id)
    if (!sequence) return null

    Object.assign(sequence, updates, { updatedAt: new Date() })
    this.save()
    return sequence
  }

  deleteSequence(id: string): boolean {
    const index = this.sequences.findIndex(seq => seq.id === id)
    if (index === -1) return false

    this.sequences.splice(index, 1)
    
    // Nettoyer les décors, scènes, rôles, costumes et accessoires associés
    delete this.decors[id]
    delete this.scenes[id]
    delete this.roles[id]
    delete this.costumes[id]
    delete this.accessoires[id]
    
    // Réinitialiser la séquence courante si c'était celle supprimée
    if (this.currentSequenceId === id) {
      this.currentSequenceId = this.sequences.length > 0 ? this.sequences[0].id : null
    }
    this.save()
    return true
  }

  // === CRUD DÉCORS ===
  createDecor(sequenceId: string, data: Omit<Decor, 'id' | 'createdAt'>): Decor | null {
    if (!this.getSequence(sequenceId)) return null

    const newDecor: Decor = {
      ...data,
      id: `decor-${Date.now()}`,
      createdAt: new Date()
    }

    if (!this.decors[sequenceId]) {
      this.decors[sequenceId] = []
    }
    
    this.decors[sequenceId].push(newDecor)
    this.save()
    return newDecor
  }

  getDecors(sequenceId: string): Decor[] {
    return this.decors[sequenceId] || []
  }

  updateDecor(sequenceId: string, decorId: string, updates: Partial<Omit<Decor, 'id' | 'createdAt'>>): Decor | null {
    const decors = this.decors[sequenceId]
    if (!decors) return null

    const decor = decors.find(d => d.id === decorId)
    if (!decor) return null

    Object.assign(decor, updates)
    this.save()
    return decor
  }

  deleteDecor(sequenceId: string, decorId: string): boolean {
    const decors = this.decors[sequenceId]
    if (!decors) return false

    const index = decors.findIndex(d => d.id === decorId)
    if (index === -1) return false

    decors.splice(index, 1)

    // Supprimer aussi les scènes associées à ce décor
    const scenes = this.scenes[sequenceId]
    if (scenes) {
      this.scenes[sequenceId] = scenes.filter(scene => scene.decorId !== decorId)
    }
    this.save()
    return true
  }

  // === CRUD SCÈNES ===
  createScene(sequenceId: string, data: Omit<Scene, 'id' | 'createdAt'>): Scene | null {
    if (!this.getSequence(sequenceId)) return null

    const newScene: Scene = {
      ...data,
      id: `scene-${Date.now()}`,
      createdAt: new Date()
    }

    if (!this.scenes[sequenceId]) {
      this.scenes[sequenceId] = []
    }
    
    this.scenes[sequenceId].push(newScene)
    this.save()
    return newScene
  }

  getScenes(sequenceId: string): Scene[] {
    return this.scenes[sequenceId] || []
  }

  getScenesWithDecors(sequenceId: string): (Scene & { decor?: Decor })[] {
    const scenes = this.getScenes(sequenceId)
    const decors = this.getDecors(sequenceId)
    
    return scenes.map(scene => ({
      ...scene,
      decor: decors.find(d => d.id === scene.decorId)
    }))
  }

  updateScene(sequenceId: string, sceneId: string, updates: Partial<Omit<Scene, 'id' | 'createdAt'>>): Scene | null {
    const scenes = this.scenes[sequenceId]
    if (!scenes) return null

    const scene = scenes.find(s => s.id === sceneId)
    if (!scene) return null

    Object.assign(scene, updates)
    this.save()
    return scene
  }

  deleteScene(sequenceId: string, sceneId: string): boolean {
    const scenes = this.scenes[sequenceId]
    if (!scenes) return false

    const index = scenes.findIndex(s => s.id === sceneId)
    if (index === -1) return false

    scenes.splice(index, 1)
    this.save()
    return true
  }

  // === CRUD RÔLES ===
  createRole(sequenceId: string, data: Omit<Role, 'id' | 'createdAt'>): Role | null {
    if (!this.getSequence(sequenceId)) return null

    const newRole: Role = {
      ...data,
      id: `role-${Date.now()}`,
      createdAt: new Date()
    }

    if (!this.roles[sequenceId]) {
      this.roles[sequenceId] = []
    }
    
    this.roles[sequenceId].push(newRole)
    this.save()
    return newRole
  }

  getRoles(sequenceId: string): Role[] {
    return this.roles[sequenceId] || []
  }

  updateRole(sequenceId: string, roleId: string, updates: Partial<Omit<Role, 'id' | 'createdAt'>>): Role | null {
    const roles = this.roles[sequenceId]
    if (!roles) return null

    const role = roles.find(r => r.id === roleId)
    if (!role) return null

    Object.assign(role, updates)
    this.save()
    return role
  }

  deleteRole(sequenceId: string, roleId: string): boolean {
    const roles = this.roles[sequenceId]
    if (!roles) return false

    const index = roles.findIndex(r => r.id === roleId)
    if (index === -1) return false

    roles.splice(index, 1)
    this.save()
    return true
  }

  // === CRUD COSTUMES ===
  createCostume(sequenceId: string, data: Omit<Costume, 'id' | 'createdAt'>): Costume | null {
    if (!this.getSequence(sequenceId)) return null

    const newCostume: Costume = {
      ...data,
      id: `costume-${Date.now()}`,
      createdAt: new Date()
    }

    if (!this.costumes[sequenceId]) {
      this.costumes[sequenceId] = []
    }
    
    this.costumes[sequenceId].push(newCostume)
    this.save()
    return newCostume
  }

  getCostumes(sequenceId: string): Costume[] {
    return this.costumes[sequenceId] || []
  }

  updateCostume(sequenceId: string, costumeId: string, updates: Partial<Omit<Costume, 'id' | 'createdAt'>>): Costume | null {
    const costumes = this.costumes[sequenceId]
    if (!costumes) return null

    const costume = costumes.find(c => c.id === costumeId)
    if (!costume) return null

    Object.assign(costume, updates)
    this.save()
    return costume
  }

  deleteCostume(sequenceId: string, costumeId: string): boolean {
    const costumes = this.costumes[sequenceId]
    if (!costumes) return false

    const index = costumes.findIndex(c => c.id === costumeId)
    if (index === -1) return false

    costumes.splice(index, 1)
    this.save()
    return true
  }

  // === CRUD ACCESSOIRES ===
  createAccessoire(sequenceId: string, data: Omit<Accessoire, 'id' | 'createdAt'>): Accessoire | null {
    if (!this.getSequence(sequenceId)) return null

    const newAccessoire: Accessoire = {
      ...data,
      id: `accessoire-${Date.now()}`,
      createdAt: new Date()
    }

    if (!this.accessoires[sequenceId]) {
      this.accessoires[sequenceId] = []
    }
    
    this.accessoires[sequenceId].push(newAccessoire)
    this.save()
    return newAccessoire
  }

  getAccessoires(sequenceId: string): Accessoire[] {
    return this.accessoires[sequenceId] || []
  }

  updateAccessoire(sequenceId: string, accessoireId: string, updates: Partial<Omit<Accessoire, 'id' | 'createdAt'>>): Accessoire | null {
    const accessoires = this.accessoires[sequenceId]
    if (!accessoires) return null

    const accessoire = accessoires.find(a => a.id === accessoireId)
    if (!accessoire) return null

    Object.assign(accessoire, updates)
    this.save()
    return accessoire
  }

  deleteAccessoire(sequenceId: string, accessoireId: string): boolean {
    const accessoires = this.accessoires[sequenceId]
    if (!accessoires) return false

    const index = accessoires.findIndex(a => a.id === accessoireId)
    if (index === -1) return false

    accessoires.splice(index, 1)
    this.save()
    return true
  }

  // === UTILITAIRES ===
  getSequenceStats(sequenceId: string) {
    return {
      decorsCount: this.getDecors(sequenceId).length,
      scenesCount: this.getScenes(sequenceId).length,
      rolesCount: this.getRoles(sequenceId).length,
      costumesCount: this.getCostumes(sequenceId).length,
      accessoiresCount: this.getAccessoires(sequenceId).length
    }
  }

  getAllStats() {
    return {
      totalSequences: this.sequences.length,
      totalDecors: Object.values(this.decors).flat().length,
      totalScenes: Object.values(this.scenes).flat().length,
      totalRoles: Object.values(this.roles).flat().length,
      totalCostumes: Object.values(this.costumes).flat().length,
      totalAccessoires: Object.values(this.accessoires).flat().length
    }
  }

  // Debug helper
  debugLog() {
    console.log('=== SESSION DATA STORE DEBUG ===')
    console.log('Current Sequence ID:', this.currentSequenceId)
    console.log('Sequences:', this.sequences)
    console.log('Decors by sequence:', this.decors)
    console.log('Scenes by sequence:', this.scenes)
    console.log('Roles by sequence:', this.roles)
    console.log('Costumes by sequence:', this.costumes)
    console.log('Accessoires by sequence:', this.accessoires)
    console.log('Stats:', this.getAllStats())
  }

  // Subscribe to changes (returns unsubscribe)
  // CRUD methods for EffetsSpeciaux
  createEffetSpecial(sequenceId: string, effeDataWithoutId: Omit<EffetSpecial, 'id' | 'createdAt'>): EffetSpecial {
    const effet: EffetSpecial = {
      id: `effet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...effeDataWithoutId,
      createdAt: new Date()
    }
    
    if (!this.effetsSpeciaux[sequenceId]) {
      this.effetsSpeciaux[sequenceId] = []
    }
    this.effetsSpeciaux[sequenceId].push(effet)
    this.save()
    return effet
  }

  getEffetsSpeciaux(sequenceId: string): EffetSpecial[] {
    return this.effetsSpeciaux[sequenceId] || []
  }

  updateEffetSpecial(sequenceId: string, effeId: string, updates: Partial<Omit<EffetSpecial, 'id' | 'createdAt'>>): EffetSpecial | null {
    const effets = this.effetsSpeciaux[sequenceId] || []
    const index = effets.findIndex(e => e.id === effeId)
    if (index === -1) return null
    
    const updated = { ...effets[index], ...updates }
    this.effetsSpeciaux[sequenceId][index] = updated
    this.save()
    return updated
  }

  deleteEffetSpecial(sequenceId: string, effeId: string): boolean {
    const effets = this.effetsSpeciaux[sequenceId] || []
    const index = effets.findIndex(e => e.id === effeId)
    if (index === -1) return false
    
    this.effetsSpeciaux[sequenceId].splice(index, 1)
    this.save()
    return true
  }

  // CRUD methods for EquipesTechniques (global, not per sequence)
  createEquipeTechnique(equipeDataWithoutId: Omit<EquipeTechnique, 'id' | 'createdAt'>): EquipeTechnique {
    const equipe: EquipeTechnique = {
      id: `equipe-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...equipeDataWithoutId,
      createdAt: new Date()
    }
    
    this.equipesTechniques.push(equipe)
    this.save()
    return equipe
  }

  getEquipesTechniques(): EquipeTechnique[] {
    return this.equipesTechniques
  }

  getEquipeTechnique(equipeId: string): EquipeTechnique | null {
    return this.equipesTechniques.find(e => e.id === equipeId) || null
  }

  updateEquipeTechnique(equipeId: string, updates: Partial<Omit<EquipeTechnique, 'id' | 'createdAt'>>): EquipeTechnique | null {
    const index = this.equipesTechniques.findIndex(e => e.id === equipeId)
    if (index === -1) return null
    
    const updated = { ...this.equipesTechniques[index], ...updates }
    this.equipesTechniques[index] = updated
    this.save()
    return updated
  }

  deleteEquipeTechnique(equipeId: string): boolean {
    const index = this.equipesTechniques.findIndex(e => e.id === equipeId)
    if (index === -1) return false
    
    this.equipesTechniques.splice(index, 1)
    this.save()
    return true
  }

  // CRUD methods for MaterielSon (per sequence)
  createMaterielSon(sequenceId: string, materielDataWithoutId: Omit<MaterielSon, 'id' | 'createdAt'>): MaterielSon {
    const materiel: MaterielSon = {
      id: `materiel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...materielDataWithoutId,
      createdAt: new Date()
    }
    
    if (!this.materielSon[sequenceId]) {
      this.materielSon[sequenceId] = []
    }
    this.materielSon[sequenceId].push(materiel)
    this.save()
    return materiel
  }

  getMaterielSon(sequenceId: string): MaterielSon[] {
    return this.materielSon[sequenceId] || []
  }

  updateMaterielSon(sequenceId: string, materielId: string, updates: Partial<Omit<MaterielSon, 'id' | 'createdAt'>>): MaterielSon | null {
    const materiels = this.materielSon[sequenceId] || []
    const index = materiels.findIndex(m => m.id === materielId)
    if (index === -1) return null
    
    const updated = { ...materiels[index], ...updates }
    this.materielSon[sequenceId][index] = updated
    this.save()
    return updated
  }

  deleteMaterielSon(sequenceId: string, materielId: string): boolean {
    const materiels = this.materielSon[sequenceId] || []
    const index = materiels.findIndex(m => m.id === materielId)
    if (index === -1) return false
    
    this.materielSon[sequenceId].splice(index, 1)
    this.save()
    return true
  }

  // CRUD methods for Machineries (per sequence)
  createMachinerie(sequenceId: string, machinerieDataWithoutId: Omit<Machinerie, 'id' | 'createdAt'>): Machinerie {
    const machinerie: Machinerie = {
      id: `machinerie-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...machinerieDataWithoutId,
      createdAt: new Date()
    }
    
    if (!this.machineries[sequenceId]) {
      this.machineries[sequenceId] = []
    }
    this.machineries[sequenceId].push(machinerie)
    this.save()
    return machinerie
  }

  getMachineries(sequenceId: string): Machinerie[] {
    return this.machineries[sequenceId] || []
  }

  updateMachinerie(sequenceId: string, machinerieId: string, updates: Partial<Omit<Machinerie, 'id' | 'createdAt'>>): Machinerie | null {
    const machineries = this.machineries[sequenceId] || []
    const index = machineries.findIndex(m => m.id === machinerieId)
    if (index === -1) return null
    
    const updated = { ...machineries[index], ...updates }
    this.machineries[sequenceId][index] = updated
    this.save()
    return updated
  }

  deleteMachinerie(sequenceId: string, machinerieId: string): boolean {
    const machineries = this.machineries[sequenceId] || []
    const index = machineries.findIndex(m => m.id === machinerieId)
    if (index === -1) return false
    
    this.machineries[sequenceId].splice(index, 1)
    this.save()
    return true
  }

  subscribe(fn: () => void) {
    this.listeners.add(fn)
    return () => {
      this.listeners.delete(fn)
    }
  }
}

// Instance globale
export const sessionStore = new SessionDataStore()