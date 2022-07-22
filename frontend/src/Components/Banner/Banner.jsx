import React from "react";
import "./Banner.css";

function Banner(props) {
  return (
    <div className="banner" style={{backgroundImage : `url(${props.image})`}} onClick={props.action}>
    </div>
  );
}

export default Banner;
