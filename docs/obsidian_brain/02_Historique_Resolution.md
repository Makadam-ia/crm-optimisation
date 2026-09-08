# Historique de Résolution des Problèmes Techniques

Ce document retrace les obstacles techniques rencontrés lors du développement et leurs solutions afin d'éviter les régressions.

## Problèmes Résolus

### 1. Conflits d'initialisation et de dépendances
- **Symptôme** : Timeout et erreurs NPM liés à des packages incompatibles au démarrage (ex: React 18 vs React 19 pour `react-leaflet`).
- **Solution** : Installation forcée via `npm install --legacy-peer-deps` et purge de l'arborescence. Création manuelle d'une structure saine pour Next.js (fichiers `next.config.mjs`, `tailwind.config.js`).

### 2. Erreurs de compilation (Linting & JSX)
- **Symptôme** : `npm run build` échouait avec des erreurs de balises HTML non fermées et des caractères non échappés.
- **Solution** : 
  - Nettoyage du fichier `src/app/dashboard/page.js` : suppression d'une balise fantôme `</div></section>` laissée par erreur.
  - Échappement strict des apostrophes (`'`) remplacés par `&apos;` dans le texte JSX.

### 3. Crash du Build Vercel (URLs corrompues et variables nulles)
- **Symptôme** : Échec lors du déploiement Vercel indiquant que `supabaseUrl is required` ou est invalide, car le serveur de build n'avait pas accès au `.env.local` lors de la pré-génération SSG.
- **Solution** : Ajout de placeholders de secours (ex: `'https://placeholder.supabase.co'`) dans `src/lib/supabase.js` et `src/lib/supabase-server.js` pour duper le compilateur SSG et permettre au build de passer au vert.

### 4. Cache SSG agressif et Données vides ("0" partout)
- **Symptôme** : Le site déployé affichait "0 demandes" et aucune carte, bien que la base soit remplie. Le code utilisait `supabaseAdmin` (nécessitant la clé de service) et Next.js figeait la page vide au build (Statically Generated).
- **Solution** :
  - Remplacement de `supabaseAdmin` par le client public `supabase` (utilisant l'Anon Key).
  - Désactivation du cache de build via la directive `export const dynamic = 'force-dynamic'` injectée dans `src/app/dashboard/page.js` et `src/app/map/page.js`.

### 5. Conflit de nommage de la variable "dynamic" dans Next.js
- **Symptôme** : L'ajout de `export const dynamic = 'force-dynamic'` entrait en collision avec l'import `import dynamic from 'next/dynamic'` utilisé pour Leaflet.
- **Solution** : Renommage de l'import dynamique en `import nextDynamic from 'next/dynamic'` dans le composant de carte.

### 6. Blocage d'accès public aux données (Row Level Security - RLS)
- **Symptôme** : Après le passage à l'Anon Key, Supabase bloquait les requêtes renvoyant des tableaux vides par sécurité.
- **Solution** : Configuration explicite d'une politique RLS (Row Level Security) sur la table `demande_devis` pour autoriser l'accès anonyme en lecture :
  `ALTER TABLE demande_devis ENABLE ROW LEVEL SECURITY;`
  `CREATE POLICY "Autoriser la lecture" ON demande_devis FOR SELECT USING (true);`


### 7. Refonte UI/UX du Tableau de Bord (Mobile-First)
- **Symptôme/Besoin** : L'affichage en liste basique des interventions manquait de lisibilité, surtout en utilisation mobile (zones de clic trop petites, manque de hiérarchisation).
- **Solution** : 
  - Transformation de la liste passive en CSS Grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`).
  - Création du Client Component `InterventionCard.js` :
    - Hiérarchisation : Problème (Titre principal), Nom & Adresse (Secondaire).
    - Code couleur dynamique (Rouge pour Urgence, Orange pour En attente, Vert pour Planifié).
    - Zones de clics élargies (Padding/Min-height de `55px` pour faciliter le tap).
    - Ajout des actions rapides : Appel (href="tel:"), Waze/Trajet (href="https://waze.com/ul?q="), et un `select` pour la mise à jour directe du statut en base de données Supabase.
