import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black relative overflow-hidden">
      {/* Background gradient blur effect */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-96 h-96 bg-mapbrain-cream rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-mapbrain-pink rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-mapbrain-purple rounded-full blur-3xl"></div>
      </div>

      <div className="text-center relative z-10 px-4">
        <h1 className="text-6xl md:text-8xl font-bold mb-6">
          <span className="gradient-text">Posts App</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
          Explorez une collection d&apos;articles avec une interface moderne et performante
        </p>
        <Link
          href="/posts"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gray-950 dark:bg-white text-white dark:text-black font-semibold rounded-full hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-2xl"
        >
          <span>Voir les articles</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
