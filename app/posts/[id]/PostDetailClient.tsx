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
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {post.title}
          </h1>
          <span className="ml-4 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium flex-shrink-0">
            #{post.id}
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-6">
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
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span>Utilisateur {post.userId}</span>
        </div>
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
          {post.body}
        </p>
      </div>

      {/* Bouton pour voir le JSON brut (extra UX) */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors shadow-md"
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
