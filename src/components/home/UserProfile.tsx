import React, { useState, useMemo } from "react";
import {
  User,
  ShoppingCart,
  Package,
  Edit3,
  Camera,
  XCircle,
  Save,
} from "lucide-react";

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("info");
  const [photo, setPhoto] = useState(
    "https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
  );

  const [user, setUser] = useState({
    name: "Sindhu Prabha .P",
    email: "sindhuprabha@example.com",
    phone: "9876543210",
    whatsapp: "9876543210",
    pincode: "641001",
    address: "Coimbatore, Tamil Nadu",
    dob: "2002-06-15",
    gender: "Female",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(user);

  const [orders] = useState([
    {
      id: 1,
      name: "Rose Gold Handbag",
      image:
        "https://images.unsplash.com/photo-1593032465175-8f9b2cfa5f16?auto=format&fit=crop&w=400&q=80",
      price: 1299,
      quantity: 1,
      status: "Delivered",
    },
    {
      id: 2,
      name: "Casual White Sneakers",
      image:
        "https://images.unsplash.com/photo-1528701800489-476a1f1a6f38?auto=format&fit=crop&w=400&q=80",
      price: 2499,
      quantity: 1,
      status: "Processing",
    },
  ]);

  const [cart, setCart] = useState([
    {
      id: 101,
      name: "Floral Summer Dress",
      image:
        "https://images.unsplash.com/photo-1520975922090-8d3b80c67f8e?auto=format&fit=crop&w=400&q=80",
      price: 1499,
      quantity: 2,
    },
    {
      id: 102,
      name: "Elegant Pearl Earrings",
      image:
        "https://images.unsplash.com/photo-1617039620993-36a06f62b49b?auto=format&fit=crop&w=400&q=80",
      price: 699,
      quantity: 1,
    },
  ]);

  const grandTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setUser(editUser);
    setIsModalOpen(false);
  };

  const handleRemoveFromCart = (id: number) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const handleQuantityChange = (id: number, delta: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-pink-50 to-white flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar */}
      <div className="bg-white shadow-2xl w-full md:w-72 p-8 flex flex-col items-center rounded-b-3xl md:rounded-r-3xl border-r border-pink-100">
        <div className="relative group">
          <img
            src={photo}
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-pink-200 object-cover shadow-xl"
          />
          <label
            htmlFor="photoUpload"
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-sm opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition"
          >
            <Camera className="w-5 h-5" />
          </label>
          <input
            type="file"
            id="photoUpload"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </div>

        <h2 className="mt-4 font-bold text-gray-800 text-lg text-center">
          {user.name}
        </h2>

        <button
          onClick={() => {
            setEditUser(user);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 mt-3 px-4 py-2 text-sm font-medium bg-pink-600 text-white rounded-full hover:bg-pink-700 shadow-md transition transform hover:scale-105"
        >
          <Edit3 className="w-4 h-4" /> Edit Profile
        </button>

        <div className="flex flex-col mt-10 gap-5 w-full text-gray-700 font-medium">
          <button
            onClick={() => setActiveTab("info")}
            className={`flex items-center gap-3 px-5 py-3 rounded-xl transition transform hover:scale-[1.03] hover:shadow-md ${
              activeTab === "info"
                ? "bg-pink-100 text-pink-700 shadow-inner"
                : ""
            }`}
          >
            <User className="w-5 h-5" /> Your Info
          </button>

          <button
            onClick={() => setActiveTab("cart")}
            className={`flex items-center gap-3 px-5 py-3 rounded-xl transition transform hover:scale-[1.03] hover:shadow-md ${
              activeTab === "cart"
                ? "bg-pink-100 text-pink-700 shadow-inner"
                : ""
            }`}
          >
            <ShoppingCart className="w-5 h-5" /> Cart
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-3 px-5 py-3 rounded-xl transition transform hover:scale-[1.03] hover:shadow-md ${
              activeTab === "orders"
                ? "bg-pink-100 text-pink-700 shadow-inner"
                : ""
            }`}
          >
            <Package className="w-5 h-5" /> Orders
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        {activeTab === "info" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <User className="w-6 h-6 text-pink-600" /> Your Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(user).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-white shadow-lg rounded-2xl border border-pink-100 p-4 hover:shadow-xl transition transform hover:-translate-y-1"
                >
                  <p className="text-xs text-gray-500 uppercase">{key}</p>
                  <p className="text-gray-800 font-medium mt-1">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "cart" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-pink-600" /> Your Cart
            </h2>

            <div className="space-y-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border border-pink-100 rounded-2xl p-5 bg-white shadow-md hover:shadow-xl transition transform hover:-translate-y-1"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-28 sm:w-28 sm:h-32 object-cover rounded-xl shadow"
                  />
                  <div className="flex-1 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3 sm:gap-0 mt-3 sm:mt-0">
                    <div className="flex flex-col gap-2">
                      <h3 className="font-semibold text-gray-800 text-lg">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        ₹{item.price} × {item.quantity}
                      </p>
                      <p className="text-pink-700 font-bold mt-1 text-lg">
                        ₹{item.price * item.quantity}
                      </p>

                      {/* Quantity Control */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => handleQuantityChange(item.id, -1)}
                          className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
                        >
                          -
                        </button>
                        <span className="px-2">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, 1)}
                          className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="text-red-500 hover:text-red-600 font-medium mt-3 sm:mt-0"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              {/* Total & Checkout */}
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 p-6 bg-pink-50 rounded-2xl shadow-md">
                <p className="text-xl font-bold text-gray-800">
                  Total: ₹{grandTotal}
                </p>
                <button className="mt-4 sm:mt-0 px-6 py-2 bg-pink-600 text-white rounded-full shadow hover:bg-pink-700 transition">
                  Checkout
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Package className="w-6 h-6 text-pink-600" /> Your Orders
            </h2>
            <div className="space-y-5">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col md:flex-row items-start md:items-center gap-4 p-5 border border-pink-100 rounded-xl bg-white shadow hover:shadow-xl transition"
                >
                  <img
                    src={order.image}
                    alt={order.name}
                    className="w-24 h-24 rounded-lg object-cover shadow"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{order.name}</h3>
                    <p className="text-gray-500 text-sm">
                      Quantity: {order.quantity}
                    </p>
                    <p className="text-pink-700 font-bold mt-1">
                      ₹{order.price}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm rounded-full font-medium ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ✨ Edit Profile Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md transform scale-100 hover:scale-[1.02] transition">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Edit3 className="text-pink-600" /> Edit Profile
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-red-500 transition"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Photo Upload in Modal */}
            <div className="flex flex-col items-center mb-4">
              <div className="relative group">
                <img
                  src={photo}
                  alt="Profile"
                  className="w-28 h-28 rounded-full border-4 border-pink-200 object-cover shadow-xl"
                />
                <label
                  htmlFor="modalPhotoUpload"
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-sm opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition"
                >
                  <Camera className="w-5 h-5" />
                </label>
                <input
                  type="file"
                  id="modalPhotoUpload"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </div>
            </div>

            <div className="space-y-4">
              {Object.entries(editUser).map(([key, value]) => (
                <div key={key}>
                  <label className="text-xs uppercase text-gray-500">
                    {key}
                  </label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) =>
                      setEditUser({ ...editUser, [key]: e.target.value })
                    }
                    className="w-full border border-pink-100 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleSave}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-pink-600 text-white font-medium py-2 rounded-xl shadow-md hover:bg-pink-700 transition"
            >
              <Save className="w-5 h-5" /> Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
