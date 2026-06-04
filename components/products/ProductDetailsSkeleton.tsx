export default function ProductDetailsSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-6 animate-pulse">
      <div className="h-4 w-20 bg-gray-200 rounded mb-6" />

      <div className="grid md:grid-cols-2 gap-8">
        <div className="w-full h-80 bg-gray-200 rounded" />

        <div className="space-y-4">
          <div className="h-6 w-3/4 bg-gray-200 rounded" />
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-5/6 bg-gray-200 rounded" />
          <div className="h-4 w-1/2 bg-gray-200 rounded" />

          <div className="h-4 w-1/3 bg-gray-200 rounded mt-4" />
        </div>
      </div>
    </div>
  );
}
