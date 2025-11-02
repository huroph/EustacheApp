-- Création de la table costumes
-- Cette table stocke les informations des costumes d'une séquence

CREATE TABLE IF NOT EXISTS public.costumes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sequence_id UUID NOT NULL REFERENCES public.sequences(id) ON DELETE CASCADE,
    
    -- Informations du costume
    nom_costume VARCHAR(255) NOT NULL,
    role_id UUID REFERENCES public.roles(id) ON DELETE SET NULL,
    statut VARCHAR(20) NOT NULL CHECK (statut IN ('A validé', 'En attente', 'Validé', 'Reporté')),
    notes_costume TEXT,
    
    -- Métadonnées
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_costumes_sequence_id ON public.costumes(sequence_id);
CREATE INDEX IF NOT EXISTS idx_costumes_role_id ON public.costumes(role_id);
CREATE INDEX IF NOT EXISTS idx_costumes_statut ON public.costumes(statut);
CREATE INDEX IF NOT EXISTS idx_costumes_nom ON public.costumes(nom_costume);

-- Trigger pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_costumes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_costumes_updated_at
    BEFORE UPDATE ON public.costumes
    FOR EACH ROW
    EXECUTE FUNCTION update_costumes_updated_at();

-- RLS (Row Level Security) pour sécuriser l'accès
ALTER TABLE public.costumes ENABLE ROW LEVEL SECURITY;

-- Politique RLS temporaire : accès public (à modifier quand l'authentification sera implémentée)
CREATE POLICY "Public access" ON public.costumes FOR ALL USING (true);

-- Commentaires pour la documentation
COMMENT ON TABLE public.costumes IS 'Table des costumes pour chaque séquence';
COMMENT ON COLUMN public.costumes.sequence_id IS 'Référence vers la séquence';
COMMENT ON COLUMN public.costumes.nom_costume IS 'Nom du costume';
COMMENT ON COLUMN public.costumes.role_id IS 'Référence optionnelle vers le rôle associé';
COMMENT ON COLUMN public.costumes.statut IS 'Statut du costume : A validé, En attente, Validé, Reporté';
COMMENT ON COLUMN public.costumes.notes_costume IS 'Notes et détails sur le costume';