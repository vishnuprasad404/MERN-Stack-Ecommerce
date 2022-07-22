import React from "react";
import { useNavigate } from "react-router-dom";
import "./EmptyItemsPage.css";

function EmptyItemsPage(props) {
  const nav = useNavigate();
  const { image, text } = props;
  return (
    <div className="empty-items-page">
      <img width="500px" src={image} alt="" />
      <h3>{text}</h3>
      <button onClick={() => nav("/products")}>Continue Shopping</button>
    </div>
  );
}

export default EmptyItemsPage;
