import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";

interface OrderItem {
  product_name: string;
  selected_size?: string;
  selected_color?: string;
  price: number;
  quantity: number;
  subtotal: number;
  image_url?: string;
}

interface ShippingAddress {
  name?: string;
  phone?: string;
  line1?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

interface Order {
  id: string;
  total_price: number;
  payment_method: string;
  status: string;
  payment_status: string;
  shipping_address: ShippingAddress;
  order_items: OrderItem[];
  user_id?: string;
  created_at?: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // 👈 For image view

  // 🧾 Fetch all orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://nettly-indebted-kurtis.ngrok-free.dev/orders/admin/all");
      setOrders(res.data);
    } catch (err) {
      console.error("❌ Failed to load orders:", err);
      alert("Error loading orders");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Confirm Order
  const confirmOrder = async (orderId: string) => {
    if (!window.confirm("Are you sure you want to confirm this order?")) return;

    try {
      const res = await axios.post(
        `https://nettly-indebted-kurtis.ngrok-free.dev/orders/admin/confirm/${orderId}`
      );

      alert(res.data.message || "Order confirmed successfully!");
      fetchOrders(); // refresh list
    } catch (err) {
      console.error("❌ Confirm order failed:", err);
      alert("Failed to confirm order");
    }
  };

  // 📥 Export Orders
  const exportOrders = async () => {
    try {
      const response = await axios.get(
        "https://nettly-indebted-kurtis.ngrok-free.dev/orders/admin/export",
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "orders.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("❌ Failed to export orders:", error);
      alert("Failed to export orders to Excel");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading orders...</p>;

  const pendingOrders = orders.filter((o) => o.status === "pending");
  const confirmedOrders = orders.filter((o) => o.status === "confirmed");

  const getCustomerInfo = (order: Order) => {
    const name =
      order.shipping_address?.name ||
      order.user_id ||
      "N/A";
    const phone = order.shipping_address?.phone || "";
    return { name, phone };
  };

  const renderOrdersTable = (
    title: string,
    list: Order[],
    showButton = false
  ) => (
    <Card className="shadow-md border rounded-xl mb-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {list.length === 0 ? (
          <p className="text-gray-500">No {title.toLowerCase()} found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-left">Image</th>
                  <th className="border px-4 py-2 text-left">Order ID</th>
                  <th className="border px-4 py-2 text-left">Customer</th>
                  <th className="border px-4 py-2 text-left">Total</th>
                  <th className="border px-4 py-2 text-left">Payment</th>
                  <th className="border px-4 py-2 text-left">Date</th>
                  <th className="border px-4 py-2 text-left">Status</th>
                  <th className="border px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((order) => {
                  const { name, phone } = getCustomerInfo(order);
                  const firstImage =
                    order.order_items[0]?.image_url || null;

                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="border px-4 py-2">
                        {firstImage ? (
                          <img
                            src={firstImage}
                            alt="Product"
                            className="w-12 h-12 rounded object-cover cursor-pointer hover:opacity-80"
                            onClick={() => setSelectedImage(firstImage)}
                          />
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="border px-4 py-2">{order.id}</td>
                      <td className="border px-4 py-2">
                        {name}
                        <br />
                        <span className="text-gray-500 text-xs">{phone}</span>
                      </td>
                      <td className="border px-4 py-2 font-medium">
                        ₹{order.total_price.toFixed(2)}
                      </td>
                      <td className="border px-4 py-2">
                        {order.payment_method}{" "}
                        <span
                          className={`text-xs ml-1 ${
                            order.payment_status === "paid"
                              ? "text-green-600"
                              : "text-yellow-600"
                          }`}
                        >
                          ({order.payment_status})
                        </span>
                      </td>
                      <td className="border px-4 py-2 text-gray-600">
                        {order.created_at
                          ? new Date(order.created_at).toLocaleString()
                          : "-"}
                      </td>
                      <td className="border px-4 py-2 capitalize">
                        {order.status}
                      </td>
                      <td className="border px-4 py-2 space-x-2">
                        <Button
                          onClick={() => setSelectedOrder(order)}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded"
                        >
                          View
                        </Button>
                        {showButton && (
                          <Button
                            onClick={() => confirmOrder(order.id)}
                            className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded"
                          >
                            Confirm
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">🧾 Order Management</h1>
        <Button
          onClick={exportOrders}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded"
        >
          ⬇️ Export to Excel
        </Button>
      </div>

      {renderOrdersTable("🕒 Pending Orders", pendingOrders, true)}
      {renderOrdersTable("✅ Confirmed Orders", confirmedOrders, false)}

      {/* 🔍 Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-3xl relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4">
              Order Details — #{selectedOrder.id}
            </h2>

            <div className="mb-3">
              <p>
                <strong>Customer:</strong>{" "}
                {getCustomerInfo(selectedOrder).name} (
                {getCustomerInfo(selectedOrder).phone})
              </p>
              <p>
                <strong>Address:</strong>{" "}
                {selectedOrder.shipping_address.line1 || "-"},{" "}
                {selectedOrder.shipping_address.city || ""}{" "}
                {selectedOrder.shipping_address.pincode || ""}
              </p>
            </div>

            <table className="w-full border text-sm mb-3">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-3 py-2 text-left">Image</th>
                  <th className="border px-3 py-2 text-left">Product</th>
                  <th className="border px-3 py-2 text-left">Color</th>
                  <th className="border px-3 py-2 text-left">Size</th>
                  <th className="border px-3 py-2 text-left">Qty</th>
                  <th className="border px-3 py-2 text-left">Price</th>
                  <th className="border px-3 py-2 text-left">View</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.order_items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="border px-3 py-2">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.product_name}
                          className="w-12 h-12 object-cover rounded cursor-pointer hover:opacity-80"
                          onClick={() => setSelectedImage(item.image_url)}
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="border px-3 py-2">{item.product_name}</td>
                    <td className="border px-3 py-2">
                      {item.selected_color || "-"}
                    </td>
                    <td className="border px-3 py-2">
                      {item.selected_size || "-"}
                    </td>
                    <td className="border px-3 py-2">{item.quantity}</td>
                    <td className="border px-3 py-2">₹{item.price}</td>
                    <td className="border px-3 py-2">
                      {item.image_url ? (
                        <Button
                          className="bg-gray-700 text-white text-xs px-2 py-1 rounded hover:bg-gray-800"
                          onClick={() => setSelectedImage(item.image_url)}
                        >
                          View
                        </Button>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="text-right font-semibold">
              Total: ₹{selectedOrder.total_price.toFixed(2)}
            </p>
          </div>
        </div>
      )}

      {/* 🖼️ Image View Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[60]">
          <div className="relative">
            <img
              src={selectedImage}
              alt="Product"
              className="max-w-[90vw] max-h-[80vh] rounded-lg shadow-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 bg-white text-black px-3 py-1 rounded-full font-bold hover:bg-red-500 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
