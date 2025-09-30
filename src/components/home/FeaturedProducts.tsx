import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Truck, Award, Lock, Headphones } from "lucide-react";

// ----------------------
// Type Definitions
// ----------------------
type Rating = {
  rate: number;
  count: number;
};

type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
};

// ----------------------
// Featured Products Component
// ----------------------
export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("https://fakestoreapi.com/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data: Product[] = await res.json();

        const filtered = data.filter(
          (product) =>
            product.category === "jewelery" ||
            (product.category === "women's clothing" &&
              /dress|jacket|coat|shirt/i.test(product.title))
        );

        setProducts(filtered);
      } catch (error) {
        console.error("❌ Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <section className="py-20 bg-cream font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Traditional Women’s Dresses & Jewellery
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our curated selection of traditional women’s clothing and fine jewellery.
          </p>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-lg font-semibold animate-pulse">Loading products...</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2 flex flex-col"
              >
                {/* Product Image */}
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.title}
                    onError={(e) => ((e.target as HTMLImageElement).src = "/fallback.png")}
                    className="rounded-t-2xl w-full h-56 object-contain p-4 bg-gray-50"
                  />
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-pink-500 to-purple-500 px-3 py-1 rounded-full text-white text-sm font-semibold shadow-lg">
                    {product.category}
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-bold mb-2 truncate">{product.title}</h3>
                  <p className="text-gray-800 font-semibold text-lg mb-4">
                    ${product.price.toFixed(2)}
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-yellow-500 font-medium">
                      ★ {product.rating.rate}
                    </span>
                    <span className="text-gray-500 text-sm">
                      ({product.rating.count})
                    </span>
                  </div>
                  <button className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition">
                    Buy Now
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-12 max-w-6xl mx-auto"
        >
          {[
            {
              title: "Fast Delivery",
              desc: "Get your orders delivered in record time.",
              icon: <Truck size={40} strokeWidth={2.5} aria-label="Delivery Truck" />,
            },
            {
              title: "Premium Quality",
              desc: "We offer top-notch products at affordable prices.",
              icon: <Award size={40} strokeWidth={2.5} aria-label="Award Icon" />,
            },
            {
              title: "Secure Payments",
              desc: "100% safe and encrypted payment methods.",
              icon: <Lock size={40} strokeWidth={2.5} aria-label="Secure Lock" />,
            },
            {
              title: "24/7 Support",
              desc: "Our team is here to help you anytime.",
              icon: <Headphones size={40} strokeWidth={2.5} aria-label="Headphones Support" />,
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center text-center transition transform hover:scale-110"
            >
              <div className="mb-4 text-pink-500">{feature.icon}</div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
