# 📊 Récapitulatif Base de Données - EustacheApp

## 🎯 Vue d'ensemble du schéma

Votre application utilise **Supabase** avec 8 tables principales organisées hiérarchiquement pour la gestion de productions audiovisuelles.

## 📋 Structure des Tables

### 🎬 **1. PROJECTS** (Table principale)
```sql
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,           -- PRJ-001, PRJ-002, etc.
  title VARCHAR(255) NOT NULL,
  description TEXT,
  script_file VARCHAR(255),
  start_date DATE,
  end_date DATE,
  cover_url VARCHAR(500),
  status VARCHAR(50) CHECK (status IN ('En préparation', 'En cours', 'Terminé', 'Archivé')),
  user_id UUID REFERENCES auth.users(id),    -- Propriétaire du projet
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```
**État actuel** : ✅ Implémentée avec auth
**Données** : ~6 projets existants

---

### 🎭 **2. SEQUENCES** (Enfant de projects)
```sql
CREATE TABLE sequences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(50) NOT NULL,                 -- SEQ-001, SEQ-002, etc.
  title VARCHAR(255) NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  color_id VARCHAR(50),
  status VARCHAR(50) CHECK (status IN ('A validé', 'En attente', 'Validé')),
  location VARCHAR(255),
  summary TEXT,
  pre_montage VARCHAR(50),
  ett VARCHAR(50),
  time_of_day VARCHAR(50) CHECK (time_of_day IN ('JOUR', 'NUIT')),
  location_type VARCHAR(50) CHECK (location_type IN ('INT', 'EXT')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(code, project_id)
);
```
**État actuel** : ✅ Implémentée
**Données** : ~4 séquences existantes

---

### 👥 **3. ROLES** (Enfant de sequences)
```sql
CREATE TABLE roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sequence_id UUID REFERENCES sequences(id) ON DELETE CASCADE,
  
  -- Type et identification
  type VARCHAR(20) CHECK (type IN ('Principale', 'Secondaire', 'Figurant', 'Voix Off')),
  nom_role VARCHAR(255) NOT NULL,
  
  -- Interprète
  interprete_nom VARCHAR(255) NOT NULL,
  interprete_prenom VARCHAR(255) NOT NULL,
  genre VARCHAR(20) CHECK (genre IN ('Masculin', 'Féminin', 'Autre')),
  age_personnage VARCHAR(50),
  
  -- Description
  apparence TEXT,
  description TEXT,
  notes_sequence TEXT,
  
  -- Contact
  adresse TEXT,
  email VARCHAR(255),
  telephone VARCHAR(20),
  
  -- Doublure
  doublure_nom VARCHAR(255),
  doublure_prenom VARCHAR(255),
  doublure_type VARCHAR(20) CHECK (doublure_type IN ('Image', 'Voix', 'Cascades')),
  doublure_adresse TEXT,
  doublure_email VARCHAR(255),
  doublure_telephone VARCHAR(20),
  doublure_notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```
**État actuel** : ✅ Implémentée et utilisée
**Données** : ~1 rôle existant

---

### 🎨 **4. COSTUMES** (Enfant de sequences)
```sql
CREATE TABLE costumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sequence_id UUID REFERENCES sequences(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE SET NULL, -- Optionnel
  nom_costume VARCHAR(255) NOT NULL,
  statut VARCHAR(50) CHECK (statut IN ('A validé', 'En attente', 'Validé', 'Reporté')),
  notes_costume TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```
**État actuel** : ⚠️ Schéma créé, hook implémenté

---

### 🛋️ **5. DECORS** (Enfant de sequences)
```sql
CREATE TABLE decors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sequence_id UUID REFERENCES sequences(id) ON DELETE CASCADE,
  nom_decor VARCHAR(255) NOT NULL,
  localisation VARCHAR(255),
  statut VARCHAR(50) CHECK (statut IN ('A validé', 'En attente', 'Validé', 'Reporté')),
  notes_decor TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```
**État actuel** : ⚠️ Schéma créé

---

### 🎬 **6. SCENES** (Enfant de sequences)
```sql
CREATE TABLE scenes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sequence_id UUID REFERENCES sequences(id) ON DELETE CASCADE,
  decor_id UUID REFERENCES decors(id) ON DELETE SET NULL,
  numero INTEGER NOT NULL,
  status VARCHAR(50) CHECK (status IN ('A validé', 'En attente', 'Validé')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```
**État actuel** : ⚠️ Schéma créé

---

### 🎭 **7. ACCESSOIRES** (Enfant de sequences)
```sql
CREATE TABLE accessoires (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sequence_id UUID REFERENCES sequences(id) ON DELETE CASCADE,
  nom_accessoire VARCHAR(255) NOT NULL,
  statut VARCHAR(50) CHECK (statut IN ('A validé', 'En attente', 'Validé', 'Reporté')),
  notes_accessoire TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```
**État actuel** : ⚠️ Schéma créé

---

### ⚡ **8. EFFETS_SPECIAUX** (Enfant de sequences)
```sql
CREATE TABLE effets_speciaux (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sequence_id UUID REFERENCES sequences(id) ON DELETE CASCADE,
  nom_effet VARCHAR(255) NOT NULL,
  type_effet VARCHAR(100),
  statut VARCHAR(50) CHECK (statut IN ('A validé', 'En attente', 'Validé', 'Reporté')),
  notes_effet TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```
**État actuel** : ⚠️ Schéma créé

## 🔗 Relations et Hiérarchie

```
👤 USERS (Supabase Auth)
    ↓
🎬 PROJECTS (user_id)
    ↓
🎭 SEQUENCES (project_id)
    ↓
    ├── 👥 ROLES (sequence_id)
    ├── 🎨 COSTUMES (sequence_id, role_id?)
    ├── 🛋️ DECORS (sequence_id)
    ├── 🎬 SCENES (sequence_id, decor_id?)
    ├── 🎭 ACCESSOIRES (sequence_id)
    └── ⚡ EFFETS_SPECIAUX (sequence_id)
```

## 🔧 Fonctions Automatiques Implémentées

### **Auto-génération des codes**
- **Projects** : `PRJ-001`, `PRJ-002`, etc.
- **Sequences** : `SEQ-001`, `SEQ-002`, etc. (par projet)

### **Triggers actifs**
- `trigger_generate_project_code` 
- `trigger_generate_sequence_code`
- `trigger_projects_updated_at`
- `trigger_sequences_updated_at`

## 📊 État Actuel des Données

| Table | Records | État | RLS |
|-------|---------|------|-----|
| projects | ~6 | ✅ Actif | ❌ Non |
| sequences | ~4 | ✅ Actif | ❌ Non |
| roles | ~1 | ✅ Actif | ❌ Non |
| costumes | 0 | ⚠️ Schéma only | ❌ Non |
| decors | 0 | ⚠️ Schéma only | ❌ Non |
| scenes | 0 | ⚠️ Schéma only | ❌ Non |
| accessoires | 0 | ⚠️ Schéma only | ❌ Non |
| effets_speciaux | 0 | ⚠️ Schéma only | ❌ Non |

## ⚠️ Problèmes de Sécurité Identifiés

1. **Aucune RLS active** → Accès libre aux données
2. **Projects sans isolation utilisateur** → Un user peut voir les projets des autres
3. **Stats publiques bloquées par RLS** → Comptage impossible

## ✅ Services Implémentés

- `ProjectsService` ✅ (avec auth user_id)
- `SequencesService` ✅
- `RolesService` ✅ 
- `StatsService` ⚠️ (problème RLS)
- `useRoles` hook ✅
- `useCostumes` hook ⚠️ (partiel)

---

## 🎯 Prochaines étapes

1. **Activer RLS** pour sécuriser les données
2. **Créer fonction publique** pour les stats
3. **Compléter les tables manquantes**
4. **Implémenter les services restants**