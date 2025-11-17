import Link from "next/link";
import { Post } from "@/lib/types";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/posts/${post.id}`}>
      <div className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700 h-full">
        <div className="flex items-start justify-between mb-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-2">
            {post.title}
          </h2>
          <span className="ml-2 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full flex-shrink-0">
            #{post.id}
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
          {post.body}
        </p>
        <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
          <svg
            className="h-4 w-4 mr-1"
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
          User {post.userId}
        </div>
      </div>
    </Link>
  );
}
