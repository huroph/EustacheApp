# 🚨 Système d'alerte pour modifications non enregistrées

## 📋 Fonctionnalité implémentée

### **Objectif :**
Prévenir l'utilisateur s'il tente de fermer le formulaire de création/modification de séquence alors qu'il a des modifications non enregistrées.

## 🔧 Implémentation technique

### **1. États ajoutés dans CreateSequenceForm :**

```typescript
// État initial du formulaire pour comparaison
const [initialFormData, setInitialFormData] = useState({...})

// Flag indiquant s'il y a des changements non sauvegardés
const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
```

### **2. Détection des changements :**

```typescript
// useEffect qui compare l'état actuel avec l'état initial
useEffect(() => {
  const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialFormData)
  setHasUnsavedChanges(hasChanges)
}, [formData, initialFormData])
```

### **3. Gestion des états initiaux :**

#### **Mode création :**
```typescript
// Sauvegarde de l'état initial après création de la séquence vide
setInitialFormData({
  code: newSequence.code,
  title: newSequence.title,
  colorId: newSequence.color_id || 'blue',
  // ... autres champs
})
```

#### **Mode édition :**
```typescript
// Sauvegarde de l'état initial lors du chargement des données
const loadedData = { /* données de la séquence */ }
setFormData(loadedData)
setInitialFormData(loadedData) // État de référence
```

### **4. Alerte avant fermeture :**

```typescript
const handleCancel = async () => {
  // Vérifier s'il y a des modifications non enregistrées
  if (hasUnsavedChanges) {
    const confirmExit = window.confirm(
      '⚠️ Vous avez des modifications non enregistrées.\n\nÊtes-vous sûr de vouloir fermer sans enregistrer ?'
    )
    
    if (!confirmExit) {
      return // L'utilisateur choisit de rester
    }
  }
  
  // Continuer la fermeture si pas de changements ou confirmation
  // ... logique de suppression et fermeture
}
```

### **5. Réinitialisation après sauvegarde :**

#### **Après modification réussie :**
```typescript
// Mettre à jour l'état de référence après sauvegarde
setInitialFormData(formData)
setHasUnsavedChanges(false)
```

#### **Après création réussie :**
```typescript
// Réinitialiser le flag après finalisation
setHasUnsavedChanges(false)
```

### **6. Propagation des changements :**

#### **Chain de notification :**
```
InformationsForm → GeneralStep → CreateSequenceForm
     ↓                ↓              ↓
  onFormChange → onFormChange → setHasUnsavedChanges(true)
```

#### **Gestionnaire dans InformationsForm :**
```typescript
const handleFormDataChange = (field: string, value: string) => {
  setFormData((prev: any) => ({ ...prev, [field]: value }))
  if (onFormChange) onFormChange() // Notifier le parent
}
```

## 🎯 Comportement utilisateur

### **Cas d'usage :**

#### **✅ Pas de modifications :**
- L'utilisateur peut fermer sans alerte
- Fermeture immédiate

#### **⚠️ Modifications non sauvegardées :**
- Alerte avec message explicite
- Choix : "Annuler" (rester) ou "OK" (fermer sans sauver)
- Interface conserve les données si l'utilisateur choisit de rester

#### **💾 Après sauvegarde :**
- État "modifications" réinitialisé
- Fermeture libre sans alerte

### **Déclencheurs d'alerte :**
1. **Bouton "Annuler"** dans le footer
2. **Croix de fermeture** en haut à droite
3. **Navigation vers autre page** (si implémenté)

## 🔍 Points d'attention

### **Comparaison JSON :**
- Simple et efficace pour objets plats
- Sensible à l'ordre des propriétés (mais OK ici)
- Détecte tous types de changements

### **Gestion des champs optionnels :**
- Valeurs par défaut cohérentes entre états
- Évite les faux positifs (undefined vs "")

### **Performance :**
- Comparaison à chaque changement
- Acceptable pour la taille des données du formulaire

## 🚀 Améliorations possibles

### **Future :**
1. **Sauvegarde automatique** (brouillon)
2. **Indicateur visuel** des modifications (*)
3. **Undo/Redo** pour les changements
4. **Comparaison par champ** pour plus de finesse

Cette implémentation offre une **protection robuste** contre la perte accidentelle de données utilisateur ! 🛡️