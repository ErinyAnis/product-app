"use client";

import { useQuery } from "@tanstack/react-query";
import { getProductById } from "@/lib/api";
import { Product } from "@/types";

export function useProduct(id: number) {
  return useQuery<Product>({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}