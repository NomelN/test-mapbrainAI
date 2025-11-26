import { Comment } from "@/lib/types";

interface CommentCardProps {
    comment: Comment;
}

export default function CommentCard({ comment }: CommentCardProps) {
    // Extract first letter of name for avatar
    const avatarLetter = comment.name.charAt(0).toUpperCase();

    return (
        <div className="group p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 hover:scale-[1.02] hover:border-mapbrain-pink/30">
            <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-mapbrain-pink to-mapbrain-purple flex items-center justify-center text-white text-lg font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                        {avatarLetter}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-mapbrain-deepPink transition-colors">
                            {comment.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {comment.email}
                        </p>
                    </div>

                    {/* Comment body */}
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {comment.body}
                    </p>
                </div>
            </div>
        </div>
    );
}
