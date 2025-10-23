import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ProductCard } from "./ProductCard";
import { Product } from "./types/product";

export function WishlistPage() {
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("loggedInUser") || "null");
        if (!storedUser?.id || !storedUser?.token) {
          alert("🔒 Please log in to view your wishlist");
          navigate("/login");
          return;
        }

        const res = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/products/user/${storedUser.id}/wishlist`,
          {
            headers: {
              Authorization: `Bearer ${storedUser.token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch wishlist");

        const data = await res.json();
        console.log("💖 Wishlist API Response:", data);

        // ✅ Extract product objects from `data.data`
        const products = Array.isArray(data?.data)
          ? data.data
              .map((item: any) => item.product)
              .filter((p: any) => !!p) // filter out null/undefined
          : [];

        setWishlistProducts(products);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
        setWishlistProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-gray-500 text-lg">Loading your wishlist...</p>
      </div>
    );
  }

  if (wishlistProducts.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px]">
        <motion.img
          src="/empty-heart.png"
          alt="Empty Wishlist"
          className="w-40 h-40 opacity-60 mb-4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        />
        <p className="text-gray-600 text-lg font-medium">Your wishlist is empty ❤️</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-pink-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-pink-700"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-8 text-gray-900">Your Wishlist ❤️</h2>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {wishlistProducts.map((product, index) => (
          <ProductCard key={product.id || index} product={product} index={index} />
        ))}
      </div>
    </div>
  );
}
