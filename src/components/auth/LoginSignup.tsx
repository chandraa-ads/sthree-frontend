// LoginSignup.tsx
import React, { useEffect, useState } from "react";
import { X, ArrowLeft } from "lucide-react";
import google from "../../assets/icon/google.png";
import facebook from "../../assets/icon/facebook1.png";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const LoginSignup: React.FC<Props> = ({ isOpen, onClose }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState<number | null>(null);
  const [otpInput, setOtpInput] = useState("");
  const [otpMsg, setOtpMsg] = useState("");
  const [email, setEmail] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);

  // Signup flow — send OTP
  const handleSignup = (signupEmail: string) => {
    if (!signupEmail) {
      setOtpMsg("❌ Please enter your email.");
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    setGeneratedOTP(otp);
    setOtpMsg(`OTP sent to ${signupEmail}: ${otp}`);
    setEmail(signupEmail);
    setShowOtpInput(true);
  };

  // OTP verification
  const handleVerify = () => {
    if (!otpInput) {
      setOtpMsg("❌ Please enter OTP!");
      return;
    }

    if (otpInput === generatedOTP?.toString()) {
      setOtpMsg("✅ Account Verified!");
      setOtpInput("");
      setGeneratedOTP(null);
      setShowOtpInput(false);
    } else {
      setOtpMsg("❌ Invalid OTP, try again!");
    }
  };

  // Google OAuth callback
  const handleGoogleResponse = async (response: any) => {
    const token = response.credential;
    console.log("Google Token:", token);

    // Simulate OTP flow after Google login
    const fakeEmail = "googleuser@example.com"; // Replace with backend email
    setOtpMsg(`OTP sent to ${fakeEmail}`);
    setEmail(fakeEmail);
    setShowOtpInput(true);
  };

  // Initialize Google button only in Signup
  useEffect(() => {
    if (!isSignup) return;

    const timeout = setTimeout(() => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });

        window.google.accounts.id.renderButton(
          document.getElementById("googleSignInDiv"),
          { theme: "outline", size: "small",type:"icon" }
        );
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [isSignup]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-[600px] min-h-[500px] max-h-[90vh] bg-white rounded-xl relative shadow-lg flex overflow-hidden">

        {/* Close Button */}
        <button
          className="absolute top-3 right-3 bg-gray-200 hover:bg-gray-300 rounded-full p-1 z-20"
          onClick={() => {
            onClose();
            setIsSignup(false);
            setGeneratedOTP(null);
            setOtpInput("");
            setOtpMsg("");
            setShowOtpInput(false);
          }}
        >
          <X size={20} />
        </button>

        {/* Banner */}
        <div
          className={`absolute right-0 top-0 w-1/2 h-full transition-transform duration-500 z-10 ${
            isSignup ? "-translate-x-full" : "translate-x-0"
          }`}
        >
          <img
            src="https://img.freepik.com/free-vector/abstract-flat-design-background_23-2148450082.jpg"
            alt="banner"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Login Form */}
        <div
          className={`absolute left-0 top-0 w-1/2 h-full p-10 flex flex-col justify-center gap-4 transition-transform duration-500 ${
            isSignup ? "-translate-x-full" : "translate-x-0"
          }`}
        >
          <h1 className="text-xl font-semibold">Log In</h1>
          <p className="text-xs text-gray-600">
            Login to your account to upload or download pictures, videos, or music.
          </p>

          <input
            type="email"
            placeholder="Enter Your Email"
            className="border-2 border-gray-300 rounded-md h-10 px-3 outline-none focus:border-cyan-600"
          />
          <input
            type="password"
            placeholder="Password"
            className="border-2 border-gray-300 rounded-md h-10 px-3 outline-none focus:border-cyan-600"
          />

          <div className="flex items-center justify-between">
            <a href="#" className="text-xs text-cyan-700">
              Forgot Password?
            </a>
            <button className="bg-cyan-700 text-white rounded-md px-4 py-1">
              Next
            </button>
          </div>
          <div className="flex gap-3 mt-3 justify-center"> <button className="flex items-center justify-center w-12 h-12 border border-gray-300 rounded-full transition duration-200 transform-gpu hover:scale-105 active:scale-95 hover:bg-blue-100 hover:shadow-md"> <img src={facebook} alt="Facebook" className="w-8 h-8" /> </button> <button className="flex items-center justify-center w-12 h-12 border border-gray-300 rounded-full transition duration-200 transform-gpu hover:scale-105 active:scale-95 hover:bg-red-100 hover:shadow-md"> <img src={google} alt="Google" className="w-8 h-8" /> </button> </div>

          <span className="text-xs mt-2">
            Don't have an account yet?{" "}
            <span
              className="text-cyan-700 cursor-pointer hover:underline"
              onClick={() => setIsSignup(true)}
            >
              Sign Up
            </span>
          </span>
        </div>

        {/* Signup Form */}
        <div
          className={`absolute left-0 top-0 w-1/2 h-full p-10 flex flex-col justify-center gap-4 transition-transform duration-500 ${
            isSignup ? "translate-x-full" : "translate-x-[200%]"
          }`}
        >
          <button
            className="absolute top-3 left-3 bg-gray-200 hover:bg-gray-300 rounded-full p-1 z-20"
            onClick={() => {
              setIsSignup(false);
              setGeneratedOTP(null);
              setOtpInput("");
              setOtpMsg("");
              setShowOtpInput(false);
            }}
          >
            <ArrowLeft size={20} />
          </button>

          <h1 className="text-xl font-semibold">Signup</h1>

          <input
            type="text"
            placeholder="User Name"
            className="border-2 border-gray-300 rounded-md h-10 px-3 outline-none"
          />
          <input
            type="email"
            id="signup-email"
            placeholder="Enter Your Email"
            className="border-2 border-gray-300 rounded-md h-10 px-3 outline-none"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter Your Password"
            className="border-2 border-gray-300 rounded-md h-10 px-3 outline-none"
          />

          {!generatedOTP && !showOtpInput && (
            <button
              className="bg-cyan-700 text-white rounded-md px-4 py-1"
              onClick={() =>
                handleSignup(
                  (document.getElementById("signup-email") as HTMLInputElement)
                    ?.value
                )
              }
            >
              Next
            </button>
          )}

          {showOtpInput && (
            <div className="mt-2">
              <input
                type="text"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                placeholder="Enter OTP"
                className="w-full h-9 border-2 border-gray-300 rounded-md px-2 outline-none"
              />
              <div className="text-xs mt-1 text-cyan-700">{otpMsg}</div>
              <button
                className="bg-cyan-700 text-white rounded-md px-4 py-1 mt-1"
                onClick={handleVerify}
              >
                Verify OTP
              </button>
            </div>
          )}

          {/* Google OAuth Button */}
          {!showOtpInput && (
            <div className="flex justify-center mt-3" id="googleSignInDiv"></div>
          )}

          <span className="text-xs mt-2">
            Already have an account?{" "}
            <span
              className="text-cyan-700 cursor-pointer hover:underline"
              onClick={() => setIsSignup(false)}
            >
              Login here
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
