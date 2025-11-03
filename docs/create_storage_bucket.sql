-- Script pour créer le bucket de stockage des scripts
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Créer le bucket 'scripts' pour stocker les fichiers PDF
INSERT INTO storage.buckets (id, name, public) VALUES ('scripts', 'scripts', true);

-- 2. Créer les politiques d'accès pour le bucket scripts
-- Politique pour permettre aux utilisateurs de voir tous les scripts (lecture)
CREATE POLICY "Users can view all scripts" ON storage.objects 
FOR SELECT USING (bucket_id = 'scripts');

-- Politique pour permettre aux utilisateurs d'uploader des scripts pour leurs projets
CREATE POLICY "Users can upload scripts for their projects" ON storage.objects 
FOR INSERT WITH CHECK (
  bucket_id = 'scripts' 
  AND auth.uid()::text = split_part(name, '/', 1)
);

-- Politique pour permettre aux propriétaires de projet de mettre à jour/supprimer leurs scripts
CREATE POLICY "Users can update their project scripts" ON storage.objects 
FOR UPDATE USING (
  bucket_id = 'scripts' 
  AND auth.uid()::text = split_part(name, '/', 1)
);

CREATE POLICY "Users can delete their project scripts" ON storage.objects 
FOR DELETE USING (
  bucket_id = 'scripts' 
  AND auth.uid()::text = split_part(name, '/', 1)
);

-- Note: Les fichiers seront organisés comme suit :
-- scripts/{project_id}/script.pdf