-- Création de la table materiel_son
CREATE TABLE IF NOT EXISTS materiel_son (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sequence_id UUID NOT NULL REFERENCES sequences(id) ON DELETE CASCADE,
    nom VARCHAR(255) NOT NULL,
    statut VARCHAR(50) NOT NULL CHECK (statut IN ('A validé', 'En attente', 'Validé', 'Reporté')),
    referent_id UUID REFERENCES equipes_techniques(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_materiel_son_sequence_id ON materiel_son(sequence_id);
CREATE INDEX IF NOT EXISTS idx_materiel_son_statut ON materiel_son(statut);
CREATE INDEX IF NOT EXISTS idx_materiel_son_referent_id ON materiel_son(referent_id);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_materiel_son_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER materiel_son_updated_at
    BEFORE UPDATE ON materiel_son
    FOR EACH ROW
    EXECUTE FUNCTION update_materiel_son_updated_at();