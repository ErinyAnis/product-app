import {
  Product,
  ProductsResponse,
  Category,
  LoginCredentials,
  AuthResponse,
} from "@/types";

const BASE_URL = "https://dummyjson.com";

export async function getProducts(
  limit: number,
  skip: number,
  search: string = "",
  category: string = ""
): Promise<ProductsResponse> {
  const params = new URLSearchParams({
    limit: String(limit),
    skip: String(skip),
  });

  let url: string;
  if (category) {
    url = `${BASE_URL}/products/category/${encodeURIComponent(category)}?${params}`;
  } else if (search) {
    params.set("q", search);
    url = `${BASE_URL}/products/search?${params}`;
  } else {
    url = `${BASE_URL}/products?${params}`;
  }

  const res = await fetch(url);

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

export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: credentials.username,
      password: credentials.password,
      expiresInMins: 60,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Invalid username or password");
  }

  return response.json();
}