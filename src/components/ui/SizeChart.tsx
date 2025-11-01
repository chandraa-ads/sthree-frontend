import React from "react";
import { motion } from "framer-motion";
import size1 from "../../assets/size/1.webp";
import size2 from "../../assets/size/2.webp";
import size3 from "../../assets/size/3.webp";
import size4 from "../../assets/size/4.webp";

export default function SizeChartZigZagAnimation() {
  const images = [size1, size2, size3, size4];

  return (
    <div className="w-screen bg-gray-900 overflow-hidden">
      {images.map((img, idx) => {
        const isLeft = idx % 2 === 0; // alternate left & right
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: isLeft ? -500 : 500, rotateY: isLeft ? -45 : 45 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-screen h-screen flex items-center justify-center"
          >
            <motion.div
              whileHover={{
                scale: 1.05,
                rotateY: isLeft ? 10 : -10,
                boxShadow: "0px 0px 30px rgba(255, 0, 150, 0.6)",
              }}
              transition={{ type: "spring", stiffness: 100, damping: 8 }}
              className={`flex ${isLeft ? "justify-start" : "justify-end"} w-full px-12`}
            >
              <div className="bg-white/10 backdrop-blur-lg p-6 rounded-3xl shadow-2xl border border-white/20">
                <img
                  src={img}
                  alt={`Size Chart ${idx + 1}`}
                  className="w-[90vw] h-[85vh] object-contain rounded-2xl"
                />
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
