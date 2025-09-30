import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter } from 'lucide-react';
import { categories, colors, brands } from './data/products';

interface FilterState {
  category: string;
  color: string;
  brand: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
}

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export function FilterSidebar({ isOpen, onClose, filters, onFilterChange }: FilterSidebarProps) {
  const handleFilterChange = (key: keyof FilterState, value: string | number) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      category: 'All',
      color: 'All',
      brand: 'All',
      minPrice: 0,
      maxPrice: 25000,
      minRating: 0,
    });
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-pink-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        <button
          onClick={clearFilters}
          className="text-sm text-pink-600 hover:text-pink-700 font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Category</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                value={category}
                checked={filters.category === category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="text-pink-600 focus:ring-pink-500"
              />
              <span className="text-sm text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Min Price</label>
            <input
              type="range"
              min="0"
              max="25000"
              step="500"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', parseInt(e.target.value))}
              className="w-full accent-pink-600"
            />
            <span className="text-sm text-gray-600">₹{filters.minPrice.toLocaleString()}</span>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Max Price</label>
            <input
              type="range"
              min="0"
              max="25000"
              step="500"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value))}
              className="w-full accent-pink-600"
            />
            <span className="text-sm text-gray-600">₹{filters.maxPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Rating</h4>
        <div className="space-y-2">
          {[4, 3, 2, 1, 0].map((rating) => (
            <label key={rating} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="rating"
                value={rating}
                checked={filters.minRating === rating}
                onChange={(e) => handleFilterChange('minRating', parseInt(e.target.value))}
                className="text-pink-600 focus:ring-pink-500"
              />
              <span className="text-sm text-gray-700">
                {rating === 0 ? 'All Ratings' : `${rating}★ & up`}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Color Filter */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Color</h4>
        <div className="space-y-2">
          {colors.map((color) => (
            <label key={color} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="color"
                value={color}
                checked={filters.color === color}
                onChange={(e) => handleFilterChange('color', e.target.value)}
                className="text-pink-600 focus:ring-pink-500"
              />
              <span className="text-sm text-gray-700">{color}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Brand</h4>
        <div className="space-y-2">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="brand"
                value={brand}
                checked={filters.brand === brand}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
                className="text-pink-600 focus:ring-pink-500"
              />
              <span className="text-sm text-gray-700">{brand}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 bg-white border-r border-gray-200 h-full overflow-y-auto">
        <div className="p-6">
          <FilterContent />
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={onClose}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <FilterContent />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}