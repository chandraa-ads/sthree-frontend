import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, WebcamIcon } from "lucide-react";
import SthLogo from "../../assets/icon/Sth_W.svg";
import WebMedia6Logo from "../../assets/icon/web media 6.svg";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Sarees", path: "/category/saree" },
    { name: "Salwar", path: "/category/salwar" },
    { name: "Top & Kurtis", path: "/category/top & kurtis" },
    { name: "Accessories", path: "/category/accessories" },
    { name: "Mens", path: "/category/mens" },
  ];

  const customerServiceLinks = [
    { name: "Size Guide", path: "/size-guide" },
    { name: "Shipping Info", path: "/shipping-info" },
    { name: "Returns & Exchanges", path: "/returns" },
    { name: "Care Instructions", path: "/care-instructions" },
  ];

  const bottomLinks = [
    { name: "Privacy Policy", path: "/privacy-policy" },
    { name: "Terms of Service", path: "/terms" },
    { name: "Cookie Policy", path: "/cookie-policy" },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center">
              <img src={SthLogo} alt="SthRee" className="h-10 w-auto" />
              <span className="ml-2 text-xl font-bold transition-colors duration-300 hover:text-pink-600">
                SthRee
              </span>
            </motion.div>

            <p className="text-gray-400 text-sm leading-relaxed">
              Discover the finest collection of traditional and contemporary sarees. Crafted with love, delivered with care.
            </p>

            <div className="flex space-x-4">
              {[{ Icon: Facebook, link: "#" }, { Icon: Twitter, link: "#" }, { Icon: Instagram, link: "#" }, { Icon: Youtube, link: "#" }].map(({ Icon, link }, idx) => (
                <motion.a
                  key={idx}
                  whileHover={{ scale: 1.1 }}
                  href={link}
                  className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <motion.button
                    whileHover={{ x: 5 }}
                    onClick={() => navigate(link.path)}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </motion.button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              {customerServiceLinks.map((link) => (
                <li key={link.name}>
                  <motion.button
                    whileHover={{ x: 5 }}
                    onClick={() => navigate(link.path)}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </motion.button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Get in Touch</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-pink-500 flex-shrink-0" />
                <a
                  href="https://www.google.com/maps/search/?api=1&query=65,+Tatabad+1st+Street,+Coimbatore+-+641+012"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 text-sm hover:underline"
                >
                  65, Tatabad 1st Street, Coimbatore - 641 012
                </a>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-pink-500 flex-shrink-0" />
                <a
                  href="https://wa.me/918903284455"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 text-sm hover:underline"
                >
                  +91 89032 84455
                </a>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-pink-500 flex-shrink-0" />
                <a
                  href="mailto:sujangnanaolivu@gmail.com"
                  className="text-gray-400 text-sm hover:underline"
                >
                  sujangnanaolivu@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} SthRee Palace. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              {bottomLinks.map((link) => (
                <motion.button
                  key={link.name}
                  whileHover={{ y: -2 }}
                  onClick={() => navigate(link.path)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {link.name}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods / Powered by Section */}
      <div className="bg-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="flex items-center space-x-2">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 hover:underline"
              >
                <img src={WebMedia6Logo} alt="Web Media 6" className="h-6 w-auto" />
                <span className="text-gray-400 text-sm">Powered by Media Web 6</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
