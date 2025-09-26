import React, { useState } from "react";

interface CartItem {
  product: string;
  size: string;
  quantity: number;
  price: number;
}

const AccountInfo: React.FC = () => {
  const [cartItems] = useState<CartItem[]>([
    { product: "T-Shirt", size: "M", quantity: 2, price: 500 },
    { product: "Jeans", size: "32", quantity: 1, price: 1200 },
  ]);

  const [paymentMethod, setPaymentMethod] = useState<string>("");

  const confirmOrder = () => {
    if (!paymentMethod) {
      alert("⚠️ Please select a payment method before confirming the order!");
      return;
    }

    alert(`✅ Order Confirmed Successfully!\nPayment Method: ${paymentMethod}`);
  };

  return (
    <div className="flex max-w-5xl mx-auto my-8 bg-white rounded-xl overflow-hidden shadow-lg flex-col md:flex-row">
      {/* Left Profile */}
      <div className="w-full md:w-72 bg-pink-100 p-6 text-center border-b md:border-b-0 md:border-r border-gray-200">
        <img
          src="/logo.png"
          alt="Logo"
          className="w-28 h-28 rounded-xl object-cover mx-auto mb-4"
        />
        <h2 className="text-xl font-semibold">Mark Cole</h2>
        <p className="text-gray-600">swoo@gmail.com</p>
      </div>

      {/* Right Form */}
      <div className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-6">Account Info</h2>

        {/* Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">First Name *</label>
            <input
              type="text"
              defaultValue="Mark"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last Name *</label>
            <input
              type="text"
              defaultValue="Cole"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Payment */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
          >
            <option value="">-- Select --</option>
            <option value="Credit Card">Credit Card</option>
            <option value="UPI">UPI</option>
            <option value="Net Banking">Net Banking</option>
            <option value="COD">Cash on Delivery</option>
          </select>
        </div>

        {/* Address */}
        <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Address Line 1"
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
          />
          <input
            type="text"
            placeholder="Address Line 2"
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="City"
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
          />
          <input
            type="text"
            placeholder="Pin Code"
            defaultValue="641-107"
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            placeholder="Phone Number 1"
            defaultValue="+1 0231 4554 452"
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
          />
          <input
            type="text"
            placeholder="Phone Number 2"
            defaultValue="+1 0231 4554 452"
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Table */}
        <h3 className="text-lg font-semibold mb-2">Order Item (From Cart)</h3>
        <div className="overflow-x-auto rounded-lg shadow mb-6">
          <table className="w-full border-collapse">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="p-3 text-center">Product_Name</th>
                <th className="p-3 text-center">Selected Size</th>
                <th className="p-3 text-center">Quantity</th>
                <th className="p-3 text-center">Price (Rs)</th>
                <th className="p-3 text-center">Sub Total (Rs)</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, i) => (
                <tr
                  key={i}
                  className={i % 2 === 0 ? "bg-gray-50 hover:bg-green-50" : "bg-white hover:bg-green-50"}
                >
                  <td className="p-3 text-center">{item.product}</td>
                  <td className="p-3 text-center">{item.size}</td>
                  <td className="p-3 text-center">{item.quantity}</td>
                  <td className="p-3 text-center">{item.price}</td>
                  <td className="p-3 text-center">{item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Confirm Button */}
        <div className="text-center">
          <button
            onClick={confirmOrder}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-green-700 hover:scale-105 transition-transform"
          >
            ORDER CONFIRM
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountInfo;
