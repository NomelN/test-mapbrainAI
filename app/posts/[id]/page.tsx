import { Suspense } from "react";
import Link from "next/link";
import { getPost, getPosts } from "@/lib/api";
import { notFound } from "next/navigation";
import PostDetailClient from "./PostDetailClient";

interface PostPageProps {
  params: Promise<{ id: string }>;
}

// Génération statique des pages au build time
export async function generateStaticParams() {
  const posts = await getPosts();

  // On ne génère que les 10 premiers posts au build pour optimiser
  return posts.slice(0, 10).map((post) => ({
    id: post.id.toString(),
  }));
}

function PostDetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4" />
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-8" />
      <div className="space-y-3">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6" />
      </div>
    </div>
  );
}

async function PostDetailContent({ id }: { id: string }) {
  try {
    const post = await getPost(id);
    return <PostDetailClient post={post} />;
  } catch {
    notFound();
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <Link
          href="/posts"
          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-8"
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
          Retour aux articles
        </Link>

        {/* Contenu avec Suspense */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <Suspense fallback={<PostDetailSkeleton />}>
            <PostDetailContent id={id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
