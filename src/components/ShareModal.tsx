import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MessageCircle,
  Mail,
  Facebook,
  Twitter,
  Copy,
  Check,
} from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string | number;
    title: string;
    price: number;
    image: string;
    sizes?: string[];
    color?: string;
  };
  productUrl: string;
  onCopySuccess: () => void;
  copyStatus: "idle" | "copied";
}

export function ShareModal({
  isOpen,
  onClose,
  product,
  productUrl,
  onCopySuccess,
  copyStatus,
}: ShareModalProps) {
  const shareText = `Check out this beautiful product: ${
    product.title
  } - ₹${product.price.toLocaleString()}`;
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(productUrl);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      onCopySuccess();
    } catch (error) {
      const textArea = document.createElement("textarea");
      textArea.value = productUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      onCopySuccess();
    }
  };

  // Format product details as multi-line text
  const formattedProductText = `
${product.title}
Price: ₹${product.price.toLocaleString()}
Link: ${productUrl}
`.trim();

  const encodedWhatsAppText = encodeURIComponent(formattedProductText);

  // Share options
  const shareOptions = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "bg-green-500 hover:bg-green-600",
      url: `https://wa.me/?text=${encodedWhatsAppText}`,
    },
    {
      name: "Email",
      icon: Mail,
      color: "bg-blue-500 hover:bg-blue-600",
      url: `mailto:?subject=${encodeURIComponent(
        product.title
      )}&body=${encodedWhatsAppText}`,
    },
    {
      name: "Facebook",
      icon: Facebook,
      color: "bg-blue-600 hover:bg-blue-700",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        productUrl
      )}&quote=${encodeURIComponent(formattedProductText)}`,
    },
    {
      name: "Twitter",
      icon: Twitter,
      color: "bg-sky-500 hover:bg-sky-600",
      url: `https://twitter.com/intent/tweet?text=${encodedWhatsAppText}`,
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Share Product
              </h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Product Preview */}
            <div className="p-6 border-b border-gray-200 space-y-4">
              {/* Image (clickable) */}
              <a href={productUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-32 h-32 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform"
                />
              </a>

              {/* Product details */}
              <div className="space-y-1">
                <h4 className="font-medium text-gray-900 text-lg">
                  {product.title}
                </h4>
                <p className="text-pink-600 font-bold text-lg">
                  ₹{product.price.toLocaleString()}
                </p>
                {product.sizes && product.sizes.length > 0 && (
                  <p className="text-sm text-gray-500">
                    Sizes: {product.sizes.join(", ")}
                  </p>
                )}
                {product.color && (
                  <p className="text-sm text-gray-500">
                    Color: {product.color}
                  </p>
                )}

                {/* Clickable link */}
                <p className="text-sm text-gray-500">
                  Link:{" "}
                  <a
                    href={productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-600 underline hover:text-pink-700"
                  >
                    {productUrl}
                  </a>
                </p>
              </div>
            </div>

            {/* Share Options */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-3 mb-4">
                {shareOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <motion.a
                      key={option.name}
                      href={option.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`${option.color} text-white p-4 rounded-xl flex items-center space-x-3 transition-colors`}
                      onClick={onClose}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="font-medium">{option.name}</span>
                    </motion.a>
                  );
                })}
              </div>

              {/* Copy Link */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCopyLink}
                className={`w-full p-4 rounded-xl border-2 transition-all ${
                  copyStatus === "copied"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-300 hover:border-pink-500 text-gray-700"
                }`}
              >
                <div className="flex items-center justify-center space-x-3">
                  {copyStatus === "copied" ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span className="font-medium">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      <span className="font-medium">Copy Link</span>
                    </>
                  )}
                </div>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
