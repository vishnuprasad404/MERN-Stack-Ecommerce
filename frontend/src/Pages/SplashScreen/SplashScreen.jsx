import React from "react";
import "./SplashScreen.css";
import cart from '../../Assets/loadercart.gif'

function SplashScreen() {
  return (
    <div className="splashscreen">
      <img
        src={cart}
        alt=""
      />
      <p className="splash-text">Ecart online</p>
    </div>
  );
}

export default SplashScreen;
