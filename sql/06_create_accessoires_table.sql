-- Création de la table accessoires
-- Cette table stocke les informations des accessoires d'une séquence

CREATE TABLE IF NOT EXISTS public.accessoires (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sequence_id UUID NOT NULL REFERENCES public.sequences(id) ON DELETE CASCADE,
    
    -- Informations de l'accessoire
    nom_accessoire VARCHAR(255) NOT NULL,
    role_id UUID REFERENCES public.roles(id) ON DELETE SET NULL,
    statut VARCHAR(20) NOT NULL CHECK (statut IN ('A validé', 'En attente', 'Validé', 'Reporté')),
    notes_accessoire TEXT,
    
    -- Métadonnées
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_accessoires_sequence_id ON public.accessoires(sequence_id);
CREATE INDEX IF NOT EXISTS idx_accessoires_role_id ON public.accessoires(role_id);
CREATE INDEX IF NOT EXISTS idx_accessoires_statut ON public.accessoires(statut);
CREATE INDEX IF NOT EXISTS idx_accessoires_nom ON public.accessoires(nom_accessoire);

-- Trigger pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_accessoires_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_accessoires_updated_at
    BEFORE UPDATE ON public.accessoires
    FOR EACH ROW
    EXECUTE FUNCTION update_accessoires_updated_at();

-- RLS (Row Level Security) pour sécuriser l'accès
ALTER TABLE public.accessoires ENABLE ROW LEVEL SECURITY;

-- Politique RLS temporaire : accès public (à modifier quand l'authentification sera implémentée)
CREATE POLICY "Public access" ON public.accessoires FOR ALL USING (true);

-- Commentaires pour la documentation
COMMENT ON TABLE public.accessoires IS 'Table des accessoires pour chaque séquence';
COMMENT ON COLUMN public.accessoires.sequence_id IS 'Référence vers la séquence';
COMMENT ON COLUMN public.accessoires.nom_accessoire IS 'Nom de l\'accessoire';
COMMENT ON COLUMN public.accessoires.role_id IS 'Référence optionnelle vers le rôle associé';
COMMENT ON COLUMN public.accessoires.statut IS 'Statut de l\'accessoire : A validé, En attente, Validé, Reporté';
COMMENT ON COLUMN public.accessoires.notes_accessoire IS 'Notes et détails sur l\'accessoire';