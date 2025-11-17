export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-40 mb-8 animate-pulse" />

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4" />
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-8" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded" />
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded" />
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
