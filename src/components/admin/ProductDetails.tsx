import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Share2 } from "lucide-react";
import { productService } from "../products/ProductService";
import { Product, ProductVariant } from "../types/product";
import { RatingStars } from "../RatingStars";
import { ProductCarousel } from "../ProductCarousel";
import { ShareModal } from "../ShareModal";
import { useCart, CartItem } from "../../contexts/CartContext";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { Heart } from "lucide-react";
import { Helmet } from "react-helmet-async";

interface UserRating {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string;
  media?: { type: "image" | "video"; url: string }[];
  created_at: string;
  updated_at: string;
  user: { id: string | null; name: string };
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
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; token: string } | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);


  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser") || "null");
    setUser(storedUser);
  }, []);

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

  const handleWishlistToggle = async () => {
    if (!user?.id) {
      alert("🔒 Please log in to manage your wishlist.");
      return;
    }

    try {
      const data = await productService.toggleWishlist(product!.id, user.id);
      setIsWishlisted(data.wishlist);
    } catch (err) {
      console.error("Failed to toggle wishlist", err);
      alert("❌ Failed to update wishlist.");
    }
  };


  useEffect(() => {
    if (id) {
      loadProduct(id);
      loadRatings(id);
    }
  }, [id]);

  // Load product
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

      // Always fetch reviews from API
      await loadRatings(productId);

      // Related products
      const allProducts = await productService.getAllProducts();
      const related = allProducts
        .filter(p => p.main_category === productData.main_category && p.id !== productData.id)
        .slice(0, 6);
      setRelatedProducts(related);
    } catch (err) {
      console.error("Error loading product:", err);
      setError("Failed to load product details. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Load reviews
  const loadRatings = async (productId: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/products/${productId}/reviews`);
      if (!res.ok) throw new Error("Failed to load reviews");

      const data: UserRating[] = await res.json();

      setAllRatings(
        data.map(r => ({
          ...r,
          media: Array.isArray(r.media) ? r.media : [],
          user: r.user ? { id: r.user.id, name: r.user.name || "Anonymous" } : { id: null, name: "Anonymous" },
        }))
      );
    } catch (err) {
      console.error("Error loading reviews:", err);
    }
  };

  // Submit review
  const submitReview = async () => {
    if (!product) return;

    const loggedInUserString = localStorage.getItem("loggedInUser");
    if (!loggedInUserString) {
      alert("Please log in to submit a review");
      return;
    }

    const loggedInUser = JSON.parse(loggedInUserString);
    const token = loggedInUser?.token;
    if (!token) {
      alert("Invalid login session. Please login again.");
      return;
    }

    const formData = new FormData();
    formData.append("rating", String(userRating));
    formData.append("comment", userComment);
    reviewImages.forEach(file => formData.append("images", file));

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/products/${product.id}/review`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to submit review");
      }

      setUserRating(0);
      setUserComment("");
      setReviewImages([]);

      await loadRatings(product.id);
    } catch (err) {
      console.error("Submit review error:", err);
      alert(err instanceof Error ? err.message : String(err));
    }
  };

  // Get available sizes
  const getAvailableSizesForVariant = (variant: ProductVariant, productData: Product) => {
    if (variant.size && typeof variant.size === "string") {
      const sizes = productService.parseJsonString(variant.size);
      return Array.isArray(sizes) ? sizes : [];
    }
    return productService.getProductSizes(productData);
  };

  const getAvailableSizes = () => {
    if (selectedVariant?.size && typeof selectedVariant.size === "string") {
      const sizes = productService.parseJsonString(selectedVariant.size);
      return Array.isArray(sizes) ? sizes : [];
    }
    return productService.getProductSizes(product!);
  };

  // Average rating
  const getAverageRating = () => {
    if (allRatings.length === 0) return product?.average_rating || 0;
    const total = allRatings.reduce((sum, r) => sum + r.rating, 0);
    return total / allRatings.length;
  };

  // Add to cart
  const handleAddToCart = async () => {
    if (!product) return;
    const loggedInUserString = localStorage.getItem("loggedInUser");
    if (!loggedInUserString) {
      alert("Please log in to add items to your cart.");
      return;
    }
    const loggedInUser = JSON.parse(loggedInUserString);
    const token = loggedInUser?.token;
    if (!token) {
      alert("Invalid login session. Please log in again.");
      return;
    }

    const image_url =
      selectedVariant?.images?.[selectedImageIndex] ||
      selectedVariant?.images?.[0] ||
      product.images[selectedImageIndex] ||
      product.images[0] ||
      "/default-product.png";

    const cartItem: CartItem = {
      id: crypto.randomUUID(),
      product_id: product.id,
      product_variant_id: selectedVariant?.id || null,
      quantity: 1,
      name: product.name,
      price: selectedVariant?.price || product.price,
      image_url,
      color: selectedVariant?.color || "Default",
      size: selectedSize || "Standard",
      variant_name: undefined,
    };

    try {
      await addItem({ ...cartItem, id: crypto.randomUUID() });
    } catch (error) {
      console.error("Add to cart failed:", error);
      alert("Failed to add item to cart. Try again later.");
    }
  };

  // Buy now
  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate("/cart");
  };

  // Change variant
  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    const sizes = getAvailableSizesForVariant(variant, product!);
    setSelectedSize(sizes.length > 0 ? sizes[0] : "");
    setSelectedImageIndex(0);
  };

  if (isLoading)
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <LoadingSpinner size="lg" text="Loading product details..." />
      </div>
    );

  if (error || !product)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || "Product not found"}</h2>
          <button onClick={() => navigate("/")} className="text-pink-600 hover:text-pink-700 font-medium">
            Return to Home
          </button>
        </div>
      </div>
    );

  const currentPrice = selectedVariant?.price || product.price;
  const originalPrice = selectedVariant?.original_price || product.original_price;
  const discountPercentage = selectedVariant?.discount_percentage || product.discount_percentage || 0;
  const stock = selectedVariant?.stock || product.stock || 0;

  // ...rest of JSX remains same as your previous code (images, details, reviews, related products)


  return (
    <div className="min-h-screen bg-white">
       <Helmet>
        <title>{`${product.name} | SthRee Collections`}</title>
        <meta name="description" content={product.description.slice(0, 150)} />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.description.slice(0, 150)} />
        <meta property="og:image" content={product.images?.[0]} />
        <meta property="og:url" content={`https://sthree.com/product/${product.id}`} />
        <meta name="keywords" content={`${product.name}, ${product.category}, sthree`} />
      </Helmet>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
          <button onClick={() => navigate("/")} className="hover:text-pink-600">Home</button>
          <ChevronRight className="w-4 h-4" />
          <span>{product.main_category}</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 truncate">{product.name}</span>
        </nav>
      </div>

      {/* Product Info */}
      <div className="max-w-6xl mx-auto px-4 py-8 grid lg:grid-cols-2 gap-12 min-h-[800px]">
        {/* Images */}
        <div className="space-y-4">
          <motion.div className="relative overflow-hidden rounded-lg bg-gray-100 w-[85%] mx-auto h-[750px] sm:h-[800px] lg:h-[850px]">
            <img
              src={product.images[selectedImageIndex] || "/default-product.png"}
              alt={product.name}
              className="w-full h-full object-cover"
            />

            {/* Wishlist Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleWishlistToggle}
              className="absolute top-3 left-3 p-2 rounded-full border shadow-sm bg-white z-10"
            >
              <Heart
                className={`w-6 h-6 transition-colors duration-300 ${isWishlisted ? "text-red-500 fill-red-500" : "text-gray-500 hover:text-pink-600"}`}
              />
            </motion.button>
          </motion.div>


          {product.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button key={index} onClick={() => setSelectedImageIndex(index)}>
                  <img
                    src={image}
                    alt={`${product.name}-${index}`}
                    className={`w-10 h-20 object-cover rounded-lg ${selectedImageIndex === index ? "ring-2 ring-pink-600" : ""
                      }`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>


        {/* Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">
              {product.name} 
            </h1>

            <div className="flex items-center space-x-1 text-xs">
              <RatingStars
                rating={product.average_rating || 0}
                size="sm" // smaller stars
                showCount
                reviewCount={allRatings.length}
              />
              <span className="text-gray-500">{stock} in stock</span>
            </div>

          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mt-2">
            {/* Discounted price */}
            <span className="text-xl font-bold text-gray-900">
              ₹{currentPrice.toLocaleString()}
            </span>

            {/* Original price (strikethrough) */}
            {originalPrice && originalPrice > currentPrice && (
              <>
                <span className="text-sm text-gray-500 line-through">
                  ₹{originalPrice.toLocaleString()}
                </span>

                {/* Discount percentage */}
                <span className="text-green-600 font-medium text-sm">
                  {discountPercentage}% OFF
                </span>
              </>
            )}
          </div>



          <div className="grid grid-cols-1 gap-6 mb-0"> {/* removed mb-4 */}
            {/* Color Column */}
            {product.variants?.length > 0 && (
              <div>
                <h3 className="font-semibold mb-1 text-sm">Color</h3>
                <div className="flex flex-row gap-1.5 overflow-x-auto">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => handleVariantChange(variant)}
                      className={`px-2.5 py-1.5 border rounded-md text-xs ${selectedVariant?.id === variant.id
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


            {/* Size Column */}
            {(() => {
              const allSizes = ["Free","XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"];
              const availableSizes = getAvailableSizes();

              return (
                <div>
                  <h3 className="font-semibold mb-1">Size</h3>
                  <div className="flex flex-row flex-wrap gap-2">
                    {allSizes.map((size) => {
                      const isAvailable = availableSizes.includes(size);
                      return (
                        <button
                          key={size}
                          onClick={() => isAvailable && setSelectedSize(size)}
                          disabled={!isAvailable}
                          className={`px-3 py-1.5 border rounded-lg text-sm transition 
                ${selectedSize === size
                              ? "border-pink-600 bg-pink-50 text-pink-700"
                              : "border-gray-300"} 
                ${!isAvailable ? "opacity-50 cursor-not-allowed bg-gray-100" : "hover:border-pink-400"}`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

          </div>

          {/* About / Description / Product Details */}
          <div className="max-w-7xl mx-auto px-4 py-4 border-t"> {/* reduced py-8 → py-4 */}
            {/* About Item */}
            {product.about_item && (
              <div className="mb-6">
                <h4 className="text-2xl font-semibold mb-2 text-gray-900">About this Item</h4>
                <p className="text-gray-700 leading-relaxed">{product.about_item}</p>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div className="mb-6">
                <h4 className="text-2xl font-semibold mb-2 text-gray-900">Description</h4>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Product Details */}
            {product.product_detail && (
              <div className="mb-6">
                <h4 className="text-2xl font-semibold mb-2 text-gray-900">Product Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-1 gap-x-6 text-gray-700">
                  {(() => {
                    let productDetails: Record<string, any> = {};

                    if (typeof product.product_detail === "string") {
                      try {
                        productDetails = JSON.parse(product.product_detail);
                      } catch {
                        product.product_detail.split(",").forEach((item) => {
                          const [key, value] = item.split(":");
                          if (key && value) productDetails[key.trim()] = value.trim();
                        });
                      }
                    } else {
                      productDetails = product.product_detail;
                    }

                    return Object.entries(productDetails).map(([key, value]) => (
                      <div
                        key={key}
                        className="text-sm flex items-center"
                      >
                        <span className="font-semibold text-gray-900 capitalize">
                          {key.replace(/_/g, " ")} :
                        </span>
                        <span className="ml-1 text-gray-700">{String(value)}</span>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            )}


            {/* Actions */}
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={stock === 0}
                className="flex-1 bg-pink-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg text-sm sm:text-base"
              >
                Add to Cart
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBuyNow}
                disabled={stock === 0}
                className="flex-1 bg-orange-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg text-sm sm:text-base"
              >
                Buy Now
              </motion.button>

              <button
                onClick={() => setIsShareModalOpen(true)}
                className="flex-1 bg-blue-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg flex items-center gap-2 justify-center text-sm sm:text-base hover:bg-blue-700"
              >
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                Share
              </button>
            </div>

          </div>

          {/* Share Modal Trigger */}
          {/* Share Modal Trigger */}

        </div>


      </div>




      {/* Reviews */}
      {/* Reviews Section */}
      <div className="max-w-7xl mx-auto px-4 py-8 border-t">
        {/* Toggle Review Form */}
        <button
          onClick={() => setIsReviewOpen(!isReviewOpen)}
          className="flex justify-between items-center w-full text-left border-b pb-3"
        >
          <h3 className="text-2xl font-bold">Leave a Review</h3>
          <motion.span
            animate={{ rotate: isReviewOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            ▶
          </motion.span>
        </button>

        {/* Review Form */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: isReviewOpen ? "auto" : 0, opacity: isReviewOpen ? 1 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="mt-4">
            {/* Star Rating */}
            <div className="flex items-center space-x-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`cursor-pointer text-2xl ${star <= userRating ? "text-yellow-400" : "text-gray-300"
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

            {/* Comment Textarea */}
            <textarea
              className="w-full border rounded p-2 mb-2"
              placeholder="Write your review..."
              value={userComment}
              onChange={(e) => setUserComment(e.target.value)}
            />

            {/* Upload Media */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Images or Videos (optional)
              </label>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={(e) => {
                  if (e.target.files) setReviewImages(Array.from(e.target.files));
                }}
                className="border p-2 rounded w-full"
              />
              {reviewImages.length > 0 && (
                <div className="flex space-x-2 mt-2 overflow-x-auto">
                  {reviewImages.map((file, idx) => (
                    <div key={idx} className="relative">
                      {file.type.startsWith("video") ? (
                        <video
                          src={URL.createObjectURL(file)}
                          className="w-16 h-16 object-cover rounded"
                          muted
                          loop
                        />
                      ) : (
                        <img
                          src={URL.createObjectURL(file)}
                          alt="preview"
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={submitReview}
              className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
            >
              Submit Review
            </button>
          </div>
        </motion.div>

        <hr className="my-6" />

        {/* Existing Reviews */}
        {allRatings.length > 0 ? (
          <div className="mt-4">
            <h4 className="text-lg font-semibold">User Reviews ({allRatings.length})</h4>

            <div className="flex items-center mb-4">
              <RatingStars
                rating={getAverageRating()}
                showCount
                reviewCount={allRatings.length}
              />
            </div>

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

              {/* Preview Modal */}
              {previewMedia && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                  onClick={() => setPreviewMedia(null)}
                >
                  <div className="relative max-w-3xl w-full">
                    {previewMedia.type === "image" ? (
                      <img src={previewMedia.url} className="w-full h-auto rounded" />
                    ) : (
                      <video
                        src={previewMedia.url}
                        className="w-full h-auto rounded"
                        controls
                        autoPlay
                      />
                    )}
                    <button
                      className="absolute top-2 right-2 text-white text-2xl font-bold"
                      onClick={() => setPreviewMedia(null)}
                    >
                      &times;
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500 mt-4">
            No reviews yet. Be the first to review!
          </p>
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

