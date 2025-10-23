import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { ProductCard } from "../ProductCard";
import { Product } from "../types/product";

interface FeaturedProductsProps {
  products: Product[];
  category?: string; // optional category name
}

export function FeaturedProducts({ products, category }: FeaturedProductsProps) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-bold text-gray-800">
          No products found {category ? `in "${category}"` : ""}.
        </h2>
      </div>
    );
  }

  return (
    // <section className="py-20 bg-gradient-to-br from-gray-50 to-pink-50/30">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >


        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {category ? category.toUpperCase() : "Featured"}
          <span className="block bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            {category ? " Collection" : " Masterpieces"}
          </span>
        </h2>

        <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-pink-200 mb-6">
          <Sparkles className="w-4 h-4 text-pink-600" />
          <span className="text-sm font-medium text-gray-700">
            Handpicked Collection
          </span>
        </div>

        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          {category
            ? `Discover our curated selection of ${category.toLowerCase()}, each piece carefully chosen for its exceptional quality, timeless design, and cultural significance.`
            : "Explore our beautiful collections, each one specially selected for its high quality, elegant design, and cultural value."}
        </p>


      </motion.div>

      {/* Products Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="
    grid 
    grid-cols-2          /* ✅ 2 per row on mobile */
    sm:grid-cols-2       /* ✅ still 2 on small tablets */
    md:grid-cols-3       /* ✅ 3 per row on medium screens */
    lg:grid-cols-4       /* ✅ 4 per row on large screens */
    gap-3 sm:gap-4 md:gap-6 lg:gap-8  /* ✅ responsive spacing */
    mb-8 sm:mb-10 md:mb-12
    px-2 sm:px-4         /* ✅ smaller horizontal padding on mobile */
  "
      >
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="flex justify-center"
          >
            <div className="w-[95%] sm:w-[90%] md:w-[85%] lg:w-full">
              <ProductCard product={product} />
            </div>
          </motion.div>
        ))}
      </motion.div>


    </div>
    // </section>
  );
}
