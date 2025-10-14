import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useCart } from "../../contexts/CartContext";

export const CartDrawer: React.FC = () => {
  const { cartItems, isCartOpen, closeCartDrawer, updateCartItem, removeItem } = useCart();

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
            onClick={closeCartDrawer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Drawer */}
          <motion.div
            className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Your Cart</h2>
              <button onClick={closeCartDrawer}>
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {cartItems.length === 0 ? (
                <p className="text-gray-500 text-center mt-10">Your cart is empty</p>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex items-start gap-4 border-b py-3">
                    <img
                      src={item.image_url || "/default-product.png"}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />


                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-600">₹{item.price}</p>

                      {/* 🧩 Extra details */}
                      <div className="text-xs text-gray-500 mt-1 space-y-1">
                        {item.size && (
                          <p>
                            <span className="font-medium text-gray-700">Size:</span> {item.size}
                          </p>
                        )}
                        {item.color && (
                          <p>
                            <span className="font-medium text-gray-700">Color:</span> {item.color}
                          </p>
                        )}
                        {item.variant_name && (
                          <p>
                            <span className="font-medium text-gray-700">Variant:</span>{" "}
                            {item.variant_name}
                          </p>
                        )}
                      </div>

                      {/* Quantity controls */}
                      <div className="flex items-center mt-2">
                        <button
                          onClick={() => updateCartItem(item, item.quantity - 1)}
                          className="px-2 py-1 border rounded-l hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="px-3 border-t border-b">{item.quantity}</span>
                        <button
                          onClick={() => updateCartItem(item, item.quantity + 1)}
                          className="px-2 py-1 border rounded-r hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 text-xs hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="border-t p-4">
              <div className="flex justify-between text-lg font-semibold mb-3">
                <span>Total:</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
              <button
                className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
                disabled={!cartItems.length}
              >
                Checkout
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
