import React from "react";
import "./OrderPlacedNotifyPage.css";
import image from "../../Assets/order-placed-success.png";
import { useNavigate, useParams } from "react-router-dom";

function OrderPlacedNotifyPage() {
  const nav = useNavigate();
  const { OrderId } = useParams();

  return (
    <div className="order-placed-notify-page">
      <div className="order-placed-notify-container">
        <div className="order-placed-container">
          <h3>Your Order Placed Successfully</h3>
          <p>Order Id : ({OrderId}) </p>
          <img src={image} alt="" />
          <p>Thankyou for shopping</p>
          <button onClick={() => nav("/")}>Continue Shopping</button>
        </div>
      </div>
    </div>
  );
}

export default OrderPlacedNotifyPage;
