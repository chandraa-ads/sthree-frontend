// src/pages/Home.tsx
import React from "react";

// ✅ Correct imports (don't import Home inside itself)
import { Hero } from "../../components/home/Hero";
import { FeaturedProducts, Testimonials } from "../../components/home/FeaturedProducts";
import FooterUser from "../../components/footer/FooterUser";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <main className="flex-grow">
        <Hero />
        <FeaturedProducts />
        <Testimonials />
      </main>

      {/* Footer */}
      <FooterUser />
    </div>
  );
};

export default Home;
