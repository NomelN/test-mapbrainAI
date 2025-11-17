import { Suspense } from "react";
import { getPosts } from "@/lib/api";
import PostCard from "@/components/PostCard";
import SearchBar from "@/components/SearchBar";
import RefreshButton from "@/components/RefreshButton";
import Link from "next/link";

interface PostsPageProps {
  searchParams: Promise<{ q?: string }>;
}

// Loading skeleton pour les cartes
function PostsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="p-6 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse h-48"
        />
      ))}
    </div>
  );
}

async function PostsList({ searchQuery }: { searchQuery: string }) {
  const posts = await getPosts();

  // Filtrage côté client (en mémoire) basé sur le terme de recherche
  const filteredPosts = searchQuery
    ? posts.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : posts;

  if (filteredPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          Aucun article trouvé pour &quot;{searchQuery}&quot;
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const params = await searchParams;
  const searchQuery = params.q || "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/"
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Retour
            </Link>
            <RefreshButton />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Articles
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Explorez notre collection d&apos;articles
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="mb-8">
          <SearchBar />
        </div>

        {/* Liste des posts avec Suspense pour le streaming */}
        <Suspense fallback={<PostsSkeleton />}>
          <PostsList searchQuery={searchQuery} />
        </Suspense>
      </div>
    </div>
  );
}
