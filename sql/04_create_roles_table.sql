-- Création de la table roles
-- Cette table stocke les informations des rôles (personnages) d'une séquence

CREATE TABLE IF NOT EXISTS public.roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sequence_id UUID NOT NULL REFERENCES public.sequences(id) ON DELETE CASCADE,
    
    -- Informations du rôle
    type VARCHAR(20) NOT NULL CHECK (type IN ('Principale', 'Secondaire', 'Figurant', 'Voix Off')),
    nom_role VARCHAR(255) NOT NULL,
    
    -- Informations de l'interprète
    interprete_nom VARCHAR(255) NOT NULL,
    interprete_prenom VARCHAR(255) NOT NULL,
    genre VARCHAR(20) NOT NULL CHECK (genre IN ('Masculin', 'Féminin', 'Autre')),
    age_personnage VARCHAR(50),
    
    -- Description du personnage
    apparence TEXT,
    description TEXT,
    notes_sequence TEXT,
    
    -- Contact de l'interprète
    adresse TEXT,
    email VARCHAR(255),
    telephone VARCHAR(50),
    
    -- Informations doublure (optionnelles)
    doublure_nom VARCHAR(255),
    doublure_prenom VARCHAR(255),
    doublure_type VARCHAR(20) CHECK (doublure_type IN ('Image', 'Voix', 'Cascades')),
    doublure_adresse TEXT,
    doublure_email VARCHAR(255),
    doublure_telephone VARCHAR(50),
    doublure_notes TEXT,
    
    -- Métadonnées
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_roles_sequence_id ON public.roles(sequence_id);
CREATE INDEX IF NOT EXISTS idx_roles_type ON public.roles(type);
CREATE INDEX IF NOT EXISTS idx_roles_nom_role ON public.roles(nom_role);

-- Trigger pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_roles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_roles_updated_at
    BEFORE UPDATE ON public.roles
    FOR EACH ROW
    EXECUTE FUNCTION update_roles_updated_at();

-- RLS (Row Level Security) pour sécuriser l'accès
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

-- Politique RLS temporaire : accès public (à modifier quand l'authentification sera implémentée)
CREATE POLICY "Public access" ON public.roles FOR ALL USING (true);

-- Commentaires pour la documentation
COMMENT ON TABLE public.roles IS 'Table des rôles (personnages) pour chaque séquence';
COMMENT ON COLUMN public.roles.sequence_id IS 'Référence vers la séquence';
COMMENT ON COLUMN public.roles.type IS 'Type de rôle : Principale, Secondaire, Figurant, Voix Off';
COMMENT ON COLUMN public.roles.nom_role IS 'Nom du personnage/rôle';
COMMENT ON COLUMN public.roles.interprete_nom IS 'Nom de famille de l''interprète';
COMMENT ON COLUMN public.roles.interprete_prenom IS 'Prénom de l''interprète';
COMMENT ON COLUMN public.roles.genre IS 'Genre du personnage';
COMMENT ON COLUMN public.roles.age_personnage IS 'Âge du personnage (peut être une tranche)';
COMMENT ON COLUMN public.roles.apparence IS 'Description physique du personnage';
COMMENT ON COLUMN public.roles.description IS 'Description générale du personnage';
COMMENT ON COLUMN public.roles.notes_sequence IS 'Notes spécifiques pour cette séquence';
COMMENT ON COLUMN public.roles.doublure_type IS 'Type de doublure : Image, Voix, Cascades';