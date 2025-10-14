import React, { useState, useMemo, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "../camera/cropImage";

type User = {
  id?: string;
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  pincode: string;
  address: string;
  dob: string;
  gender: string;
  photo: string;
  addresses?: string[];
};

type Product = {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  status?: "Delivered" | "Processing";
};

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "cart">(
    "profile"
  );
  const [user, setUser] = useState<User>({
    id: "",
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    pincode: "",
    address: "",
    dob: "",
    gender: "",
    photo: "",
    addresses: [],
  });
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<User>(user);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [showCropper, setShowCropper] = useState(false);

  const [orders] = useState<Product[]>([
    {
      id: 1,
      name: "Pink Handbag",
      image:
        "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=400&q=80",
      price: 1200,
      quantity: 1,
      status: "Delivered",
    },
    {
      id: 2,
      name: "Casual Sneakers",
      image:
        "https://images.unsplash.com/photo-1528701800489-476a1f1a6f38?auto=format&fit=crop&w=400&q=80",
      price: 2200,
      quantity: 1,
      status: "Processing",
    },
  ]);

  const [cart, setCart] = useState<Product[]>([
    {
      id: 101,
      name: "Rose Top",
      image:
        "https://images.unsplash.com/photo-1585386959984-a4155229b6e7?auto=format&fit=crop&w=400&q=80",
      price: 799,
      quantity: 1,
    },
    {
      id: 102,
      name: "Floral Dress",
      image:
        "https://images.unsplash.com/photo-1531123414780-f8f3e3f8d7a1?auto=format&fit=crop&w=400&q=80",
      price: 1599,
      quantity: 2,
    },
  ]);

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser({ ...user, ...parsed, addresses: parsed.addresses || [] });
        setEditData(parsed);
      } catch (err) {
        console.error("Failed to parse stored user", err);
      }
    }
  }, []);

  const openEdit = () => {
    setEditData(user);
    setEditing(true);
  };

  const saveProfile = async (e?: React.FormEvent) => {
    e?.preventDefault();
    // ... keep your saveProfile logic
  };

  const onCropComplete = useCallback(
    (_: any, croppedAreaPixels: any) => setCroppedAreaPixels(croppedAreaPixels),
    []
  );

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setShowCropper(true);
      };
    }
  };

  const handleCropSave = async () => {
    if (imageSrc && croppedAreaPixels) {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      setEditData({ ...editData, photo: croppedImage });
      setShowCropper(false);
    }
  };

  const changeQty = (id: number, delta: number) => {
    setCart((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, quantity: Math.max(1, it.quantity + delta) } : it
      )
    );
  };

  const removeItem = (id: number) => setCart((prev) => prev.filter((it) => it.id !== id));
  const grandTotal = useMemo(
    () => cart.reduce((s, it) => s + it.price * it.quantity, 0),
    [cart]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-pink-100 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Profile Header */}
        <div className="bg-white shadow-xl rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-center md:justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-pink-200 shadow-lg">
              <img
                src={user.photo || "https://via.placeholder.com/150?text=Profile"}
                alt="avatar"
                className="w-full h-full object-cover rounded-full transition-transform duration-300 hover:scale-105"
              />
              <label className="absolute bottom-0 right-0 bg-pink-600 text-white rounded-full p-2 cursor-pointer shadow-lg hover:bg-pink-700 transition">
                📷
                <input type="file" className="hidden" onChange={handlePhotoChange} />
              </label>
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{user.name}</h1>
              <p className="text-sm md:text-base text-gray-500">{user.email}</p>
              <div className="flex flex-wrap gap-4 text-sm md:text-base text-gray-600">
                <span><strong>Phone:</strong> {user.phone}</span>
                <span><strong>WhatsApp:</strong> {user.whatsapp}</span>
                <span><strong>Pincode:</strong> {user.pincode}</span>
                <span><strong>DOB:</strong> {user.dob}</span>
                <span><strong>Gender:</strong> {user.gender}</span>
              </div>
              <p className="text-sm md:text-base text-gray-500">{user.address}</p>
            </div>
          </div>
          <button
            onClick={openEdit}
            className="mt-4 md:mt-0 px-6 py-2 bg-pink-600 text-white rounded-full shadow-lg hover:bg-pink-700 transition"
          >
            Edit Profile
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-3xl shadow-md overflow-hidden">
          <nav className="flex border-b border-pink-100 bg-pink-50">
            {["profile", "orders", "cart"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 py-3 text-center font-medium transition-colors duration-300 ${
                  activeTab === tab
                    ? "text-pink-700 border-b-4 border-pink-600 bg-white"
                    : "text-pink-500 hover:text-pink-700"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>

          <div className="p-6 bg-white">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(user).map(([key, value]) => (
                  <div key={key} className="p-4 rounded-xl shadow-sm bg-pink-50 hover:shadow-md transition">
                    <p className="text-sm text-gray-500">{key.charAt(0).toUpperCase() + key.slice(1)}</p>
                    <p className="font-medium text-gray-800 truncate">{value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="space-y-4">
                {orders.map((o) => (
                  <div key={o.id} className="flex items-center gap-4 p-4 rounded-xl border border-pink-100 shadow hover:shadow-lg transition hover:-translate-y-1 transform bg-white">
                    <img src={o.image} alt={o.name} className="w-20 h-20 rounded-md object-cover" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{o.name}</h3>
                      <p className="text-sm text-gray-500">Qty: {o.quantity}</p>
                      <p className="font-semibold text-pink-600">₹{o.price}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      o.status === "Delivered" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {o.status}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Cart Tab */}
            {activeTab === "cart" && (
              <div className="space-y-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border border-pink-100 bg-pink-50 hover:shadow-lg transition-transform transform hover:-translate-y-1">
                    <img src={item.image} alt={item.name} className="w-24 h-32 sm:w-28 sm:h-36 object-cover rounded-lg"/>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-500">Unit Price: ₹{item.price}</p>
                      <div className="flex items-center gap-2 mt-2 border border-pink-200 rounded-lg bg-pink-100 px-2 py-1 w-max">
                        <button onClick={() => changeQty(item.id, -1)} className="p-1 hover:bg-pink-200 rounded">−</button>
                        <span className="min-w-[24px] text-center font-semibold text-pink-700">{item.quantity}</span>
                        <button onClick={() => changeQty(item.id, 1)} className="p-1 hover:bg-pink-200 rounded">+</button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <p className="font-bold text-pink-700 text-lg">₹{(item.price * item.quantity).toFixed(2)}</p>
                      <div className="flex gap-2">
                        <button onClick={() => removeItem(item.id)} className="text-sm text-red-500 hover:underline">Remove</button>
                        <button onClick={() => { removeItem(item.id); alert("Saved for later!"); }} className="text-sm text-pink-700 hover:underline">Save</button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="mt-6 p-6 rounded-xl shadow-lg bg-white flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Grand Total</p>
                    <p className="text-2xl font-bold text-gray-800">₹{grandTotal}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="font-semibold text-gray-700">Payment Method:</p>
                    <select className="p-2 border rounded-lg">
                      <option>Credit / Debit Card</option>
                      <option>Net Banking</option>
                      <option>UPI</option>
                      <option>Cash on Delivery</option>
                    </select>
                  </div>
                  <button className="px-6 py-2 bg-pink-600 text-white rounded-full shadow hover:bg-pink-700">Checkout</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit & Cropper Modals */}
      {/* ... keep your modals as before, styling can also be updated similarly */}
    </div>
  );
}
