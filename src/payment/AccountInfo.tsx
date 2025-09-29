// src/components/payment/AccountInfo.tsx
import React, { useMemo, useState } from "react";


interface CartItem {
  product: string;
  size: string;
  quantity: number;
  price: number;
}

const SAMPLE_COUPONS: Record<
  string,
  { type: "percent" | "flat"; value: number; description?: string }
> = {
  SAVE10: { type: "percent", value: 10, description: "10% off" },
  FLAT100: { type: "flat", value: 100, description: "₹100 off" },
};

const AccountInfo: React.FC = () => {
  const [cartItems] = useState<CartItem[]>([
    { product: "T-Shirt", size: "M", quantity: 2, price: 500 },
    { product: "Jeans", size: "32", quantity: 1, price: 1200 },
  ]);

  // Customer / Shipping states
  const [firstName, setFirstName] = useState("Mark");
  const [lastName, setLastName] = useState("Cole");
  const [email, setEmail] = useState("swoo@gmail.com");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [pinCode, setPinCode] = useState("641-107");
  const [phone1, setPhone1] = useState("+1 0231 4554 452");
  const [phone2, setPhone2] = useState("+1 0231 4554 452");

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvv: "" });
  const [upiId, setUpiId] = useState("");
  const [bank, setBank] = useState("");

  // Coupon
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const subtotal = useMemo(
    () => cartItems.reduce((s, it) => s + it.price * it.quantity, 0),
    [cartItems]
  );

  // Business rules (example)
  const DELIVERY_FREE_OVER = 2000; // free delivery threshold
  const FLAT_DELIVERY = 50;
  const gstRate = 0.18; // 18% GST

  const deliveryCharge = subtotal >= DELIVERY_FREE_OVER ? 0 : FLAT_DELIVERY;
  const gstAmount = +(subtotal * gstRate).toFixed(2);

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    const c = SAMPLE_COUPONS[appliedCoupon];
    if (!c) return 0;
    if (c.type === "percent") {
      return +(subtotal * (c.value / 100)).toFixed(2);
    } else {
      return Math.min(c.value, subtotal);
    }
  }, [appliedCoupon, subtotal]);

  const total = +(subtotal + deliveryCharge + gstAmount - discount).toFixed(2);

  const [isProcessing, setIsProcessing] = useState(false);

  function applyCoupon() {
    setCouponError(null);
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setCouponError("Enter coupon code.");
      return;
    }
    const c = SAMPLE_COUPONS[code];
    if (!c) {
      setCouponError("Invalid coupon.");
      return;
    }
    setAppliedCoupon(code);
    setCouponError(null);
  }

  async function confirmOrder() {
    if (isProcessing) return;
    // basic validation
    if (!firstName || !lastName || !email) {
      alert("Please fill name and email.");
      return;
    }
    if (!paymentMethod) {
      alert("Select payment method.");
      return;
    }
    if (paymentMethod === "Credit Card") {
      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv) {
        alert("Please fill card details.");
        return;
      }
    }
    if (paymentMethod === "UPI" && !upiId) {
      alert("Enter UPI ID.");
      return;
    }
    if (paymentMethod === "Net Banking" && !bank) {
      alert("Select bank.");
      return;
    }

    setIsProcessing(true);

    // Build order payload to send to backend
    const orderPayload = {
      customer: {
        firstName,
        lastName,
        email,
        phone1,
        phone2,
      },
      shippingAddress: {
        address1,
        address2,
        city,
        pinCode,
      },
      items: cartItems,
      paymentMethod,
      totals: {
        subtotal,
        gst: gstAmount,
        deliveryCharge,
        discount,
        total,
      },
      coupon: appliedCoupon || null,
      createdAt: new Date().toISOString(),
    };

    try {
      // If payment method is COD, simply create order server-side and set status 'pending' or 'confirmed' per business logic
      if (paymentMethod === "COD") {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...orderPayload, paymentInfo: { method: "COD" } }),
        });
        const data = await res.json();
        // handle server response (show order id / success)
        alert("Order placed (COD). Order id: " + (data.orderId || "—"));
      } else {
        // For online payments: ask backend to create a payment session (Razorpay / Stripe)
        // Backend should create payment intent/order and return provider info
        const paymentInit = await fetch("/api/payments/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: orderPayload }),
        });
        const payData = await paymentInit.json();
        // Example Razorpay response: { orderId, amount, currency, key }
        // Example Stripe: { sessionUrl }
        if (payData.sessionUrl) {
          // Stripe-like: redirect to hosted checkout
          window.location.href = payData.sessionUrl;
        } else if (payData.razorpay) {
          // Example: open Razorpay checkout (frontend code)
          const { orderId, amount, key } = payData.razorpay;
          // NOTE: include razorpay checkout script in index.html or load dynamically
          const options = {
            key,
            amount,
            order_id: orderId,
            name: `${firstName} ${lastName}`,
            description: "Order Payment",
            handler: async function (response: any) {
              // response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature
              // send to backend to verify
              const verify = await fetch("/api/payments/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                  orderPayload,
                }),
              });
              const verifyRes = await verify.json();
              if (verifyRes.success) {
                alert("Payment successful & order confirmed! Order id: " + verifyRes.orderId);
              } else {
                alert("Payment verification failed. Contact support.");
              }
            },
            prefill: {
              email,
              contact: phone1,
            },
            theme: { color: "#F97316" },
          };
          // @ts-ignore
          const rz = new (window as any).Razorpay(options);
          rz.open();
        } else {
          alert("Payment setup failed on server.");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Error placing order. See console.");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="flex max-w-6xl mx-auto my-10 bg-white rounded-xl overflow-hidden shadow-lg flex-col md:flex-row">
      {/* LEFT PROFILE */}
    

      {/* RIGHT CONTENT */}
      <div className="flex-1 p-8">
        {/* BEFORE PAYMENT */}
        <h2 className="text-2xl font-bold mb-6">Account & Shipping Info</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="p-2 border rounded-md" />
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="p-2 border rounded-md" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="p-2 border rounded-md" />
          <input value={phone1} onChange={(e) => setPhone1(e.target.value)} className="p-2 border rounded-md" />
        </div>

        <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input value={address1} onChange={(e) => setAddress1(e.target.value)} placeholder="Address Line 1" className="p-2 border rounded-md" />
          <input value={address2} onChange={(e) => setAddress2(e.target.value)} placeholder="Address Line 2" className="p-2 border rounded-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="p-2 border rounded-md" />
          <input value={pinCode} onChange={(e) => setPinCode(e.target.value)} placeholder="Pin Code" className="p-2 border rounded-md" />
        </div>

        {/* ORDER ITEMS */}
        <h3 className="text-lg font-semibold mb-2">Order Items</h3>
        <div className="overflow-x-auto rounded-lg shadow mb-6">
          <table className="w-full border-collapse">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="p-3 text-center">Product</th>
                <th className="p-3 text-center">Size</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-center">Price</th>
                <th className="p-3 text-center">Sub</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="p-3 text-center">{item.product}</td>
                  <td className="p-3 text-center">{item.size}</td>
                  <td className="p-3 text-center">{item.quantity}</td>
                  <td className="p-3 text-center">₹{item.price}</td>
                  <td className="p-3 text-center">₹{item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAYMENT */}
        <h2 className="text-2xl font-bold mb-4">Payment Method</h2>
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full p-2 mb-4 border rounded-md">
          <option value="">-- Select --</option>
          <option value="Credit Card">Credit / Debit Card</option>
          <option value="UPI">UPI</option>
          <option value="Net Banking">Net Banking</option>
          <option value="COD">Cash on Delivery</option>
        </select>

        {paymentMethod === "Credit Card" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input value={cardDetails.number} onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })} placeholder="Card Number" className="p-2 border rounded-md" />
            <input value={cardDetails.expiry} onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })} placeholder="MM/YY" className="p-2 border rounded-md" />
            <input value={cardDetails.cvv} onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })} placeholder="CVV" className="p-2 border rounded-md" />
          </div>
        )}
        {paymentMethod === "UPI" && (
          <div className="mb-4">
            <input value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="example@upi" className="w-full p-2 border rounded-md" />
          </div>
        )}
        {paymentMethod === "Net Banking" && (
          <div className="mb-4">
            <select value={bank} onChange={(e) => setBank(e.target.value)} className="w-full p-2 border rounded-md">
              <option value="">-- Select Bank --</option>
              <option value="SBI">SBI</option>
              <option value="HDFC">HDFC</option>
              <option value="ICICI">ICICI</option>
            </select>
          </div>
        )}

        {/* COUPON */}
        <div className="mb-6 flex gap-2">
          <input value={couponInput} onChange={(e) => setCouponInput(e.target.value)} placeholder="Coupon code" className="p-2 border rounded-md flex-1" />
          <button onClick={applyCoupon} className="px-4 py-2 bg-blue-600 text-white rounded-md">Apply</button>
        </div>
        {appliedCoupon && <div className="mb-4 text-green-700">Applied: {appliedCoupon} — {SAMPLE_COUPONS[appliedCoupon].description}</div>}
        {couponError && <div className="mb-4 text-red-600">{couponError}</div>}

        {/* ORDER SUMMARY */}
        <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
        <div className="mb-6 space-y-2 text-gray-800">
          <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>GST ({(gstRate*100).toFixed(0)}%)</span><span>₹{gstAmount.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Delivery</span><span>₹{deliveryCharge.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Discount</span><span>- ₹{discount.toFixed(2)}</span></div>
          <div className="border-t pt-2 flex justify-between font-bold"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
        </div>

        {/* CONFIRM */}
        <div className="text-center">
          <button
            onClick={confirmOrder}
            disabled={isProcessing}
            className="bg-green-600 disabled:opacity-60 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-green-700 transition-transform"
          >
            {isProcessing ? "Processing..." : "ORDER CONFIRM"}
          </button>
        </div>
      </div>
    </div>
    const Home: React.FC = () => {
  return (
    <div>
      {/* Services Section */}
      <Services />

      {/* Featured Products Section */}
      <FeaturedProducts />

      {/* Testimonials Section */}
      <Testimonials />
    </div>
  );
};

export default Home;

  );
};

export default AccountInfo;
