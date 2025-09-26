import React, { useState } from "react";
import logo from "../../assets/icon/home.svg";

interface Product {
  id: number;
  name: string;
  price:number;
  img: string;
  stocks: number;
  brand: string;
  mainCat: string;
  subCat: string;
  size: string;
  details: string;
  about: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "T-Shirt",
    img: logo,
    price:1020,
    stocks: 50,
    brand: "Nike",
    mainCat: "Clothing",
    subCat: "Topwear",
    size: "M",
    details: "Cotton",
    about: "Comfortable and casual",
  },
  {
    id: 2,
    name: "Shoes",
    img: "https://via.placeholder.com/200",
    price:1020,
    stocks: 20,
    brand: "Adidas",
    mainCat: "Footwear",
    subCat: "Sports",
    size: "8",
    details: "Running Shoes",
    about: "Lightweight and durable",
  },
];

const ProductDetails: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center p-8 bg-gray-50 min-h-screen bg-gradient-to-b from-rose-50 to-white  ">
      {/* Logo Section */}
      <div className="text-center mb-6">
        <img src={logo} alt="SthRee Logo" className="h-24 mx-auto" />
        <p className="font-bold mt-2 text-lg text-gray-700">
          Outfit Speaks Person
        </p>
      </div>

      {/* Title */}
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6">
        PRODUCT DETAILS
      </h2>

      {/* Table Card - NO SCROLLBAR */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-[95%] max-w-6xl">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-pink-400 to-pink-600 text-white">
              {[
                "P.ID",
                "P.NAME/IMG",
                "P.Price",
                "P.STOCKS",
                "P.BRAND",
                "P.MAIN CATEGORY",
                "P.SUB CATEGORY",
                "P.SIZE",
                "P.DETAILS",
                "ABOUT",
              ].map((header) => (
                <th
                  key={header}
                  className="p-3 text-center text-sm font-semibold tracking-wide whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr
                key={product.id}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-pink-50 transition-all duration-200`}
              >
                <td className="p-3 text-center border-b">{product.id}</td>
                <td className="p-3 flex items-center justify-center gap-2 border-b">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-10 h-10 rounded-xl shadow-md cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => setSelectedImage(product.img)}
                  />
                  <span className="font-medium text-sm">{product.name}</span>
                </td>
                <td className="p-3 text-center border-b">{product.stocks}</td>
                <td className="p-3 text-center border-b">{product.price}</td>
                <td className="p-3 border-b text-sm">{product.brand}</td>
                <td className="p-3 border-b text-sm">{product.mainCat}</td>
                <td className="p-3 border-b text-sm">{product.subCat}</td>
                <td className="p-3 text-center border-b">{product.size}</td>
                <td className="p-3 border-b text-sm">{product.details}</td>
                <td className="p-3 border-b text-sm">{product.about}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal (Big Image Preview) */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="relative bg-white rounded-2xl shadow-xl p-4">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-2xl"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
            <img
              src={selectedImage}
              alt="Preview"
              className="max-w-[90vw] max-h-[80vh] rounded-xl shadow-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
