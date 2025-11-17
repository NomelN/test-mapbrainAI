import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Posts App
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Explorez une collection d&apos;articles
        </p>
        <Link
          href="/posts"
          className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
        >
          Voir les articles
        </Link>
      </div>
    </div>
  );
}
