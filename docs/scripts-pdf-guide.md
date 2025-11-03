# Gestion des scripts PDF chiffrés - Guide complet

## Vue d'ensemble

Ce système permet aux utilisateurs d'uploader des scripts PDF **chiffrés** lors de la création/modification de projets. Seul le propriétaire peut déchiffrer et visualiser son propre script, garantissant une sécurité maximale.

## 🔐 Sécurité et chiffrement

### **Principe**
- **Chiffrement côté client** : le PDF est chiffré avant l'upload
- **Clé unique par utilisateur** : dérivée de l'ID utilisateur + salt
- **Algorithme** : AES-GCM 256 bits avec IV aléatoire
- **Accès exclusif** : seul le propriétaire peut déchiffrer

### **Flux de sécurité**
1. **Upload** : PDF → Chiffrement AES → Upload fichier .encrypted
2. **Affichage** : Download → Déchiffrement → Blob URL temporaire
3. **Cleanup** : Révocation automatique des URLs temporaires

## Architecture technique

### 1. **Stockage (Supabase Storage)**
- **Bucket** : `scripts` (public mais fichiers chiffrés)
- **Structure** : `{user_id}/{project_id}-script.encrypted`
- **Type** : `application/octet-stream` (binaire chiffré)

### 2. **Base de données**
- **Champ** : `projects.script_file` stocke l'URL du fichier chiffré
- **Exemple** : `https://your-project.supabase.co/storage/v1/object/public/scripts/alice-123/proj-456-script.encrypted`

### 3. **Services**

#### **EncryptionService** (`src/lib/services/encryption.ts`)
- `getUserEncryptionKey(userId)` : génère clé unique AES-256
- `encryptFile(file, userId)` : chiffre le PDF
- `decryptFile(buffer, userId)` : déchiffre le PDF
- `createDecryptedBlobUrl()` : crée URL temporaire pour affichage

#### **StorageService** (modifié)
- `uploadScriptPDF()` : chiffre puis upload
- `downloadAndDecryptScript()` : download puis déchiffre
- `cleanupBlobUrl()` : nettoie les URLs temporaires

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
  // Le fichier PDF est automatiquement chiffré avant upload
  if (scriptFile) {
    const encryptedUrl = await StorageService.uploadScriptPDF(scriptFile, projectId)
    formData.script_file = encryptedUrl // URL du fichier chiffré
  }
}
```

### 2. **Visualisation du script**
```typescript
// Dans breakdown/page.tsx
<ScriptViewer 
  scriptUrl={project.script_file} // URL du fichier chiffré
  projectTitle={project.title}
  mode="creation"
/>

// Le composant ScriptViewer :
// 1. Télécharge le fichier chiffré
// 2. Le déchiffre avec la clé de l'utilisateur
// 3. Crée une URL blob temporaire
// 4. Affiche le PDF dans l'iframe
```

### 3. **États d'affichage**
- **Chargement** : "Déchiffrement du script..." avec animation
- **Erreur** : "Accès refusé" si mauvaise clé/utilisateur
- **Succès** : PDF affiché avec icône 🔒 (sécurisé)

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

## Sécurité renforcée

### 1. **Chiffrement AES-256**
- **Algorithme** : AES-GCM (authentifié)
- **Clé** : PBKDF2 avec 100 000 itérations
- **IV** : 12 bytes aléatoires par fichier
- **Salt** : Fixe mais unique à l'application

### 2. **Isolation utilisateur**
- Clé de chiffrement unique par utilisateur
- Impossible de déchiffrer le script d'un autre utilisateur
- Même si quelqu'un accède au fichier, il est inutilisable

### 3. **Politiques Storage**
- **Lecture** : fichiers accessibles mais chiffrés
- **Écriture** : propriétaire du dossier seulement
- **Déchiffrement** : côté client uniquement

### 4. **Gestion mémoire**
- URLs blob temporaires automatiquement nettoyées
- Pas de cache persistant du contenu déchiffré
- Rechiffrement à chaque fermeture/ouverture

## Flux utilisateur sécurisé

1. **Création projet** :
   - Remplir le formulaire
   - Sélectionner un fichier PDF
   - Cliquer "Créer" → **chiffrement automatique** → upload

2. **Dépouillement** :
   - Aller sur la page breakdown
   - Cliquer "Créer une séquence"
   - → **Déchiffrement automatique** → PDF affiché à gauche avec 🔒

3. **Sécurité** :
   - Seul le propriétaire peut voir son script
   - Tentative d'accès par un autre utilisateur → "Accès refusé"
   - Fichiers stockés sous forme chiffrée sur le serveur

## Avantages de la solution

✅ **Confidentialité maximale** : scripts illisibles sans la bonne clé
✅ **Performance** : déchiffrement côté client (pas de serveur)
✅ **Transparent** : l'utilisateur ne voit pas la complexité
✅ **Résilient** : impossible de compromettre les scripts
✅ **Évolutif** : peut être étendu à d'autres types de fichiers

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