import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// ===== Components & Pages =====
import { Home } from "./components/home/HomePage.tsx";
import Navbar from "./components/layout/Navbar";
// import {ProductDetail} from "./components/home/ProductDetail.tsx";
import { ProductDetail } from "./components/admin/ProductDetails.tsx";
import { CartDrawer } from "./components/cart/CartDrawer";
import LoginSignup from "./components/auth/LoginSignup";
import AccountInfo from "./payment/AccountInfo";
import UserProfile from "./components/home/UserProfile";
import AdminLogin from "./components/admin/AdminLogin";
import ProductForm from "./components/products/ProductForm";
import CategoryPage from "./components/home/CategoryPage";
import { WishlistPage } from "./components/WishlistPage";
import ShoppingCart from "./components/cart/ShoppingCart";
import { Footer } from "./components/footer/FooterUser";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import SearchResultsPage from "./components/home/SearchResultsPage";
import Dashboard from "./components/admin/Dashboard";
import OrdersTable from "./components/admin/status.tsx";
import UsersTable from "./components/admin/user.tsx";
import SizeChartPage from "./components/ui/SizeChart.tsx";
import Checkout from "./payment/Checkout.tsx";
import ShippingInfo from "./components/footer/ShippingInfo.tsx";
import Returns from "./components/footer/Returns.tsx";

// ===== Layout Component =====
const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
  <div className="flex flex-col min-h-screen w-screen">
      {/* Navbar */}
      <Navbar />

      {/* Main content grows to fill the remaining viewport */}
      <main className="flex-grow overflow-auto mt-[var(--navbar-height)]">
        {children}
      </main>

      {/* Footer always at bottom */}
      <Footer />

      {/* Floating Cart Drawer */}
      <CartDrawer />
    </div>
  );
};


// ===== Admin Auth Guard =====
const RequireAdminAuth: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
};

// ===== Main App =====
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
            {/* ===== Public Routes ===== */}
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
                    <Route path="/search" element={<SearchResultsPage />} />
                    <Route path="/size" element={<SizeChartPage />} />
                    <Route path="/payment" element={<Checkout/>} />
                    <Route path="/shipping-info" element={<ShippingInfo />} />
                    <Route path="/returns" element={<Returns />} />


                  </Routes>
                </Layout>
              }
            />

            {/* ===== Admin Routes ===== */}
            <Route
              path="/admin/login"
              element={<AdminLogin onLoginSuccess={handleAdminLoginSuccess} />}
            />

            <Route
              path="/admin/dashboard"
              element={
                <RequireAdminAuth>
                  <Dashboard token={token} />
                </RequireAdminAuth>
              }
            />

            <Route
              path="/admin/add-product"
              element={
                <RequireAdminAuth>
                  <ProductForm token={token} />
                </RequireAdminAuth>
              }
            />

            <Route
              path="/admin/product-details"
              element={
                <RequireAdminAuth>
                  <ProductDetail token={token} />
                </RequireAdminAuth>
              }
            />

            <Route
              path="/admin/status"
              element={
                <RequireAdminAuth>
                  <OrdersTable token={token} />
                </RequireAdminAuth>
              }
            />

            <Route
              path="/admin/users"
              element={
                <RequireAdminAuth>
                  <UsersTable token={token} />
                </RequireAdminAuth>
              }
            />

            <Route
              path="/admin/reviews"
              element={
                <RequireAdminAuth>
                  <ProductDetail token={token} />
                </RequireAdminAuth>
              }
            />

            {/* ===== Catch-All Route ===== */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
