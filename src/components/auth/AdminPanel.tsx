import React, { useState, useEffect } from "react";
import AdminLogin from "../admin/AdminLogin";
import ProductForm from "../products/ProductForm";

const AdminPanel: React.FC = () => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("adminToken"));

  // Optional: you can add a logout button to clear token
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setToken(null);
  };

  return (
    <div>
      {!token ? (
        <AdminLogin onLoginSuccess={setToken} />
      ) : (
        <>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-1 px-3 rounded mb-4"
          >
            Logout
          </button>
          <ProductForm token={token} />
        </>
      )}
    </div>
  );
};

export default AdminPanel;
