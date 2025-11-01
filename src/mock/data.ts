// src/mock/data.ts
export const projects = [
  {
    id: 'p-2026-1',
    year: 2026,
    title: 'Le gang des amazone',
    pdf: 'Scenrario.pdf',
    dates: '15 oct. 2025 → 15 oct. 2025',
    badge: 'Propriétaire',
    imageAlt: 'Le gang des amazone',
  },
  {
    id: 'p-2026-2',
    year: 2026,
    title: 'Le gang des amazone',
    pdf: 'Scenrario.pdf',
    dates: '15 oct. 2025 → 15 oct. 2025',
    badge: 'Propriétaire',
    imageAlt: 'Le gang des amazone',
  },
  {
    id: 'p-2025-1',
    year: 2025,
    title: 'Le gang des amazone',
    pdf: 'Scenrario.pdf',
    dates: '15 oct. 2025 → 15 oct. 2025',
    badge: 'Propriétaire',
    imageAlt: 'Le gang des amazone',
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
