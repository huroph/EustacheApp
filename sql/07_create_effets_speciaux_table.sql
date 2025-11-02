-- Création de la table effets_speciaux
CREATE TABLE IF NOT EXISTS effets_speciaux (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sequence_id UUID NOT NULL REFERENCES sequences(id) ON DELETE CASCADE,
    nom VARCHAR(255) NOT NULL,
    statut VARCHAR(50) NOT NULL CHECK (statut IN ('En attente', 'A validé', 'Validé', 'Reporté')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_effets_speciaux_sequence_id ON effets_speciaux(sequence_id);
CREATE INDEX IF NOT EXISTS idx_effets_speciaux_statut ON effets_speciaux(statut);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_effets_speciaux_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER effets_speciaux_updated_at
    BEFORE UPDATE ON effets_speciaux
    FOR EACH ROW
    EXECUTE FUNCTION update_effets_speciaux_updated_at();

-- RLS (Row Level Security)
ALTER TABLE effets_speciaux ENABLE ROW LEVEL SECURITY;

-- Politique RLS : les utilisateurs ne peuvent voir que leurs propres effets spéciaux
CREATE POLICY "Les utilisateurs peuvent voir leurs effets spéciaux" ON effets_speciaux
    FOR SELECT USING (
        sequence_id IN (
            SELECT s.id FROM sequences s 
            WHERE s.project_id IN (
                SELECT p.id FROM projects p WHERE p.user_id = auth.uid()
            )
        )
    );

-- Politique RLS : les utilisateurs peuvent insérer des effets spéciaux dans leurs séquences
CREATE POLICY "Les utilisateurs peuvent créer des effets spéciaux" ON effets_speciaux
    FOR INSERT WITH CHECK (
        sequence_id IN (
            SELECT s.id FROM sequences s 
            WHERE s.project_id IN (
                SELECT p.id FROM projects p WHERE p.user_id = auth.uid()
            )
        )
    );

-- Politique RLS : les utilisateurs peuvent modifier leurs effets spéciaux
CREATE POLICY "Les utilisateurs peuvent modifier leurs effets spéciaux" ON effets_speciaux
    FOR UPDATE USING (
        sequence_id IN (
            SELECT s.id FROM sequences s 
            WHERE s.project_id IN (
                SELECT p.id FROM projects p WHERE p.user_id = auth.uid()
            )
        )
    );

-- Politique RLS : les utilisateurs peuvent supprimer leurs effets spéciaux
CREATE POLICY "Les utilisateurs peuvent supprimer leurs effets spéciaux" ON effets_speciaux
    FOR DELETE USING (
        sequence_id IN (
            SELECT s.id FROM sequences s 
            WHERE s.project_id IN (
                SELECT p.id FROM projects p WHERE p.user_id = auth.uid()
            )
        )
    );