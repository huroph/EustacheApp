# 🔍 Guide de débogage - Erreur 406

## 📋 Étapes de diagnostic

### **1. Vérifier les logs détaillés**
Ouvrez votre application dans le navigateur et allez sur la page des projets.
Ouvrez la console de développement (F12) et regardez :

- **Logs de ProjectsService** : Ils vous diront exactement quelle requête échoue
- **Erreurs Supabase** : Code d'erreur, détails, hint
- **Requêtes réseau** : Onglet Network pour voir les 406

### **2. Actions possibles**

#### **Option A : Utiliser le bouton de réparation**
1. Sur la page des projets, cliquez sur le bouton "🔧 Réparer codes"
2. Cela va automatiquement :
   - Renuméroter tous vos projets (PRJ-1, PRJ-2, etc.)
   - Corriger les codes problématiques
   - Recharger la liste

#### **Option B : Migration SQL manuelle**
Si le bouton ne fonctionne pas, exécutez dans Supabase SQL Editor :

```sql
-- 1. D'abord, voir l'état actuel
SELECT user_id, code, title, created_at 
FROM projects 
ORDER BY user_id, created_at;

-- 2. Si vous voyez des problèmes, nettoyer
WITH numbered_projects AS (
  SELECT 
    id,
    user_id,
    'PRJ-' || ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at) as new_code
  FROM projects
)
UPDATE projects 
SET code = numbered_projects.new_code
FROM numbered_projects
WHERE projects.id = numbered_projects.id;
```

### **3. Vérifications post-correction**

Après avoir appliqué une correction :

1. **Rechargez l'application** (F5)
2. **Vérifiez la console** : plus d'erreurs 406 ?
3. **Testez la création** : nouveaux projets fonctionnent ?
4. **Vérifiez la numérotation** : PRJ-1, PRJ-2, PRJ-3... ?

## 🚨 Messages d'erreur courants

### **"duplicate key value violates unique constraint"**
- **Cause** : Deux projets ont le même code
- **Solution** : Renumérotation automatique

### **"relation does not exist"**
- **Cause** : Migration SQL pas appliquée
- **Solution** : Exécuter le script de migration

### **"permission denied"**
- **Cause** : Problème RLS (Row Level Security)
- **Solution** : Vérifier les politiques Supabase

## 📞 Que faire si ça ne marche toujours pas

1. **Copiez les logs** de la console
2. **Vérifiez Supabase** : policies, constraints, données
3. **Testez avec un nouveau compte** pour isoler le problème
4. **Supprimez temporairement** tous les projets pour repartir à zéro

## 🎯 Script de test rapide

Dans la console du navigateur :
```javascript
// Test de connexion
const { data: user } = await supabase.auth.getUser()
console.log('Utilisateur:', user)

// Test de récupération
const { data: projects, error } = await supabase
  .from('projects')
  .select('*')
  .eq('user_id', user.user.id)
console.log('Projets:', projects, 'Erreur:', error)
```

Cette approche méthodique devrait résoudre le problème ! 🚀