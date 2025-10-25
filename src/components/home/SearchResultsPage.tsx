import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ProductCard } from "../ProductCard";
import { productService } from "../products/ProductService";

export default function SearchResultsPage() {
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("query")?.trim() || "";
    setQuery(q);

    if (q) {
      fetchProducts(q);
    } else {
      setProducts([]);
    }
  }, [location.search]);

  const fetchProducts = async (searchQuery: string) => {
    try {
      setLoading(true);
      // ✅ Send query as `name` to match backend filter
      const response = await productService.filterProducts({ name: searchQuery, page: 1, limit: 20 });
      setProducts(response.data || []);
    } catch (err) {
      console.error("Error fetching search results:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-xl font-semibold mb-4">
        Search Results for: <span className="text-green-600">“{query}”</span>
      </h2>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-gray-600">
          {query ? "No products found." : "Enter a search query to find products."}
        </p>
      )}
    </div>
  );
}
