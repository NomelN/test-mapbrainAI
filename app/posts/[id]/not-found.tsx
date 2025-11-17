import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 text-center">
          <div className="text-6xl font-bold text-blue-600 dark:text-blue-400 mb-4">
            404
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Article non trouvé
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            L&apos;article que vous recherchez n&apos;existe pas ou a été supprimé.
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href="/posts"
              className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-center"
            >
              Voir tous les articles
            </Link>

            <Link
              href="/"
              className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-center"
            >
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
