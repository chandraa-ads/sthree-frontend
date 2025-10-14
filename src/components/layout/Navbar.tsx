import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, User, Search, Menu, X, Heart } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import LoginSignup from "../auth/LoginSignup";

import logoImg from "../../assets/icon/sth_ree.svg";
import sareeIcon from "../../assets/icon/Saree.png";
import salwarIcon from "../../assets/icon/salwar.png";
import kuruthaIcon from "../../assets/icon/kurutha.png";
import kidsIcon from "../../assets/icon/kids.png";
import homeIcon from "../../assets/icon/home.png";
import dupattaIcon from "../../assets/icon/dupatta.png";
import accessoriesIcon from "../../assets/icon/accessories.png";
import mens from "../../assets/icon/mens.png";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const categories = [
    { name: "SAREE", icon: sareeIcon },
    { name: "SALWAR", icon: salwarIcon },
    { name: "TOP & KURTIS", icon: kuruthaIcon },
    { name: "KIDS WEAR", icon: kidsIcon },
    { name: "HOME WEAR", icon: homeIcon },
    { name: "DUPATTA", icon: dupattaIcon },
    { name: "ACCESSORIES", icon: accessoriesIcon },
    { name: "MENS", icon: mens },
  ];

  // Check login status on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.name);
      setIsLoggedIn(true);
    }
  }, []);

  // Running banner scroll effect
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
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Handle category selection from navigation state
  useEffect(() => {
    if (location.state && (location.state as any).selectedCategory) {
      setSelectedCategory((location.state as any).selectedCategory);
    }
  }, [location]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    navigate(`/category/${category.toLowerCase()}`);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("userRole");
    localStorage.removeItem("adminToken");
    setIsLoggedIn(false);
    setUserName(null);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="bg-[#fdfaf3] border-b border-gray-200 w-full sticky top-0 z-50 font-serif">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-30">
          {/* Logo */}
          <button onClick={() => navigate("/")} className="flex items-center">
            <img src={logoImg} alt="Logo" className="h-20 w-auto object-contain" />
          </button>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            {!isLoggedIn ? (
              <button
                onClick={() => setIsLoginOpen(true)}
                className="p-1 hover:text-green-600 transition-colors"
              >
                <User className="w-6 h-6 text-gray-700 cursor-pointer" />
              </button>
            ) : (
              <div className="flex items-center space-x-3">
                <span className="text-gray-700 font-medium">
                  Hello, {userName || "User"}!
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}

            {/* Wishlist Icon */}
            <Heart
              className="w-6 h-6 text-gray-700 cursor-pointer hover:text-pink-600"
              onClick={() => navigate("/wishlist")}
            />

            {/* Shopping Cart */}
            <ShoppingCart
              className="w-6 h-6 text-gray-700 cursor-pointer hover:text-green-600"
              onClick={() => navigate("/cart")}
            />

            {/* Mobile Menu */}
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
            <button
              key={cat.name}
              onClick={() => handleCategoryClick(cat.name)}
              className={`flex items-center space-x-2 hover:text-green-600 focus:outline-none ${
                selectedCategory === cat.name ? "text-green-600 font-bold" : ""
              }`}
            >
              <img src={cat.icon} alt={cat.name} className="w-6 h-6 object-contain" />
              <span>{cat.name}</span>
            </button>
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
                    placeholder="Search products..."
                    className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                  />
                  <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                </div>

                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => handleCategoryClick(cat.name)}
                    className={`flex items-center space-x-2 text-gray-800 hover:text-green-600 focus:outline-none ${
                      selectedCategory === cat.name ? "text-green-600 font-bold" : ""
                    }`}
                  >
                    <img src={cat.icon} alt={cat.name} className="w-6 h-6 object-contain" />
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Login/Signup Modal */}
      <LoginSignup
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        setIsLoggedIn={(loggedIn: boolean, name?: string) => {
          setIsLoggedIn(loggedIn);
          if (loggedIn && name) setUserName(name);
        }}
      />
    </>
  );
}
