import React, { useState } from "react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Checkout() {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [amount, setAmount] = useState(999);
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [errors, setErrors] = useState<any>({});

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

  // ✅ Razorpay Handler
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
      description: "Dress Purchase Payment",
      order_id: order.id,
      handler: function (response: any) {
        alert(`✅ Payment successful! ID: ${response.razorpay_payment_id}`);
      },
      prefill: {
        name: address.name,
        email: "customer@example.com",
        contact: address.phone,
      },
      theme: { color: "#F37254" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // ✅ PayPal Handler
  const handlePayPal = () => {
    window.open("https://www.paypal.com/paypalme/yourpaypalid", "_blank");
  };

  // ✅ Cash on Delivery
  const handleCOD = () => {
    alert("📦 Order placed successfully with Cash on Delivery!");
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

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 space-y-8">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          🛍️ Checkout - Swethaa Fashion
        </h2>

        {/* Address Section */}
        <section className="border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-medium mb-4 text-gray-800">
            Delivery Address
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["name", "phone", "street", "city", "state", "pincode"].map(
              (field) => (
                <div key={field} className="col-span-1">
                  <input
                    type={field === "phone" || field === "pincode" ? "number" : "text"}
                    name={field}
                    value={(address as any)[field]}
                    onChange={handleChange}
                    placeholder={
                      field === "street"
                        ? "Street Address"
                        : field.charAt(0).toUpperCase() + field.slice(1)
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500 outline-none"
                  />
                  {errors[field] && (
                    <p className="text-sm text-red-500 mt-1">{errors[field]}</p>
                  )}
                </div>
              )
            )}
          </div>
        </section>

        {/* Payment Method Section */}
        <section className="border border-gray-200 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Select Payment Method
          </h3>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer border border-gray-200 p-3 rounded-lg hover:bg-gray-50">
              <input
                type="radio"
                name="payment"
                value="razorpay"
                checked={paymentMethod === "razorpay"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <div>
                <p className="font-medium text-gray-700">
                  💳 Razorpay (UPI / Card / NetBanking)
                </p>
                <p className="text-sm text-gray-500">
                  Pay securely using Razorpay payment gateway
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer border border-gray-200 p-3 rounded-lg hover:bg-gray-50">
              <input
                type="radio"
                name="payment"
                value="paypal"
                checked={paymentMethod === "paypal"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <div>
                <p className="font-medium text-gray-700">🌍 PayPal</p>
                <p className="text-sm text-gray-500">
                  Ideal for international transactions
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer border border-gray-200 p-3 rounded-lg hover:bg-gray-50">
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <div>
                <p className="font-medium text-gray-700">🚚 Cash on Delivery</p>
                <p className="text-sm text-gray-500">
                  Pay in cash or UPI when the product is delivered
                </p>
              </div>
            </label>
          </div>
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
