"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { refreshPosts } from "@/app/posts/actions";

export default function RefreshButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRefresh = async () => {
    startTransition(async () => {
      await refreshPosts(); // Force la revalidation via Server Action
      router.refresh(); // Actualise l'UI avec les nouvelles données
    });
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={isPending}
      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors shadow-md"
    >
      <svg
        className={`h-5 w-5 ${isPending ? "animate-spin" : ""}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      {isPending ? "Actualisation..." : "Rafraîchir"}
    </button>
  );
}
