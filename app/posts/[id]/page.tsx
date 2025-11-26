import { Suspense } from "react";
import Link from "next/link";
import { getPost, getPosts, getComments } from "@/lib/api";
import { notFound } from "next/navigation";
import PostDetailClient from "./PostDetailClient";
import CommentCard from "@/components/CommentCard";

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

// Comments skeleton
function CommentsSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-48 animate-pulse" />
        <div className="h-6 w-12 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse" />
      </div>
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl animate-pulse">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700" />
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3" />
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded" />
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-5/6" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Comments section component
async function CommentsSection({ postId }: { postId: number }) {
  const comments = await getComments(postId);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <h2 className="text-3xl font-bold">
          <span className="gradient-text">Commentaires</span>
        </h2>
        <span className="px-4 py-1.5 bg-gradient-to-r from-mapbrain-cream/20 to-mapbrain-pink/20 text-mapbrain-deepPink rounded-full text-sm font-semibold border border-mapbrain-pink/20">
          {comments.length}
        </span>
      </div>

      {/* Comments list */}
      {comments.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {comments.map((comment, index) => (
            <div
              key={comment.id}
              style={{
                animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
              }}
            >
              <CommentCard comment={comment} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
          Aucun commentaire pour cet article.
        </p>
      )}
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
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigation */}
        <Link
          href="/posts"
          className="group inline-flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium rounded-full hover:bg-white dark:hover:bg-gray-900 transition-all mb-10"
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
          Retour aux articles
        </Link>

        {/* Contenu avec Suspense */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-10 mb-8">
          <Suspense fallback={<PostDetailSkeleton />}>
            <PostDetailContent id={id} />
          </Suspense>
        </div>

        {/* Comments Section */}
        <Suspense fallback={<CommentsSkeleton />}>
          <CommentsSection postId={parseInt(id)} />
        </Suspense>
      </div>
    </div>
  );
}
