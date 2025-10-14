import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { Footer } from "./components/footer/FooterUser";
import { Home } from "./components/home/Home";
import Navbar from "./components/layout/Navbar";
import { ProductDetail } from "./components/admin/ProductDetails";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import { CartDrawer } from "./components/cart/CartDrawer"; // ✅ FIXED LINE
import AccountInfo from "./payment/AccountInfo";
import LoginSignup from "./components/auth/LoginSignup";
import UserProfile from "./components/home/UserProfile";
import AdminLogin from "./components/admin/AdminLogin";
import ProductForm from "./components/products/ProductForm";
import CategoryPage from "./components/home/CategoryPage";
import { WishlistPage } from "./components/WishlistPage";
import ShoppingCart from "./components/cart/ShoppingCart";


const Layout: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="flex flex-col min-h-screen relative">
    <Navbar />
    <main className="flex-grow">{children}</main>
    <Footer />
    <CartDrawer />
  </div>
);

const RequireAdminAuth: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
};

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("adminToken"));

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken !== token) setToken(storedToken);
  }, [token]);

  const handleAdminLoginSuccess = (newToken: string) => {
    localStorage.setItem("adminToken", newToken);
    setToken(newToken);
  };

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route
              path="/*"
              element={
                <Layout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/accountinfo" element={<AccountInfo />} />
                    <Route path="/userprofile" element={<UserProfile />} />
                    <Route path="/category/:main_category" element={<CategoryPage />} />
                    <Route path="/login" element={<LoginSignup isOpen={false} onClose={() => {}} />} />
                       <Route path="/wishlist" element={<WishlistPage />} />
                       <Route path="/cart" element={<ShoppingCart />} /> 

                  </Routes>
                </Layout>
              }
            />

            <Route
              path="/admin/*"
              element={
                <Layout>
                  <Routes>
                    <Route path="login" element={<AdminLogin onLoginSuccess={handleAdminLoginSuccess} />} />
                    <Route path="product-form" element={<RequireAdminAuth><ProductForm token={token} /></RequireAdminAuth>} />
                  </Routes>
                </Layout>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
