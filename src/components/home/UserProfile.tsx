import React, { useState, useEffect } from "react";
import {
  User,
  Package,
  Edit3,
  Camera,
  XCircle,
  Save,
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

  // Fetch user data once
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

      // Only update fields that are empty in frontend (prevent overwriting)
      setUser((prev) => ({
        name: prev.name || profile.full_name || "",
        email: prev.email || profile.email || "",
        phone: prev.phone || profile.phone || "",
        whatsapp: prev.whatsapp || profile.whatsapp_no || "",
        address: prev.address || formattedAddress,
        dob: prev.dob || profile.dob || "",
        gender: prev.gender || profile.gender || "",
      }));

      setEditUser((prev) => ({
        name: prev.name || profile.full_name || "",
        email: prev.email || profile.email || "",
        phone: prev.phone || profile.phone || "",
        whatsapp: prev.whatsapp || profile.whatsapp_no || "",
        address: prev.address || formattedAddress,
        dob: prev.dob || profile.dob || "",
        gender: prev.gender || profile.gender || "",
      }));

      if (profile.profile_photo) setPhoto(profile.profile_photo);
    } catch (err) {
      console.error(err);
    }
  };

  fetchUser();
}, [userId, token]);


  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!userId) return alert("User not logged in!");

    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("full_name", editUser.name || "");
      formData.append("phone", editUser.phone || "");
      formData.append("whatsapp_no", editUser.whatsapp || "");
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

      setUser(editUser); // Update frontend only after save
      if (data.profile?.profile_photo) setPhoto(data.profile.profile_photo);
      setIsModalOpen(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile. Try again.");
    }
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
            className={`flex items-center gap-3 px-5 py-3 rounded-xl transition transform hover:scale-[1.03] hover:shadow-md ${
              activeTab === "info" ? "bg-pink-100 text-pink-700 shadow-inner" : ""
            }`}
          >
            <User className="w-5 h-5" /> Your Info
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-3 px-5 py-3 rounded-xl transition transform hover:scale-[1.03] hover:shadow-md ${
              activeTab === "orders" ? "bg-pink-100 text-pink-700 shadow-inner" : ""
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
                    <p className="text-gray-500 text-sm">Quantity: {order.quantity}</p>
                    <p className="text-pink-700 font-bold mt-1">₹{order.price}</p>
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

      {/* Edit Profile Modal */}
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

            {/* Photo Upload */}
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

            {/* Form Inputs */}
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="text-xs uppercase text-gray-500">Name</label>
                <input
                  type="text"
                  value={editUser.name}
                  onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                  className="w-full border border-pink-100 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="text-xs uppercase text-gray-500">Phone</label>
                <input
                  type="text"
                  value={editUser.phone}
                  onChange={(e) => {
                    const onlyDigits = e.target.value.replace(/\D/g, "");
                    setEditUser({ ...editUser, phone: onlyDigits });
                  }}
                  placeholder="Enter phone number"
                  className="w-full border border-pink-100 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>

              {/* WhatsApp */}
              <div>
                <label className="text-xs uppercase text-gray-500">WhatsApp</label>
                <input
                  type="text"
                  value={editUser.whatsapp}
                  onChange={(e) => {
                    const onlyDigits = e.target.value.replace(/\D/g, "");
                    setEditUser({ ...editUser, whatsapp: onlyDigits });
                  }}
                  placeholder="Enter WhatsApp number"
                  className="w-full border border-pink-100 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>

              {/* DOB */}
              <div>
                <label className="text-xs uppercase text-gray-500">Date of Birth</label>
                <div className="flex gap-2 mt-1">
                  {/* Day */}
                  <select
                    value={editUser.dob?.split("-")[2] || ""}
                    onChange={(e) => {
                      const [year, month] = editUser.dob.split("-");
                      setEditUser({
                        ...editUser,
                        dob: `${year || "2000"}-${month || "01"}-${e.target.value}`,
                      });
                    }}
                    className="border border-pink-100 rounded-lg px-2 py-1"
                  >
                    <option value="">Day</option>
                    {Array.from({ length: 31 }, (_, i) => (
                      <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                        {i + 1}
                      </option>
                    ))}
                  </select>

                  {/* Month */}
                  <select
                    value={editUser.dob?.split("-")[1] || ""}
                    onChange={(e) => {
                      const [year, , day] = editUser.dob.split("-");
                      setEditUser({
                        ...editUser,
                        dob: `${year || "2000"}-${e.target.value}-${day || "01"}`,
                      });
                    }}
                    className="border border-pink-100 rounded-lg px-2 py-1"
                  >
                    <option value="">Month</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                        {i + 1}
                      </option>
                    ))}
                  </select>

                  {/* Year */}
                  <select
                    value={editUser.dob?.split("-")[0] || ""}
                    onChange={(e) => {
                      const [, month, day] = editUser.dob.split("-");
                      setEditUser({
                        ...editUser,
                        dob: `${e.target.value}-${month || "01"}-${day || "01"}`,
                      });
                    }}
                    className="border border-pink-100 rounded-lg px-2 py-1"
                  >
                    <option value="">Year</option>
                    {Array.from({ length: 100 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="text-xs uppercase text-gray-500">Gender</label>
                <select
                  value={editUser.gender}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEditUser({ ...editUser, gender: val });
                    setShowOtherGender(val === "Other");
                  }}
                  className="w-full border border-pink-100 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-300"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {showOtherGender && (
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Enter gender"
                    value={editUser.gender}
                    onChange={(e) =>
                      setEditUser({ ...editUser, gender: e.target.value })
                    }
                    className="w-full border border-pink-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                </div>
              )}

              {/* Address */}
              <div>
                <label className="text-xs uppercase text-gray-500">Address</label>
                <input
                  type="text"
                  value={editUser.address}
                  onChange={(e) => setEditUser({ ...editUser, address: e.target.value })}
                  className="w-full border border-pink-100 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>
            </div>

            {/* Save Button */}
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
