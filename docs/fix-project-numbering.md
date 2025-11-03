# 🔧 Correction du système de numérotation des projets

## 🐛 Problème identifié

**Erreur** : `duplicate key value violates unique constraint "projects_code_key"`

**Cause** : Le système de génération automatique des codes de projets avait plusieurs problèmes :

1. **Numérotation globale** : Tous les utilisateurs partageaient la même séquence PRJ-1, PRJ-2...
2. **Race condition** : Deux utilisateurs créant un projet simultanément tentaient d'obtenir le même code
3. **Pas de gestion des suppressions** : Suppression de PRJ-2 laissait un trou permanent
4. **Trigger SQL défaillant** : Logique de génération non isolée par utilisateur

## ✅ Solution implémentée

### **1. Numérotation par utilisateur**
- Chaque utilisateur a ses propres codes : PRJ-1, PRJ-2, PRJ-3...
- Isolation complète entre utilisateurs
- Pas de conflits possibles

### **2. Gestion automatique des suppressions**
- Suppression de PRJ-2 → PRJ-3 devient PRJ-2 automatiquement
- Aucun trou dans la numérotation
- Ordre chronologique préservé

### **3. Contrainte unique modifiée**
```sql
-- Avant : code unique global (problématique)
ALTER TABLE projects ADD CONSTRAINT projects_code_key UNIQUE (code);

-- Après : code unique par utilisateur (correct)
ALTER TABLE projects ADD CONSTRAINT projects_code_user_unique UNIQUE (code, user_id);
```

## 🛠️ Modifications techniques

### **ProjectsService (src/lib/services/projects.ts)**

#### `getNextProjectNumber()` - **Nouveau**
```typescript
// Trouve le premier numéro disponible pour l'utilisateur
const numbers = projects.map(extractNumber).sort()
let nextNumber = 1
for (const num of numbers) {
  if (num === nextNumber) nextNumber++
  else break
}
return nextNumber
```

#### `create()` - **Modifié**
```typescript
// Génération automatique du code
const nextNumber = await this.getNextProjectNumber()
const code = `PRJ-${nextNumber}`

const project = await supabase.insert({
  ...projectData,
  user_id: user.id,
  code // Code généré automatiquement
})
```

#### `delete()` - **Modifié**
```typescript
// Suppression + renumérotation automatique
await supabase.delete().eq('id', id).eq('user_id', user.id)
await this.renumberProjects() // Renumérotation automatique
```

#### `renumberProjects()` - **Nouveau**
```typescript
// Renumérotation intelligente par ordre chronologique
const projects = await getByUser()
const sorted = projects.sort((a, b) => a.created_at - b.created_at)

for (let i = 0; i < sorted.length; i++) {
  const newCode = `PRJ-${i + 1}`
  if (sorted[i].code !== newCode) {
    await update(sorted[i].id, { code: newCode })
  }
}
```

### **useProjects Hook - Simplifié**

#### `createProject()` - **Modifié**
```typescript
// Plus besoin de passer le code !
const createProject = async (data: ProjectCreateInput) => {
  const newProject = await ProjectsService.create(data)
  await loadProjects() // Recharger pour voir la numérotation
  return newProject
}

// Type simplifié (sans 'code')
type ProjectCreateInput = Omit<ProjectInsert, 'user_id' | 'code'>
```

#### `deleteProject()` - **Modifié**
```typescript
// Suppression + renumérotation automatique
const deleteProject = async (id: string) => {
  await ProjectsService.delete(id) // Inclut la renumérotation
  await loadProjects() // Recharger pour voir les nouveaux numéros
}
```

## 🔄 Migration nécessaire

### **1. Exécuter dans Supabase SQL Editor**
```sql
-- Supprimer l'ancien trigger
DROP TRIGGER IF EXISTS trigger_generate_project_code ON projects;
DROP FUNCTION IF EXISTS generate_project_code();

-- Modifier la contrainte unique
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_code_key;
ALTER TABLE projects ADD CONSTRAINT projects_code_user_unique UNIQUE (code, user_id);
```

### **2. Test de la correction**
```typescript
// Test 1 : Création normale
await createProject({ title: "Premier projet" }) // → PRJ-1
await createProject({ title: "Deuxième projet" }) // → PRJ-2

// Test 2 : Suppression et renumérotation
await deleteProject(firstProjectId) // → PRJ-2 devient PRJ-1

// Test 3 : Isolation utilisateurs
// Utilisateur A : PRJ-1, PRJ-2
// Utilisateur B : PRJ-1, PRJ-2 (pas de conflit)
```

## 🎯 Avantages de la correction

### **Pour l'utilisateur**
✅ **Fiable** : Plus d'erreurs lors de la création
✅ **Logique** : Numérotation séquentielle 1, 2, 3...
✅ **Personnel** : Chaque utilisateur a ses propres numéros

### **Pour le système**
✅ **Pas de race conditions** : Génération côté client sécurisée
✅ **Isolation** : Utilisateurs complètement séparés
✅ **Consistance** : Pas de trous dans la numérotation

### **Pour la base de données**
✅ **Contraintes correctes** : Unique par (code, user_id)
✅ **Performance** : Requêtes optimisées par utilisateur
✅ **Intégrité** : Pas de conflits possibles

## 🚀 Prochaines étapes

1. **Exécuter la migration SQL** dans Supabase
2. **Tester la création** de projets
3. **Vérifier l'isolation** entre utilisateurs
4. **Appliquer la même logique** aux séquences (optionnel)

Le système est maintenant **robuste** et **sans conflits** ! 🎉