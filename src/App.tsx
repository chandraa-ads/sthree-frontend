import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import Navbar from "./components/layout/Navbar";
import { AuthModal } from "./components/auth/AuthModal";
import { CartDrawer } from "./components/cart/CartDrawer";

// ✅ Pages
import { Hero } from "./components/home/Hero";
import { FeaturedProducts } from "./components/home/FeaturedProducts";
import AddProduct from "./components/admin/AddProduct";
import Dashboard from "./components/admin/Dashboard";
import ProductDetails from "./components/admin/ProductDetails";
import OrdersTable from "./components/admin/status";
import { User } from "lucide-react";
import UsersTable from "./components/admin/user";
import AccountInfo from "./payment/AccountInfo";

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-white">
            {/* 🔻 Navbar */}
            <Navbar onAuthClick={() => setIsAuthModalOpen(true)} />

            {/* 🔻 Page Routes */}
            <main>
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

                {/* Add Product → shows only AddProduct component */}
                <Route path="/product-details" element={<ProductDetails />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/add-product" element={<AddProduct />} />
                <Route path="/status" element={<OrdersTable />} />
                <Route path="/user" element={<UsersTable />} />
                <Route path="/accountinfo" element={<AccountInfo />} />

              


                {/* About Page */}
              </Routes>
            </main>

            {/* 🔑 Auth Modal */}
            <AuthModal
              isOpen={isAuthModalOpen}
              onClose={() => setIsAuthModalOpen(false)}
            />

            {/* 🛒 Cart Drawer */}
            <CartDrawer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
