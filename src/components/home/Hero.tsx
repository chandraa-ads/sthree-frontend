
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import banner1 from "../../assets/icon/front_1.jpg";
import banner2 from "../../assets/icon/front_2.jpg";
import banner3 from "../../assets/icon/front_6.png";
import banner4 from "../../assets/icon/front_7.png";

const images = [banner3, banner2, banner1, banner4];

// Slide animation variants
const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    position: "absolute" as const,
  }),
  center: {
    x: 0,
    opacity: 1,
    position: "relative" as const,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0,
    position: "absolute" as const,
  }),
};

export function Hero() {
  const [[currentImage, direction], setCurrentImage] = useState<[number, number]>([0, 0]);
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("loggedInUser");
        setUser(null);
      }
    }
  }, []);

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage(([prev]) => [(prev + 1) % images.length, 1]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Handle manual navigation
  const goToImage = (index: number) => {
    setCurrentImage(([current]) => [index, index > current ? 1 : -1]);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setUser(null);
  };

  return (
    <section className="relative w-full overflow-hidden h-[40vh] md:h-[88vh]">
      {/* User Info + Logout */}
      {user && (
        <div className="absolute top-4 right-6 z-20 flex items-center space-x-4 bg-black/50 px-4 py-2 rounded-full text-white backdrop-blur-sm">
          <span>Hello, {user.name || user.email?.split("@")[0] || "User"}!</span>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white rounded-md px-3 py-1 text-sm font-semibold transition"
            aria-label="Logout"
          >
            Logout
          </button>
        </div>
      )}

      {/* Slideshow */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={currentImage}
            src={images[currentImage]}
            alt={`Slideshow ${currentImage + 1}`}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = images[0]; // fallback image
            }}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 1.2 }}
            className="w-full h-full object-cover absolute inset-0"
          />
        </AnimatePresence>
      </div>

      {/* Foreground */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-6 text-5xl md:text-7xl font-bold text-white leading-tight"
        >
          Shop with
          <span className="block bg-gradient-to-r from-pink-500 via-green-400 to-blue-500 bg-clip-text text-transparent mt-2">
            Confidence
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed mt-4"
        >
          Discover premium products with a seamless shopping experience. Quality
          guaranteed, satisfaction delivered.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-10"
        >
          <span className="text-sm font-medium text-white bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm border border-white/30">
            ✨ New Collection Available
          </span>
        </motion.div>

        {/* Slide Indicators */}
        <div className="flex justify-center mt-8 space-x-4">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToImage(idx)}
              className={`w-4 h-4 rounded-full transition-colors ${
                idx === currentImage
                  ? "bg-white"
                  : "bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
