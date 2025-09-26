import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const FooterUser: React.FC = () => {
  return (
    <footer className="bg-[#FFF8E7] text-black">
      {/* Main Footer Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 px-6 md:px-16 py-12">
        
        {/* Exclusive */}
        <div>
          <h3 className="text-black font-bold mb-4">Exclusive</h3>
          <p className="mb-2">Subscribe</p>
          <p className="mb-4">Get 10% off your first order</p>
         <form className="flex" onSubmit={(e) => e.preventDefault()}>
  <label htmlFor="email" className="sr-only">
    Enter your email
  </label>
  <input
    id="email"
    type="email"
    placeholder="Enter your email"
    required
    className="px-3 py-2 w-2/3 border border-gray-300 rounded-l-md text-black focus:outline-none focus:border-rose-400"
  />
  <button
    type="submit"
    className="px-4 py-2 border border-gray-300 border-l-0 bg-white text-black rounded-r-md hover:bg-rose-400 hover:text-white transition"
  >
    &#10148;
  </button>
</form>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-black font-bold mb-4">Support</h3>
          <address className="not-italic text-black">
            <p className="mb-2">65, Tatabad 1st Street,</p>
            <p className="mb-2">Coimbatore - 641 012</p>
            <p className="mb-2">exclusive@gmail.com</p>
            <p>91+ 89032 84455</p>
          </address>
        </div>

        {/* Account */}
        <div>
          <h3 className="text-black font-bold mb-4">Account</h3>
          <ul className="space-y-2 text-black">
            {["My Account", "Login / Register", "Cart", "Wishlist", "Shop"].map(
              (item) => (
                <li key={item}>
                  <a href="#" className="hover:text-rose-400 transition">
                    {item}
                  </a>
                </li>
              )
            )}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-black font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-black">
            {["Privacy Policy", "Terms Of Use", "FAQ", "Contact"].map((item) => (
              <li key={item}>
                <a href="#" className="hover:text-rose-400 transition">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Icons */}
        <div>
          <h3 className="text-black font-bold mb-4">Follow Us</h3>
          <div className="flex space-x-4 text-black text-xl">
            <a href="#" aria-label="Facebook" className="hover:text-rose-400 transition">
              <FaFacebookF />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-rose-400 transition">
              <FaTwitter />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-rose-400 transition">
              <FaInstagram />
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-rose-400 transition">
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="bg-neutral-900 text-gray-400 text-center py-4 text-sm">
        © Copyright Rimel {new Date().getFullYear()}. All rights reserved.
      </div>
    </footer>
  );
};

export default FooterUser;
