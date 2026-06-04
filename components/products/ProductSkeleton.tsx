export default function ProductSkeleton() {
  return (
    <div className="border rounded-lg p-4 animate-pulse space-y-3">
      <div className="w-full h-40 bg-gray-200 rounded" />

      <div className="h-4 bg-gray-200 rounded w-3/4" />

      <div className="h-4 bg-gray-200 rounded w-1/2" />
    </div>
  );
}
