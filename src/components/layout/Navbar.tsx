import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, User, Search, Menu, X, Heart, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import LoginSignup from "../auth/LoginSignup";
import { productService } from "../products/ProductService";

import logoImg from "../../assets/webpicon/sth_ree.webp";
import sareeIcon from "../../assets/webpicon/Saree.webp";
import salwarIcon from "../../assets/webpicon/salwar.webp";
import kuruthaIcon from "../../assets/webpicon/kurutha.webp";
import kidsIcon from "../../assets/webpicon/kids.webp";
import homeIcon from "../../assets/webpicon/home.webp";
import dupattaIcon from "../../assets/webpicon/dupatta.webp";
import accessoriesIcon from "../../assets/webpicon/accessories.webp";
import mens from "../../assets/webpicon/mens.webp";
import { ProductCard } from "../ProductCard";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const categories = [
    { name: "SAREE", icon: sareeIcon },
    { name: "SALWAR", icon: salwarIcon },
    { name: "TOP & KURTHI", icon: kuruthaIcon },
    { name: "KIDS WEAR", icon: kidsIcon },
    { name: "NEW BORN ", icon: kidsIcon },
    { name: "HOME WEAR", icon: homeIcon },
    { name: "DUPATTA", icon: dupattaIcon },
    { name: "ACCESSORIES", icon: accessoriesIcon },
    { name: "MENS", icon: mens },
  ];

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // Check login status
  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.name);
      setUserEmail(user.email);
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
    if (category === "PROFILE") {
      if (isLoggedIn) {
        navigate("/userprofile");
      } else {
        alert("🔒 Please log in to access your profile.");
        setIsLoginOpen(true);
      }
    } else {
      setSelectedCategory(category);
      navigate(`/category/${category.toLowerCase()}`);
    }
    setIsMenuOpen(false);
  };

  // Search products (small dropdown preview)
  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }

    const debounceTimer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const response = await productService.filterProducts({ name: searchQuery, limit: 10 });
        setSearchResults(response.data || []);
      } catch (err) {
        console.error(err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("userRole");
    localStorage.removeItem("adminToken");
    setIsLoggedIn(false);
    setUserName(null);
    setUserEmail(null);
    setShowDropdown(false);
  };

  // Navigate to search results page
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="bg-[#fdfaf3] border-b border-gray-200 w-full sticky top-0 z-50 font-serif">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-30">
          {/* Left section: Logo */}
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate("/")} className="flex items-center">
              <img src={logoImg} alt="Logo" className="h-20 w-auto object-contain" />
            </button>
          </div>

          {/* Center: Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          {/* User dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => {
                if (isLoggedIn) setShowDropdown(!showDropdown);
                else setIsLoginOpen(true);
              }}
              className="flex items-center space-x-2 hover:text-green-600"
            >
              <User className="w-6 h-6 text-gray-700" />
              {isLoggedIn && (
                <div className="flex flex-col text-left">
                  <span className="text-sm font-semibold text-green-700">{userName}</span>
                  <span className="text-xs text-gray-500">{userEmail}</span>
                </div>
              )}
            </button>

            {isLoggedIn && (
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg border border-gray-100 p-3 z-50"
                  >
                    <div className="border-b border-gray-200 pb-2 mb-2">
                      <p className="text-sm font-semibold text-green-700">{userName}</p>
                      <p className="text-xs text-gray-500">{userEmail}</p>
                    </div>

                    <ul className="flex flex-col space-y-2 text-sm text-gray-700">
                      <li
                        onClick={() => { navigate("/userprofile"); setShowDropdown(false); }}
                        className="flex items-center gap-2 hover:text-green-600 cursor-pointer"
                      >
                        <User className="w-4 h-4" /> My Account
                      </li>
                      <li
                        onClick={() => { navigate("/cart"); setShowDropdown(false); }}
                        className="flex items-center gap-2 hover:text-green-600 cursor-pointer"
                      >
                        <ShoppingCart className="w-4 h-4" /> My Cart
                      </li>
                      <li
                        onClick={() => { navigate("/wishlist"); setShowDropdown(false); }}
                        className="flex items-center gap-2 hover:text-green-600 cursor-pointer"
                      >
                        <Heart className="w-4 h-4" /> Wishlist
                      </li>
                      <li
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>

          {/* Mobile menu */}
          <div className="flex items-center space-x-4 relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-green-600 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Desktop categories */}
        <div className="hidden md:flex justify-center space-x-8 py-3 text-gray-800 font-medium">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => handleCategoryClick(cat.name)}
              className={`flex items-center space-x-2 hover:text-green-600 focus:outline-none ${selectedCategory === cat.name ? "text-green-600 font-bold" : ""}`}
            >
              <img src={cat.icon} alt={cat.name} className="w-6 h-6 object-contain" />
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Mobile menu content */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 py-4"
            >
              <div className="flex flex-col space-y-4 px-4">
                {/* Search input */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearch}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>

                {/* Categories */}
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => handleCategoryClick(cat.name)}
                    className={`flex items-center space-x-2 text-gray-800 hover:text-green-600 focus:outline-none ${selectedCategory === cat.name ? "text-green-600 font-bold" : ""}`}
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
        setIsLoggedIn={(loggedIn: boolean, name?: string, email?: string) => {
          setIsLoggedIn(loggedIn);
          if (loggedIn && name) setUserName(name);
          if (loggedIn && email) setUserEmail(email);
        }}
      />
    </>
  );
}
