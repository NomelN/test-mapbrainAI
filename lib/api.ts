import { Post, Comment } from "./types";

const API_URL = "https://jsonplaceholder.typicode.com";

/**
 * Récupère tous les posts avec cache et revalidation
 * - Cache: force-cache pour éviter les refetch systématiques
 * - Revalidation: 60 secondes (les données sont actualisées toutes les minutes)
 */
export async function getPosts(): Promise<Post[]> {
  const res = await fetch(`${API_URL}/posts`, {
    next: { revalidate: 60 }, // Revalidation ISR toutes les 60 secondes
  });

  if (!res.ok) {
    throw new Error("Échec de récupération des posts");
  }

  return res.json();
}

/**
 * Récupère un post spécifique par ID
 * - generateStaticParams pré-génère les pages au build
 * - revalidate: 60 pour actualiser périodiquement
 */
export async function getPost(id: string): Promise<Post> {
  const res = await fetch(`${API_URL}/posts/${id}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Échec de récupération du post ${id}`);
  }

  return res.json();
}

/**
 * Récupère les commentaires pour un post spécifique
 * - Filtre par postId pour obtenir uniquement les commentaires associés
 * - revalidate: 60 pour actualiser périodiquement
 */
export async function getComments(postId: number): Promise<Comment[]> {
  const res = await fetch(`${API_URL}/comments?postId=${postId}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Échec de récupération des commentaires pour le post ${postId}`);
  }

  return res.json();
}
