import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export interface CartItem {
  variant_name: any;
  id: string;
  product_id: string;
  product_variant_id?: string | null;
  name: string;
  image_url: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
}

interface CartContextProps {
  cartItems: CartItem[];
  isCartOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  addItem: (item: CartItem) => void;
  updateCartItem: (item: CartItem, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalAmount: number;
  totalQuantity: number;
}

const CartContext = createContext<CartContextProps>({} as CartContextProps);
export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // ✅ Get logged in user from localStorage
  const user = JSON.parse(localStorage.getItem("loggedInUser") || "{}");

  /** ---------------------------
   * Fetch Cart from Backend
   ---------------------------- */
  const fetchCart = async () => {
    if (!user?.id) return;

    try {
      const { data } = await axios.get("http://localhost:3000/cart", {
        params: { user_id: user.id },
      });
      setCartItems(data.cart_items || []);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  useEffect(() => {
    if (user?.id) fetchCart();
  }, []);

  /** ---------------------------
   * Add Item to Cart
   ---------------------------- */
const addItem = async (newItem: CartItem) => {
  try {
    const payload = { ...newItem, user_id: user.id };
    const { data } = await axios.post("http://localhost:3000/cart", payload);
    setCartItems(data.cart_items || []);  // ✅ updates state from backend response
    openCartDrawer();
  } catch(err: any) {
      console.error("Error adding to cart:", err.response?.data || err.message);
    }
  };

  /** ---------------------------
   * Update Cart Item Quantity
   ---------------------------- */
  const updateCartItem = async (item: CartItem, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      const payload = {
        quantity: newQuantity,
        product_variant_id: item.product_variant_id,
        user_id: user.id,
        color: item.color,
        size: item.size,
        price: item.price,
        name: item.name,
        image_url: item.image_url,
      };

      const { data } = await axios.patch(
        `http://localhost:3000/cart/${item.id}`,
        payload
      );

      setCartItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, quantity: newQuantity } : i))
      );
    } catch (err: any) {
      console.error("Error updating cart item:", err.response?.data || err.message);
    }
  };

  /** ---------------------------
   * Remove Item from Cart
   ---------------------------- */
  const removeItem = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/cart/${id}`, {
        params: { user_id: user.id },
      });
      setCartItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err: any) {
      console.error("Error removing cart item:", err.response?.data || err.message);
    }
  };

  /** ---------------------------
   * Clear Cart
   ---------------------------- */
  const clearCart = async () => {
    try {
      await axios.delete(`http://localhost:3000/cart/clear/${user.id}`);
      setCartItems([]);
    } catch (err: any) {
      console.error("Error clearing cart:", err.response?.data || err.message);
    }
  };

  /** ---------------------------
   * Drawer Controls
   ---------------------------- */
  const openCartDrawer = () => setIsCartOpen(true);
  const closeCartDrawer = () => setIsCartOpen(false);

  /** ---------------------------
   * Totals
   ---------------------------- */
  const totalAmount = cartItems.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );
  const totalQuantity = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        openCartDrawer,
        closeCartDrawer,
        addItem,
        updateCartItem,
        removeItem,
        clearCart,
        totalAmount,
        totalQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
