import React from "react";
import HomeSection from "../../Components/HomeSection/HomeSection";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import "./HomePage.css";
import { useEffect } from "react";
import { useStore } from "../../Hooks/useStore";
import {GetAllCartProductProvider} from '../../ApiRenderController'

function HomePage() {
  const { state, dispatch } = useStore();
  // useEffect(() => {
  //   const getCart = async () => {
  //     let res = await GetAllCartProductProvider();
  //     dispatch({
  //       type: "ADD_TO_CART",
  //       payload: [...state,res],
  //     });
  //   };
  //   getCart();
  // }, [dispatch]);
  return (
    <div className="home-page">
      <Navbar />
      <HomeSection />
      <Footer />
    </div>
  );
}

export default HomePage;
