import React, { useState, useMemo, useRef } from "react";
import { Search, Filter, ShoppingBag } from "lucide-react";
import Fuse from "fuse.js";

import { products } from "../data/products";
import { FeaturedProducts } from "./FeaturedProducts";
import { SortDropdown, SortOption } from "../SortDropdown";
import { FilterSidebar } from "../FilterSidebar";
import { ProductCard } from "../ProductCard";
import { Hero } from "./Hero";

interface FilterState {
  category: string;
  color: string;
  brand: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
}

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [filters, setFilters] = useState<FilterState>({
    category: "All",
    color: "All",
    brand: "All",
    minPrice: 0,
    maxPrice: 25000,
    minRating: 0,
  });

  const featuredRef = useRef<HTMLDivElement | null>(null);

  const handleShopNow = () => {
    featuredRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fuse = useMemo(() => {
    return new Fuse(products, {
      keys: ["title", "brand", "category", "description"],
      threshold: 0.3,
    });
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products;

    if (searchQuery.trim()) {
      const searchResults = fuse.search(searchQuery);
      result = searchResults.map((item) => item.item);
    }

    result = result.filter((product) => {
      if (filters.category !== "All" && product.category !== filters.category) return false;
      if (filters.color !== "All" && product.color !== filters.color) return false;
      if (filters.brand !== "All" && product.brand !== filters.brand) return false;
      if (product.price < filters.minPrice || product.price > filters.maxPrice) return false;
      if (product.rating < filters.minRating) return false;
      return true;
    });

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      default:
        break;
    }

    return result;
  }, [searchQuery, filters, sortBy, fuse]);

  const bestSellers = products.filter((p) => p.badges?.includes("Best Seller")).slice(0, 6);
  const premiumProducts = products.filter((p) => p.badges?.includes("Premium")).slice(0, 6);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Hero */}
      <Hero onShopNow={handleShopNow} />

      {/* Product Search / Filters */}
      <section className="">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters */}
          <FilterSidebar
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            filters={filters}
            onFilterChange={setFilters}
          />

          {/* Products */}
          <div className="flex-1">
            {/* Search bar */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search sarees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>

                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden flex items-center space-x-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:border-pink-600 transition-colors"
                >
                  <Filter className="w-5 h-5" />
                  <span>Filters</span>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-gray-600">{filteredProducts.length} products found</p>
                <SortDropdown value={sortBy} onChange={setSortBy} />
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <div ref={featuredRef}>
        <FeaturedProducts />
      </div>
    </div>
  );
};

export default Home;
