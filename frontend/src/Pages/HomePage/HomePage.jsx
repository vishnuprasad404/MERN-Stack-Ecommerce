import React from "react";
import HomeSection from "../../Components/HomeSection/HomeSection";
import Navbar from "../../Components/Navbar/Navbar";
import "./HomePage.css";

function HomePage() {
  return (
    <div className="home-page">
      <Navbar />
      <HomeSection />
    </div>
  );
}

export default HomePage;
