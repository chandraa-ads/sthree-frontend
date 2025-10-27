import React from "react";
import { motion } from "framer-motion";
import { RefreshCcw, ShieldCheck, Mail, Clock } from "lucide-react";

interface PolicyCard {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  desc: string;
}

interface FAQItem {
  q: string;
  a: string;
}

const Returns: React.FC = () => {
  const policyCards: PolicyCard[] = [
    {
      Icon: RefreshCcw,
      title: "Easy Returns",
      desc: "You can return or exchange your order within 7 days of delivery.",
    },
    {
      Icon: ShieldCheck,
      title: "Quality Guarantee",
      desc: "All products are inspected before dispatch — only the best reach you.",
    },
    {
      Icon: Clock,
      title: "Fast Processing",
      desc: "Refunds are processed within 3–5 business days after we receive your return.",
    },
    {
      Icon: Mail,
      title: "Hassle-Free Support",
      desc: "Our support team will guide you through every step of your return or exchange.",
    },
  ];

  const faqItems: FAQItem[] = [
    {
      q: "What items are eligible for return?",
      a: "Items must be unused, unwashed, and returned in their original packaging with tags intact within 7 days of delivery.",
    },
    {
      q: "Are sale items returnable?",
      a: "Products purchased during clearance or flash sales are not eligible for return or exchange unless defective.",
    },
    {
      q: "How do I initiate a return?",
      a: "You can request a return by contacting us via WhatsApp or email at sthreetrendz2025@gmail.com with your order details.",
    },
    {
      q: "When will I receive my refund?",
      a: "Refunds are typically processed within 3–5 working days after your returned item passes our quality check.",
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
            Returns & Exchanges
          </motion.h1>
          <p className="text-gray-300 text-lg">
            We value your satisfaction — easy returns and exchanges from{" "}
            <span className="text-pink-500 font-semibold">SthRee Trendz</span>.
          </p>
        </div>
      </section>

      {/* ===== POLICY CARDS ===== */}
      <section className="max-w-6xl mx-auto px-6 py-16 space-y-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {policyCards.map(({ Icon, title, desc }, index) => (
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

        {/* ===== RETURN POLICY DETAILS ===== */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white shadow-md rounded-xl p-8"
        >
          <h2 className="text-2xl font-semibold mb-4 text-pink-600">
            Return & Exchange Policy
          </h2>
          <ul className="list-disc list-inside space-y-3 text-gray-700 leading-relaxed">
            <li>
              You can return or exchange products within 7 days of delivery if they are unused, unwashed, and in original condition.
            </li>
            <li>
              Items with visible wear, perfume scent, stains, or damages will not be accepted.
            </li>
            <li>
              Returns are not applicable on accessories, discounted items, or custom-stitched pieces.
            </li>
            <li>
              Once the returned product is received and verified, your refund or exchange will be processed promptly.
            </li>
            <li>
              For damaged or defective items, please email us at{" "}
              <a
                href="mailto:sthreetrendz2025@gmail.com"
                className="text-pink-600 hover:underline"
              >
                sthreetrendz2025@gmail.com
              </a>{" "}
              within 24 hours of delivery.
            </li>
          </ul>
        </motion.div>

        {/* ===== FAQ SECTION ===== */}
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

export default Returns;
