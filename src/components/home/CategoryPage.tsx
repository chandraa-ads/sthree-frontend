import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FeaturedProducts } from "./FeaturedProducts";
import { Product } from "../types/product";

export default function CategoryPage() {
  const { main_category } = useParams<{ main_category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!main_category) return;

    setLoading(true);

    fetch(
      `http://localhost:3000/products/search/by-category?main_category=${main_category}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        setProducts(data.products || []);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [main_category]);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      {/* <h2 className="text-3xl font-bold mb-8 text-center uppercase">
        {main_category} Collection
      </h2> */}

      {loading ? (
        <div className="flex justify-center items-center">
          <svg
            className="animate-spin h-8 w-8 text-green-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
            />
          </svg>
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          No products found in "{main_category}".
        </p>
      ) : (
        <FeaturedProducts products={products} category={main_category || ""} />
      )}
    </div>
  );
}
