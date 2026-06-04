"use client";

import { useProducts } from "@/hooks/useProducts";
import ProductGrid from "@/components/products/ProductGrid";
import ProductSkeleton from "@/components/products/ProductSkeleton";
import EmptyState from "@/components/products/EmptyState";
import { useCategories } from "@/hooks/useCategories";
import { Product } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

export default function HomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Number(searchParams.get("page") || 1);
  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";

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

  const { data, error } = useProducts(page);

  const products = data?.products ?? [];
  const total = data?.total ?? 0;

  const { data: categories = [], isLoading } = useCategories();

  const filteredProducts = products.filter((product: Product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory = category ? product.category === category : true;
    return matchesSearch && matchesCategory;
  });

  const totalPages =
    search || category
      ? Math.ceil(filteredProducts.length / 12)
      : Math.ceil(total / 12);

  return (
    <>
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
                updateMultipleParams({ search: e.target.value, page: "1" })
              }
              className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Category */}
          <select
            value={category}
            onChange={(e) =>
              updateMultipleParams({ category: e.target.value, page: "1" })
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

        {/* Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        )}

        {error && (
          <p className="text-red-500 text-center py-10">
            Failed to load products
          </p>
        )}

        {/* Products */}
        {!isLoading &&
          !error &&
          (filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} />
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
          ))}
      </div>

      {/* Pagination */}
      {!isLoading && !error && totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-6 mb-10">
          <button
            disabled={page === 1}
            onClick={() => updateMultipleParams({ page: String(page - 1) })}
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
            onClick={() => updateMultipleParams({ page: String(page + 1) })}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-medium disabled:opacity-40 hover:bg-gray-200 transition cursor-pointer disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  );
}
