import React from "react";
import "./ErrorPage.css";
import error from "../../Assets/error.jpg";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function ErrorPage() {
  const nav = useNavigate();
  useEffect(()=>{
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  },[])
  return (
    <div className="error-page">
      <img width="400px" src={error} alt="" />
      <button onClick={() => nav("/")} className="error-btn">
        Go to Home
      </button>
    </div>
  );
}

export default ErrorPage;
