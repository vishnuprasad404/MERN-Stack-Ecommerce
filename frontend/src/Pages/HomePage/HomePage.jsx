import React from "react";
import HomeSection from "../../Components/HomeSection/HomeSection";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import "./HomePage.css";

function HomePage() {
  return (
    <div className="home-page">
      <Navbar />
      <HomeSection />
      <Footer />
    </div>
  );
}

export default HomePage;
