import React, { useEffect, useState } from "react";
import "./OrdersPage.css";
import Navbar from "../../Components/Navbar/Navbar";
import axios from "axios";
import Rating from "../../Components/Rating/Rating";
import { useNavigate } from "react-router-dom";
import emptyOrder from "../../Assets/empty-orders.png";
import EmptyItemsPage from "../../Components/EmptyItemsPage/EmptyItemsPage";
import { Loading } from "../../Components/Loading/Loading";
import FilterOrders from "../../Components/FilterOrders/FilterOrders";

function OrdersPage() {
  const nav = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GetAllOrders()
  }, []);

  const GetAllOrders = async () => {
    let res = await axios.get(`${process.env.REACT_APP_BASE_URL}/user/get-orders`);
    setOrders(res.data)
    setLoading(false)
  };

  return (
    <>
      <Navbar />
      {!loading && orders.length >= 1 ? (
        <div className="view-orders-page">
          <FilterOrders orders={orders} setOrders={setOrders} />
          <section className="orders-section">
            <div className="order-container-wrapper">
              {orders.map((itm, k) => {
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
                          <Rating id={itm.item} />

                          <br />
                          <p>
                            $ {itm.prise} Quantity : {itm.quantity}{" "}
                          </p>
                        </div>
                      </section>
                      {itm.status === "pending" ? (
                        <span className="pending-bnr">Pending</span>
                      ) : null}
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
      ) : !loading && orders.length < 1 ? (
        <EmptyItemsPage
          text="No Orders Available"
          image={emptyOrder}
          imageSize="200px"
        />
      ) : (
        <Loading height="400px" />
      )}
    </>
  );
}

export default OrdersPage;
