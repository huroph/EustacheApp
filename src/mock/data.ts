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
};

export const projects: Project[] = [
  {
    id: "prj_aurora2026",
    title: "Opération Aurora",
    scriptFile: "Aurora_Script.pdf",
    startDate: "2026-03-10",
    endDate: "2026-05-15",
    year: 2026,
    sequencesCount: 3,
    coverUrl: undefined
  },
  {
    id: "prj_sables2025",
    title: "Les Sables du Temps",
    scriptFile: "Sables_Script.pdf",
    startDate: "2025-09-05",
    endDate: "2025-10-12",
    year: 2025,
    sequencesCount: 3,
    coverUrl: undefined
  },
  {
    id: "prj_envol2025",
    title: "L'Envol du Phénix",
    scriptFile: "Phoenix_Script.pdf",
    startDate: "2025-02-15",
    endDate: "2025-04-01",
    year: 2025,
    sequencesCount: 3,
    coverUrl: undefined
  }
];

// --- BREAKDOWN MOCK (générique pour test UI) ---

export const breakdown = {
  projectTitle: "Projet sélectionné",
  pages: "1 / 8",
  sequencesCountText: "3 séquences créées — voir la liste"
};

// --- SEQUENCES PAR PROJET ---

export const sequences = {
  prj_aurora2026: [
    {
      id: "seq-a1",
      code: "SEQ-A1",
      tags: ["EXT", "NUIT"],
      title: "Arrivée au camp secret",
      time: "2h10",
      summary:
        "Une base militaire isolée dans la montagne. Hélicoptère en approche, soldats postés, tension palpable.",
      roles: ["Acteurs", "Equipe", "Silhouette"]
    },
    {
      id: "seq-a2",
      code: "SEQ-A2",
      tags: ["INT", "JOUR"],
      title: "Briefing stratégique",
      time: "1h20",
      summary:
        "Salle de commandement. Table holographique, explication du plan d’infiltration, tension entre les officiers.",
      roles: ["Acteurs", "Equipe", "Silhouette"]
    },
    {
      id: "seq-a3",
      code: "SEQ-A3",
      tags: ["EXT", "JOUR"],
      title: "Test du dispositif Aurora",
      time: "3h00",
      summary:
        "Zone d’essai isolée, dispositif activé, explosion lumineuse, réaction du personnel scientifique.",
      roles: ["Acteurs", "Equipe", "Silhouette"]
    },{
      id: "seq-a4",
      code: "SEQ-A4",
      tags: ["EXT", "JOUR"],
      title: "Test du dispositif Aurora",
      time: "3h00",
      summary:
        "Zone d’essai isolée, dispositif activé, explosion lumineuse, réaction du personnel scientifique.",
      roles: ["Acteurs", "Equipe", "Silhouette"]
    },
    {
      id: "seq-a5",
      code: "SEQ-A5",
      tags: ["EXT", "JOUR"],
      title: "Test du dispositif Aurora",
      time: "3h00",
      summary:
        "Zone d’essai isolée, dispositif activé, explosion lumineuse, réaction du personnel scientifique.",
      roles: ["Acteurs", "Equipe", "Silhouette"]
    },
    {
      id: "seq-a6",
      code: "SEQ-A6",
      tags: ["EXT", "JOUR"],
      title: "Test du dispositif Aurora",
      time: "3h00",
      summary:
        "Zone d’essai isolée, dispositif activé, explosion lumineuse, réaction du personnel scientifique.",
      roles: ["Acteurs", "Equipe", "Silhouette"]
    }
  ],

  prj_sables2025: [
    {
      id: "seq-s1",
      code: "SEQ-S1",
      tags: ["EXT", "JOUR"],
      title: "Désert sacré",
      time: "1h45",
      summary:
        "Étendue désertique, caravane en marche, découverte d’une empreinte gigantesque ensevelie.",
      roles: ["Acteurs", "Equipe", "Silhouette"]
    },
    {
      id: "seq-s2",
      code: "SEQ-S2",
      tags: ["INT", "NUIT"],
      title: "Temple enfoui",
      time: "2h00",
      summary:
        "Salle obscure, torches, inscriptions anciennes révélant une prophétie oubliée.",
      roles: ["Acteurs", "Equipe", "Silhouette"]
    },
    {
      id: "seq-s3",
      code: "SEQ-S3",
      tags: ["EXT", "JOUR"],
      title: "Tempête de sable",
      time: "1h15",
      summary:
        "Vent violent, équipe dispersée, course vers un abri de fortune.",
      roles: ["Acteurs", "Equipe", "Silhouette"]
    }
  ],

  prj_envol2025: [
    {
      id: "seq-e1",
      code: "SEQ-E1",
      tags: ["INT", "JOUR"],
      title: "Laboratoire secret",
      time: "1h30",
      summary:
        "Expérience scientifique, flammes bleutées, l’oiseau mécanique s’active.",
      roles: ["Acteurs", "Equipe", "Silhouette"]
    },
    {
      id: "seq-e2",
      code: "SEQ-E2",
      tags: ["EXT", "JOUR"],
      title: "Premier envol",
      time: "2h00",
      summary:
        "Falaises ensoleillées, prototype prend son envol, émerveillement collectif.",
      roles: ["Acteurs", "Equipe", "Silhouette"]
    },
    {
      id: "seq-e3",
      code: "SEQ-E3",
      tags: ["INT", "NUIT"],
      title: "Révélations",
      time: "1h10",
      summary:
        "Réunion secrète, trahison révélée, destruction imminente du prototype.",
      roles: ["Acteurs", "Equipe", "Silhouette"]
    }
  ]
};

export default { projects, breakdown, sequences };
