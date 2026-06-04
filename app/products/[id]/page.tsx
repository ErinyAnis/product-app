"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Star, ArrowLeft, Tag, Package } from "lucide-react";
import ProductDetailsSkeleton from "@/components/products/ProductDetailsSkeleton";
import { useProduct } from "@/hooks/useProduct";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const productId = Number(id);

  const { data: product, isLoading, error } = useProduct(productId);
  const imageSrc = product?.images?.[0] || "/placeholder.png";
  const rating = product?.rating ?? 0;
  const reviewsCount = product?.reviews?.length ?? 0;

  if (isLoading) return <ProductDetailsSkeleton />;

  if (error)
    return (
      <div className="p-6 text-red-500 text-center">Failed to load product</div>
    );

  if (!product) return <div className="p-6 text-center">Product not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 mb-6 text-blue-600 hover:text-blue-700 transition cursor-pointer text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="grid md:grid-cols-2 gap-6 sm:gap-10 bg-white p-5 sm:p-8 rounded-2xl shadow">
        <div className="flex items-center justify-center bg-gray-50 rounded-xl p-6 min-h-55">
          <Image
            src={imageSrc}
            alt={product.title}
            width={300}
            height={300}
            className="object-contain max-h-64 w-auto"
          />
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
              {product.title}
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              {product.description}
            </p>
          </div>

          <p className="text-2xl font-bold text-green-600">${product.price}</p>

          {/* Category & Stock */}
          <div className="flex flex-wrap gap-2">
            <span className="flex items-center gap-1.5 text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium">
              <Tag className="w-3 h-3" />
              {product.category}
            </span>

            {product.stock !== undefined && (
              <span className="flex items-center gap-1.5 text-xs bg-green-50 text-green-600 px-3 py-1 rounded-full font-medium">
                <Package className="w-3 h-3" />
                {product.stock} in stock
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => {
                const fillPercentage = Math.max(0, Math.min(1, rating - i));
                return (
                  <div key={i} className="relative w-4 h-4">
                    <Star size={16} className="text-gray-300 absolute" />
                    <div
                      className="absolute overflow-hidden"
                      style={{ width: `${fillPercentage * 100}%` }}
                    >
                      <Star size={16} fill="#facc15" stroke="#facc15" />
                    </div>
                  </div>
                );
              })}
            </div>
            <span className="text-sm text-gray-600">
              {rating.toFixed(1)}{" "}
              <span className="text-gray-400">({reviewsCount} reviews)</span>
            </span>
          </div>

          {/* Divider */}
          <hr className="border-gray-100" />

          {/* Reviews */}
          {product.reviews && product.reviews.length > 0 && (
            <div className="flex flex-col gap-2">
              <h2 className="text-sm font-semibold text-gray-700">
                Recent Reviews
              </h2>
              <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
                {product.reviews.map(
                  (
                    review: {
                      reviewerName: string;
                      comment: string;
                      rating: number;
                    },
                    i: number,
                  ) => (
                    <div
                      key={i}
                      className="bg-gray-50 rounded-lg px-3 py-2 text-xs text-gray-600"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-700">
                          {review.reviewerName}
                        </span>
                        <span className="text-yellow-500">
                          {"★".repeat(review.rating)}
                          {"☆".repeat(5 - review.rating)}
                        </span>
                      </div>
                      <p className="leading-relaxed">{review.comment}</p>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
