import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface OrderItem {
  product_name: string;
  selected_size?: string;
  selected_color?: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface ShippingAddress {
  name: string;
  phone: string;
  address?: string;
  city?: string;
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
  created_at?: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // 🧾 Fetch all orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3000/orders/admin/all");
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
        `http://localhost:3000/orders/admin/confirm/${orderId}`
      );
      alert(res.data.message || "Order confirmed successfully!");
      fetchOrders();
    } catch (err) {
      console.error("❌ Confirm order failed:", err);
      alert("Failed to confirm order");
    }
  };

  // 📥 Export Orders to Excel
  const exportOrders = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/orders/admin/export",
        {
          responseType: "blob", // important for file download
        }
      );

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "orders.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();

      console.log("✅ Orders exported successfully");
    } catch (error) {
      console.error("❌ Failed to export orders:", error);
      alert("Failed to export orders to Excel");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading orders...</p>;

  // 🧩 Separate pending and confirmed orders
  const pendingOrders = orders.filter((o) => o.status === "pending");
  const confirmedOrders = orders.filter((o) => o.status === "confirmed");

  const renderOrdersTable = (title: string, list: Order[], showButton = false) => (
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
                  <th className="border px-4 py-2 text-left">Order ID</th>
                  <th className="border px-4 py-2 text-left">Customer</th>
                  <th className="border px-4 py-2 text-left">Total</th>
                  <th className="border px-4 py-2 text-left">Payment</th>
                  <th className="border px-4 py-2 text-left">Status</th>
                  <th className="border px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{order.id}</td>
                    <td className="border px-4 py-2">
                      {order.shipping_address.name} ({order.shipping_address.phone})
                    </td>
                    <td className="border px-4 py-2">₹{order.total_price}</td>
                    <td className="border px-4 py-2">
                      {order.payment_method} ({order.payment_status})
                    </td>
                    <td className="border px-4 py-2 capitalize">{order.status}</td>
                    <td className="border px-4 py-2">
                      {showButton ? (
                        <Button
                          onClick={() => confirmOrder(order.id)}
                          className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded"
                        >
                          Confirm
                        </Button>
                      ) : (
                        <span className="text-green-600 font-semibold">Confirmed</span>
                      )}
                    </td>
                  </tr>
                ))}
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

      {/* 🕒 Pending Orders */}
      {renderOrdersTable("🕒 Pending Orders", pendingOrders, true)}

      {/* ✅ Confirmed Orders */}
      {renderOrdersTable("✅ Confirmed Orders", confirmedOrders, false)}
    </div>
  );
}
