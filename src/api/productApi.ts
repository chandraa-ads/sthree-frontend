// src/api/productApi.ts

import { Product } from "../types";

interface ApiListResponse {
  data: Product[];
}

interface ApiSingleResponse {
  data: Product;
}

export async function fetchAllProducts(): Promise<Product[]> {
  const resp = await fetch("/api/products");
  if (!resp.ok) {
    throw new Error(`Failed to fetch products: ${resp.statusText}`);
  }
  const json = (await resp.json()) as ApiListResponse;
  return json.data;
}

export async function fetchProductById(id: string): Promise<Product> {
  const resp = await fetch(`/api/products/${id}`);
  if (!resp.ok) {
    throw new Error(`Product not found: ${resp.statusText}`);
  }
  const json = (await resp.json()) as ApiSingleResponse;
  return json.data;
}

export async function fetchProductsByCategory(category: string): Promise<Product[]> {
  const resp = await fetch(`/api/products?category=${encodeURIComponent(category)}`);
  if (!resp.ok) {
    // maybe return empty or throw
    return [];
  }
  const json = (await resp.json()) as ApiListResponse;
  return json.data;
}
