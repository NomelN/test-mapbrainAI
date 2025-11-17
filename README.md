# Posts App - Next.js 15

Application de gestion d'articles avec Next.js 15 (App Router), TypeScript et Tailwind CSS.

## 🚀 Démarrage

```bash
npm install
npm run dev
```

Accès : [http://localhost:3000](http://localhost:3000)

---

## 📐 Architecture de Rendu : SSG / ISR / SSR

### Stratégie Hybride Adoptée

J'ai opté pour une **combinaison ISR + SSG partiel** pour optimiser les performances tout en garantissant la fraîcheur des données.

#### 1. **ISR (Incremental Static Regeneration)** - Stratégie Principale

**Code** ([lib/api.ts](lib/api.ts:10-15)) :
```typescript
export async function getPosts(): Promise<Post[]> {
  const res = await fetch(`${API_URL}/posts`, {
    next: { revalidate: 60 }, // Revalidation toutes les 60s
  });
  return res.json();
}
```

**Pourquoi ISR ?**
- Les données de JSONPlaceholder sont **statiques** (changent rarement)
- ISR offre le meilleur des deux mondes :
  - **Performance** : Les pages sont servies depuis le cache (quasi-instantané)
  - **Fraîcheur** : Revalidation automatique toutes les 60 secondes
  - **Scalabilité** : Pas de requête API à chaque visite

**Fonctionnement** :
1. **Première requête** : Next.js génère la page et la met en cache
2. **Requêtes suivantes (< 60s)** : Page servie depuis le cache (ultra-rapide)
3. **Après 60s** : Next.js regénère la page en arrière-plan à la prochaine requête
4. L'utilisateur voit toujours une page instantanément (stale-while-revalidate)

**Alternative SSR rejetée** :
```typescript
// ❌ SSR - Non utilisé
fetch(url, { cache: 'no-store' })
```
- Aurait généré une requête API à **chaque visite**
- Latence inutile (300-500ms par requête)
- Charge excessive sur l'API externe

#### 2. **SSG Partiel** avec `generateStaticParams`

**Code** ([app/posts/[id]/page.tsx](app/posts/[id]/page.tsx:17-24)) :
```typescript
export async function generateStaticParams() {
  const posts = await getPosts();

  // Pré-génération des 10 premiers posts uniquement
  return posts.slice(0, 10).map((post) => ({
    id: post.id.toString(),
  }));
}
```

**Pourquoi seulement 10 posts ?**
- **Build rapide** : 100 pages statiques = build long et déploiement lent
- **Principe de Pareto** : Les 10 premiers posts représentent probablement 80% du trafic
- **On-demand ISR** : Les 90 autres pages sont générées à la demande puis cachées

**Cycle de vie** :
```
POST 1-10  : Build → HTML statique → Cache (instantané)
POST 11-100: Requête → Génération on-demand → Cache ISR (60s)
```

#### 3. **Pourquoi pas du Full SSG ?**

```typescript
// ❌ Full SSG - Non utilisé
return posts.map(post => ({ id: post.id.toString() }))
```

**Problèmes** :
- 100 pages HTML statiques à générer au build
- Temps de build x10 plus long
- Gaspillage de ressources pour des pages rarement visitées
- Difficile à mettre à jour (nécessite un re-build complet)

---

## 🔄 Rafraîchissement du Cache

### 1. Revalidation Automatique (ISR)

**Mécanisme** :
```typescript
next: { revalidate: 60 }
```

Next.js utilise la stratégie **stale-while-revalidate** :

```
Timeline:
0s     →  Requête 1 : Génération + mise en cache
5s     →  Requête 2 : Cache hit (instantané) ✅
30s    →  Requête 3 : Cache hit (instantané) ✅
65s    →  Requête 4 : Cache hit MAIS déclenche revalidation en arrière-plan 🔄
66s    →  Requête 5 : Nouveau cache (données fraîches) ✅
```

**Avantages** :
- Utilisateur ne subit **jamais** de latence
- Données actualisées automatiquement
- Zéro configuration côté client

### 2. Rafraîchissement Manuel

**Code** ([components/RefreshButton.tsx](components/RefreshButton.tsx:11-16)) :
```typescript
const handleRefresh = async () => {
  startTransition(async () => {
    await refreshPosts(); // Server Action qui appelle revalidatePath()
    router.refresh(); // Actualise l'UI avec les nouvelles données
  });
};
```

**Server Action** ([app/posts/actions.ts](app/posts/actions.ts)) :
```typescript
"use server";

import { revalidatePath } from "next/cache";

export async function refreshPosts() {
  revalidatePath("/posts"); // Invalide le cache Next.js
  return { success: true, timestamp: Date.now() };
}
```

**Comment ça fonctionne ?**

1. **Click sur le bouton** → Appelle `handleRefresh()`
2. **Server Action `refreshPosts()`** → Appelle `revalidatePath("/posts")`
3. **`revalidatePath()`** → Invalide le cache ISR de Next.js côté serveur
4. **`router.refresh()`** → Force le re-render du Server Component
5. **Re-fetch automatique** → Les données sont récupérées à nouveau depuis l'API
6. **UI actualisée** → Les nouvelles données s'affichent

**Pourquoi Server Action + revalidatePath ?**

`router.refresh()` seul ne suffit pas car :
- Il invalide uniquement le **Router Cache** côté client
- Il ne force PAS Next.js à ignorer le cache ISR serveur
- Résultat : on récupère les mêmes données depuis le cache

`revalidatePath()` résout ce problème :
- Invalide le **Full Route Cache** (cache ISR serveur)
- Force un nouveau fetch vers l'API JSONPlaceholder
- Garantit des données fraîches

**Pourquoi `useTransition` ?**
```typescript
const [isPending, startTransition] = useTransition();
```

- **Non-bloquant** : L'UI reste interactive pendant le refresh
- **État de chargement** : `isPending` permet d'afficher un spinner
- **Async dans Transition** : Supporte les Server Actions asynchrones

**Alternative rejetée** (hard reload) :
```typescript
// ❌ Mauvaise approche
window.location.reload()
```
- Perd l'état de l'application
- Recharge tous les assets (CSS, JS)
- Expérience utilisateur dégradée

### 3. Filtrage Client-Side (Pas de Revalidation)

**Code** ([app/posts/page.tsx](app/posts/page.tsx:24-29)) :
```typescript
const filteredPosts = searchQuery
  ? posts.filter((post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  : posts;
```

**Pourquoi client-side ?**
- Les 100 posts sont **déjà en mémoire** (< 50 KB)
- Filtrage instantané (0ms vs 300ms+ avec API)
- JSONPlaceholder ne supporte pas `?title_like=`
- Évite des dizaines de requêtes API inutiles

**Implémentation** ([components/SearchBar.tsx](components/SearchBar.tsx:8-20)) :
```typescript
const handleSearch = (term: string) => {
  startTransition(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    router.push(`/posts?${params.toString()}`);
  });
};
```

- Utilise les **URL search params** pour la persistance
- `useTransition` pour éviter le blocage pendant la navigation
- Le Server Component reçoit `searchParams` et filtre côté serveur (mais après fetch)

---

## 🚧 Améliorations Futures

### 1. **Pagination / Virtualisation**

**Problème actuel** :
- Charge 100 posts d'un coup (même si seulement 10 visibles)
- Peut ralentir sur mobile avec connexion lente

**Solution** :
```typescript
// API virtuelle avec pagination
const { data } = usePagination('/posts', {
  limit: 20,
  page: currentPage
});

// OU React Virtual pour le scroll infini
import { useVirtualizer } from '@tanstack/react-virtual'
```

**Impact** :
- Chargement initial 5x plus rapide
- Meilleure UX sur mobile

### 2. **Debouncing de la Recherche**

**Problème actuel** :
- Chaque frappe déclenche un re-render
- Peut être lent avec beaucoup de posts

**Solution** :
```typescript
import { useDebouncedValue } from '@/hooks/useDebounce';

const debouncedSearch = useDebouncedValue(searchTerm, 300);
```

**Impact** :
- Réduit les renders de 90%
- UX plus fluide

### 3. **Optimistic Updates pour le Refresh**

**Problème actuel** :
- Le refresh affiche un loader
- Peut sembler "cassé" si les données n'ont pas changé

**Solution** :
```typescript
const { mutate } = useSWR('/posts', fetcher, {
  optimisticData: currentData, // Garde les données actuelles
  revalidate: true
});
```

**Impact** :
- Zéro "flash" de chargement
- Meilleure perception de performance

### 4. **Cache Stale-Time Intelligent**

**Problème actuel** :
- `revalidate: 60` est arbitraire
- Peut être trop court (gaspillage) ou trop long (données obsolètes)

**Solution** :
```typescript
// Adapter le revalidate selon le type de données
const REVALIDATE_TIMES = {
  posts: 5 * 60,      // 5 min (change rarement)
  comments: 60,       // 1 min (plus dynamique)
  user: 10 * 60,      // 10 min (très statique)
};
```

**Impact** :
- Optimisation fine du cache
- Réduction de 70% des requêtes API

### 5. **Prefetching des Pages Détail**

**Problème actuel** :
- Cliquer sur un post déclenche un fetch (même si ISR)

**Solution** :
```typescript
<Link
  href={`/posts/${post.id}`}
  prefetch={true} // Next.js 15 prefetch par défaut
>
```

**Vérifier** :
```typescript
// Dans next.config.ts
experimental: {
  optimisticClientCache: true,
}
```

**Impact** :
- Navigation **instantanée**
- Précharge au survol (100-200ms de gain)

### 6. **Analytics & Monitoring**

**Manque actuel** :
- Pas de métriques sur le cache hit ratio
- Impossible de savoir si `revalidate: 60` est optimal

**Solution** :
```typescript
// Vercel Analytics
import { Analytics } from '@vercel/analytics/react';

// Custom logging
export async function getPosts() {
  const start = performance.now();
  const res = await fetch(url, { next: { revalidate: 60 } });

  console.log('[CACHE]', {
    duration: performance.now() - start,
    cached: res.headers.get('x-vercel-cache') === 'HIT'
  });
}
```

**Impact** :
- Données pour optimiser le cache
- Détection des problèmes de performance

### 7. **Error Recovery Automatique**

**Problème actuel** :
- Si l'API tombe, l'utilisateur voit une erreur
- Nécessite un clic manuel sur "Retry"

**Solution** :
```typescript
// Retry automatique avec backoff exponentiel
const { data, error } = useSWR('/posts', fetcher, {
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
    if (retryCount >= 3) return;
    setTimeout(() => revalidate({ retryCount }), 5000 * retryCount);
  }
});
```

**Impact** :
- Résilience automatique
- Meilleure expérience en cas de panne réseau

### 8. **Skeleton Matching**

**Problème actuel** :
- Les skeletons ont une hauteur fixe
- Peut causer un "layout shift" au chargement

**Solution** :
```typescript
// Skeleton qui match la vraie carte
<div className="h-[180px]"> {/* Hauteur réelle mesurée */}
  <div className="h-8 w-3/4 bg-gray-300 animate-pulse" />
  <div className="h-20 bg-gray-300 animate-pulse mt-4" />
</div>
```

**Impact** :
- CLS (Cumulative Layout Shift) proche de 0
- Meilleur score Lighthouse

---

## 📊 Métriques de Performance

**Estimations** (à valider avec Lighthouse) :

| Métrique | Valeur Estimée | Cible |
|----------|----------------|-------|
| **FCP** (First Contentful Paint) | ~800ms | < 1.8s ✅ |
| **LCP** (Largest Contentful Paint) | ~1.2s | < 2.5s ✅ |
| **TTI** (Time to Interactive) | ~1.5s | < 3.8s ✅ |
| **CLS** (Cumulative Layout Shift) | ~0.05 | < 0.1 ✅ |
| **Cache Hit Ratio** (après warm-up) | ~85% | > 80% ✅ |

---

**Développé avec Next.js 15, TypeScript et Tailwind CSS**
