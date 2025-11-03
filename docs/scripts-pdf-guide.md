# Gestion des scripts PDF - Guide complet

## Vue d'ensemble

Ce système permet aux utilisateurs d'uploader des scripts PDF lors de la création/modification de projets et de les visualiser dynamiquement dans la page de dépouillement.

## Architecture

### 1. **Stockage (Supabase Storage)**
- **Bucket** : `scripts` (public)
- **Structure** : `{user_id}/{project_id}-script.pdf`
- **Exemple** : `alice-123/proj-456-script.pdf`

### 2. **Base de données**
- **Champ** : `projects.script_file` stocke l'URL complète du fichier
- **Exemple** : `https://your-project.supabase.co/storage/v1/object/public/scripts/alice-123/proj-456-script.pdf`

### 3. **Services**
- **StorageService** : gestion upload/suppression des PDF
- **ProjectsService** : inchangé, stocke juste l'URL

## Configuration requise

### 1. Créer le bucket et les politiques
Exécuter le script SQL `docs/create_storage_bucket.sql` dans Supabase :

```sql
-- Créer le bucket public
INSERT INTO storage.buckets (id, name, public) VALUES ('scripts', 'scripts', true);

-- Politiques d'accès (voir le fichier complet)
```

### 2. Variables d'environnement
Les variables Supabase existantes suffisent :
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Utilisation

### 1. **Création de projet**
```typescript
// Dans ProjectForm.tsx
const handleSubmit = async (formData) => {
  // Si un fichier PDF est sélectionné, l'uploader
  if (scriptFile) {
    const scriptUrl = await StorageService.uploadScriptPDF(scriptFile, projectId)
    formData.script_file = scriptUrl
  }
  // Sauvegarder le projet avec l'URL
}
```

### 2. **Visualisation du script**
```typescript
// Dans breakdown/page.tsx
<ScriptViewer 
  scriptUrl={project.script_file}
  projectTitle={project.title}
  mode="creation" // ou "edition"
/>
```

## Composants créés/modifiés

### 1. **StorageService** (`src/lib/services/storage.ts`)
- `uploadScriptPDF(file, projectId)` : upload vers Supabase Storage
- `deleteScriptPDF(scriptUrl)` : suppression du fichier
- `validatePDFFile(file)` : validation (type PDF, taille < 10MB)

### 2. **ScriptViewer** (`src/components/breakdown/ScriptViewer.tsx`)
- Affichage dynamique du PDF via iframe
- Gestion du cas "pas de script"
- Modes création/édition/normal

### 3. **ProjectForm** (modifié)
- Champ file input pour PDF
- Validation et preview du fichier
- Upload automatique lors de la soumission

### 4. **Page breakdown** (modifiée)
- Utilise ScriptViewer au lieu du PDF statique
- Affichage conditionnel selon le projet

## Sécurité

### 1. **Politiques Storage**
- **Lecture** : tous les utilisateurs connectés
- **Écriture** : propriétaire du dossier seulement
- **Structure** : `{user_id}/` empêche l'accès croisé

### 2. **Validation côté client**
- Type MIME : `application/pdf`
- Taille max : 10MB
- Extension : `.pdf`

## Flux utilisateur

1. **Création projet** :
   - Remplir le formulaire
   - Sélectionner un fichier PDF
   - Cliquer "Créer" → upload automatique

2. **Dépouillement** :
   - Aller sur la page breakdown
   - Cliquer "Créer une séquence"
   - → Le script PDF s'affiche à gauche

3. **Pas de script** :
   - Message informatif avec icône
   - Invitation à ajouter un script

## Limitations et améliorations futures

### Limitations actuelles
- Taille max : 10MB
- Format : PDF uniquement
- Pas de prévisualisation avant upload

### Améliorations possibles
- Compression automatique des PDF
- Support d'autres formats (Word, etc.)
- Annotations sur le PDF
- Synchronisation lecture avec timeline

## Dépannage

### Erreur "Bucket n'existe pas"
→ Exécuter le script `create_storage_bucket.sql`

### Erreur "Accès refusé"
→ Vérifier les politiques RLS du bucket

### PDF ne s'affiche pas
→ Vérifier que l'URL est accessible publiquement

### Upload échoue
→ Vérifier la taille (<10MB) et le format (PDF)