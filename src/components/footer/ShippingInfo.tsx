import React from "react";
import { motion } from "framer-motion";
import { Truck, Globe, Clock, PackageCheck } from "lucide-react";

interface InfoCard {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  desc: string;
}

interface FAQItem {
  q: string;
  a: string;
}

const ShippingInfo: React.FC = () => {
  const infoCards: InfoCard[] = [
    {
      Icon: Truck,
      title: "Free Shipping",
      desc: "Enjoy free delivery on all orders above ₹1,999 anywhere in India.",
    },
    {
      Icon: Clock,
      title: "Delivery Time",
      desc: "Orders are processed within 24–48 hours and delivered in 3–7 business days.",
    },
    {
      Icon: PackageCheck,
      title: "Order Tracking",
      desc: "You’ll receive tracking details once your order is shipped.",
    },
    {
      Icon: Globe,
      title: "International Shipping",
      desc: "We also ship globally — charges and timelines vary by destination.",
    },
  ];

  const faqItems: FAQItem[] = [
    {
      q: "How can I track my order?",
      a: "Once your order is shipped, we’ll email or WhatsApp you a tracking link so you can follow your package in real time.",
    },
    {
      q: "Can I change my shipping address after ordering?",
      a: "You can change your address before your order is shipped. Please contact our customer support team immediately.",
    },
    {
      q: "Do you offer same-day delivery?",
      a: "Currently, same-day delivery is available only for selected pin codes in Coimbatore city.",
    },
  ];

  return (
    <div className="bg-gray-50 text-gray-800">
      {/* ===== HERO SECTION ===== */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Shipping Information
          </motion.h1>
          <p className="text-gray-300 text-lg">
            Fast, reliable, and carefully packed deliveries from{" "}
            <span className="text-pink-500 font-semibold">SthRee Trendz</span>.
          </p>
        </div>
      </section>

      {/* ===== SHIPPING DETAILS ===== */}
      <section className="max-w-6xl mx-auto px-6 py-16 space-y-14">
        {/* Info cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {infoCards.map(({ Icon, title, desc }, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon className="text-pink-500 w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{title}</h3>
              <p className="text-gray-600 text-sm">{desc}</p>
            </motion.div>
          ))}
        </div>

        {/* ===== Policy Text Section ===== */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white shadow-md rounded-xl p-8"
        >
          <h2 className="text-2xl font-semibold mb-4 text-pink-600">
            Our Shipping Policy
          </h2>
          <ul className="list-disc list-inside space-y-3 text-gray-700 leading-relaxed">
            <li>
              Orders placed before 5 PM IST will be processed the same day. Orders
              after that will be processed on the next business day.
            </li>
            <li>
              Once shipped, you will receive a tracking number via email or
              WhatsApp.
            </li>
            <li>
              Delivery times may vary based on location, weather conditions, or courier delays.
            </li>
            <li>
              In rare cases of shipping damage, please contact us within 24 hours
              with clear photos of the package.
            </li>
            <li>
              International customers are responsible for any customs duties or import taxes.
            </li>
          </ul>
        </motion.div>

        {/* ===== FAQ Section ===== */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-10"
        >
          <h2 className="text-2xl font-semibold text-pink-600 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-5">
            {faqItems.map(({ q, a }, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition"
              >
                <h4 className="font-semibold text-lg mb-2">{q}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default ShippingInfo;
