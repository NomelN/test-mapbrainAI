"use client";

import { useState } from "react";
import { Post } from "@/lib/types";
import JsonModal from "@/components/JsonModal";

interface PostDetailClientProps {
  post: Post;
}

export default function PostDetailClient({ post }: PostDetailClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="mb-8">
        <div className="flex items-start justify-between mb-6">
          <h1 className="text-4xl md:text-5xl font-bold">
            <span className="gradient-text">{post.title}</span>
          </h1>
          <span className="ml-4 px-4 py-2 bg-gradient-to-r from-mapbrain-cream/20 to-mapbrain-pink/20 text-mapbrain-deepPink rounded-full text-sm font-semibold flex-shrink-0 border border-mapbrain-pink/20">
            #{post.id}
          </span>
        </div>

        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-mapbrain-pink to-mapbrain-purple flex items-center justify-center text-white font-semibold">
            {post.userId}
          </div>
          <span className="text-lg">Utilisateur {post.userId}</span>
        </div>
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-xl">
          {post.body}
        </p>
      </div>

      {/* Bouton pour voir le JSON brut (extra UX) */}
      <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gray-950 dark:bg-white text-white dark:text-black font-semibold rounded-full hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
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
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            />
          </svg>
          Voir le JSON brut
        </button>
      </div>

      {/* Modal JSON */}
      <JsonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={post}
        title={`Données JSON - Article #${post.id}`}
      />
    </>
  );
}
