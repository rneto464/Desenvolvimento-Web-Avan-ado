export default function SkeletonLoader({ count = 12 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-news-rule border border-news-rule">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white">
          <div className="bg-news-surface animate-pulse" style={{ paddingTop: '60%' }} />
          <div className="p-4 space-y-2.5">
            <div className="h-2.5 bg-news-surface rounded animate-pulse w-1/4" />
            <div className="h-4 bg-news-surface rounded animate-pulse" />
            <div className="h-4 bg-news-surface rounded animate-pulse w-5/6" />
            <div className="h-3 bg-news-surface rounded animate-pulse w-3/4" />
            <div className="h-2 bg-news-surface rounded animate-pulse w-1/3 mt-3" />
          </div>
        </div>
      ))}
    </div>
  );
}
