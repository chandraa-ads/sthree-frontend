import React, { useState } from "react";
import { X, ArrowLeft } from "lucide-react";

export const AuthModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    JSON.parse(localStorage.getItem("loggedInUser") || "null")
  );

  const handleLogin = () => {
    const stored = localStorage.getItem("loggedInUser");
    if (!stored) return alert("No account found. Please sign up first.");

    const savedUser = JSON.parse(stored);
    if (savedUser.email === email && savedUser.password === password) {
      setUser(savedUser);
      alert("Login successful!");
      onClose();
    } else alert("Invalid email or password!");
  };

  const handleSignup = () => {
    if (!name || !email || !password) return alert("Please fill all fields.");
    const newUser = { name, email, password };
    localStorage.setItem("loggedInUser", JSON.stringify(newUser));
    alert("Signup successful! You can now log in.");
    setIsSignup(false);
  };

  const handleLogout = () => {
    setUser(null);
    alert("Logged out successfully!");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-[600px] min-h-[500px] max-h-[90vh] bg-white rounded-xl relative shadow-lg flex overflow-hidden flex-col md:flex-row">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 bg-gray-200 hover:bg-gray-300 rounded-full p-1 z-20"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        {/* Greeting */}
        {user && (
          <div className="absolute top-3 left-4 text-lg font-semibold text-cyan-700 z-20">
            Hello {user.name || user.email.split("@")[0]}!
          </div>
        )}

        {/* Image Banner */}
        <div
          className={`absolute right-0 top-0 w-1/2 h-full transition-transform duration-500 z-10 ${
            isSignup ? "-translate-x-full" : "translate-x-0"
          }`}
        >
          <img
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80"
            alt="banner"
            className="w-full h-full object-cover"
          />
        </div>

        {/* LOGIN FORM */}
        <div
          className={`absolute left-0 top-0 w-1/2 h-full p-10 flex flex-col justify-center gap-4 transition-transform duration-500 ${
            isSignup ? "-translate-x-full" : "translate-x-0"
          }`}
        >
          <h1 className="text-xl font-semibold">Log In</h1>
          <p className="text-xs text-gray-600">
            Login to your account to access features and explore content.
          </p>
          <input
            type="email"
            placeholder="Enter Your Email"
            className="border-2 border-gray-300 rounded-md h-10 px-3 outline-none focus:border-cyan-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border-2 border-gray-300 rounded-md h-10 px-3 outline-none focus:border-cyan-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex items-center justify-between">
            <a href="#" className="text-xs text-cyan-700">
              Forgot Password?
            </a>
            <button
              className="bg-cyan-700 text-white rounded-md px-4 py-1"
              onClick={handleLogin}
            >
              Login
            </button>
          </div>

          <span className="text-xs mt-4">
            Don’t have an account yet?{" "}
            <span
              className="text-cyan-700 cursor-pointer hover:underline"
              onClick={() => setIsSignup(true)}
            >
              Sign Up
            </span>
          </span>
        </div>

        {/* SIGNUP FORM */}
        <div
          className={`absolute left-0 top-0 w-1/2 h-full p-10 flex flex-col justify-center gap-4 transition-transform duration-500 ${
            isSignup ? "translate-x-full" : "translate-x-[200%]"
          }`}
        >
          <button
            className="absolute top-3 left-3 bg-gray-200 hover:bg-gray-300 rounded-full p-1 z-20"
            onClick={() => setIsSignup(false)}
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold">Sign Up</h1>
          <input
            type="text"
            placeholder="User Name"
            className="border-2 border-gray-300 rounded-md h-10 px-3 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Enter Your Email"
            className="border-2 border-gray-300 rounded-md h-10 px-3 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter Your Password"
            className="border-2 border-gray-300 rounded-md h-10 px-3 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="bg-cyan-700 text-white rounded-md px-4 py-1"
            onClick={handleSignup}
          >
            Register
          </button>

          <span className="text-xs mt-2">
            Already have an account?{" "}
            <span
              className="text-cyan-700 cursor-pointer hover:underline"
              onClick={() => setIsSignup(false)}
            >
              Login here
            </span>
          </span>

          {user && (
            <button
              className="mt-6 bg-red-600 text-white rounded-md px-4 py-1"
              onClick={handleLogout}
              type="button"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
