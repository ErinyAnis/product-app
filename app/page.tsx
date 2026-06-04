"use client";

import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { Product } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import ProductGrid from "@/components/products/ProductGrid";
import ProductSkeleton from "@/components/products/ProductSkeleton";

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

  const { isLoading } = useCategories();

  const filteredProducts = products.filter((product: Product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory = category ? product.category === category : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1"></div>
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
  );
}
