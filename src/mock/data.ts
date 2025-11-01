// src/mock/data.ts
export type Project = {
  id: string;
  title: string;
  scriptFile: string;
  startDate: string;
  endDate: string;
  year: number;
  sequencesCount?: number;
  coverUrl?: string;
}

export const projects: Project[] = [
  {
    id: 'prj_01',
    title: 'Le gang des amazones',
    scriptFile: 'Scenario.pdf',
    startDate: '2026-03-15',
    endDate: '2026-05-20',
    year: 2026,
    sequencesCount: 32,
    coverUrl: undefined,
  },
  {
    id: 'prj_02',
    title: 'Les mystères de la forêt',
    scriptFile: 'Scenario.pdf',
    startDate: '2026-01-10',
    endDate: '2026-02-28',
    year: 2026,
    sequencesCount: 28,
    coverUrl: undefined,
  },
  {
    id: 'prj_a1b2c3',
    title: 'Retour vers le futur moderne',
    scriptFile: 'Scenario.pdf',
    startDate: '2025-11-01',
    endDate: '2025-12-15',
    year: 2025,
    sequencesCount: 24,
    coverUrl: undefined,
  },
  {
    id: 'prj_xyz789',
    title: 'La dernière mission',
    scriptFile: 'Scenario.pdf',
    startDate: '2025-09-01',
    endDate: '2025-10-30',
    year: 2025,
    sequencesCount: 18,
    coverUrl: undefined,
  },
]

export const breakdown = {
  projectTitle: 'Le gang des amazone',
  pages: '1 / 8',
  sequencesCountText: '14 séquences créées — voir la liste',
}

export const sequences = [
  {
    id: 'seq-1',
    code: 'SEQ-1',
    tags: ['EXT', 'JOUR'],
    title: 'Confrontation dans le manoir',
    time: '1h30',
    summary:
      "Une rue commerçante. Passants, vélos, poussettes. Un MIMÉE (mime) statue vivante. Un CHIEN renifle une borne de parking. Des panneaux incompréhensibles...",
    roles: ['Acteurs', 'Equipe', 'Silhouette'],
  },
]

export default { projects, breakdown, sequences }
