import React from "react";
import { motion } from "framer-motion";
import silkSareeImg from "../../assets/landing_img/set topssalwar.jpg";
import cottonSareeImg from "../../assets/landing_img/80f175fb3a268fc594148204ce134d8a.jpg";
import designerSareeImg from "../../assets/landing_img/Blue Crepe Satin.jpg";
import partyWear1 from "../../assets/landing_img/c67d2c0f89eb944d58fc9fef062ece06.jpg";
import partyWear2 from "../../assets/landing_img/Chiffon Lace Border Work Saree.jpg";
import partyWear3 from "../../assets/landing_img/kurtis sandal.jpg";
import partyWear4 from "../../assets/landing_img/New pure chanderi batik saree with designer blouse..jpg";
import partyWear5 from "../../assets/landing_img/Peach checked linen saree.jpg";

const categories = [
  { id: 1, name: "Silk Sarees", image: silkSareeImg },
  { id: 2, name: "Cotton Sarees", image: cottonSareeImg },
  { id: 3, name: "Designer Sarees", image: designerSareeImg },
  { id: 4, name: "Party Wear", image: partyWear1 },
  { id: 5, name: "Party Wear", image: partyWear2 },
  { id: 6, name: "Party Wear", image: partyWear3 },
  { id: 7, name: "Party Wear", image: partyWear4 },
  { id: 8, name: "Party Wear", image: partyWear5 },
];

export function Categories() {
  return (
    <section className="py-10 bg-white">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900">
            Shop by{" "}
            <span className="block mt-2 mb-4 pb-1 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
              Categories
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our diverse collection organized by style, occasion, and fabric
          </p>
        </div>

        {/* Infinite Marquee */}
        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-4 sm:gap-6"
            animate={{ x: ["0%", "-100%"] }}
            transition={{
              repeat: Infinity,
              duration: 24, // ⚡ Increased speed (was 30)
              ease: "linear",
            }}
          >
            {[...categories, ...categories].map((category, index) => (
              <div
                key={index}
                className="relative min-w-[200px] sm:min-w-[250px] h-[200px] sm:h-[250px] flex-shrink-0 group cursor-pointer overflow-hidden rounded-2xl shadow-lg"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
