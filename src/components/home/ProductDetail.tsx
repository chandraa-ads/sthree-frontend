import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronRight, 
  Heart, 
  Share2, 
  ShoppingCart, 
  Truck, 
  Shield, 
  RotateCcw,

} from 'lucide-react';
// import { products } from '../data/products';
// import { RatingStars } from '../components/RatingStars';
// import { ProductCarousel } from '../components/ProductCarousel';
// import { useCart } from '../contexts/CartContext';
import { products } from '../data/products';
import { RatingStars } from '../RatingStars';
import { ProductCarousel } from '../ProductCarousel';
import { useCart } from '../../contexts/CartContext';

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <button
            onClick={() => navigate('/')}
            className="text-pink-600 hover:text-pink-700 font-medium"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 6);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.title,
      price: product.price,
      image_url: product.image,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // Navigate to checkout or cart
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
          <button onClick={() => navigate('/')} className="hover:text-pink-600">
            Home
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="hover:text-pink-600 cursor-pointer">{product.category}</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 truncate">{product.title}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-square overflow-hidden rounded-lg bg-gray-100"
            >
              <img
                src={product.images[selectedImageIndex]}
                alt={product.title}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500 cursor-zoom-in"
              />
            </motion.div>

            {/* Image Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-none w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImageIndex === index
                        ? 'border-pink-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and Brand */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.title}
              </h1>
              <p className="text-lg text-gray-600">{product.brand}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-4">
              <RatingStars 
                rating={product.rating} 
                size="md" 
                showCount 
                reviewCount={product.reviewCount} 
              />
              <span className="text-sm text-gray-500">
                {product.soldCount}+ bought in past month
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-gray-900">
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Badges */}
            {product.badges && product.badges.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.badges.map((badge, index) => (
                  <span
                    key={index}
                    className="inline-block px-3 py-1 bg-pink-100 text-pink-800 text-sm font-medium rounded-full"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900">Fabric</h4>
                <p className="text-gray-600">{product.fabric}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Origin</h4>
                <p className="text-gray-600">{product.origin}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Size</h4>
                <p className="text-gray-600">{product.size}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Care</h4>
                <p className="text-gray-600">{product.care}</p>
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-pink-600 rounded-full" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="flex-1 bg-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-pink-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBuyNow}
                  className="flex-1 bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                >
                  Buy Now
                </motion.button>
              </div>

              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${
                    isWishlisted
                      ? 'border-pink-600 text-pink-600 bg-pink-50'
                      : 'border-gray-300 text-gray-700 hover:border-pink-600 hover:text-pink-600'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  <span>Wishlist</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-pink-600 hover:text-pink-600 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </motion.button>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="border-t pt-6 space-y-4">
              <div className="flex items-center space-x-3">
                <Truck className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Free Delivery</p>
                  <p className="text-sm text-gray-600">Delivered in 3-5 business days</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Secure Payment</p>
                  <p className="text-sm text-gray-600">100% secure payment methods</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <RotateCcw className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="font-medium text-gray-900">Easy Returns</p>
                  <p className="text-sm text-gray-600">7-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t">
          <ProductCarousel 
            products={relatedProducts} 
            title="You might also like" 
            autoScroll={false}
          />
        </section>
      )}
    </div>
  );
}