import React, { useState, useEffect } from "react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Checkout() {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [amount, setAmount] = useState(0);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [errors, setErrors] = useState<any>({});

  // 🟢 Load user & product data from localStorage
  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("loggedInUser") || "null");
    const buyNowProduct = JSON.parse(localStorage.getItem("buyNowProduct") || "null");

    if (buyNowProduct) {
      setAmount(buyNowProduct.price * (buyNowProduct.quantity || 1));
      setCartItems([
        {
          product_id: buyNowProduct.id,
          product_variant_id: buyNowProduct.variant_id || null,
          selected_size: buyNowProduct.size,
          selected_color: buyNowProduct.color,
          price: buyNowProduct.price,
          quantity: buyNowProduct.quantity || 1,
          product_name: buyNowProduct.name,
          image_url: buyNowProduct.image_url || null, // ✅ store image URL
        },
      ]);
    } else {
      // fallback sample
      setAmount(2999);
      setCartItems([
        {
          product_id: "sample-id",
          product_variant_id: "variant-id",
          selected_size: "M",
          selected_color: "Brown",
          price: 2999,
          quantity: 1,
          product_name: "Leather Wallet",
          image_url: "https://cdn-icons-png.flaticon.com/512/2748/2748558.png",
        },
      ]);
    }

    if (loggedUser) {
      setAddress((prev) => ({ ...prev, name: loggedUser.name || "" }));
    }
  }, []);

  const loggedUser = JSON.parse(localStorage.getItem("loggedInUser") || "null");
  const userId = loggedUser?.id || "";

  // ✅ Address Validation
  const validateAddress = () => {
    const newErrors: any = {};
    if (!address.name) newErrors.name = "Name is required";
    if (!address.phone) newErrors.phone = "Phone number is required";
    else if (!/^[6-9]\d{9}$/.test(address.phone))
      newErrors.phone = "Enter a valid 10-digit phone number";
    if (!address.street) newErrors.street = "Street address is required";
    if (!address.city) newErrors.city = "City is required";
    if (!address.state) newErrors.state = "State is required";
    if (!address.pincode) newErrors.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(address.pincode))
      newErrors.pincode = "Enter a valid 6-digit pincode";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Create Order (Multipart - supports image upload)
  const createOrder = async (payment_method: string, payment_info: any = null) => {
    try {
      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("payment_method", payment_method);
      formData.append("shipping_address", JSON.stringify({
        name: address.name,
        phone: address.phone,
        line1: address.street,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
      }));
      formData.append("items", JSON.stringify(cartItems));
      if (payment_info) formData.append("payment_info", JSON.stringify(payment_info));

      // ✅ If any product has image file or URL
      cartItems.forEach((item, index) => {
        if (item.image_file) {
          formData.append("images", item.image_file); // upload file
        } else if (item.image_url) {
          formData.append("images", item.image_url); // backend will store as URL
        }
      });

      const response = await fetch("http://localhost:3000/orders", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert(`✅ Order placed successfully!\nOrder ID: ${data.id}`);
        console.log("Order Response:", data);
        localStorage.removeItem("buyNowProduct");
      } else {
        alert("❌ Failed to place order. Please try again.");
        console.error(data);
      }
    } catch (err) {
      console.error("Error creating order:", err);
      alert("⚠️ Something went wrong while placing the order.");
    }
  };

  // ✅ Razorpay Payment
  const handleRazorpay = async () => {
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
      name: "Swethaa Fashion Store",
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
  };

  // ✅ PayPal Payment
  const handlePayPal = async () => {
    window.open("https://www.paypal.com/paypalme/yourpaypalid", "_blank");
    createOrder("PayPal");
  };

  // ✅ COD
  const handleCOD = () => {
    alert("📦 Order placed successfully with Cash on Delivery!");
    createOrder("COD");
  };

  const handlePayment = () => {
    if (!validateAddress()) return alert("⚠️ Please fill in all address details");

    if (paymentMethod === "razorpay") handleRazorpay();
    else if (paymentMethod === "paypal") handlePayPal();
    else if (paymentMethod === "cod") handleCOD();
    else alert("Please select a payment method");
  };

  const handleChange = (e: any) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  // ✅ Preload product images for smoother UI
  useEffect(() => {
    cartItems.forEach((item) => {
      if (item.image_url) {
        const img = new Image();
        img.src = item.image_url.startsWith("http")
          ? item.image_url
          : `http://localhost:3000${item.image_url}`;
      }
    });
  }, [cartItems]);


  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 space-y-8">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          🛍️ Checkout - Swethaa Fashion
        </h2>

        {/* Address Section */}
        {/* 🛒 Order Summary */}
        <section className="border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-medium mb-4 text-gray-800">Order Summary</h3>

          {cartItems.map((item, index) => (
            <div key={index} className="flex items-center space-x-4 mb-4">
              <img
                src={
                  item.image_url?.startsWith("http")
                    ? item.image_url
                    : `http://localhost:3000${item.image_url}`
                }
                alt={item.product_name}
                className="w-20 h-20 object-cover rounded-lg border border-gray-200"
              />
              <div className="flex-1">
                <h4 className="text-gray-800 font-semibold">{item.product_name}</h4>
                <p className="text-sm text-gray-500">
                  {item.selected_color} | {item.selected_size}
                </p>
                <p className="text-sm text-gray-600">
                  ₹{item.price.toLocaleString()} × {item.quantity}
                </p>
              </div>
              <span className="text-gray-900 font-semibold">
                ₹{(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}

          <hr className="my-3" />
          <div className="flex justify-between text-gray-800 font-medium text-lg">
            <span>Total:</span>
            <span>₹{amount.toLocaleString()}</span>
          </div>
        </section>


        {/* Payment Section */}
        <section className="border border-gray-200 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Select Payment Method
          </h3>

          {[
            {
              value: "razorpay",
              label: "💳 Razorpay (UPI / Card / NetBanking)",
              desc: "Pay securely using Razorpay payment gateway",
            },
            {
              value: "paypal",
              label: "🌍 PayPal",
              desc: "Ideal for international transactions",
            },
            {
              value: "cod",
              label: "🚚 Cash on Delivery",
              desc: "Pay in cash or UPI when the product is delivered",
            },
          ].map((m) => (
            <label
              key={m.value}
              className="flex items-center gap-3 cursor-pointer border border-gray-200 p-3 rounded-lg hover:bg-gray-50"
            >
              <input
                type="radio"
                name="payment"
                value={m.value}
                checked={paymentMethod === m.value}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <div>
                <p className="font-medium text-gray-700">{m.label}</p>
                <p className="text-sm text-gray-500">{m.desc}</p>
              </div>
            </label>
          ))}
        </section>

        {/* Pay Button */}
        <div className="pt-4">
          <button
            onClick={handlePayment}
            className="bg-pink-600 hover:bg-pink-700 text-white text-lg font-medium py-3 w-full rounded-xl transition-all"
          >
            Proceed to Pay ₹{amount}
          </button>
        </div>
      </div>
    </div>
  );
}
