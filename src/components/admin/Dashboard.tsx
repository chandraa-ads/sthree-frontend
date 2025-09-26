import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/icon/home.svg";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    { value: "40K", label: "TOTAL ORDER", color: "text-red-500" },
    { value: "60K", label: "REVENUE", color: "text-blue-500" },
    { value: "20K", label: "LOW_STOCKS", color: "text-pink-600" },
    { value: "90K", label: "PENDING_RETURN", color: "text-green-700" },
  ];

  const cards = [
    { title: "ADD PRODUCT", path: "/add-product" },
    { title: "PRODUCT DETAILS", path: "/product-details" },
    { title: "STATUS", path: "/status" },
    { title: "USER", path: "/user" },
    { title: "PRODUCT REVIEW", path: "/" },
  ];

  return (
    <div className="flex flex-col items-center p-8 bg-white min-h-screen w-full bg-gradient-to-b from-rose-50 to-white">
      {/* Logo Section */}
      <div className="text-center mb-6">
        <img src={logo} alt="SthRee Logo" className="h-24 mx-auto" />
        <p className="font-bold mt-2 text-lg text-gray-700">
          Outfit Speaks Person
        </p>
      </div>


      {/* Stats + Cards */}
      <div className="flex flex-col items-center gap-10 w-full">
        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-6 w-full">
          {stats.map((stat, idx) => (
            <div
              key={idx}
             className="flex flex-col items-center font-bold border border-rose-300 rounded-xl px-6 py-3 
shadow-sm transition-all duration-200 cursor-pointer 
hover:shadow-md hover:scale-105 hover:bg-rose-50"

            >
              <span className={`${stat.color} text-xl`}>{stat.value}</span>
              <span className="text-gray-800 text-sm">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Cards Section */}
        <div className="flex flex-wrap justify-center gap-8 w-full ">
          {cards.map((card, idx) => (
            <div
              key={idx}
              onClick={() => navigate(card.path)}
              className="border border-rose-300 rounded-xl shadow-md w-48 h-32 flex items-center justify-center text-center 
transition-all duration-200 hover:scale-105 hover:shadow-lg hover:bg-rose-100 cursor-pointer"

            >
              <h3 className="font-bold text-lg">{card.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
