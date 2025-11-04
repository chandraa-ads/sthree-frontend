import React from "react";
import { useCart } from "../../contexts/CartContext";
import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ShoppingCart: React.FC = () => {
  const { cartItems, updateCartItem, removeItem } = useCart();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (acc, item) => acc + Number(item.price) * item.quantity,
    0
  );
  const deliveryFee = cartItems.length > 0 ? (subtotal >= 1000 ? 0 : 50) : 0;
  const totalAmount = subtotal + deliveryFee;
  const { main_category } = useParams();
  const formatted = main_category?.replace(/-/g, " ") || "Category";
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <Helmet>
        <title>{`${formatted} Collection | SthRee Collections`}</title>
        <meta
          name="description"
          content={`Explore SthRee’s exclusive ${formatted} collection. Premium fabrics, unique designs, and unbeatable prices.`}
        />
        <meta property="og:title" content={`${formatted} - SthRee`} />
        <meta property="og:image" content={`/assets/category/${main_category}.jpg`} />
        <link rel="canonical" href={`https://sthree.com/category/${main_category}`} />
      </Helmet>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT SIDE - CART ITEMS */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6">
          <h1 className="text-2xl font-semibold mb-6 border-b pb-3">
            Shopping Cart
          </h1>

          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">Your cart is empty 😕</p>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 border-b pb-6"
                >
                  {/* Product Image */}
                  <img
                    src={item.image_url || "/default-product.png"}
                    alt={item.name}
                    className="w-28 h-28 object-cover rounded-lg border"
                  />

                  {/* Product Info + Amount + Delete */}
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Left side: Info and quantity */}
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{item.name}</h4>

                      {/* Variant details */}
                      <div className="text-xs text-gray-500 mt-1 space-y-1">
                        {item.size && (
                          <p>
                            <span className="font-medium text-gray-700">
                              Size:
                            </span>{" "}
                            {item.size}
                          </p>
                        )}
                        {item.color && (
                          <p>
                            <span className="font-medium text-gray-700">
                              Color:
                            </span>{" "}
                            {item.color}
                          </p>
                        )}
                        {item.variant_name && (
                          <p>
                            <span className="font-medium text-gray-700">
                              Variant:
                            </span>{" "}
                            {item.variant_name}
                          </p>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center mt-3">
                        <button
                          onClick={() =>
                            updateCartItem(item, Math.max(item.quantity - 1, 1))
                          }
                          className="px-3 py-1 border rounded-l hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="px-4 py-1 border-t border-b">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateCartItem(item, item.quantity + 1)
                          }
                          className="px-3 py-1 border rounded-r hover:bg-gray-100"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-600 transition ml-10"
                          title="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Right side: Amount + Delete */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-end gap-2 mt-2 sm:mt-0">


                      <span className="font-semibold text-gray-800">
                        ₹{(Number(item.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT SIDE - ORDER SUMMARY */}
        {cartItems.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-6 h-fit lg:sticky lg:top-10">
            <h2 className="text-xl font-semibold border-b pb-3 mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? "Free" : `₹${deliveryFee.toFixed(2)}`}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <button
              className="w-full mt-6 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
              onClick={() => {
                // Save all cart data to localStorage before navigating
                localStorage.setItem("checkoutData", JSON.stringify({
                  cartItems,
                  subtotal,
                  totalAmount,
                  deliveryFee,
                }));

                navigate("/checkout");
              }}
            >
              Proceed to Checkout
            </button>

          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;
