import React from "react";
import { Hero } from "./components/home/Hero";



export default function App() {
  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Products Section */}
      <section
        id="products"
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <h2 className="text-3xl font-bold mb-8 text-center">Our Collections</h2>

        {/* Example Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="p-4 border rounded-lg shadow hover:shadow-md transition">
            <img
              src="https://via.placeholder.com/300"
              alt="Product 1"
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="text-lg font-semibold">Elegant Silk Saree</h3>
            <p className="text-gray-600">₹12,999</p>
          </div>

          <div className="p-4 border rounded-lg shadow hover:shadow-md transition">
            <img
              src="https://via.placeholder.com/300"
              alt="Product 2"
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="text-lg font-semibold">Cotton Handloom Saree</h3>
            <p className="text-gray-600">₹2,499</p>
          </div>

          <div className="p-4 border rounded-lg shadow hover:shadow-md transition">
            <img
              src="https://via.placeholder.com/300"
              alt="Product 3"
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="text-lg font-semibold">Art Silk Saree</h3>
            <p className="text-gray-600">₹4,999</p>
          </div>

          <div className="p-4 border rounded-lg shadow hover:shadow-md transition">
            <img
              src="https://via.placeholder.com/300"
              alt="Product 4"
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="text-lg font-semibold">Kanjivaram Silk Saree</h3>
            <p className="text-gray-600">₹15,999</p>
          </div>
        </div>
      </section>
    </>
  );
}
