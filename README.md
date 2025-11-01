# EustacheAppThis is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).



Application moderne avec Next.js 14+, App Router, TypeScript et Tailwind CSS featuring un header et une sidebar rétractable.## Getting Started



## ✨ FonctionnalitésFirst, run the development server:



- **Header persistant** avec bouton de toggle sidebar, champ de recherche et avatar```bash

- **Sidebar rétractable** (desktop) et drawer (mobile) avec persistance localStoragenpm run dev

- **Navigation intelligente** avec détection de route active# or

- **Raccourci clavier** (Ctrl/Cmd + B) pour toggle la sidebaryarn dev

- **Responsive design** adaptatif mobile/desktop# or

- **Accessibilité** complète (ARIA, focus management)pnpm dev

- **TypeScript strict** avec configuration complète# or

- **Tests** avec Vitest et Testing Librarybun dev

- **Composants réutilisables** avec API propre```



## 🚀 Démarrage rapideOpen [http://localhost:3000](http://localhost:3000) with your browser to see the result.



```bashYou can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

# Installation des dépendances

npm installThis project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.



# Développement## Learn More

npm run dev

To learn more about Next.js, take a look at the following resources:

# Tests

npm run test- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

npm run test:watch- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.



# Build de productionYou can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

npm run build

npm start## Deploy on Vercel



# LintingThe easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

npm run lint

```Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## 📁 Structure du projet

```
src/
├── app/                    # App Router (Next.js 14+)
│   ├── (app)/             # Groupe de routes avec layout
│   │   ├── dashboard/     # Page Dashboard
│   │   ├── analytics/     # Page Analytics
│   │   └── layout.tsx     # Layout avec AppShell
│   ├── globals.css        # Styles globaux + Tailwind
│   ├── layout.tsx         # Layout racine
│   └── page.tsx           # Page d'accueil (redirection)
├── components/
│   ├── ui/                # Composants UI réutilisables
│   │   ├── Button.tsx     # Composant Button avec variants
│   │   └── __tests__/     # Tests des composants UI
│   └── layout/            # Composants de mise en page
│       ├── AppShell.tsx   # Shell principal avec state management
│       ├── Header.tsx     # Header avec toggle et navigation
│       └── Sidebar.tsx    # Sidebar responsive et accessible
├── hooks/
│   └── useSidebar.ts      # Hook state management + localStorage + shortcuts
├── lib/
│   └── utils.ts           # Utilitaires (cn pour classes CSS)
└── test/
    ├── setup.ts           # Configuration tests
    └── vitest-globals.d.ts # Types globaux Vitest
```

## 🎨 Design System

### Palette de couleurs
- **Primary**: Blue (Tailwind blue-600 par défaut)
- **Neutral**: Gray scale pour UI
- **États**: Success (green), Warning (yellow), Error (red)

### Breakpoints
- **Mobile**: < 768px (sidebar en drawer)
- **Desktop**: ≥ 768px (sidebar collapsible)

### Composants

#### Button
```tsx
<Button variant="default" size="default">Default</Button>
<Button variant="ghost" size="icon"><Icon /></Button>
<Button variant="outline">Outline</Button>
```

#### Sidebar Navigation
- Automatiquement rétractée/étendue sur desktop
- Mode drawer sur mobile avec overlay
- Persistance de l'état dans localStorage
- Links avec détection de route active

## ⌨️ Raccourcis clavier

- **Ctrl/Cmd + B**: Toggle sidebar (desktop uniquement)

## 🧪 Tests

```bash
# Tous les tests
npm run test

# Tests en mode watch
npm run test:watch

# Tests avec UI
npm run test:ui
```

### Coverage
- Tests du composant `Button` (variants, props, états)
- Tests de la page `Dashboard` (rendu, contenu)
- Configuration Vitest avec jsdom pour React

## 🔧 Configuration

### TypeScript
- Mode strict activé
- Alias de chemins (`@/*` → `src/*`)
- Types globaux Vitest

### Tailwind CSS
- Configuration étendue avec palette primary
- Police Inter via next/font
- Classes utilitaires optimisées

### ESLint
- Configuration Next.js recommandée
- Rules pour React et TypeScript

## 📱 Responsive Design

### Mobile (< 768px)
- Header fixe avec bouton menu
- Sidebar en drawer (slide-in) avec overlay
- Navigation pleine largeur

### Desktop (≥ 768px)
- Sidebar fixe avec toggle collapse/expand
- État persisté dans localStorage
- Raccourci clavier pour toggle

## ♿ Accessibilité

- **ARIA labels** sur tous les éléments interactifs
- **Focus management** avec indicateurs visuels
- **Keyboard navigation** complète
- **Screen reader** friendly
- **aria-expanded** pour état de la sidebar
- **role="navigation"** pour la navigation principale

## 🚀 Déploiement sur Vercel

1. **Push vers GitHub**
```bash
git add .
git commit -m "Initial EustacheApp setup"
git push origin main
```

2. **Connecter à Vercel**
- Aller sur [vercel.com](https://vercel.com)
- Importer le projet GitHub
- Déploiement automatique

3. **Variables d'environnement** (si nécessaire)
```bash
# Ajouter dans Vercel Dashboard > Settings > Environment Variables
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

## 📋 Checklist finale

- ✅ Sidebar rétractable avec persistance localStorage
- ✅ Header avec navigation et champs mock
- ✅ Routing fonctionnel (/dashboard, /analytics)
- ✅ Design responsive (mobile drawer, desktop sidebar)
- ✅ Accessibilité complète (ARIA, keyboard, focus)
- ✅ Tests unitaires et d'intégration
- ✅ TypeScript strict sans erreurs
- ✅ Build production sans warnings
- ✅ Documentation complète

## 🔄 Prochaines étapes suggérées

1. **Authentification** - Ajouter système de login/logout
2. **Thème sombre** - Implémenter dark mode avec persistance
3. **API Integration** - Connecter à une vraie API backend
4. **Performance** - Optimiser bundle et lazy loading
5. **PWA** - Ajouter service worker et offline support
6. **Internationalisation** - Support multi-langues avec next-intl

## 📄 Licence

MIT - Libre d'utilisation pour projets personnels et commerciaux.