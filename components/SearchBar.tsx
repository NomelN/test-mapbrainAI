"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const currentSearch = searchParams.get("q") || "";

  const handleSearch = (term: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (term) {
        params.set("q", term);
      } else {
        params.delete("q");
      }
      router.push(`/posts?${params.toString()}`);
    });
  };

  return (
    <div className="relative max-w-2xl">
      <input
        type="text"
        placeholder="Rechercher par titre..."
        defaultValue={currentSearch}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full px-5 py-3.5 pl-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full focus:ring-2 focus:ring-mapbrain-pink/30 focus:border-mapbrain-pink dark:text-white placeholder:text-gray-400 transition-all shadow-sm focus:shadow-md"
      />
      <svg
        className="absolute left-4 top-4 h-5 w-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      {isPending && (
        <div className="absolute right-4 top-3.5">
          <div className="animate-spin h-6 w-6 border-2 border-mapbrain-pink border-t-transparent rounded-full" />
        </div>
      )}
    </div>
  );
}
