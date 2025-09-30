import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// import { Product } from '../data/products';
import { Product } from './data/products';
import { RatingStars } from './RatingStars';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const navigate = useNavigate();
  const { addItem } = useCart();

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.title,
      price: product.price,
      image_url: product.image,
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Handle wishlist logic here
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer group"
      onClick={handleCardClick}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Badges */}
        {product.badges && product.badges.length > 0 && (
          <div className="absolute top-3 left-3 space-y-1">
            {product.badges.map((badge, idx) => (
              <span
                key={idx}
                className="inline-block px-2 py-1 bg-pink-600 text-white text-xs font-medium rounded-full"
              >
                {badge}
              </span>
            ))}
          </div>
        )}

        {/* Wishlist Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleWishlist}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <Heart className="w-4 h-4 text-gray-600 hover:text-pink-600" />
        </motion.button>

        {/* Quick Add Button */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            className="w-full bg-pink-600 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 shadow-lg"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Quick Add</span>
          </motion.button>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
            {product.title}
          </h3>
          <p className="text-sm text-gray-600">{product.brand}</p>
        </div>

        <div className="mb-3">
          <RatingStars rating={product.rating} showCount reviewCount={product.reviewCount} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500">
            {product.soldCount}+ sold
          </span>
        </div>

        <div className="mt-2">
          <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            {product.category}
          </span>
        </div>
      </div>
    </motion.div>
  );
}