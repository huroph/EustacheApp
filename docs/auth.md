# Auth (Supabase) — guide rapide

Ce fichier explique la configuration minimale pour l'authentification Supabase utilisée par l'application.

## Variables d'environnement requises

- `NEXT_PUBLIC_SUPABASE_URL` — URL de votre instance Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — clé publique (anon)

## Rôles

### Métiers utilisateur (user_metadata.role)
- `director` (Réalisateur)
- `producer` (Producteur) 
- `assistant` (Assistant réalisateur)
- `scriptwriter` (Scénariste)
- `other` (Autre)

Le rôle représente le métier de l'utilisateur et est affiché dans l'en-tête.

### Rôles par projet (logique fonctionnelle)
- **Propriétaire** : celui qui a créé le projet (`project.user_id === user.id`)
- **Éditeur** : accès en lecture/écriture via partage (table `project_shares` avec `role = 'editor'`)
- **Lecteur** : accès en lecture seule via partage (table `project_shares` avec `role = 'reader'`)

### Hooks utilitaires
- `useProjectRole(project)` : retourne `'owner' | 'editor' | 'reader' | null`
- `useCanEditProject(project)` : retourne `boolean` (owner ou editor)
- `useCanViewProject(project)` : retourne `boolean` (owner, editor ou reader)

## Flux implémenté

- **Inscription** : la page `/register` propose un formulaire avec sélection du métier. Le champ `role` est envoyé en `user_metadata` à Supabase.
- **Connexion** : la page `/login` utilise `supabase.auth.signInWithPassword`.
- **Protection des routes** : toutes les pages dans `(app)/` sont protégées par `AuthGuard` et redirigent vers `/login` si non connecté.
- **Redirections automatiques** : si l'utilisateur est déjà connecté et visite `/login` ou `/register`, il est redirigé vers `/`.
- **Navigation** : liens entre pages de login et register pour faciliter la navigation.
- **En-tête** : affiche l'email et le métier de l'utilisateur connecté.

## Structure des données

- **Projets par utilisateur** : chaque projet est lié à un `user_id` (créateur = propriétaire)
- **Partage anticipé** : table `project_shares(project_id, user_id, role)` pour partager avec rôles `editor`/`reader`
- **Sécurité RLS** : Row Level Security activé avec politiques pour accès selon propriété/partage
- **Services mis à jour** : `ProjectsService` filtre automatiquement par utilisateur connecté et projets partagés

## Migration database

Pour mettre à jour votre base de données existante, exécutez le script SQL dans `docs/migration_add_user_id.sql` :

```sql
-- Ajouter user_id aux projets et activer RLS
-- Voir le fichier complet pour tous les détails
```

## Notes et prochaines étapes

- Pour aller plus loin, il est recommandé de créer une table `profiles` côté Supabase pour stocker des métadonnées d'utilisateur (nom, photo, préférences) et de lier le rôle aux règles RLS.
- Pour le partage de projet, on ajoutera plus tard une table `project_shares(project_id, user_id, role)` pour gérer les droits par projet.
