import React from "react";
import { motion } from "framer-motion";

const categories = [
  {
    id: 1,
    name: "Silk Sarees",
    image:
"../src/assets/landing_img/set topssalwar.jpg",
  },
  {
    id: 2,
    name: "Cotton Sarees",
    image:
"../src/assets/landing_img/80f175fb3a268fc594148204ce134d8a.jpg",
  },
  {
    id: 3,
    name: "Designer Sarees",
    image:
"../src/assets/landing_img/Blue Crepe Satin.jpg",  },
  {
    id: 4,
    name: "Party Wear",
    image:
"../src/assets/landing_img/c67d2c0f89eb944d58fc9fef062ece06.jpg", },
    {
    id: 5,
    name: "Party Wear",
    image:
"../src/assets/landing_img/Chiffon Lace Border Work Saree.jpg",  },
    {
    id: 6,
    name: "Party Wear",
    image:
"../src/assets/landing_img/kurtis sandal.jpg", },    {
    id: 7,
    name: "Party Wear",
    image:
"../src/assets/landing_img/New pure chanderi batik saree with designer blouse..jpg",  },    {
    id: 8,
    name: "Party Wear",
    image:
"../src/assets/landing_img/Peach checked linen saree.jpg",  },
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
            className="flex gap-6"
            animate={{ x: ["0%", "-30%"] }}
            transition={{
              repeat: Infinity,
              duration: 10, // change speed
              ease: "linear",
            }}
          >
            {/* Duplicate cards so loop is seamless */}
            {[...categories, ...categories].map((category, index) => (
              <div
                key={index}
                className="relative min-w-[250px] h-[250px] flex-shrink-0 group cursor-pointer overflow-hidden rounded-2xl shadow-lg"
              >
                {/* Full Image */}
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Transparent Title Overlay */}
                {/* <div className="absolute bottom-0 w-full bg-black/30 text-white text-center py-2 text-lg font-bold">
                  {category.name}
                </div> */}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
