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
          className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 h-48"
        >
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
          </div>
        </div>
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
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/"
              className="group flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium rounded-full hover:bg-white dark:hover:bg-gray-900 transition-all"
            >
              <svg
                className="h-5 w-5 group-hover:-translate-x-1 transition-transform"
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
          <h1 className="text-5xl md:text-6xl font-bold mb-3">
            <span className="gradient-text">Articles</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Explorez notre collection d&apos;articles
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="mb-10">
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
