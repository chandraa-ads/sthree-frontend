import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Contexts
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";

// Layout
import Navbar from "./components/layout/Navbar";
import FooterUser from "./components/footer/FooterUser"; // ✅ Fixed missing import

// Auth & Cart
import { AuthModal } from "./components/auth/AuthModal";
import { CartDrawer } from "./components/cart/CartDrawer";

// Pages & Components
import { Hero } from "./components/home/Hero";
import { FeaturedProducts } from "./components/home/FeaturedProducts";
import AddProduct from "./components/admin/AddProduct";
import Dashboard from "./components/admin/Dashboard";
import ProductDetails from "./components/admin/ProductDetails";
import OrdersTable from "./components/admin/status";
import UsersTable from "./components/admin/user";
import AccountInfo from "./payment/AccountInfo";

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-white">
            
            {/* 🔻 Navbar */}
            <Navbar onAuthClick={() => setIsAuthModalOpen(true)} />

            {/* 🔻 Page Routes */}
            <main className="flex-grow">
              <Routes>
                {/* Home */}
                <Route
                  path="/"
                  element={
                    <>
                      <Hero />
                      <FeaturedProducts />
                    </>
                  }
                />

                {/* Admin & User Pages */}
                <Route path="/product-details" element={<ProductDetails />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/add-product" element={<AddProduct />} />
                <Route path="/status" element={<OrdersTable />} />
                <Route path="/user" element={<UsersTable />} />

                {/* Payments */}
                <Route path="/accountinfo" element={<AccountInfo />} />

                {/* Footer Demo Route */}
                <Route path="/footer" element={<FooterUser />} />
              </Routes>
            </main>

            {/* 🔑 Auth Modal */}
            <AuthModal
              isOpen={isAuthModalOpen}
              onClose={() => setIsAuthModalOpen(false)}
            />

            {/* 🛒 Cart Drawer */}
            <CartDrawer />

            {/* 🔻 Global Footer (on all pages) */}
            <FooterUser />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
