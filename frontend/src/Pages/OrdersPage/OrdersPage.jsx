import React, { useEffect, useState } from "react";
import "./OrdersPage.css";
import Navbar from "../../Components/Navbar/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Rating from "../../Components/Rating/Rating";
import { useNavigate } from "react-router-dom";

function OrdersPage() {
  const nav = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/user/get-orders`)
      .then((res) => {
        setOrders(res.data.reverse());
      });
  });



  return (
    <>
      <Navbar />
      <div className="view-orders-page">
        <section className="order-filter-section">
          <h5>Filter Orders</h5>
          <div className="filter-order-by-search">
            <FontAwesomeIcon icon={faSearch} />
            <input type="text" placeholder="Search order" />
          </div>
          <div className="sort-orders">
            <p className="orders-sort-heading">Order Status</p>
            <OrderSortOption opt="Pending" />
            <OrderSortOption opt="Placed" />
            <OrderSortOption opt="Deliverd" />
            <OrderSortOption opt="Cancelled" />
            <p className="orders-sort-heading">Order Time</p>
            <OrderSortOption opt="Last 30 Days" />
            <OrderSortOption opt="2022" />
            <OrderSortOption opt="2021" />
            <OrderSortOption opt="2019" />
            <OrderSortOption opt="Older" />
          </div>
        </section>
        <section className="orders-section">
          <div className="order-container-wrapper">
            {orders.map( (itm, k) => {
              let today = new Date();
              const yyyy = today.getFullYear();
              let mm = today.getMonth() + 1;
              let dd = today.getDate();
              if (dd < 10) dd = "0" + dd;
              if (mm < 10) mm = "0" + mm;
              today = dd + "/" + mm + "/" + yyyy;

              let ORDER_DATE =
                itm.created_at === today ? "Today" : itm.created_at;

              return (
                <>
                  <p className="order-date">{ORDER_DATE}</p>
                  <div
                    className="orders-container"
                    onClick={() => nav(`/view-order-product/${itm.item}`)}
                  >
                    <section className="orders-item-details">
                      <div className="orders-item-image">
                        <img src={itm.product.image1} alt="" />
                      </div>
                      <div className="orders-item-title-and-prise">
                        <h6>{itm.product.title}</h6>
                        <Rating id={itm.item}/>

                        <br />
                        <p>
                          $ {itm.prise} Quantity : {itm.quantity}{" "}
                        </p>
                      </div>
                    </section>
                    {itm.status === "placed" ? (
                      <span className="placed-bnr">Active</span>
                    ) : null}
                    {itm.status === "dispatched" ? (
                      <span className="pending-bnr">Shipped</span>
                    ) : null}
                    {itm.status === "completed" ? (
                      <span className="deliverd-bnr">Deliverd</span>
                    ) : null}
                    {itm.status === "cancelled" ? (
                      <span className="cancelled-bnr">Cancelled</span>
                    ) : null}
                  </div>
                </>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}

const OrderSortOption = (props) => {
  return (
    <div className="sort-order-option">
      <input type="checkbox" />
      {props.opt}
    </div>
  );
};
export default OrdersPage;
