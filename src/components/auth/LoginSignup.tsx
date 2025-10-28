import React, { useEffect, useState } from "react";
import { X, ArrowLeft } from "lucide-react";
import introBanner from "../../assets/icon/intro1.png";
import sreeLogo from "../../assets/icon/Sth_W.svg"; // ✅ your logo image

interface Props {
  isOpen: boolean;
  onClose: () => void;
  setIsLoggedIn: (loggedIn: boolean, name?: string) => void;
}

const LoginSignup: React.FC<Props> = ({ isOpen, onClose, setIsLoggedIn }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState<number | null>(null);
  const [otpInput, setOtpInput] = useState("");
  const [otpMsg, setOtpMsg] = useState("");
  const [email, setEmail] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [isForgot, setIsForgot] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [user, setUser] = useState<{ name?: string; email: string } | null>(
    null
  );
  const [googleIdToken, setGoogleIdToken] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");

  // Load user from localStorage when modal opens
  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem("loggedInUser");
      if (stored) setUser(JSON.parse(stored));
    }
  }, [isOpen]);

  // Save user data
  useEffect(() => {
    if (user) localStorage.setItem("loggedInUser", JSON.stringify(user));
  }, [user]);

  // Initialize Google buttons
  useEffect(() => {
    if (!isOpen || !(window as any).google) return;

    const initializeGoogle = () => {
      try {
        const win: any = window;
        win.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });

        const loginBtn = document.getElementById("googleLoginBtn");
        const signupBtn = document.getElementById("googleSignupBtn");

        if (loginBtn) {
          loginBtn.innerHTML = "";
          win.google.accounts.id.renderButton(loginBtn, {
            theme: "outline",
            size: "large",
            width: 250,
          });
        }

        if (signupBtn) {
          signupBtn.innerHTML = "";
          win.google.accounts.id.renderButton(signupBtn, {
            theme: "outline",
            size: "large",
            width: 250,
          });
        }
      } catch (err) {
        console.error("Google button error:", err);
      }
    };

    initializeGoogle();
  }, [isOpen]);

  // ✅ Signup
  const handleSignup = async (email: string) => {
    if (!email) {
      setOtpMsg("❌ Please enter your email.");
      return;
    }

    const usernameInput = (
      document.querySelector(
        'input[placeholder="User Name"]'
      ) as HTMLInputElement
    )?.value;
    const passwordInput = (
      document.querySelector(
        'input[placeholder="Enter Your Password"]'
      ) as HTMLInputElement
    )?.value;

    if (!usernameInput || !passwordInput) {
      setOtpMsg("❌ Please fill out all fields.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/auth/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          username: usernameInput,
          password: passwordInput,
        }),
      });

      if (res.status === 409) {
        setOtpMsg("❌ Email already registered. Try logging in.");
        return;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      alert("📩 OTP sent to your email! Please check and enter it below.");
      setOtpMsg("Enter the OTP sent to your email.");
      setShowOtpInput(true);
      setGeneratedOTP(null);
    } catch (err: any) {
      setOtpMsg(`❌ ${err.message}`);
    }
  };

  // ✅ Verify OTP after signup
  const handleVerify = async () => {
    if (!otpInput || !email) {
      setOtpMsg("❌ Please enter OTP!");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/auth/user/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpInput }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "OTP verification failed");

      alert("✅ Registration successful! Please log in.");
      setOtpInput("");
      setShowOtpInput(false);
      setGeneratedOTP(null);
      setIsSignup(false);
      setEmail("");
    } catch (err: any) {
      setOtpMsg(`❌ ${err.message}`);
    }
  };

  // ✅ Google login
  const handleGoogleResponse = async (response: any) => {
    const token = response.credential;
    try {
      const res = await fetch("http://localhost:3000/auth/user/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: token }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      const emailUsername = data.user.email.split("@")[0];
      const userData = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name || emailUsername,
        token: data.token,
      };

      setUser(userData);
      localStorage.setItem("loggedInUser", JSON.stringify(userData));
      setSuccessMsg("✅ Login successful!");
      setIsLoggedIn(true, userData.name);
      onClose();
    } catch (err: any) {
      setOtpMsg(`❌ ${err.message}`);
    }
  };

  // ✅ Forgot Password
  const handleForgotPassword = async (emailParam: string) => {
    if (!emailParam) {
      setOtpMsg("❌ Please enter your registered email.");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:3000/auth/user/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: emailParam }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");

      setOtpMsg("📩 OTP sent to your email. Please enter it below.");
      setShowOtpInput(true);
    } catch (err: any) {
      setOtpMsg(`❌ ${err.message}`);
    }
  };

  // ✅ Reset Password
  const handleResetPassword = async () => {
    if (!forgotEmail || !otpInput || !newPassword) {
      setOtpMsg("❌ Enter your email, OTP, and new password.");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:3000/auth/user/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: forgotEmail, // ✅ use forgotEmail
            reset_code: otpInput,
            new_password: newPassword,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Reset failed");

      alert("✅ Password reset successful! Please log in.");
      setIsForgot(false);
      setOtpInput("");
      setNewPassword("");
      setOtpMsg("");
      setShowOtpInput(false);
    } catch (err: any) {
      setOtpMsg(`❌ ${err.message}`);
    }
  };

  // ✅ Login
  const handleLogin = async () => {
    const emailInput = (
      document.querySelector(
        'input[placeholder="Enter Your Email"]'
      ) as HTMLInputElement
    )?.value;
    const passwordInput = (
      document.querySelector(
        'input[placeholder="Password"]'
      ) as HTMLInputElement
    )?.value;

    if (!emailInput || !passwordInput) {
      alert("❌ Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/auth/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput, password: passwordInput }),
      });

      const data = await res.json();

      if (!res.ok) {
        // If login fails, show alert with the server message
        alert(`❌ Login failed: ${data.message || "Invalid credentials"}`);
        setOtpMsg(`❌ ${data.message || "Invalid credentials"}`);
        return;
      }

      const userData = {
        id: data.id,
        email: data.email,
        name: data.username || "",
        role: data.role,
        token: data.token,
      };

      localStorage.setItem("loggedInUser", JSON.stringify(userData));
      setUser(userData);
      alert("✅ Login successful!");
      setOtpMsg("✅ Login successful!");
      setIsLoggedIn(true, userData.name);
      onClose();
    } catch (error: any) {
      alert(`❌ Login failed: ${error.message}`);
      setOtpMsg(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-[600px] min-h-[500px] max-h-[90vh] bg-white rounded-xl relative shadow-lg flex overflow-hidden flex-col">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 bg-gray-200 hover:bg-gray-300 rounded-full p-1 z-20"
          onClick={() => {
            onClose();
            setIsSignup(false);
            setGeneratedOTP(null);
            setOtpInput("");
            setSuccessMsg("");
            setOtpMsg("");
            setShowOtpInput(false);
            setGoogleIdToken("");
            setEmail("");
          }}
        >
          <X size={20} />
        </button>

        {/* ✅ Sree Logo Position Logic */}
        {isSignup ? (
          <div className="absolute top-4 right-10 z-20 ">
            <img
              src={sreeLogo}
              alt="Sree Logo"
              className="w-20 h-auto object-contain"
            />
          </div>
        ) : (
          <div className="absolute top-2 left-4 z-20">
            <img
              src={sreeLogo}
              alt="Sree Logo"
              className="w-20 h-auto object-contain"
            />
          </div>
        )}

        {/* Banner Image */}
        <div
          className={`absolute right-0 top-0 w-1/2 h-full transition-transform duration-500 z-10 ${
            isSignup ? "-translate-x-full" : "translate-x-0"
          }`}
        >
          <img
            src={introBanner}
            alt="banner"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Login / Forgot Password Form */}
        <div
          className={`absolute left-0 top-2 w-1/2 h-full p-10 flex flex-col justify-center gap-4 transition-transform duration-500 ${
            isSignup ? "-translate-x-full" : "translate-x-0"
          }`}
        >
          {!isForgot ? (
            <>
              {/* Login Form */}
              <h1 className="text-2xl font-semibold text-gray-800">Log In</h1>
              <p className="text-sm text-gray-600 mb-4">Welcome Back!</p>

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
              />
              <button
                className="bg-cyan-700 text-white rounded-md px-4 py-2 mt-2 hover:bg-cyan-800 transition"
                onClick={handleLogin}
              >
                Login
              </button>

              {/* Forgot Password Link */}
              <span
                className="text-xs text-cyan-700 cursor-pointer hover:underline mt-2"
                onClick={() => {
                  setIsForgot(true);
                  setForgotEmail("");
                  setOtpInput("");
                  setShowOtpInput(false);
                  setOtpMsg("");
                }}
              >
                Forgot Password?
              </span>

              {/* Google Login */}
              <div
                className="flex justify-center mt-6"
                id="googleLoginBtn"
              ></div>

              {/* Signup Link */}
              <span className="text-xs mt-4 text-center">
                Don't have an account yet?{" "}
                <span
                  className="text-cyan-700 cursor-pointer hover:underline"
                  onClick={() => setIsSignup(true)}
                >
                  Sign Up
                </span>
              </span>
            </>
          ) : (
            <>
              {/* Forgot Password Form */}
              <h1 className="text-xl font-semibold">Forgot Password</h1>
              <input
                type="email"
                placeholder="Enter Your Registered Email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="border-2 border-gray-300 rounded-md h-10 px-3 outline-none focus:border-cyan-600"
              />

              {!showOtpInput ? (
                <button
                  className="bg-cyan-700 text-white rounded-md px-4 py-2 mt-2 hover:bg-cyan-800 transition"
                  onClick={() => handleForgotPassword(forgotEmail)}
                >
                  Send OTP
                </button>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    className="border-2 border-gray-300 rounded-md h-10 px-3 outline-none focus:border-cyan-600"
                  />
                  <input
                    type="password"
                    placeholder="Enter New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="border-2 border-gray-300 rounded-md h-10 px-3 outline-none focus:border-cyan-600"
                  />
                  <button
                    className="bg-cyan-700 text-white rounded-md px-4 py-2 mt-2 hover:bg-cyan-800 transition"
                    onClick={handleResetPassword}
                  >
                    Reset Password
                  </button>
                </>
              )}

              {otpMsg && (
                <div className="text-xs text-cyan-700 mt-2">{otpMsg}</div>
              )}
            </>
          )}
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
              setGoogleIdToken("");
              setEmail("");
            }}
          >
            <ArrowLeft size={20} />
          </button>

          <h1 className="text-xl font-semibold">Signup</h1>

          <input
            type="text"
            placeholder="User Name"
            className="border-2 border-gray-300 rounded-md h-10 px-3 outline-none focus:border-cyan-600"
          />
          <input
            type="email"
            placeholder="Enter Your Email"
            className="border-2 border-gray-300 rounded-md h-10 px-3 outline-none focus:border-cyan-600"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter Your Password"
            className="border-2 border-gray-300 rounded-md h-10 px-3 outline-none focus:border-cyan-600"
          />

          {!generatedOTP && !showOtpInput && (
            <button
              className="bg-cyan-700 text-white rounded-md px-4 py-1"
              onClick={() => handleSignup(email)}
            >
              Register
            </button>
          )}

          {showOtpInput && (
            <div className="mt-2 flex flex-col gap-2">
              <input
                type="text"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                placeholder="Enter OTP"
                className="w-full h-10 border-2 border-gray-300 rounded-md px-3 outline-none focus:border-cyan-600"
              />
              {otpMsg && <div className="text-xs text-cyan-700">{otpMsg}</div>}
              <button
                className="bg-cyan-700 text-white rounded-md px-4 py-1"
                onClick={handleVerify}
              >
                Verify OTP
              </button>
            </div>
          )}

          {!showOtpInput && (
            <div
              className="flex justify-center mt-3"
              id="googleSignupBtn"
            ></div>
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
