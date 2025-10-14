import axios from "axios";
import { CartItem } from "../../contexts/CartContext";

const API_BASE = "http://localhost:3000"; // backend URL

export const cartService = {
  async getCart(user_id: string) {
    const response = await axios.get(`${API_BASE}/cart`, {
      params: { user_id },
    });
    return response.data;
  },

  async addToCart(payload: any) {
    const response = await axios.post(`${API_BASE}/cart`, payload);
    return response.data;
  },

  async removeFromCart(cart_id: string, user_id: string) {
    const response = await axios.delete(`${API_BASE}/cart/${cart_id}`, {
      params: { user_id },
    });
    return response.data;
  },

  async updateCart(cart_id: string, payload: any) {
    const response = await axios.put(`${API_BASE}/cart/${cart_id}`, payload);
    return response.data;
  },

  async clearCart(user_id: string) {
    const response = await axios.delete(`${API_BASE}/cart`, {
      params: { user_id },
    });
    return response.data;
  },
};

// ✅ Add-to-cart function with login check safety
export const addToCart = async (item: CartItem, user_id: string) => {
  if (!user_id) throw new Error("User not logged in");

  const payload = {
    user_id,
    product_id: item.product_id,
    product_variant_id: item.product_variant_id || null,
    name: item.name,
    price: Number(item.price),
    quantity: Number(item.quantity),
    color: item.color || null,
    size: item.size || null,
    image_url: item.image_url || null,
  };

  console.log("POST /cart payload:", payload);

  return axios.post("http://localhost:3000/cart", payload);
};

