import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import logo from '../assets/webpicon/logo.webp'
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Checkout() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [amount, setAmount] = useState(0);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [errors, setErrors] = useState<any>({});

  // 🟢 Load user, checkoutData, or buyNowProduct
  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("loggedInUser") || "null");
    const checkoutData = JSON.parse(localStorage.getItem("checkoutData") || "null");
    const buyNowProduct = JSON.parse(localStorage.getItem("buyNowProduct") || "null");

    if (checkoutData) {
      setCartItems(checkoutData.cartItems || []);
      const total = (checkoutData.subtotal || 0) + (checkoutData.deliveryFee || 0);
      setAmount(total);
    } else if (buyNowProduct) {
      const total = buyNowProduct.price * (buyNowProduct.quantity || 1);
      setAmount(total);
      setCartItems([
        {
          image_file: buyNowProduct.image_file || null,
          image_url: buyNowProduct.image_url || "",
          product_variant_id: buyNowProduct.variant_id || null,
          selected_size: buyNowProduct.size,
          selected_color: buyNowProduct.color,
          price: buyNowProduct.price,
          quantity: buyNowProduct.quantity || 1,
          product_id: buyNowProduct.id,
          product_name: buyNowProduct.name,
        },
      ]);
    }

    if (loggedUser) {
      setAddress((prev) => ({ ...prev, name: loggedUser.name || "" }));
    }
  }, []);

  const loggedUser = JSON.parse(localStorage.getItem("loggedInUser") || "null");
  const userId = loggedUser?.id || "";

  // ✅ Validate Address
  const validateAddress = () => {
    const newErrors: any = {};
    if (!address.name) newErrors.name = "Name is required";
    if (!address.phone) newErrors.phone = "Phone number is required";
    else if (!/^[6-9]\d{9}$/.test(address.phone))
      newErrors.phone = "Enter a valid 10-digit phone number";
    if (!address.street) newErrors.street = "Street is required";
    if (!address.city) newErrors.city = "City is required";
    if (!address.state) newErrors.state = "State is required";
    if (!address.pincode) newErrors.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(address.pincode))
      newErrors.pincode = "Enter a valid 6-digit pincode";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Create Order API
  const createOrder = async (payment_method: string, payment_info: any = null) => {
    try {
      setIsProcessing(true);

      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("payment_method", payment_method);
      formData.append(
        "shipping_address",
        JSON.stringify({
          line1: address.street,
          city: address.city,
          pincode: address.pincode,
          state: address.state,
        })
      );

      const formattedItems = cartItems.map((item) => ({
        image_file: item.image_file ? "file" : "string",
        product_variant_id: item.product_variant_id,
        selected_size: item.selected_size || item.size,
        price: item.price,
        quantity: item.quantity,
        image_url: item.image_url,
        product_id: item.product_id,
        product_name: item.product_name || item.name,
        selected_color: item.selected_color || item.color,
      }));

      formData.append("items", JSON.stringify(formattedItems));

      cartItems.forEach((item, index) => {
        if (item.image_file instanceof File) {
          formData.append(`image_file_${index}`, item.image_file);
        }
      });

      const res = await fetch("https://nettly-indebted-kurtis.ngrok-free.dev/orders", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Order placed successfully!");
        console.log("Order Response:", data);
        localStorage.removeItem("buyNowProduct");
        localStorage.removeItem("checkoutData");
        navigate("/userprofile"); // ✅ Redirect
      } else {
        console.error("❌ Error Response:", data);
        alert("❌ Failed to place order. Please try again.");
      }
    } catch (err) {
      console.error("Error creating order:", err);
      alert("⚠️ Something went wrong while placing the order.");
    } finally {
      setIsProcessing(false);
    }
  };

  // ✅ Razorpay
  const handleRazorpay = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch("http://localhost:5000/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const order = await res.json();

      const options = {
        key: "YOUR_RAZORPAY_KEY_ID",
        amount: order.amount,
        currency: "INR",
        name: "SthRee Store",
        description: "Order Payment",
        order_id: order.id,
        handler: function (response: any) {
          alert(`✅ Payment successful! ID: ${response.razorpay_payment_id}`);
          createOrder("Razorpay", {
            payment_id: response.razorpay_payment_id,
            order_id: response.razorpay_order_id,
            signature: response.razorpay_signature,
          });
        },
        prefill: {
          name: address.name,
          email: loggedUser?.email || "customer@example.com",
          contact: address.phone,
        },
        theme: { color: "#F37254" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("⚠️ Unable to initiate Razorpay payment.");
      console.error(err);
      setIsProcessing(false);
    }
  };

  // ✅ PayPal
  const handlePayPal = async () => {
    setIsProcessing(true);
    window.open("https://www.paypal.com/paypalme/yourpaypalid", "_blank");
    createOrder("PayPal");
  };

  // ✅ COD
  const handleCOD = () => {
    setIsProcessing(true);
    createOrder("COD");
  };

  const handlePayment = () => {
    if (!validateAddress()) return alert("⚠️ Please fill all address details");
    if (paymentMethod === "razorpay") handleRazorpay();
    else if (paymentMethod === "paypal") handlePayPal();
    else if (paymentMethod === "cod") handleCOD();
    else alert("Please select a payment method");
  };

  const handleChange = (e: any) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };



  const handleRemoveItem = (index: number) => {
    const updatedItems = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedItems);

    // Update localStorage if applicable
    const checkoutData = JSON.parse(localStorage.getItem("checkoutData") || "null");
    if (checkoutData) {
      checkoutData.cartItems = updatedItems;
      checkoutData.subtotal = updatedItems.reduce(
        (sum: number, item: any) => sum + Number(item.price) * Number(item.quantity),
        0
      );
      checkoutData.totalAmount =
        checkoutData.subtotal + (checkoutData.deliveryFee || 0);
      localStorage.setItem("checkoutData", JSON.stringify(checkoutData));
    }

    // Recalculate total amount
    const newTotal =
      updatedItems.reduce(
        (sum: number, item: any) => sum + Number(item.price) * Number(item.quantity),
        0
      ) + (checkoutData?.deliveryFee || 0);
    setAmount(newTotal);
  };


  // ✅ Preload images
  useEffect(() => {
    cartItems.forEach((item) => {
      if (item.image_url) {
        const img = new Image();
        img.src = item.image_url;
      }
    });
  }, [cartItems]);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 space-y-8">
        <h2 className="text-2xl font-semibold text-gray-800 text-center flex items-center justify-center gap-3">
          <img
            src={logo}
            alt="SthRee Logo"
            className="w-20 h-10 object-contain rounded-md shadow-sm"
          />
          <span>Checkout - <span className="text-pink-600">SthRee</span></span>
        </h2>


        {/* Address Section */}
        <section className="border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-medium mb-4 text-gray-800">Shipping Address</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={address.name}
              onChange={handleChange}
              className={`border rounded-lg p-2 w-full ${errors.name ? "border-red-500" : "border-gray-300"}`}
            />

            {/* Phone */}
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={address.phone}
              onChange={handleChange}
              className={`border rounded-lg p-2 w-full ${errors.phone ? "border-red-500" : "border-gray-300"}`}
            />

            {/* Street */}
            <input
              type="text"
              name="street"
              placeholder="Street / Area"
              value={address.street}
              onChange={handleChange}
              className={`border rounded-lg p-2 w-full col-span-2 ${errors.street ? "border-red-500" : "border-gray-300"}`}
            />

            {/* City - searchable dropdown */}
            <div className="relative">
              <input
                type="text"
                name="city"
                placeholder="City"
                value={address.city}
                onChange={handleChange}
                list="city-list"
                className={`border rounded-lg p-2 w-full ${errors.city ? "border-red-500" : "border-gray-300"}`}
              />
              <datalist id="city-list">
                {[
                  "Coimbatore",
                  "Chennai",
                  "Madurai",
                  "Salem",
                  "Erode",
                  "Tirupur",
                  "Trichy",
                  "Vellore",
                  "Nagercoil",
                  "Thanjavur",
                ].map((city) => (
                  <option key={city} value={city} />
                ))}
              </datalist>
            </div>

            {/* State - searchable dropdown */}
            <div className="relative">
              <input
                type="text"
                name="state"
                placeholder="State"
                value={address.state}
                onChange={handleChange}
                list="state-list"
                className={`border rounded-lg p-2 w-full ${errors.state ? "border-red-500" : "border-gray-300"}`}
              />
              <datalist id="state-list">
                {[
                  "Tamil Nadu",
                  "Kerala",
                  "Karnataka",
                  "Andhra Pradesh",
                  "Telangana",
                  "Maharashtra",
                  "Gujarat",
                  "Delhi",
                  "West Bengal",
                  "Odisha",
                  "Rajasthan",
                  "Punjab",
                  "Haryana",
                  "Uttar Pradesh",
                  "Madhya Pradesh",
                  "Bihar",
                ].map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>

            {/* Pincode */}
            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={address.pincode}
              onChange={handleChange}
              className={`border rounded-lg p-2 w-full ${errors.pincode ? "border-red-500" : "border-gray-300"}`}
            />
          </div>
        </section>

        {/* Order Summary */}
        {!isProcessing && (
          <section className="border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-medium mb-4 text-gray-800">Order Summary</h3>

            {cartItems.length === 0 ? (
              <p className="text-gray-500 text-center py-4">🛒 No items in your cart</p>
            ) : (
              <>
                {cartItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-4 mb-4 border-b pb-3 relative group"
                  >
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">
                        {item.name || item.product_name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Color: {item.color || item.selected_color} | Size:{" "}
                        {item.size || item.selected_size}
                      </p>
                      <p className="text-sm text-gray-600">
                        ₹{item.price} × {item.quantity} = ₹
                        {(Number(item.price) * Number(item.quantity)).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(i)}
                      className="text-gray-500 hover:text-red-600 transition-all"
                      title="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}

                <hr className="my-3" />
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal:</span>
                  <span>
                    ₹
                    {cartItems
                      .reduce(
                        (sum, item) => sum + Number(item.price) * Number(item.quantity),
                        0
                      )
                      .toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-gray-700 mt-1">
                  <span>Delivery Fee:</span>
                  <span>
                    ₹
                    {JSON.parse(localStorage.getItem("checkoutData") || "{}")
                      ?.deliveryFee || 0}
                  </span>
                </div>

                {/* 🚚 Estimated Delivery */}
                <div className="flex justify-between text-gray-700 mt-1">
                  <span>Estimated Delivery:</span>
                  <span className="font-medium">
                    {address.city?.toLowerCase() === "coimbatore"
                      ? "3 Days"
                      : "5 Days"}
                  </span>
                </div>

                <div className="flex justify-between text-gray-800 font-medium text-lg mt-2 border-t pt-3">
                  <span>Total:</span>
                  <span>₹{amount.toLocaleString()}</span>
                </div>
              </>
            )}
          </section>
        )}




        {/* Loading State */}
        {isProcessing && (
          <div className="text-center text-lg text-gray-700 font-medium py-6 animate-pulse">
            💳 Processing your payment... please wait
          </div>
        )}



        {/* Pay Button */}
        {/* Payment Methods */}
        {!isProcessing && (
          <section className="border border-gray-200 rounded-xl p-6 space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              💰 Select Payment Method
            </h3>

            <div className="space-y-3">
              {/* Razorpay */}
              <div
                className="flex items-center justify-between border rounded-xl p-4 bg-gray-50 opacity-60 cursor-not-allowed"
                title="Coming soon"
              >
                <div className="flex items-center gap-3">
                  <input type="radio" disabled />
                  <div>
                    <p className="font-medium text-gray-700">
                      💳 Razorpay (UPI / Card)
                    </p>
                    <p className="text-xs text-gray-500">Coming soon — available in future</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500 border border-gray-300 px-2 py-1 rounded-md">
                  Coming Soon
                </span>
              </div>

              {/* PayPal */}
              <div
                className="flex items-center justify-between border rounded-xl p-4 bg-gray-50 opacity-60 cursor-not-allowed"
                title="Coming soon"
              >
                <div className="flex items-center gap-3">
                  <input type="radio" disabled />
                  <div>
                    <p className="font-medium text-gray-700">🌍 PayPal</p>
                    <p className="text-xs text-gray-500">International payments coming soon</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500 border border-gray-300 px-2 py-1 rounded-md">
                  Coming Soon
                </span>
              </div>

              {/* Cash on Delivery */}
              <label className="flex items-center justify-between border rounded-xl p-4 hover:bg-pink-50 cursor-pointer transition">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div>
                    <p className="font-medium text-gray-800">🚚 Cash on Delivery</p>
                    <p className="text-xs text-gray-500">
                      Pay in cash when your order arrives
                    </p>
                  </div>
                </div>
                {paymentMethod === "cod" && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-md">
                    Selected
                  </span>
                )}
              </label>
            </div>
          </section>
        )}
        {/* Proceed to Pay Button */}
        {!isProcessing && (
          <div className="text-center mt-6">
            <button
              onClick={handlePayment}
              className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all duration-300"
            >
              {isProcessing ? "Processing..." : "🛒 Proceed to Pay"}
            </button>

            {/* Contact Info */}
            <div className="mt-4 text-gray-600 text-sm">
              <p>
                Have a query?{" "}
                <a
                  href="tel:+918903284455"
                  className="text-pink-600 hover:underline font-medium"
                >
                  📞 Call
                </a>{" "}
                or{" "}
                <a
                  href="https://wa.me/918903284455"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:underline font-medium"
                >
                  💬 WhatsApp
                </a>
              </p>
            </div>
          </div>
        )}


      </div>
    </div>
  );
}
