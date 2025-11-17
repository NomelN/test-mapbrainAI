import Link from "next/link";
import { Post } from "@/lib/types";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/posts/${post.id}`}>
      <div className="group block p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-800 h-full hover:scale-[1.02] hover:border-mapbrain-pink/30">
        <div className="flex items-start justify-between mb-3">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-mapbrain-deepPink transition-colors">
            {post.title}
          </h2>
          <span className="ml-2 px-3 py-1 text-xs font-medium bg-gradient-to-r from-mapbrain-cream/20 to-mapbrain-pink/20 text-mapbrain-deepPink rounded-full flex-shrink-0 border border-mapbrain-pink/20">
            #{post.id}
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
          {post.body}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-500">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-mapbrain-pink to-mapbrain-purple flex items-center justify-center text-white text-xs font-semibold mr-2">
              {post.userId}
            </div>
            <span>User {post.userId}</span>
          </div>
          <svg className="w-5 h-5 text-gray-400 group-hover:text-mapbrain-deepPink group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
