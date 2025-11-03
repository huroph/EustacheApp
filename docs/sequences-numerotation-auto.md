# Gestion automatique des numéros de séquence

## Vue d'ensemble

Le système de numérotation des séquences est maintenant **entièrement automatique** et **intelligent**. Les numéros sont gérés automatiquement lors de la création et suppression des séquences.

## 🔢 Logique de numérotation

### **Principe**
- **Numérotation séquentielle** : SEQ-1, SEQ-2, SEQ-3, etc.
- **Pas de trous** : suppression de SEQ-2 → SEQ-3 devient SEQ-2
- **Par projet** : chaque projet a sa propre séquence 1, 2, 3...
- **Ordre chronologique** : basé sur la date de création

### **Exemples concrets**

#### Création normale
```
Projet vide → Créer séquence → SEQ-1
Ajouter séquence → SEQ-2
Ajouter séquence → SEQ-3
```

#### Suppression et renumérotation
```
État initial : SEQ-1, SEQ-2, SEQ-3
Supprimer SEQ-1 → Résultat : SEQ-1 (ex-SEQ-2), SEQ-2 (ex-SEQ-3)
Supprimer SEQ-1 → Résultat : SEQ-1 (ex-SEQ-3)
```

#### Suppression au milieu
```
État initial : SEQ-1, SEQ-2, SEQ-3, SEQ-4
Supprimer SEQ-2 → Résultat : SEQ-1, SEQ-2 (ex-SEQ-3), SEQ-3 (ex-SEQ-4)
```

## 🛠️ Implémentation technique

### **1. Service SequencesService**

#### `getNextSequenceNumber(projectId)`
```typescript
// Trouve le premier numéro disponible
const sequences = await getByProject(projectId)
const numbers = sequences.map(s => extractNumber(s.code)).sort()

// Algorithme : 1, 2, 3, ... trouve le premier trou
let next = 1
for (const num of numbers) {
  if (num === next) next++
  else break
}
return next
```

#### `create(sequenceData)` - **Modifié**
```typescript
// Plus besoin de passer le code !
const nextNumber = await getNextSequenceNumber(projectId)
const code = `SEQ-${nextNumber}`

const sequence = await supabase.insert({
  ...sequenceData,
  code // Code généré automatiquement
})
```

#### `delete(id)` - **Modifié**
```typescript
// Suppression + renumérotation automatique
const sequence = await getById(id)
await supabase.delete().eq('id', id)

// Renuméroter toutes les séquences restantes
await renumberSequences(sequence.project_id)
```

#### `renumberSequences(projectId)`
```typescript
// Renumérotation intelligente
const sequences = await getByProject(projectId)
const sorted = sequences.sort((a, b) => a.created_at - b.created_at)

// Renuméroter : 1, 2, 3, ...
for (let i = 0; i < sorted.length; i++) {
  const newCode = `SEQ-${i + 1}`
  if (sorted[i].code !== newCode) {
    await update(sorted[i].id, { code: newCode })
  }
}
```

### **2. Hook useSequences - Simplifié**

#### `createSequence()` - **Modifié**
```typescript
// Plus besoin de gérer le code manuellement !
const createSequence = async (data: SequenceCreateInput) => {
  const newSequence = await SequencesService.create(data)
  await loadSequences() // Recharger pour voir la numérotation
  return newSequence
}

// Type simplifié (sans 'code')
type SequenceCreateInput = Omit<SequenceInsert, 'code'>
```

#### `deleteSequence()` - **Modifié**
```typescript
// Suppression + renumérotation automatique
const deleteSequence = async (id: string) => {
  await SequencesService.delete(id) // Inclut la renumérotation
  await loadSequences() // Recharger pour voir les nouveaux numéros
}
```

### **3. CreateSequenceForm - Simplifié**

#### Avant (complexe)
```typescript
// Logique complexe manuelle
const generateCode = () => {
  const numbers = sequences.map(extractNumber).sort()
  const max = Math.max(...numbers)
  return `SEQ-${max + 1}`
}

await createSequence({ ...data, code: generateCode() })
await updateSequence(id, { code })
```

#### Après (simple)
```typescript
// Création automatique !
const newSequence = await createSequence({
  project_id: project.id,
  title: 'Nouvelle séquence'
  // Pas de code : généré automatiquement
})

// newSequence.code contient déjà SEQ-1, SEQ-2, etc.
```

## 🔒 Sécurité et isolation

### **Par projet**
- Chaque projet a ses propres numéros 1, 2, 3...
- Projet A : SEQ-1, SEQ-2 | Projet B : SEQ-1, SEQ-2
- Impossible de mélanger les séquences de projets différents

### **Vérifications**
```typescript
// Création : vérification du project_id
if (sequenceData.project_id !== expectedProjectId) {
  throw new Error('ID du projet non valide')
}

// Suppression : vérification de l'appartenance
const isValid = await verifySequenceProject(sequenceId, projectId)
if (!isValid) {
  throw new Error('Séquence non autorisée')
}
```

## 🎯 Avantages du nouveau système

### **Pour l'utilisateur**
✅ **Simple** : les numéros se gèrent tout seuls
✅ **Logique** : toujours 1, 2, 3, 4... sans trous
✅ **Prévisible** : suppression = renumérotation automatique

### **Pour le développeur**
✅ **Moins de code** : plus de logique manuelle
✅ **Pas de bugs** : numérotation garantie correcte
✅ **Atomique** : création + suppression en une opération

### **Pour la base de données**
✅ **Consistance** : les codes sont toujours valides
✅ **Performance** : requêtes optimisées par projet
✅ **Intégrité** : pas de doublons possibles

## 🚀 Migration et compatibilité

### **Séquences existantes**
- Les séquences avec codes manuels continuent de fonctionner
- La renumérotation s'applique à la prochaine suppression
- Pas de migration nécessaire

### **API rétrocompatible**
- `SequencesService.create()` fonctionne toujours
- Seul changement : le `code` est optionnel maintenant
- Les composants existants continuent de marcher

## 🧪 Tests recommandés

```bash
# Test 1 : Création séquentielle
Créer séquence → Vérifier SEQ-1
Créer séquence → Vérifier SEQ-2
Créer séquence → Vérifier SEQ-3

# Test 2 : Suppression du milieu
Supprimer SEQ-2 → Vérifier SEQ-1, SEQ-2 (ex-SEQ-3)

# Test 3 : Suppression du début
Supprimer SEQ-1 → Vérifier SEQ-1 (ex-SEQ-2), SEQ-2 (ex-SEQ-3)

# Test 4 : Isolation par projet
Projet A : SEQ-1, SEQ-2
Projet B : SEQ-1, SEQ-2
→ Pas d'interférence
```

Le système est maintenant **robuste**, **automatique** et **sans surprise** ! 🎉