// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home"; // ✅ lowercase (matches home.tsx)
import FooterUser from "./components/footer/FooterUser";
import Navbar from "./components/navbar/Navbar";

// Layout wrapper
const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <FooterUser />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home /> {/* ✅ works with home.tsx */}
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

 