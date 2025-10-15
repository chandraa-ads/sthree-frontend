import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ShoppingBag } from 'lucide-react';
import { productService } from '../products/ProductService';
import { Product, FilterParams } from '../types/product';
import { ProductCard } from '../ProductCard';
import { ProductCarousel } from '../ProductCarousel';
import { FilterSidebar } from '../FilterSidebar';
import { SortDropdown, SortOption } from '../SortDropdown';
import { ProductCardSkeleton } from '../ui/ProductCardSkeleton';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Hero } from '../home/Hero';
import { FeaturedProducts } from '../home/FeaturedProducts';
import { Categories } from '../home/Categories';

interface FilterState {
  category: string;
  color: string;
  brand: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
}

export function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [brands, setBrands] = useState<string[]>(['All']);
  const [colors, setColors] = useState<string[]>(['All']);
  const [filters, setFilters] = useState<FilterState>({
    category: 'All',
    color: 'All',
    brand: 'All',
    minPrice: 0,
    maxPrice: 25000,
    minRating: 0,
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');

    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const productsPromise = categoryParam
          ? productService.getProductsByCategory(categoryParam)
          : productService.getAllProducts();

        const [productsData, categoriesData, brandsData, colorsData] = await Promise.all([
          productsPromise,
          productService.getCategories(),
          productService.getBrands(),
          productService.getColors()
        ]);

        setProducts(productsData);
        if (categoryParam) {
          setFilteredProducts(productsData);
          setShowAllProducts(true);
        }
        setCategories(categoriesData);
        setBrands(brandsData);
        setColors(colorsData);
      } catch (error) {
        console.error('Error loading initial data:', error);
        setProducts([]);
        setFilteredProducts([]);
        setCategories(['All', 'Saree', 'Salwar', 'Lehenga', 'Kurti', 'Dress']);
        setBrands(['All', 'Deeptex', 'Kessi', 'Shangrila', 'Triveni', 'Lifestyle']);
        setColors(['All', 'Red', 'Blue', 'Green', 'Pink', 'Purple', 'Black', 'White']);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    const filterProducts = async () => {
      if (!searchQuery && !showAllProducts && Object.values(filters).every(f => f === 'All' || f === 0 || f === 25000)) {
        setFilteredProducts([]);
        return;
      }

      try {
        setIsSearching(true);
        const filterParams: FilterParams = {
          name: searchQuery || undefined,
          main_category: filters.category !== 'All' ? filters.category : undefined,
          brand: filters.brand !== 'All' ? filters.brand : undefined,
          color: filters.color !== 'All' ? [filters.color] : undefined,
          minPrice: filters.minPrice > 0 ? filters.minPrice : undefined,
          maxPrice: filters.maxPrice < 25000 ? filters.maxPrice : undefined,
          rating: filters.minRating > 0 ? filters.minRating : undefined,
          sort: sortBy === 'price-low' ? 'price_asc' :
            sortBy === 'price-high' ? 'price_desc' :
              sortBy === 'rating' ? 'rating' :
                sortBy === 'newest' ? 'newest' : 'newest',
          limit: 50
        };

        const response = await productService.filterProducts(filterParams);
        setFilteredProducts(response.data || []);
      } catch (error) {
        console.error('Error filtering products:', error);
        setFilteredProducts([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(filterProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, filters, sortBy, showAllProducts]);

  const featuredProducts = useMemo(() => products.slice(0, 6), [products]);
  const bestSellers = useMemo(() => products.filter(p => productService.getProductTags(p).some(tag => tag.toLowerCase().includes('best seller'))).slice(0, 6), [products]);
  const premiumProducts = useMemo(() => products.filter(p => p.price > 5000).sort((a, b) => b.price - a.price).slice(0, 6), [products]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-pink-100 to-purple-100">
          <div className="text-center">
            <LoadingSpinner size="lg" text="Loading beautiful dresses..." />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Hero and Categories */}
      <Hero />
      <Categories />
      <FeaturedProducts products={featuredProducts} />

      {/* Search & Filters (Fixed) */}
      {(searchQuery || showAllProducts || Object.values(filters).some(f => f !== 'All' && f !== 0 && f !== 25000)) && (
        <div className="flex flex-col lg:flex-row px-4 sm:px-6 lg:px-8 gap-4">
          {/* Filters Sidebar */}
          <FilterSidebar
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            filters={filters}
            onFilterChange={setFilters}
            categories={categories}
            brands={brands}
            colors={colors}
            // className="flex-shrink-0 lg:sticky lg:top-[120px] lg:h-[calc(100vh-120px)]"
          />

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Sticky Search & Sort */}
            <div className="sticky top-[120px] z-50 bg-white/95 backdrop-blur-sm shadow px-0 sm:px-4 py-2">
              <div className="flex flex-col sm:flex-row gap-2 mb-2 items-center">
                {/* Sort Dropdown on Left */}
                <div className="flex-shrink-0">
                  <SortDropdown value={sortBy} onChange={setSortBy} />
                </div>

                {/* Search Bar (flex-1 to take remaining space) */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>

                {/* Mobile Filter Button */}
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-pink-600 transition-colors"
                >
                  <Filter className="w-5 h-5" />
                  <span>Filters</span>
                </button>
              </div>

              {/* Results Count (optional below search for clarity) */}
              <p className="text-gray-600 mt-1">{filteredProducts.length} products found</p>
            </div>


            {/* Products Grid (Scrollable) */}
            <div className="flex-1 overflow-y-auto mt-2 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {isSearching
                ? [...Array(10)].map((_, index) => <ProductCardSkeleton key={index} />)
                : filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
            </div>

            {filteredProducts.length === 0 && !isSearching && (
              <div className="text-center py-16">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Show All Products Button */}
      {!showAllProducts && !searchQuery && Object.values(filters).every(f => f === 'All' || f === 0 || f === 25000) && (
        <section className="py-12 bg-white text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAllProducts(true)}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            View All Products
          </motion.button>
        </section>
      )}

      {/* Premium Collection Carousel */}
      {premiumProducts.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ProductCarousel products={premiumProducts} title="Premium Collection" />
          </div>
        </section>
      )}
    </div>
  );
}
