import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/api";
import { ProductsResponse } from "@/types";

export function useProducts(page: number, limit: number = 12, search: string = "", category: string = "") {
  return useQuery<ProductsResponse>({
    queryKey: ["products", page, search, category],
    queryFn: () => {
      const skip = (page - 1) * limit;
      return getProducts(limit, skip);
    },
    placeholderData: (prev) => prev,
  });
}