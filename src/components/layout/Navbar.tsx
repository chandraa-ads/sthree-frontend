import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, User, Search, Menu, X } from "lucide-react";
import LoginSignup from "../auth/LoginSignup";

import logoImg from "../../assets/icon/logo.svg";
import sareeIcon from "../../assets/icon/Saree.png";
import salwarIcon from "../../assets/icon/salwar.png";
import kuruthaIcon from "../../assets/icon/kurutha.png";
import kidsIcon from "../../assets/icon/kids.png";
import homeIcon from "../../assets/icon/home.svg";
import dupattaIcon from "../../assets/icon/dupatta.png";
import accessoriesIcon from "../../assets/icon/accessories.png";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  // Running banner animation
  useEffect(() => {
    const el = bannerRef.current;
    if (!el) return;

    let x = 0;
    const speed = 0.5;
    let frameId: number;

    const step = () => {
      x -= speed;
      if (Math.abs(x) >= el.scrollWidth / 2) x = 0;
      el.style.transform = `translateX(${x}px)`;
      frameId = requestAnimationFrame(step);
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId); // ✅ Proper cleanup
  }, []);

  const categories = [
    { name: "SAREE", icon: sareeIcon, path: "/saree" },
    { name: "SALWAR", icon: salwarIcon, path: "/salwar" },
    { name: "TOP AND KURUTHA", icon: kuruthaIcon, path: "/kurutha" },
    { name: "KIDS WEAR", icon: kidsIcon, path: "/kids" },
    { name: "HOME WEAR", icon: homeIcon, path: "/homewear" },
    { name: "DUPATTA", icon: dupattaIcon, path: "/dupatta" },
    { name: "ACCESSORIES", icon: accessoriesIcon, path: "/accessories" },
  ];

  return (
    <>
      {/* Running banner */}
      <div className="w-full bg-black text-white text-sm py-1 overflow-hidden">
        <div
          ref={bannerRef}
          className="flex whitespace-nowrap"
          style={{ willChange: "transform" }}
        >
          {Array(8)
            .fill("END OF SEASON SALE LIVE NOW UPTO 75% DISCOUNT •")
            .map((text, i) => (
              <span key={i} className="px-8">
                {text}
              </span>
            ))}
        </div>
      </div>

      {/* Navbar */}
      <nav className="bg-[#fdfaf3] border-b border-gray-200 w-full sticky top-0 z-50 font-serif">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-20">
          <Link to="/" className="flex items-center">
            <img
              src={logoImg}
              alt="Logo"
              className="h-12 w-auto object-contain"
            />
          </Link>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <input
              type="text"
              placeholder="Outfit Speaks Person"
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsLoginOpen(true)}
              className="p-1 hover:text-green-600 transition-colors"
            >
              <User className="w-6 h-6 text-gray-700 cursor-pointer" />
            </button>
            <ShoppingCart className="w-6 h-6 text-gray-700 cursor-pointer hover:text-green-600" />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-green-600 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Categories (desktop) */}
        <div className="hidden md:flex justify-center space-x-8 py-3 text-gray-800 font-medium">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.path}
              className="flex items-center space-x-2 hover:text-green-600"
            >
              <img
                src={cat.icon}
                alt={cat.name}
                className="w-6 h-6 object-contain"
              />
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 py-4"
            >
              <div className="flex flex-col space-y-4 px-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Outfit Speaks Person"
                    className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                  />
                  <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                </div>

                {categories.map((cat) => (
                  <Link
                    key={cat.name}
                    to={cat.path}
                    className="flex items-center space-x-2 text-gray-800 hover:text-green-600"
                  >
                    <img
                      src={cat.icon}
                      alt={cat.name}
                      className="w-6 h-6 object-contain"
                    />
                    <span>{cat.name}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Login/Signup Modal */}
      <LoginSignup isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
