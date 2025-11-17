# Test technique Frontend (MAPBRAIN AI)

Application de gestion d'articles avec Next.js 15 (App Router), TypeScript et Tailwind CSS.

## 🚀 Démarrage

```bash
npm install
npm run dev
```

Accès : [http://localhost:3000](http://localhost:3000)

---

## 1. Comment j'ai géré le rendu (SSG / ISR / SSR) et pourquoi

### Stratégie choisie : **ISR (Incremental Static Regeneration) + SSG Partiel**

#### ISR comme stratégie principale

**Implémentation** :
```typescript
// lib/api.ts
export async function getPosts(): Promise<Post[]> {
  const res = await fetch(`${API_URL}/posts`, {
    next: { revalidate: 60 }, // Revalidation toutes les 60 secondes
  });
  return res.json();
}
```

**Pourquoi ISR plutôt que SSR ?**

J'ai **rejeté le SSR** (Server-Side Rendering) car :
- Il aurait généré une requête API à **chaque visite** (300-500ms de latence)
- Charge inutile sur l'API JSONPlaceholder
- Mauvaise expérience utilisateur avec chargement à chaque page

**Pourquoi ISR plutôt que Full SSG ?**

J'ai **rejeté le Full SSG** (100 pages statiques) car :
- Temps de build trop long (génération de 100 pages HTML)
- Gaspillage de ressources pour des pages rarement visitées
- Difficile à mettre à jour (nécessite un re-build complet)

**Avantages de l'ISR** :
- ✅ **Performance** : Pages servies depuis le cache (< 100ms)
- ✅ **Fraîcheur** : Revalidation automatique toutes les 60 secondes
- ✅ **Scalabilité** : Pas de requête API systématique
- ✅ **Stratégie stale-while-revalidate** : L'utilisateur voit toujours une page instantanément

**Comment ça fonctionne** :
```
Requête 1 (0s)   → Génération + mise en cache
Requête 2 (5s)   → Cache hit (instantané)
Requête 3 (65s)  → Cache hit + revalidation en arrière-plan
Requête 4 (66s)  → Nouveau cache avec données fraîches
```

#### SSG Partiel avec `generateStaticParams`

**Implémentation** :
```typescript
// app/posts/[id]/page.tsx
export async function generateStaticParams() {
  const posts = await getPosts();

  // Pré-génération des 10 premiers posts uniquement
  return posts.slice(0, 10).map((post) => ({
    id: post.id.toString(),
  }));
}
```

**Pourquoi seulement 10 posts ?**
- **Optimisation du build** : Build rapide, déploiement rapide
- **Principe de Pareto** : Les 10 premiers posts = ~80% du trafic
- **On-demand ISR** : Les 90 autres posts sont générés à la demande puis cachés

**Résultat** :
- Posts 1-10 : HTML statique au build (instantané)
- Posts 11-100 : Générés on-demand + cache ISR (60s)

---

## 2. Comment j'ai implémenté le rafraîchissement du cache

### Problème initial

`router.refresh()` seul **ne suffit pas** car :
- Il invalide uniquement le Router Cache côté client
- Il **ne force pas** Next.js à ignorer le cache ISR serveur
- Résultat : les "nouvelles" données proviennent toujours du cache

### Solution : Server Action + `revalidatePath()`

**Server Action** :
```typescript
// app/posts/actions.ts
"use server";

import { revalidatePath } from "next/cache";

export async function refreshPosts() {
  revalidatePath("/posts"); // Invalide le cache Next.js côté serveur
  return { success: true, timestamp: Date.now() };
}
```

**Composant Client** :
```typescript
// components/RefreshButton.tsx
const handleRefresh = async () => {
  startTransition(async () => {
    await refreshPosts();  // 1. Invalide cache serveur
    router.refresh();      // 2. Force re-render + re-fetch
  });
};
```

### Flux complet de rafraîchissement

```
Click Bouton
    ↓
refreshPosts() [Server Action]
    ↓
revalidatePath("/posts") → Invalide Full Route Cache + Data Cache
    ↓
router.refresh() → Re-render du Server Component
    ↓
getPosts() ré-exécuté → fetch() vers API (cache invalidé)
    ↓
Données fraîches affichées ✅
```

### Pourquoi `useTransition` ?

```typescript
const [isPending, startTransition] = useTransition();
```

- **Non-bloquant** : L'UI reste interactive pendant le refresh
- **Feedback visuel** : `isPending` permet d'afficher un spinner
- **Support async** : Fonctionne avec les Server Actions asynchrones

### Revalidation automatique

En plus du refresh manuel, l'ISR revalide automatiquement :
- Toutes les 60 secondes après expiration du cache
- En arrière-plan (stale-while-revalidate)
- Sans impacter l'utilisateur

