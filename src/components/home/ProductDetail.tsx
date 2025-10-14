import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { productService } from "../products/ProductService";
import { Product, ProductVariant } from "../types/product";
import { RatingStars } from "../RatingStars";
import { ProductCarousel } from "../ProductCarousel";
import { ShareModal } from "../ShareModal";
import { useCart, CartItem } from "../../contexts/CartContext";
import { LoadingSpinner } from "../ui/LoadingSpinner";

interface UserRating {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string;
  media?: { type: "image" | "video"; url: string }[];
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    name: string;
  };
}



export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied">("idle");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
const [reviewImages, setReviewImages] = useState<File[]>([]);
  const [userRating, setUserRating] = useState<number>(0);
  const [userComment, setUserComment] = useState<string>("");
  const [allRatings, setAllRatings] = useState<UserRating[]>([]);
const [previewMedia, setPreviewMedia] = useState<{ url: string; type: "image" | "video" } | null>(null);

useEffect(() => {
  if (id) {
    loadProduct(id);
    loadRatings(id);
  }
}, [id]);

useEffect(() => {
  if (product?.id) {
    loadRatings(product.id);
  }
}, [product]);


  const getAvailableSizesForVariant = (variant: ProductVariant, productData: Product) => {
    if (variant.size && typeof variant.size === "string") {
      const sizes = productService.parseJsonString(variant.size);
      return Array.isArray(sizes) ? sizes : [];
    }
    return productService.getProductSizes(productData);
  };

const loadProduct = async (productId: string) => {
    try {
        setIsLoading(true);
        setError(null);

        const productData = await productService.getProductById(productId);

        setProduct(productData);

        if (productData.variants && productData.variants.length > 0) {
            const firstVariant = productData.variants[0];
            setSelectedVariant(firstVariant);

            const sizes = getAvailableSizesForVariant(firstVariant, productData);
            if (sizes.length > 0) setSelectedSize(sizes[0]);
        }

        // Reviews now come with productData
        setAllRatings(productData.reviews || []);

        const allProducts = await productService.getAllProducts();
        const related = allProducts
            .filter(
                (p) =>
                    p.main_category === productData.main_category &&
                    p.id !== productData.id
            )
            .slice(0, 6);

        setRelatedProducts(related);
    } catch (error) {
        console.error("Error loading product:", error);
        setError("Failed to load product details. Please try again later.");
    } finally {
        setIsLoading(false);
    }
};


const loadRatings = async (productId: string) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/products/${productId}/reviews`
    );
    if (!res.ok) throw new Error("Failed to load reviews");
    const data = await res.json();
    setAllRatings(data);
  } catch (err) {
    console.error(err);
  }
};


  // const saveRatings = (productId: string, ratings: UserRating[]) => {
  //   localStorage.setItem(`ratings_${productId}`, JSON.stringify(ratings));
  // };

const submitReview = async () => {
  if (!product) return;
  const loggedInUser = localStorage.getItem("loggedInUser");
  if (!loggedInUser) {
    alert("Please log in to submit a review");
    return;
  }

  const user = JSON.parse(loggedInUser);
  const token = user?.token;
  if (!token) {
    alert("Invalid login session. Please login again.");
    return;
  }

  const formData = new FormData();
  formData.append("user_id", user.id);
  formData.append("product_id", product.id);
  formData.append("rating", String(userRating));
  formData.append("comment", userComment);

  // ✅ Correct field name for files
  reviewImages.forEach((file) => {
    formData.append("images", file);
  });

  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/products/${product.id}/review`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to submit review: ${errorText}`);
    }

    const data = await res.json();
    console.log("Review submitted successfully:", data);

    setUserRating(0);
    setUserComment("");
    setReviewImages([]);
    loadRatings(product.id);
  } catch (err) {
    console.error("Submit review error:", err);
    alert(err instanceof Error ? err.message : String(err));
  }
};











  const handleAddRating = () => {
    submitReview();
  };

const getAverageRating = () => {
  if (allRatings.length === 0) return product?.average_rating || 0;
  const total = allRatings.reduce((sum, r) => sum + r.rating, 0);
  return total / allRatings.length;
};


  const currentPrice = selectedVariant?.price || product?.price || 0;
  const originalPrice = selectedVariant?.original_price || product?.original_price || 0;
  const discountPercentage = selectedVariant?.discount_percentage || product?.discount_percentage || 0;
  const stock = selectedVariant?.stock || product?.stock || 0;
const productSizes = product ? productService.getProductSizes(product) : [];

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      id: crypto.randomUUID(),
      product_id: product!.id,
      product_variant_id: selectedVariant?.id || "default",
      quantity: 1,
      name: product!.name,
      price: currentPrice || product!.price || 0,
      image_url: selectedVariant?.images?.[0] || product!.images[0] || "/default-product.png",
      color: selectedVariant?.color || "Default",
      size: selectedSize || productSizes[0] || "Standard",
    };
    addItem(cartItem);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    const sizes = getAvailableSizesForVariant(variant, product!);
    if (sizes.length > 0) {
      setSelectedSize(sizes[0]);
    } else {
      setSelectedSize("");
    }
  };

  const getAvailableSizes = () => {
    if (selectedVariant?.size && typeof selectedVariant.size === "string") {
      const sizes = productService.parseJsonString(selectedVariant.size);
      return Array.isArray(sizes) ? sizes : [];
    }
    return productSizes;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <LoadingSpinner size="lg" text="Loading product details..." />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || "Product not found"}
          </h2>
          <button
            onClick={() => navigate("/")}
            className="text-pink-600 hover:text-pink-700 font-medium"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
          <button onClick={() => navigate("/")} className="hover:text-pink-600">
            Home
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="hover:text-pink-600 cursor-pointer">
            {product.main_category}
          </span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 truncate">{product.name}</span>
        </nav>
      </div>

      {/* Product Info */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <motion.div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {product.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button key={index} onClick={() => setSelectedImageIndex(index)}>
                  <img
                    src={image}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-lg text-gray-600">{product.brand}</p>

          <div className="flex items-center space-x-4">
            <RatingStars rating={getAverageRating()} size="md" showCount reviewCount={allRatings.length} />
            <span className="text-sm text-gray-500">{stock} in stock</span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold">
              ₹{currentPrice.toLocaleString()}
            </span>
            {originalPrice && originalPrice > currentPrice && (
              <>
                <span className="text-xl text-gray-500 line-through">
                  ₹{originalPrice.toLocaleString()}
                </span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                  {discountPercentage}% OFF
                </span>
              </>
            )}
          </div>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div>
              <h3 className="font-semibold">Color</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => handleVariantChange(variant)}
                    className={`px-4 py-2 border rounded-lg ${
                      selectedVariant?.id === variant.id
                        ? "border-pink-600 bg-pink-50"
                        : "border-gray-300"
                    }`}
                  >
                    {variant.color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {getAvailableSizes().length > 0 && (
            <div>
              <h3 className="font-semibold">Size</h3>
              <div className="flex flex-wrap gap-2">
                {getAvailableSizes().map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-lg ${
                      selectedSize === size
                        ? "border-pink-600 bg-pink-50"
                        : "border-gray-300"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={stock === 0}
              className="flex-1 bg-pink-600 text-white py-3 px-6 rounded-lg"
            >
              Add to Cart
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBuyNow}
              disabled={stock === 0}
              className="flex-1 bg-orange-600 text-white py-3 px-6 rounded-lg"
            >
              Buy Now
            </motion.button>
          </div>

          {/* Share Modal Trigger */}
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Share Product
          </button>
        </div>
      </div>

      {/* Reviews */}
{/* Reviews */}
<div className="max-w-7xl mx-auto px-4 py-8 border-t">
  <h3 className="text-2xl font-bold mb-4">Leave a Review</h3>

  {/* Rating Selector */}
  <div className="flex items-center space-x-2 mb-2">
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={`cursor-pointer text-2xl ${
          star <= userRating ? "text-yellow-400" : "text-gray-300"
        }`}
        onClick={() => setUserRating(star)}
      >
        ★
      </span>
    ))}
    <span className="ml-2 text-sm text-gray-500">
      {userRating ? `${userRating} Stars` : ""}
    </span>
  </div>

  {/* Review Comment Input */}
  <textarea
    className="w-full border rounded p-2 mb-2"
    placeholder="Write your review..."
    value={userComment}
    onChange={(e) => setUserComment(e.target.value)}
  />

  {/* Image Upload */}
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Upload Images (optional)
    </label>
<input
  type="file"
  multiple
  accept="image/*,video/*"
  onChange={(e) => {
    if (e.target.files) {
      setReviewImages(Array.from(e.target.files));
    }
  }}
  className="border p-2 rounded w-full"
/>

    {reviewImages.length > 0 && (
      <div className="flex space-x-2 mt-2 overflow-x-auto">
        {reviewImages.map((file, idx) => (
          <img
            key={idx}
            src={URL.createObjectURL(file)}
            alt="preview"
            className="w-16 h-16 object-cover rounded"
          />
        ))}
      </div>
    )}
  </div>

  {/* Submit Review Button */}
  <button
    onClick={handleAddRating}
    className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
  >
    Submit Review
  </button>

  {/* Divider */}
  <hr className="my-6" />

  {/* Existing Reviews */}
{allRatings.length > 0 ? (
  <div className="mt-4">
    <h4 className="text-lg font-semibold">User Reviews ({allRatings.length})</h4>

    {/* Average Rating */}
    <div className="flex items-center mb-4">
      <RatingStars
        rating={getAverageRating()}
        showCount
        reviewCount={allRatings.length}
      />
      <span className="ml-2 text-sm text-gray-500">
        Average rating: {getAverageRating().toFixed(1)} / 5
      </span>
    </div>

    {/* Review List */}
    <div className="space-y-4">
      {allRatings.map((r, i) => (
        <div key={i} className="border-t py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <strong className="text-sm">{r.user?.name || "Anonymous"}</strong>
              <RatingStars rating={r.rating} size="sm" />
            </div>
            <span className="text-xs text-gray-400">
              {new Date(r.created_at).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm text-gray-700 mt-1">{r.comment}</p>

          {/* Show review media */}
          {r.media && r.media.length > 0 && (
            <div className="flex space-x-2 mt-2 overflow-x-auto">
              {r.media.map((m, idx) => (
                <div key={idx} className="relative">
                  {m.type === "video" ? (
                    <video
                      src={m.url}
                      className="w-20 h-20 object-cover rounded cursor-pointer hover:opacity-80"
                      onClick={() => setPreviewMedia({ url: m.url, type: "video" })}
                      muted
                      loop
                    />
                  ) : (
                    <img
                      src={m.url}
                      alt={`review-media-${idx}`}
                      className="w-20 h-20 object-cover rounded cursor-pointer hover:opacity-80"
                      onClick={() => setPreviewMedia({ url: m.url, type: "image" })}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
) : (
  <p className="text-sm text-gray-500 mt-4">No reviews yet. Be the first to review!</p>
)}


{previewMedia && (
  <div
    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
    onClick={() => setPreviewMedia(null)}
  >
    {previewMedia.type === "image" ? (
      <img
        src={previewMedia.url}
        alt="Preview"
        className="max-w-[90%] max-h-[90%] object-contain rounded-lg shadow-lg"
      />
    ) : (
      <video
        src={previewMedia.url}
        controls
        autoPlay
        className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg"
      />
    )}
    <button
      onClick={() => setPreviewMedia(null)}
      className="absolute top-5 right-5 text-white text-2xl font-bold"
    >
      &times;
    </button>
  </div>
)}


</div>


      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16 border-t">
          <ProductCarousel
            products={relatedProducts}
            title="You might also like"
            autoScroll={false}
          />
        </section>
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        product={{
          title: product!.name,
          price: currentPrice,
          image: product!.images[0] || "/default-product.png",
        }}
        productUrl={window.location.href}
        onCopySuccess={() => setCopyStatus("copied")}
        copyStatus={copyStatus}
      />
    </div>
  );
}
