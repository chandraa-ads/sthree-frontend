import React, { useEffect, useState } from "react";
import { X, ArrowLeft } from "lucide-react";
import google from "../../assets/icon/google.png";
import introBanner from "../../assets/icon/intro1.jpeg";

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

  // Load user from localStorage on mount or when modal opens
  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem("loggedInUser");
      if (stored) setUser(JSON.parse(stored));
    }
  }, [isOpen]);

  // Save user
  useEffect(() => {
    if (user) localStorage.setItem("loggedInUser", JSON.stringify(user));
  }, [user]);

  // Google login
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

  const handleSignup = async (email: string) => {
    if (!email) {
      setOtpMsg("❌ Please enter your email.");
      return;
    }

    const usernameInput = (
      document.querySelector('input[placeholder="User Name"]') as HTMLInputElement
    )?.value;
    const passwordInput = (
      document.querySelector('input[placeholder="Enter Your Password"]') as HTMLInputElement
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
          email: email,
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

      // OTP verified successfully
      alert("✅ Registration successful! Please log in."); // show alert instead of inline message

      // Clear OTP fields
      setOtpInput("");
      setShowOtpInput(false);
      setGeneratedOTP(null);

      // Switch back to login form
      setIsSignup(false);

      // Optionally clear email input
      setEmail("");

    } catch (err: any) {
      setOtpMsg(`❌ ${err.message}`);
    }
  };


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
        id: data.user.id,         // add this
        email: data.user.email,
        name: data.user.name || emailUsername,
        token: data.token,
      };

      setUser(userData);
      localStorage.setItem("loggedInUser", JSON.stringify(userData));
      setSuccessMsg("✅ Login successful!");
      setIsLoggedIn(true, userData.name);
      setOtpMsg("✅ Google login successful!");
      onClose();
    } catch (err: any) {
      setOtpMsg(`❌ ${err.message}`);
    }
  };



  const handleVerifyOtpForGoogle = async () => {
    if (!otpInput) {
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

      const userData = {
        email,
        name: "",
      };
      setUser(userData);
      localStorage.setItem("loggedInUser", JSON.stringify(userData));

      setOtpMsg("✅ Google Account Verified!");
      setOtpInput("");
      setShowOtpInput(false);
      onClose();
    } catch (error: any) {
      setOtpMsg(`❌ ${error.message}`);
    }
  };

  const handleLogin = async () => {
    const emailInput = (document.querySelector('input[placeholder="Enter Your Email"]') as HTMLInputElement)?.value;
    const passwordInput = (document.querySelector('input[placeholder="Password"]') as HTMLInputElement)?.value;

    if (!emailInput || !passwordInput) {
      setOtpMsg("❌ Please enter both email and password.");
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
      if (!res.ok) throw new Error(data.message || "Login failed");

      const userData = {
        id: data.id,
        email: data.email,
        name: data.username || "",
        role: data.role,
        token: data.token,
      };

      localStorage.setItem("loggedInUser", JSON.stringify(userData));
      setUser(userData);
      setOtpMsg("✅ Login successful!");
      setIsLoggedIn(true, userData.name);
      onClose();
    } catch (error: any) {
      setOtpMsg(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };



  const handleForgotPassword = async () => {
    if (!email) {
      setOtpMsg("❌ Please enter your email!");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/auth/user/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");

      setOtpMsg("📩 OTP sent! Check your email.");
      setShowOtpInput(true);
    } catch (err: any) {
      setOtpMsg(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otpInput || !newPassword) {
      setOtpMsg("❌ Please enter OTP and new password!");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/auth/user/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, reset_code: otpInput, new_password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to reset password");

      alert("✅ Password reset successful! You can now log in.");
      setIsForgot(false);
      setOtpInput("");
      setNewPassword("");
      setShowOtpInput(false);
      setOtpMsg("");
    } catch (err: any) {
      setOtpMsg(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };




  const handleLogout = () => {
  setUser(null);
  localStorage.removeItem("loggedInUser");
  setIsLoggedIn(false);
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
            setSuccessMsg("✅ Login successful!");
            setOtpMsg("");
            setShowOtpInput(false);
            setGoogleIdToken("");
            setEmail("");
            // Do NOT clear user or localStorage here
          }}
        >
          <X size={20} />
        </button>

        {/* Greeting */}
        {/* {user && (
          <div className="absolute top-3 left-4 text-lg font-semibold text-cyan-700 z-20">
            Hello {user.name || user.email.split("@")[0]}!
          </div>
        )} */}

        {/* Banner Image */}
        <div
          className={`absolute right-0 top-0 w-1/2 h-full transition-transform duration-500 z-10 ${isSignup ? "-translate-x-full" : "translate-x-0"
            }`}
        >
          <img
            src={introBanner}
            alt="banner"
            className="w-full h-full object-cover"
          />

        </div>

        {/* Login Form */}
        <div
          className={`absolute left-0 top-0 w-1/2 h-full p-10 flex flex-col justify-center gap-4 transition-transform duration-500 ${isSignup || isForgot ? "-translate-x-full" : "translate-x-0"
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border-2 border-gray-300 rounded-md h-10 px-3 outline-none focus:border-cyan-600"
          />

          <div className="flex items-center justify-between">
            <span
              className="text-xs text-cyan-700 cursor-pointer"
              onClick={() => {
                setIsForgot(true);
                setOtpMsg("");
                setShowOtpInput(false);
              }}
            >
              Forgot Password?
            </span>

            <button
              className="bg-cyan-700 text-white rounded-md px-4 py-1"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
              ) : (
                "Login"
              )}
            </button>
          </div>

          {/* Google Login Button */}
          <div className="flex justify-center mt-6" id="googleLoginBtn"></div>

          <span className="text-xs mt-4">
            Don't have an account yet?{" "}
            <span
              className="text-cyan-700 cursor-pointer hover:underline"
              onClick={() => setIsSignup(true)}
            >
              Sign Up
            </span>
          </span>
        </div>

        {/* Forgot Password Form */}
        {isForgot && (
          <div
            className={`absolute left-0 top-0 w-1/2 h-full p-10 flex flex-col justify-center gap-4 transition-transform duration-500 translate-x-0`}
          >
            <h1 className="text-xl font-semibold">Forgot Password</h1>

            <input
              type="email"
              placeholder="Enter Your Email"
              className="border-2 border-gray-300 rounded-md h-10 px-3 outline-none focus:border-cyan-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {!showOtpInput && (
              <button
                className="bg-cyan-700 text-white rounded-md px-4 py-1 mt-2"
                onClick={handleForgotPassword}
                disabled={loading}
              >
                Send OTP
              </button>
            )}

            {showOtpInput && (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="border-2 border-gray-300 rounded-md h-10 px-3 outline-none focus:border-cyan-600 mt-2"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="New Password"
                  className="border-2 border-gray-300 rounded-md h-10 px-3 outline-none focus:border-cyan-600 mt-2"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  className="bg-cyan-700 text-white rounded-md px-4 py-1 mt-2"
                  onClick={handleResetPassword}
                  disabled={loading}
                >
                  Reset Password
                </button>
              </>
            )}

            {otpMsg && <div className="text-xs text-cyan-700 mt-1">{otpMsg}</div>}

            <span
              className="text-xs text-cyan-700 cursor-pointer mt-2 inline-block"
              onClick={() => {
                setIsForgot(false);
                setOtpMsg("");
                setShowOtpInput(false);
              }}
            >
              Back to Login
            </span>
          </div>
        )}


        {/* Signup Form */}
        <div
          className={`absolute left-0 top-0 w-1/2 h-full p-10 flex flex-col justify-center gap-4 transition-transform duration-500 ${isSignup ? "translate-x-full" : "translate-x-[200%]"
            }`}
        >
          {/* Back button */}
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
            id="signup-username"
          />
          <input
            type="email"
            id="signup-email"
            placeholder="Enter Your Email"
            className="border-2 border-gray-300 rounded-md h-10 px-3 outline-none focus:border-cyan-600"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter Your Password"
            className="border-2 border-gray-300 rounded-md h-10 px-3 outline-none focus:border-cyan-600"
            id="signup-password"
          />

          {/* Register Button */}
          {!generatedOTP && !showOtpInput && (
            <button
              className="bg-cyan-700 text-white rounded-md px-4 py-1"
              onClick={() => handleSignup(email)}
            >
              Register
            </button>
          )}

          {/* OTP Verification */}
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
                onClick={generatedOTP ? handleVerify : handleVerifyOtpForGoogle}
              >
                Verify OTP
              </button>
            </div>
          )}

          {/* Google Signup Button */}
          {!showOtpInput && (
            <div className="flex justify-center mt-3" id="googleSignupBtn"></div>
          )}

          {/* Already have account */}
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
function setIsLoggedIn(arg0: boolean, name: any) {
  throw new Error("Function not implemented.");
}
  
