export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-48 mb-4 animate-pulse" />
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-64 animate-pulse" />
        </div>

        <div className="mb-8">
          <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="p-6 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse h-48"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
