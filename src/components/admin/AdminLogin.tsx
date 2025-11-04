import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ import
import bgImg from '../../assets/webpicon/admin.webp';
import logo from '../../assets/webpicon/sth_ree.webp';

interface AdminLoginProps {
  onLoginSuccess: (token: string) => void;
}

const ModernAdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate(); // ✅ initialize navigate
  const [email, setEmail] = useState("akashperumal4@gmail.com");
  const [password, setPassword] = useState("Password123!");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("https://nettly-indebted-kurtis.ngrok-free.dev/auth/admin/login", {
        email,
        password,
      });
      const token = response.data.token;
      localStorage.setItem("adminToken", token);
      onLoginSuccess(token);
      
      // ✅ redirect after login
      navigate("/admin/dashboard");
    } catch (error) {
      alert("Login failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen w-full flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <div className="w-full max-w-md p-10 rounded-3xl bg-white/30 backdrop-blur-lg border border-white/20 shadow-xl flex flex-col items-center">
        <img src={logo} alt="Logo" className="h-20 w-40 rounded-full mb-4" />
        <h1 className="text-2xl font-bold text-white mb-1">Welcome Back</h1>
        <p className="text-sm text-white mb-6">Sign in to continue</p>

        <form className="w-full flex flex-col gap-4" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl placeholder-black-700 text-pink-700 border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-300 shadow-sm transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl placeholder-black-700 text-pink-700 border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-300 shadow-sm transition"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 mt-2 rounded-xl text-white font-semibold shadow-lg transition-all ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-pink-400 to-pink-500 hover:scale-105 hover:shadow-2xl"
            }`}
          >
            {loading ? "Logging in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModernAdminLogin;
