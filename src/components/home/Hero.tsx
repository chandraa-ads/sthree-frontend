import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "../ui/Button";

export function Hero() {
  // Shop Now scroll handler
  const handleShopNow = () => {
    const section = document.getElementById("products");
    section?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-coral/10 via-white to-turquoise/10">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-coral/20 to-turquoise/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-turquoise/20 to-coral/20 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-gray-200"
          >
            <Sparkles className="w-4 h-4 text-coral" />
            <span className="text-sm font-medium text-gray-700">
              New Collection Available
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight"
          >
            Shop with
            <span className="block bg-gradient-to-r from-coral to-turquoise bg-clip-text text-transparent">
              Confidence
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Discover premium products with seamless shopping experience. Quality
            guaranteed, satisfaction delivered.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mt-6"
          >
            {/* Shop Now - scrolls down */}
            <Button
              size="lg"
              className="group px-10 py-5 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              onClick={handleShopNow}
            >
              Shop Now
              <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            {/* View Collections */}
            <Button
              variant="outline"
              size="lg"
              className="px-10 py-5 text-lg font-semibold border-2"
            >
              View Collections
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
