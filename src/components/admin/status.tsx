import React from "react";
import logo from "../../assets/icon/home.svg";

interface ShippingAddress {
  city: string;
  line1: string;
  pincode: string;
}

interface OrderItem {
  price: number;
  quantity: number;
  product_id: string;
  product_name: string;
  selected_size: string;
}

interface Order {
  id: string;
  total: number;
  status: string;
  created_at: string;
  payment_method: string;
  payment_status: string;
  user_id: string;
  shipping_address: ShippingAddress;
  items: OrderItem[];
}

const orders: Order[] = [
  {
    id: "81f6c17b-1c2f-4610-8785-a4c538064a8f",
    total: 20000,
    status: "pending",
    created_at: "2025-09-24T10:31:09.548",
    items: [
      {
        price: 10000,
        quantity: 2,
        product_id: "f515e38b-fed2-4bd8-858f-20227a43db37",
        product_name: "zdsfgrfghb",
        selected_size: "M",
      },
    ],
    payment_method: "COD",
    shipping_address: {
      city: "Bangalore",
      line1: "123 Street",
      pincode: "560001",
    },
    user_id: "cfeed55d-c050-4189-91c8-56e9ae6ec9bc",
    payment_status: "pending",
  },
  {
    id: "eeef72ad-ab4d-4ec7-b909-34adcb008afd",
    total: 20000,
    status: "confirmed",
    created_at: "2025-09-23T09:54:09.547189",
    items: [
      {
        price: 10000,
        quantity: 2,
        product_id: "88dc6a66-d5c4-4825-9c8c-028cdbe8786f",
        product_name: "Mysore Silk Saree",
        selected_size: "Free Size",
      },
    ],
    payment_method: "COD",
    shipping_address: {
      city: "Bangalore",
      line1: "123 Street",
      pincode: "560001",
    },
    user_id: "fbef8356-539c-4b75-8396-585bf8b7d0b8",
    payment_status: "success",
  },
];

const OrdersTable: React.FC = () => {
  return (
    <div className="flex flex-col items-center p-10 bg-gradient-to-b from-rose-50 to-white min-h-screen">
      {/* Logo Section */}
     <div className="text-center mb-6">
        <img src={logo} alt="SthRee Logo" className="h-24 mx-auto" />
        <p className="font-bold mt-2 text-lg text-gray-700">
          Outfit Speaks Person
        </p>
      </div>

      {/* Orders Table Section */}
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          All Orders
        </h1>

        {/* Table Wrapper */}
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full min-w-[1000px] text-sm bg-white">
            <thead>
              <tr className="bg-gradient-to-r from-pink-400 to-pink-600 text-white text-xs uppercase tracking-wide">
                {[
                  "Order ID",
                  "Status",
                  "Total",
                  "Payment Method",
                  "Payment Status",
                  "User ID",
                  "Shipping Address",
                  "Product",
                  "Size",
                  "Qty",
                  "Price",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 text-left font-semibold"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {orders.map((order) => {
                const shipping = order.shipping_address;
                const shippingText = `${shipping.line1}, ${shipping.city} - ${shipping.pincode}`;

                return order.items.map((item, idx) => (
                  <tr
                    key={`${order.id}-${idx}`}
                    className="hover:bg-pink-50 transition"
                  >
                    <td className="px-4 py-3">{idx === 0 ? order.id : ""}</td>
                    <td className="px-4 py-3">
                      {idx === 0 && (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : order.status === "confirmed"
                              ? "bg-pink-100 text-pink-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {idx === 0 ? `₹${order.total}` : ""}
                    </td>
                    <td className="px-4 py-3">
                      {idx === 0 ? order.payment_method : ""}
                    </td>
                    <td className="px-4 py-3">
                      {idx === 0 && (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.payment_status === "success"
                              ? "bg-green-100 text-green-700"
                              : "bg-pink-100 text-pink-700"
                          }`}
                        >
                          {order.payment_status}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {idx === 0 ? order.user_id : ""}
                    </td>
                    <td className="px-4 py-3">
                      {idx === 0 ? shippingText : ""}
                    </td>
                    <td className="px-4 py-3">{item.product_name}</td>
                    <td className="px-4 py-3">{item.selected_size}</td>
                    <td className="px-4 py-3">{item.quantity}</td>
                    <td className="px-4 py-3">₹{item.price}</td>
                  </tr>
                ));
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersTable;
