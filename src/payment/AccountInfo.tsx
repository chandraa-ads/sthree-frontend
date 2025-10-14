// src/components/payment/AccountInfo.tsx
import React, { useMemo, useState } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

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
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
  });
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

  // Business rules
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

    // validations
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
      if (paymentMethod === "COD") {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...orderPayload,
            paymentInfo: { method: "COD" },
          }),
        });
        const data = await res.json();
        alert("Order placed (COD). Order id: " + (data.orderId || "—"));
      } else {
        const paymentInit = await fetch("/api/payments/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: orderPayload }),
        });
        const payData = await paymentInit.json();

        if (payData.sessionUrl) {
          window.location.href = payData.sessionUrl;
        } else if (payData.razorpay) {
          const { orderId, amount, key } = payData.razorpay;
          const options = {
            key,
            amount,
            order_id: orderId,
            name: `${firstName} ${lastName}`,
            description: "Order Payment",
            handler: async function (response: any) {
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
                alert(
                  "Payment successful & order confirmed! Order id: " +
                    verifyRes.orderId
                );
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
      {/* RIGHT CONTENT */}
      <div className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-6">Account & Shipping Info</h2>

        {/* form inputs, order items, payment method ... */}
        {/* (your UI code is unchanged here, I just cleaned structure) */}

      </div>
    </div>
  );
};

export default AccountInfo;
