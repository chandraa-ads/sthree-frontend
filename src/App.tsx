import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { Home } from "./components/home/Home.tsx";
import Navbar from "./components/layout/Navbar"; // folder: layout, file: Navbar.tsx
import { ProductDetail } from "./components/admin/ProductDetails"; // ProductDetails.tsx
import { CartDrawer } from "./components/cart/CartDrawer"; // CartDrawer.tsx
import LoginSignup from "./components/auth/LoginSignup"; // LoginSignup.tsx
import AccountInfo from "./payment/AccountInfo"; // AccountInfo.tsx
import UserProfile from "./components/home/UserProfile"; // UserProfile.tsx
import AdminLogin from "./components/admin/AdminLogin"; // AdminLogin.tsx
import ProductForm from "./components/products/ProductForm"; // ProductForm.tsx
import CategoryPage from "./components/home/CategoryPage"; // CategoryPage.tsx
import { WishlistPage } from "./components/WishlistPage"; // WishlistPage.tsx
import ShoppingCart from "./components/cart/ShoppingCart"; // ShoppingCart.tsx
import { Footer } from "./components/footer/FooterUser"; // FooterUser.tsx
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";



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
