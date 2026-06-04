"use client";

import { useProducts } from "@/hooks/useProducts";
import ProductGrid from "@/components/products/ProductGrid";
import ProductSkeleton from "@/components/products/ProductSkeleton";
import EmptyState from "@/components/products/EmptyState";
import { useCategories } from "@/hooks/useCategories";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, ChevronLeft, ChevronRight, X } from "lucide-react";

export default function HomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Number(searchParams.get("page") || 1);
  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";

  // Sync filters and pagination with URL query params
  const updateMultipleParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.push(`/?${params.toString()}`);
  };

  // Products are fetched based on current page and active filters
  const {
    data,
    error,
    isLoading: productsLoading,
  } = useProducts(page, 12, search, category);

  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();

  const isLoading = productsLoading || categoriesLoading;

  const products = data?.products ?? [];
  const total = data?.total ?? 0;

  // Pagination is calculated from API total count
  const totalPages = Math.ceil(total / 12);

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <p className="text-red-500 text-center py-10">
          Failed to load products
        </p>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) =>
                updateMultipleParams({
                  search: e.target.value,
                  page: "1",
                })
              }
              className="w-full border border-gray-300 rounded-lg pl-9 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />

            {search && (
              <button
                type="button"
                onClick={() =>
                  updateMultipleParams({
                    search: "",
                    page: "1",
                  })
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {/* Category */}
          <select
            value={category}
            onChange={(e) =>
              updateMultipleParams({
                category: e.target.value,
                page: "1",
              })
            }
            className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition sm:w-48 bg-white"
          >
            <option value="">All Categories</option>

            {categories.map((categoryItem) => (
              <option key={categoryItem.slug} value={categoryItem.slug}>
                {categoryItem.name}
              </option>
            ))}
          </select>
        </div>

        {/* Products */}
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <>
            <EmptyState
              title="No matching products"
              description={
                search && category
                  ? `No products found for "${search}" in "${category}".`
                  : search
                    ? `No products match "${search}".`
                    : category
                      ? `No products found in "${category}".`
                      : "No products available."
              }
            />

            <div className="flex justify-center">
              <button
                onClick={() =>
                  updateMultipleParams({
                    search: "",
                    category: "",
                    page: "1",
                  })
                }
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition text-sm"
              >
                Clear Filters
              </button>
            </div>
          </>
        )}
      </div>

      {/* Persist pagination state in URL so navigation keeps the current page */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-6 mb-10">
          <button
            disabled={page === 1}
            onClick={() =>
              updateMultipleParams({
                page: String(page - 1),
              })
            }
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-medium disabled:opacity-40 hover:bg-gray-200 transition cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Prev
          </button>

          <span className="text-sm text-gray-600">
            Page <span className="font-semibold text-gray-800">{page}</span> of{" "}
            <span className="font-semibold text-gray-800">{totalPages}</span>
          </span>

          <button
            disabled={page === totalPages}
            onClick={() =>
              updateMultipleParams({
                page: String(page + 1),
              })
            }
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-medium disabled:opacity-40 hover:bg-gray-200 transition cursor-pointer disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </ProtectedRoute>
  );
}
