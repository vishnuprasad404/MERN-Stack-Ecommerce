import React from "react";
import { useNavigate } from "react-router-dom";
import "./EmptyItemsPage.css";

function EmptyItemsPage(props) {
  const nav = useNavigate();
  const { image, text, imageSize } = props;
  return (
    <div className="empty-items-page">
      <img width={imageSize} src={image} alt="Item is empty" />
      <h3>{text}</h3>
      <button onClick={() => nav("/products")}>Continue Shopping</button>
    </div>
  );
}

export default EmptyItemsPage;
