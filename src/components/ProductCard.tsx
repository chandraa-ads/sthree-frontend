import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RatingStars } from "./RatingStars";
import { useCart } from "../contexts/CartContext";
import { productService } from "./products/ProductService";
import { Product, ProductVariant as ProductVariantType } from "./types/product";
import { addToCart } from "./services/cartService";

interface ProductCardProps {
  product: Product;
  index?: number;
}

interface UserRating {
  id: string;
  user: string;
  rating: number;
  comment: string;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const navigate = useNavigate();
  const { addItem, cartItems, openCartDrawer } = useCart();

  const firstVariant = product?.variants?.[0] || null;
  const [selectedVariant] = useState<ProductVariantType | null>(firstVariant);
  const [reviews, setReviews] = useState<UserRating[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [availableStock, setAvailableStock] = useState(product.stock || 0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [user, setUser] = useState<{ id: string; token: string } | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  // Handle resize for mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Get logged in user
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser") || "null");
    setUser(storedUser);
  }, []);

  // Fetch wishlist status
  useEffect(() => {
    const fetchWishlistStatus = async () => {
      if (!user?.id || !product?.id) return;
      try {
        const data = await productService.isProductWishlisted(product.id, user.id);
        setIsWishlisted(data.wishlisted);
      } catch (err) {
        console.error("Failed to fetch wishlist status", err);
        setIsWishlisted(false);
      }
    };
    fetchWishlistStatus();
  }, [user?.id, product?.id]);

  // Toggle wishlist
  const handleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user?.id) {
      alert("🔒 Please log in to manage your wishlist.");
      return;
    }
    try {
      const data = await productService.toggleWishlist(product.id, user.id);
      setIsWishlisted(data.wishlist);
    } catch (err) {
      console.error("Failed to toggle wishlist", err);
      alert("❌ Failed to update wishlist.");
    }
  };

  // Get displayed images
  const getDisplayedImages = (): string[] => {
    if (selectedVariant?.images?.length) {
      return selectedVariant.images.map((img) =>
        typeof img === "string" ? img : img.url || ""
      );
    }
    if (product?.images?.length) {
      return product.images.map((img) =>
        typeof img === "string" ? img : img.url || ""
      );
    }
    return ["/default-product.png"];
  };

  const displayedImages = getDisplayedImages();
  const selectedImageUrl = displayedImages[selectedImageIndex] || displayedImages[0];

  // Calculate average rating
  const calculateAverageRating = (reviews: UserRating[]) => {
    if (!reviews.length) return 0;
    const total = reviews.reduce((sum, r) => sum + (r.rating ?? 0), 0);
    return parseFloat((total / reviews.length).toFixed(1));
  };

  // Update available stock based on cart
  useEffect(() => {
    const variantStock = selectedVariant?.stock ?? product.stock ?? 0;
    const cartQuantity = cartItems
      .filter(
        (item) =>
          item.product_id === product.id &&
          item.product_variant_id === selectedVariant?.id
      )
      .reduce((sum, i) => sum + i.quantity, 0);

    setAvailableStock(variantStock - cartQuantity);
  }, [cartItems, product, selectedVariant]);

  // Fetch average rating
  useEffect(() => {
    const fetchAverageRating = async () => {
      try {
        const data = await productService.getAverageRating(product.id);
        if (data) {
          setAverageRating(data.average || 0);
          setReviewCount(data.count || 0);
        }
      } catch (error) {
        console.error("Error fetching average rating:", error);
      }
    };
    if (product?.id) fetchAverageRating();
  }, [product?.id]);

  useEffect(() => {
    setAverageRating(calculateAverageRating(reviews));
  }, [reviews]);

  // Navigate to product detail
  const handleCardClick = () => {
    if (!product?.id) return;
    window.scrollTo(0, 0);
    navigate(`/product/${product.id}`);
  };



  // Add this function inside ProductCard
const handleBuyNow = async (e: React.MouseEvent) => {
  e.stopPropagation();
  if (!product) return;
  if (availableStock <= 0) {
    alert("⚠️ Out of stock");
    return;
  }

  const loggedUser = JSON.parse(localStorage.getItem("loggedInUser") || "null");
  if (!loggedUser?.id) {
    alert("🔒 Please log in");
    return;
  }

  const variantSizes = selectedVariant?.size ? JSON.parse(selectedVariant.size) : [];
  const productSizes =
    (!variantSizes.length && product?.variants?.[0]?.size)
      ? JSON.parse(product.variants[0].size)
      : [];
  const selectedSize = variantSizes[0] || productSizes[0] || "";
  const productColors = product.variants?.map(v => v.color).filter(Boolean) || [];
  const selectedColor = selectedVariant?.color || productColors[0] || "Default";

  const cartItem = {
    id: crypto.randomUUID(),
    product_id: product.id,
    product_variant_id: selectedVariant?.id || null,
    name: product.name,
    image_url: displayedImages[selectedImageIndex] || displayedImages[0],
    price: selectedVariant?.price || product.price,
    quantity: 1,
    color: selectedColor,
    size: selectedSize,
    variant_name: selectedVariant?.name || "",
  };

  try {
    await addItem(cartItem as any);
    navigate("/checkout"); // Go directly to checkout
  } catch (err) {
    console.error("Failed to buy now:", err);
    alert("❌ Failed to process Buy Now. Refresh to try again.");
  }
};

  // Add to cart
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product) return;
    if (availableStock <= 0) {
      alert("⚠️ Out of stock");
      return;
    }
    const loggedUser = JSON.parse(localStorage.getItem("loggedInUser") || "null");
    if (!loggedUser?.id) {
      alert("🔒 Please log in");
      return;
    }

    const variantSizes = selectedVariant?.size ? JSON.parse(selectedVariant.size) : [];
    const productSizes =
      (!variantSizes.length && product?.variants?.[0]?.size)
        ? JSON.parse(product.variants[0].size)
        : [];
    const selectedSize = variantSizes[0] || productSizes[0] || "";
    const productColors = product.variants?.map(v => v.color).filter(Boolean) || [];
    const selectedColor = selectedVariant?.color || productColors[0] || "Default";

    const cartItem = {
      id: crypto.randomUUID(),
      product_id: product.id,
      product_variant_id: selectedVariant?.id || null,
      name: product.name,
      image_url: displayedImages[selectedImageIndex] || displayedImages[0],
      price: selectedVariant?.price || product.price,
      quantity: 1,
      color: selectedColor,
      size: selectedSize,
      variant_name: selectedVariant?.name || "",
    };

    try {
      await addItem(cartItem as any);
      openCartDrawer();
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert("❌ Failed to add to cart. Refresh to try again.");
    }
  };

  const productTags = productService.getProductTags(product || ({} as Product));
  const discountPercentage = product?.discount_percentage || 0;

  if (!product) return null;

  return (
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: index * 0.1 }}
  whileHover={!isMobile ? { y: -8, scale: 1.02 } : {}}
  className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer group"
  onClick={handleCardClick}
>
  {/* Product Image */}
  <div className="relative aspect-[3/4] overflow-hidden">
    <img
      src={selectedImageUrl}
      alt={product.name}
      className={`w-full h-full object-cover transition-transform duration-500 ${!isMobile ? 'group-hover:scale-110' : ''} sm:h-auto h-[200px]`}
    />

    {/* Discount */}
    {discountPercentage > 0 && (
      <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
        <span className="inline-block px-1.5 py-0.5 sm:px-2 sm:py-1 bg-red-600 text-white text-[10px] sm:text-xs font-medium rounded-full">
          {discountPercentage}% OFF
        </span>
      </div>
    )}

    {/* Product Tags */}
    {productTags.length > 0 && (
      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 space-y-1">
        {productTags.slice(0, 2).map((tag, idx) => (
          <span
            key={idx}
            className="block px-1.5 py-0.5 sm:px-2 sm:py-1 bg-pink-600 text-white text-[10px] sm:text-xs font-medium rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    )}

    {/* Wishlist Button (only hover on desktop) */}
    {/* Wishlist Button */}
{!isMobile ? (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={handleWishlist}
    className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
  >
    <Heart
      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors duration-300 ${
        isWishlisted ? "text-red-500 fill-red-500" : "text-gray-600 hover:text-pink-600"
      }`}
    />
  </motion.button>
) : (
  <button
    onClick={(e) => { e.stopPropagation(); handleWishlist(e); }}
    className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg"
  >
    <Heart
      className={`w-4 h-4 transition-colors duration-300 ${
        isWishlisted ? "text-red-500 fill-red-500" : "text-gray-600"
      }`}
    />
  </button>
)}


    {/* Quick Add Button (only hover on desktop) */}
    {!isMobile && (
    <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-between space-x-2">
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={handleAddToCart}
    disabled={availableStock <= 0}
    className="bg-pink-600 text-white py-1.5 px-3 rounded-md font-medium flex items-center justify-center space-x-1 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm flex-1 mr-1"
  >
    <ShoppingCart className="w-4 h-4" />
    <span>{availableStock <= 0 ? "Out of Stock" : "Quick Add"}</span>
  </motion.button>

  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={handleBuyNow}
    disabled={availableStock <= 0}
    className="bg-green-600 text-white py-1.5 px-3 rounded-md font-medium flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm flex-1 ml-1"
  >
    <span>Buy Now</span>
  </motion.button>
</div>



    )}
  </div>
  {/* Reviews */}
  <div className="px-2 sm:px-3 pt-1">
    <div className="flex items-center space-x-1">
      <RatingStars
        rating={averageRating}
        size={isMobile ? "sm" : "md"}
        showCount
        reviewCount={reviewCount}
      />
      <span className="text-[9px] sm:text-[10px] text-gray-500 leading-none">
        {averageRating.toFixed(1)} ({reviewCount} review{reviewCount !== 1 ? "s" : ""})
      </span>
    </div>
  </div>

  {/* Product Info */}
  <div className="p-3 sm:p-4">
    <div className="mb-1 sm:mb-2">
      <h3 className="font-semibold text-gray-900 line-clamp-2 mb-0.5 sm:mb-1 text-sm sm:text-base">
        {product.name}
      </h3>
      <p className="text-[11px] sm:text-sm text-gray-600">{product.brand}</p>
    </div>

    {/* Price & Stock */}
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-1 sm:space-x-2">
        <span className="text-base sm:text-lg font-bold text-gray-900">
          ₹{(selectedVariant?.price || product.price).toLocaleString()}
        </span>
        {product.original_price && product.original_price > product.price && (
          <span className="text-[11px] sm:text-sm text-gray-500 line-through">
            ₹{product.original_price.toLocaleString()}
          </span>
        )}
      </div>
      <span className="text-[10px] sm:text-xs text-gray-500">
        {availableStock} stock
      </span>
    </div>

    {/* Category */}
    <div className="mt-1.5 sm:mt-2 flex items-center justify-between">
      <span className="inline-block px-1.5 py-0.5 sm:px-2 sm:py-1 bg-green-100 text-green-800 text-[10px] sm:text-xs font-medium rounded-full">
        {product.main_category || "Category"}
      </span>
      {product.sub_category && (
        <span className="text-[10px] sm:text-xs text-gray-500">
          {product.sub_category}
        </span>
      )}
    </div>

    {/* Quick Add button visible on mobile without hover */}
    {isMobile && (
  <div className="mt-2 flex space-x-1 justify-center">
    <button
      onClick={handleAddToCart}
      disabled={availableStock <= 0}
      className="w-24 bg-pink-600 text-white py-1 px-2 rounded-md font-medium flex items-center justify-center space-x-1 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-xs"
    >
      <ShoppingCart className="w-3 h-3" />
      <span>{availableStock <= 0 ? "Out of Stock" : "Add"}</span>
    </button>
    <button
      onClick={handleBuyNow}
      disabled={availableStock <= 0}
      className="w-20 bg-green-600 text-white py-1 px-2 rounded-md font-medium flex items-center justify-center space-x-1 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-xs"
    >
      <span>Buy</span>
    </button>
  </div>
)}



  </div>
</motion.div>

  );
}
