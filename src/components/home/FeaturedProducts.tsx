import React from 'react'
import { motion } from 'framer-motion'
import { ProductCard } from '../products/ProductCard'

// Mock data for featured products
const featuredProducts = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    price: 299.99,
    image_url: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=500',
    rating: 4.8,
    category: 'Electronics',
    brand: 'AudioTech'
  },
  {
    id: '2',
    name: 'Minimalist Watch Collection',
    price: 199.99,
    image_url: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=500',
    rating: 4.9,
    category: 'Accessories',
    brand: 'TimeFlow'
  },
  {
    id: '3',
    name: 'Organic Cotton T-Shirt',
    price: 49.99,
    image_url: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=500',
    rating: 4.7,
    category: 'Clothing',
    brand: 'EcoWear'
  },
  {
    id: '4',
    name: 'Smart Fitness Tracker',
    price: 149.99,
    image_url: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=500',
    rating: 4.6,
    category: 'Electronics',
    brand: 'FitTech'
  },
  {
    id: '5',
    name: 'Leather Crossbody Bag',
    price: 129.99,
    image_url: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=500',
    rating: 4.8,
    category: 'Accessories',
    brand: 'CraftLeather'
  },
  {
    id: '6',
    name: 'Wireless Charging Pad',
    price: 39.99,
    image_url: 'https://images.pexels.com/photos/4219654/pexels-photo-4219654.jpeg?auto=compress&cs=tinysrgb&w=500',
    rating: 4.5,
    category: 'Electronics',
    brand: 'ChargeTech'
  }
]

export function FeaturedProducts() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium products that combine quality, 
            style, and innovation.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <button className="inline-flex items-center px-8 py-3 border border-coral text-coral hover:bg-coral hover:text-white transition-all duration-300 rounded-lg font-medium">
            View All Products
          </button>
        </motion.div>
      </div>
    </section>
  )
}