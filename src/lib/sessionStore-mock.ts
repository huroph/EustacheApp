// Mock temporaire pour sessionStore pendant la transition vers Supabase
// Ce fichier sera supprimé une fois Supabase intégré

import { 
  Decor, 
  Scene, 
  Role, 
  Costume, 
  Accessoire, 
  EffetSpecial, 
  EquipeTechnique, 
  MaterielSon, 
  Machinerie, 
  SequenceFormData 
} from './types-clean'

// Interface temporaire pour maintenir la compatibilité
interface MockSequence {
  id: string
  code: string
  title: string
  status: string
  colorId: string
  location: string
  summary: string
  duration: string
  notes: string
  decors: Decor[]
  scenes: Scene[]
  roles: Role[]
  costumes: Costume[]
  accessoires: Accessoire[]
  effetsSpeciaux: EffetSpecial[]
  equipeTechnique: EquipeTechnique[]
  materielSon: MaterielSon[]
  machinerie: Machinerie[]
}

// Mock temporaire - toutes les méthodes retournent des valeurs par défaut
export const sessionStore = {
  // Gestion des séquences
  getCurrentSequence: (): MockSequence => ({
    id: 'temp-sequence',
    code: 'TEMP',
    title: 'Séquence temporaire',
    status: 'draft',
    colorId: '#blue',
    location: '',
    summary: '',
    duration: '',
    notes: '',
    decors: [],
    scenes: [],
    roles: [],
    costumes: [],
    accessoires: [],
    effetsSpeciaux: [],
    equipeTechnique: [],
    materielSon: [],
    machinerie: []
  }),

  // Getters
  getDecors: (sequenceId: string): Decor[] => [],
  getScenes: (sequenceId: string): Scene[] => [],
  getRoles: (sequenceId: string): Role[] => [],
  getCostumes: (sequenceId: string): Costume[] => [],
  getAccessoires: (sequenceId: string): Accessoire[] => [],
  getEffetsSpeciaux: (sequenceId: string): EffetSpecial[] => [],
  getEquipesTechniques: (): EquipeTechnique[] => [],
  getMaterielSon: (sequenceId: string): MaterielSon[] => [],
  getMachineries: (sequenceId: string): Machinerie[] => [],

  // CRUD Décors
  createDecor: (sequenceId: string, decor: Omit<Decor, 'id' | 'createdAt'>): void => {
    console.warn('Mock sessionStore: createDecor appelé - sera remplacé par Supabase')
  },
  updateDecor: (sequenceId: string, decorId: string, decor: Omit<Decor, 'id' | 'createdAt'>): void => {
    console.warn('Mock sessionStore: updateDecor appelé - sera remplacé par Supabase')
  },
  deleteDecor: (sequenceId: string, decorId: string): void => {
    console.warn('Mock sessionStore: deleteDecor appelé - sera remplacé par Supabase')
  },

  // CRUD Scènes
  createScene: (sequenceId: string, scene: Omit<Scene, 'id' | 'createdAt'>): void => {
    console.warn('Mock sessionStore: createScene appelé - sera remplacé par Supabase')
  },
  updateScene: (sequenceId: string, sceneId: string, scene: Omit<Scene, 'id' | 'createdAt'>): void => {
    console.warn('Mock sessionStore: updateScene appelé - sera remplacé par Supabase')
  },
  deleteScene: (sequenceId: string, sceneId: string): void => {
    console.warn('Mock sessionStore: deleteScene appelé - sera remplacé par Supabase')
  },

  // CRUD Rôles
  createRole: (sequenceId: string, role: Omit<Role, 'id' | 'createdAt'>): void => {
    console.warn('Mock sessionStore: createRole appelé - sera remplacé par Supabase')
  },
  updateRole: (sequenceId: string, roleId: string, role: Omit<Role, 'id' | 'createdAt'>): void => {
    console.warn('Mock sessionStore: updateRole appelé - sera remplacé par Supabase')
  },
  deleteRole: (sequenceId: string, roleId: string): void => {
    console.warn('Mock sessionStore: deleteRole appelé - sera remplacé par Supabase')
  },

  // CRUD Costumes
  createCostume: (sequenceId: string, costume: Omit<Costume, 'id' | 'createdAt'>): void => {
    console.warn('Mock sessionStore: createCostume appelé - sera remplacé par Supabase')
  },
  updateCostume: (sequenceId: string, costumeId: string, costume: Omit<Costume, 'id' | 'createdAt'>): void => {
    console.warn('Mock sessionStore: updateCostume appelé - sera remplacé par Supabase')
  },
  deleteCostume: (sequenceId: string, costumeId: string): void => {
    console.warn('Mock sessionStore: deleteCostume appelé - sera remplacé par Supabase')
  },

  // CRUD Accessoires
  createAccessoire: (sequenceId: string, accessoire: Omit<Accessoire, 'id' | 'createdAt'>): void => {
    console.warn('Mock sessionStore: createAccessoire appelé - sera remplacé par Supabase')
  },
  updateAccessoire: (sequenceId: string, accessoireId: string, accessoire: Omit<Accessoire, 'id' | 'createdAt'>): void => {
    console.warn('Mock sessionStore: updateAccessoire appelé - sera remplacé par Supabase')
  },
  deleteAccessoire: (sequenceId: string, accessoireId: string): void => {
    console.warn('Mock sessionStore: deleteAccessoire appelé - sera remplacé par Supabase')
  },

  // CRUD Effets Spéciaux
  createEffetSpecial: (sequenceId: string, effet: Omit<EffetSpecial, 'id' | 'createdAt'>): void => {
    console.warn('Mock sessionStore: createEffetSpecial appelé - sera remplacé par Supabase')
  },
  updateEffetSpecial: (sequenceId: string, effetId: string, effet: Omit<EffetSpecial, 'id' | 'createdAt'>): void => {
    console.warn('Mock sessionStore: updateEffetSpecial appelé - sera remplacé par Supabase')
  },
  deleteEffetSpecial: (sequenceId: string, effetId: string): void => {
    console.warn('Mock sessionStore: deleteEffetSpecial appelé - sera remplacé par Supabase')
  },

  // CRUD Équipe Technique
  createEquipeTechnique: (equipe: Omit<EquipeTechnique, 'id' | 'createdAt'>): void => {
    console.warn('Mock sessionStore: createEquipeTechnique appelé - sera remplacé par Supabase')
  },
  updateEquipeTechnique: (equipeId: string, equipe: Omit<EquipeTechnique, 'id' | 'createdAt'>): void => {
    console.warn('Mock sessionStore: updateEquipeTechnique appelé - sera remplacé par Supabase')
  },
  deleteEquipeTechnique: (equipeId: string): void => {
    console.warn('Mock sessionStore: deleteEquipeTechnique appelé - sera remplacé par Supabase')
  },

  // CRUD Matériel Son
  createMaterielSon: (sequenceId: string, materiel: Omit<MaterielSon, 'id' | 'createdAt'>): void => {
    console.warn('Mock sessionStore: createMaterielSon appelé - sera remplacé par Supabase')
  },
  updateMaterielSon: (sequenceId: string, materielId: string, materiel: Omit<MaterielSon, 'id' | 'createdAt'>): void => {
    console.warn('Mock sessionStore: updateMaterielSon appelé - sera remplacé par Supabase')
  },
  deleteMaterielSon: (sequenceId: string, materielId: string): void => {
    console.warn('Mock sessionStore: deleteMaterielSon appelé - sera remplacé par Supabase')
  },

  // CRUD Machinerie
  createMachinerie: (sequenceId: string, machinerie: Omit<Machinerie, 'id' | 'createdAt'>): void => {
    console.warn('Mock sessionStore: createMachinerie appelé - sera remplacé par Supabase')
  },
  updateMachinerie: (sequenceId: string, machinerieId: string, machinerie: Omit<Machinerie, 'id' | 'createdAt'>): void => {
    console.warn('Mock sessionStore: updateMachinerie appelé - sera remplacé par Supabase')
  },
  deleteMachinerie: (sequenceId: string, machinerieId: string): void => {
    console.warn('Mock sessionStore: deleteMachinerie appelé - sera remplacé par Supabase')
  },

  // Méthodes diverses
  getSequence: (sequenceId: string): MockSequence | null => {
    console.warn('Mock sessionStore: getSequence appelé - sera remplacé par Supabase')
    return null
  },
  getSequences: (): MockSequence[] => {
    // Note: Method migrated to Supabase - returns empty array
    return []
  },
  setCurrentSequence: (sequenceId: string): void => {
    console.warn('Mock sessionStore: setCurrentSequence appelé - sera remplacé par Supabase')
  },
  getSequenceStats: (sequenceId: string): any => {
    console.warn('Mock sessionStore: getSequenceStats appelé - sera remplacé par Supabase')
    return {}
  },
  createSequence: (data: SequenceFormData): MockSequence | null => {
    console.warn('Mock sessionStore: createSequence appelé - sera remplacé par Supabase')
    return null
  },
  updateSequence: (sequenceId: string, data: Partial<SequenceFormData>): MockSequence | null => {
    console.warn('Mock sessionStore: updateSequence appelé - sera remplacé par Supabase')
    return null
  },
  deleteSequence: (sequenceId: string): void => {
    console.warn('Mock sessionStore: deleteSequence appelé - sera remplacé par Supabase')
  },
  subscribe: (callback: () => void): (() => void) => {
    console.warn('Mock sessionStore: subscribe appelé - sera remplacé par Supabase')
    return () => {}
  },
  debugLog: (): void => {
    console.warn('Mock sessionStore: debugLog appelé - sera remplacé par Supabase')
  }
}