import { SearchX } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export default function EmptyState({
  title = "No products found",
  description = "Try changing your search or filter.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center pt-16 pb-7 text-center">
      <SearchX className="w-14 h-14 text-gray-400 mb-4" />

      <h2 className="text-xl font-semibold text-gray-700">{title}</h2>

      <p className="text-gray-500 mt-2">{description}</p>
    </div>
  );
}
