import React from "react";
import "./OrderPlacedNotifyPage.css";
import image from "../../Assets/order-placed-success.png";
import { useNavigate, useParams } from "react-router-dom";
import { HashLink as Link } from "react-router-hash-link";
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
          <h3>Your Order Placed Successfully</h3>
          <p className="order-id">Order Id : ({OrderId}) </p>
          <img src={image} alt="" />
          <p>Thankyou for shopping</p>
          <button onClick={() => nav("/")}>Continue Shopping</button>
          <span className="order-placed-link">
            or <br />
            <Link className="link" to="/orders">
              My orders
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default OrderPlacedNotifyPage;
