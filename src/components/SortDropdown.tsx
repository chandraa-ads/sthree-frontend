import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export type SortOption = 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const sortOptions = [
  { value: 'featured' as SortOption, label: 'Featured' },
  { value: 'price-low' as SortOption, label: 'Price: Low to High' },
  { value: 'price-high' as SortOption, label: 'Price: High to Low' },
  { value: 'rating' as SortOption, label: 'Customer Rating' },
  { value: 'newest' as SortOption, label: 'Newest First' },
];

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = sortOptions.find(option => option.value === value);

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-pink-600 transition-colors"
      >
        <span className="text-sm font-medium text-gray-700">
          Sort by: {selectedOption?.label}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10"
          >
            {sortOptions.map((option) => (
              <motion.button
                key={option.value}
                whileHover={{ backgroundColor: '#fdf2f8' }}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                  value === option.value
                    ? 'text-pink-600 bg-pink-50'
                    : 'text-gray-700 hover:text-pink-600'
                }`}
              >
                {option.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}