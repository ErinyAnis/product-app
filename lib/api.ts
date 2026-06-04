import {
  Product,
  ProductsResponse,
  Category,
} from "@/types";

const BASE_URL = "https://dummyjson.com";

export async function getProducts(limit: number, skip: number): Promise<ProductsResponse> {
  const res = await fetch(
    `https://dummyjson.com/products?limit=${limit}&skip=${skip}`
  );

  if (!res.ok) throw new Error("Failed to fetch products");

  return res.json();
}

export async function getProductById(id: number): Promise<Product> {
  const response = await fetch(`${BASE_URL}/products/${id}`);

  if (!response.ok) {
    throw new Error("Product not found");
  }

  return response.json();
}

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${BASE_URL}/products/categories`);
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  const data = await response.json();

  return data;
}