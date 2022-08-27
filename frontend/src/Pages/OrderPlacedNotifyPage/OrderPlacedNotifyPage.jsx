import React from "react";
import "./OrderPlacedNotifyPage.css";
import image from "../../Assets/orderplaced.gif";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { GetAllOrdersProvider } from "../../ApiRenderController";

function OrderPlacedNotifyPage() {
  const nav = useNavigate();
  const { OrderId } = useParams();
  useEffect(() => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });

    const getAllOrders = async () => {
      let res = await GetAllOrdersProvider();
      let findOrder = res.filter((data) => {
        return data._id === OrderId;
      });
      if (findOrder.length < 1) {
        nav("*");
      }
    };
    getAllOrders();
  }, [OrderId, nav]);

  return (
    <div className="order-placed-notify-page">
      <div className="order-placed-notify-container">
        <div className="order-placed-container">
          <img src={image} alt="" />
          <p>Thankyou for shopping</p>
          <div className="order-placed-success-btns">
            <button onClick={() => nav("/orders")}>My Orders</button>
            <button onClick={() => nav("/")}>Continue Shopping</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderPlacedNotifyPage;
