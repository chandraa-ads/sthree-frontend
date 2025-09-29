import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface TrackingData {
  orderId: string;
  status: string;
  expectedDate: string;
  items: { product: string; quantity: number }[];
}

const steps = ["Processing", "Packed", "Shipped", "Out for Delivery", "Delivered"];

const OrderTracking: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [tracking, setTracking] = useState<TrackingData | null>(null);

  useEffect(() => {
    async function fetchTracking() {
      const res = await fetch(`/api/orders/${orderId}`);
      const data = await res.json();
      setTracking(data);
    }
    fetchTracking();
  }, [orderId]);

  if (!tracking) {
    return <p className="p-6 text-center">Loading tracking info...</p>;
  }

  const currentStep = steps.indexOf(tracking.status);

  return (
    
    <div className="max-w-3xl mx-auto my-10 p-8 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Order Tracking</h2>
      <p className="text-center mb-6">
        <strong>Order ID:</strong> {tracking.orderId} |{" "}
        <strong>Expected:</strong> {tracking.expectedDate}
      </p>

      {/* Progress Bar */}
      <div className="flex justify-between items-center relative mb-10">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-300 -z-10"></div>
        <div
          className="absolute top-1/2 left-0 h-1 bg-green-500 -z-10 transition-all duration-500"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        ></div>

        {steps.map((step, i) => (
          <div key={i} className="flex flex-col items-center w-1/5">
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full border-2 font-bold transition-all duration-300 ${
                i <= currentStep
                  ? "bg-green-500 text-white border-green-500"
                  : "bg-white border-gray-300 text-gray-400"
              }`}
            >
              {i + 1}
            </div>
            <span
              className={`mt-2 text-sm font-medium ${
                i <= currentStep ? "text-green-600" : "text-gray-500"
              }`}
            >
              {step}
            </span>
          </div>
        ))}
      </div>

      {/* Items */}
      <div>
        <h3 className="font-semibold mb-2">Items in your order:</h3>
        <ul className="list-disc list-inside text-gray-700">
          {tracking.items.map((it, i) => (
            <li key={i}>
              {it.product} × {it.quantity}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrderTracking;
