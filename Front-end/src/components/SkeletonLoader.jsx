export default function SkeletonLoader({ count = 12 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
          <div className="h-48 sm:h-56 bg-gray-200 animate-pulse" />
          <div className="p-4 sm:p-5 space-y-3">
            <div className="h-5 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6" />
            <div className="h-3 bg-gray-100 rounded animate-pulse w-1/3 mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
}
