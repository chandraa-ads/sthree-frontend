import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RatingStars } from "./RatingStars";
import { useCart } from "../contexts/CartContext";
import { productService } from "./products/ProductService";
import { Product, ProductVariant as ProductVariantType } from "./types/product";
import { addToCart } from "./services/cartService"; // ✅ added import

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
  const [previewMedia, setPreviewMedia] = useState<{ url: string; type: "image" | "video" } | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);



  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loggedUser, setLoggedUser] = useState<any>(null);


  const [user, setUser] = useState<{ id: string; token: string } | null>(null);


  // Get logged in user once
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser") || "null");
    setUser(storedUser);
  }, []);

  // Check wishlist for this product and user
  // Get wishlist status from wishlist table
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








  // 🖼️ Get correct images
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

  // ⭐ Calculate average rating
  const calculateAverageRating = (reviews: UserRating[]) => {
    if (!reviews.length) return 0;
    const total = reviews.reduce((sum, r) => sum + (r.rating ?? 0), 0);
    return parseFloat((total / reviews.length).toFixed(1));
  };

  // 🧮 Dynamic stock update based on cart
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

  // ⭐ Fetch average rating
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

  // 🧭 Navigate to product detail
  const handleCardClick = () => {
    if (!product?.id) return;
    window.scrollTo(0, 0);
    navigate(`/product/${product.id}`);
  };

  // 🛒 Add to cart (with login check)
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

  // Pick size & color
  const variantSizes = selectedVariant?.size ? JSON.parse(selectedVariant.size) : [];
  const productSizes =
    (!variantSizes.length && product?.variants?.[0]?.size)
      ? JSON.parse(product.variants[0].size)
      : [];
  const selectedSize = variantSizes[0] || productSizes[0] || "";
  const productColors = product.variants?.map(v => v.color).filter(Boolean) || [];
  const selectedColor = selectedVariant?.color || productColors[0] || "Default";

  // Build cart item
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
    await addItem(cartItem as any); // Context will handle add/increment
    openCartDrawer(); // Open cart drawer after adding
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
      whileHover={{ y: -8, scale: 1.02 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer group"
      onClick={handleCardClick}
    >
      {/* Product Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={selectedImageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {discountPercentage > 0 && (
          <div className="absolute top-3 left-3">
            <span className="inline-block px-2 py-1 bg-red-600 text-white text-xs font-medium rounded-full">
              {discountPercentage}% OFF
            </span>
          </div>
        )}

        {productTags.length > 0 && (
          <div className="absolute top-3 right-3 space-y-1">
            {productTags.slice(0, 2).map((tag, idx) => (
              <span
                key={idx}
                className="block px-2 py-1 bg-pink-600 text-white text-xs font-medium rounded-full"
              >
                {tag}
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
          <Heart
            className={`w-4 h-4 transition-colors duration-300 ${isWishlisted ? "text-red-500 fill-red-500" : "text-gray-600 hover:text-pink-600"
              }`}
          />
        </motion.button>



        {/* Quick Add Button */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            disabled={availableStock <= 0}
            className="w-full bg-pink-600 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{availableStock <= 0 ? "Out of Stock" : "Quick Add"}</span>
          </motion.button>
        </div>
      </div>

      {/* Reviews */}
      <div className="px-4 pt-2">
        <div className="flex items-center space-x-2">
          <RatingStars rating={averageRating} size="sm" />
          <span className="text-xs text-gray-500">
            {averageRating.toFixed(1)} ({reviewCount} review
            {reviewCount !== 1 ? "s" : ""})
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600">{product.brand}</p>
        </div>

        {/* Price & Stock */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              ₹{(selectedVariant?.price || product.price).toLocaleString()}
            </span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product.original_price.toLocaleString()}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500">
            {availableStock} in stock
          </span>
        </div>

        {/* Category */}
        <div className="mt-2 flex items-center justify-between">
          <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            {product.main_category || "Category"}
          </span>
          {product.sub_category && (
            <span className="text-xs text-gray-500">{product.sub_category}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
