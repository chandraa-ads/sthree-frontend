import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/icon/home.svg";

interface DashboardStats {
  total_orders: number;
  revenue: number;
  low_stock: number;
  pending_returns: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    total_orders: 0,
    revenue: 0,
    low_stock: 0,
    pending_returns: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("http://localhost:3000/admin/dashboard");
        setStats(response.data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    { title: "ADD PRODUCT", path: "/admin/add-product" },
    { title: "PRODUCT DETAILS", path: "/admin/product-details" },
    { title: "STATUS", path: "/admin/status" },
    { title: "USERS", path: "/admin/users" },
    { title: "PRODUCT REVIEWS", path: "/admin/reviews" },
  ];

  return (
    <div className="flex flex-col items-center p-8 bg-gradient-to-b from-rose-50 to-white min-h-screen w-full">
      {/* Logo Section */}
      <div className="text-center mb-10">
        <img src={logo} alt="SthRee Logo" className="h-24 mx-auto" />
        <p className="font-bold mt-2 text-lg text-gray-700">
          Outfit Speaks Person
        </p>
      </div>

      {/* Stats Section */}
      <div className="flex flex-wrap justify-center gap-6 w-full mb-10">
        {loading ? (
          <p className="text-gray-500">Loading stats...</p>
        ) : (
          <>
            <div className="flex flex-col items-center font-bold border border-rose-300 rounded-xl px-6 py-4 shadow-sm transition-all duration-200 cursor-pointer hover:shadow-md hover:scale-105 hover:bg-rose-50">
              <span className="text-red-500 text-2xl">{stats.total_orders}</span>
              <span className="text-gray-800 text-sm">TOTAL ORDERS</span>
            </div>

            <div className="flex flex-col items-center font-bold border border-rose-300 rounded-xl px-6 py-4 shadow-sm transition-all duration-200 cursor-pointer hover:shadow-md hover:scale-105 hover:bg-rose-50">
              <span className="text-blue-500 text-2xl">{stats.revenue}</span>
              <span className="text-gray-800 text-sm">REVENUE</span>
            </div>

            <div className="flex flex-col items-center font-bold border border-rose-300 rounded-xl px-6 py-4 shadow-sm transition-all duration-200 cursor-pointer hover:shadow-md hover:scale-105 hover:bg-rose-50">
              <span className="text-pink-600 text-2xl">{stats.low_stock}</span>
              <span className="text-gray-800 text-sm">LOW STOCKS</span>
            </div>

            <div className="flex flex-col items-center font-bold border border-rose-300 rounded-xl px-6 py-4 shadow-sm transition-all duration-200 cursor-pointer hover:shadow-md hover:scale-105 hover:bg-rose-50">
              <span className="text-green-700 text-2xl">{stats.pending_returns}</span>
              <span className="text-gray-800 text-sm">PENDING RETURNS</span>
            </div>
          </>
        )}
      </div>

      {/* Admin Cards Section */}
      <div className="flex flex-wrap justify-center gap-8 w-full max-w-5xl">
        {cards.map((card, idx) => (
          <div
            key={idx}
            onClick={() => navigate(card.path)}
            className="border border-rose-300 rounded-xl shadow-md w-48 h-32 flex items-center justify-center text-center transition-all duration-200 hover:scale-105 hover:shadow-lg hover:bg-rose-100 cursor-pointer"
          >
            <h3 className="font-bold text-lg">{card.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
