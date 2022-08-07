import React from "react";
import "./OrderPlacedNotifyPage.css";
import image from "../../Assets/order-placed-success.png";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

function OrderPlacedNotifyPage() {
  const nav = useNavigate();
  const { OrderId } = useParams();
  useEffect(() => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

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
