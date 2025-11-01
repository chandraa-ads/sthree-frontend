import React, { useState, useEffect } from "react";
import {
  User,
  Package,
  Edit3,
  Camera,
  XCircle,
  Save,
  Truck,
  CreditCard,
  Calendar,
} from "lucide-react";

interface UserDashboardProps {
  userId?: string;
}

export default function UserDashboard({ userId: propUserId }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState("info");
  const [photo, setPhoto] = useState(
    "https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
  );

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  const userId = propUserId || loggedInUser?.id || "";
  const token = loggedInUser?.token || "";

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    address: "",
    dob: "",
    gender: "",
  });

  const [editUser, setEditUser] = useState({ ...user });
  const [showOtherGender, setShowOtherGender] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);

  // Fetch user details
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId || !token) return;

      try {
        const res = await fetch(`http://localhost:3000/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();

        const profile = data;
        const formattedAddress = profile.address
          ? JSON.parse(profile.address).join(", ")
          : "";

        setUser({
          name: profile.full_name || "",
          email: profile.email || "",
          phone: profile.phone || "",
          whatsapp: profile.whatsapp_no || "",
          address: formattedAddress,
          dob: profile.dob || "",
          gender: profile.gender || "",
        });

        setEditUser({
          name: profile.full_name || "",
          email: profile.email || "",
          phone: profile.phone || "",
          whatsapp: profile.whatsapp_no || "",
          address: formattedAddress,
          dob: profile.dob || "",
          gender: profile.gender || "",
        });

        if (profile.profile_photo) setPhoto(profile.profile_photo);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, [userId, token]);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) return;
      try {
        const res = await fetch(`http://localhost:3000/orders/my/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrders();
  }, [userId, token]);



  useEffect(() => {
    orders.forEach((order: any) => {
      order.order_items.forEach((item: any) => {
        if (item.image_url) {
          const img = new Image();
          img.src = item.image_url.startsWith("http")
            ? item.image_url
            : `http://localhost:3000${item.image_url}`;
        }
      });
    });
  }, [orders]);

  // Handle profile photo
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Save profile changes
  const handleSave = async () => {
    if (!userId) return alert("User not logged in!");

    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("full_name", editUser.name || "");
      formData.append("phone", editUser.phone || "");
      formData.append("whatsapp_no", editUser.whatsapp || "");
      if (editUser.dob) formData.append("dob", editUser.dob);
      if (editUser.gender) formData.append("gender", editUser.gender);
      if (editUser.address) {
        const addresses = editUser.address.split(",").map((a) => a.trim());
        addresses.forEach((addr) => formData.append("addresses", addr));
      }
      if (photoFile) formData.append("profile_photo", photoFile);

      const res = await fetch("http://localhost:3000/users/update-profile", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update profile");

      setUser(editUser);
      if (data.profile?.profile_photo) setPhoto(data.profile.profile_photo);
      setIsModalOpen(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile. Try again.");
    }
  };

  // Fallback for broken images
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src =
      "https://cdn-icons-png.flaticon.com/512/2748/2748558.png";
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
            setShowOtherGender(user.gender === "Other");
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 mt-3 px-4 py-2 text-sm font-medium bg-pink-600 text-white rounded-full hover:bg-pink-700 shadow-md transition transform hover:scale-105"
        >
          <Edit3 className="w-4 h-4" /> Edit Profile
        </button>

        <div className="flex flex-col mt-10 gap-5 w-full text-gray-700 font-medium">
          <button
            onClick={() => setActiveTab("info")}
            className={`flex items-center gap-3 px-5 py-3 rounded-xl transition transform hover:scale-[1.03] hover:shadow-md ${activeTab === "info" ? "bg-pink-100 text-pink-700 shadow-inner" : ""
              }`}
          >
            <User className="w-5 h-5" /> Your Info
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-3 px-5 py-3 rounded-xl transition transform hover:scale-[1.03] hover:shadow-md ${activeTab === "orders" ? "bg-pink-100 text-pink-700 shadow-inner" : ""
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

        {activeTab === "orders" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Package className="w-6 h-6 text-pink-600" /> My Orders
            </h2>

            {orders.length === 0 ? (
              <p className="text-gray-500">No orders found.</p>
            ) : (
              <div className="space-y-6">
                {orders.map((order: any) => (
                  <div
                    key={order.id}
                    className="border border-pink-100 bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold text-gray-800">
                        🧾 Order #{order.id}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(order.created_at).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {order.order_items.map((item: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 bg-pink-50/40 border border-pink-100 rounded-xl p-3 hover:bg-pink-50 transition"
                        >
                          <img
                            src={
                              item.image_url
                                ? item.image_url.startsWith("http")
                                  ? item.image_url
                                  : `http://localhost:3000${item.image_url}`
                                : "https://cdn-icons-png.flaticon.com/512/2748/2748558.png"
                            }
                            alt={item.product_name}
                            onError={(e) =>
                            ((e.target as HTMLImageElement).src =
                              "https://cdn-icons-png.flaticon.com/512/2748/2748558.png")
                            }
                            className="w-20 h-20 object-cover rounded-lg border border-gray-200 shadow-sm bg-white"
                          />

                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{item.product_name}</p>
                            {item.selected_color && item.selected_size && (
                              <p className="text-sm text-gray-500">
                                {item.selected_color} | {item.selected_size}
                              </p>
                            )}
                            <p className="text-sm text-gray-600">
                              Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                            </p>
                          </div>

                          <span className="font-semibold text-gray-900">
                            ₹{(item.quantity * item.price).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center mt-4 border-t border-gray-200 pt-3">
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Truck className="w-4 h-4 text-pink-600" /> {order.status || "Processing"}
                      </p>
                      <p className="text-lg font-semibold text-pink-700">
                        Total: ₹{order.total_amount?.toLocaleString() || "0"}
                      </p>
                    </div>
                  </div>
                ))}

              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Profile Modal (keep your existing one if you already had) */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 p-4">
          {/* Modal content omitted for brevity */}
        </div>
      )}
    </div>
  );
}
