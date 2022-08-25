import React, { useEffect, useState } from "react";
import "./OrdersPage.css";
import Navbar from "../../Components/Navbar/Navbar";
import Rating from "../../Components/Rating/Rating";
import { useNavigate } from "react-router-dom";
import emptyOrder from "../../Assets/empty-orders.png";
import EmptyItemsPage from "../../Components/EmptyItemsPage/EmptyItemsPage";
import { Loading } from "../../Components/Loading/Loading";
import FilterOrders from "../../Components/FilterOrders/FilterOrders";
import { GetAllOrdersProvider } from "../../ApiRenderController";

function OrdersPage() {
  const nav = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const GetAllOrders = async () => {
      let res = await GetAllOrdersProvider();
      setOrders(res.reverse());
      setLoading(false);
    };
    GetAllOrders();
  }, []);

  return (
    <>
      <Navbar />
      {loading ? (
        <Loading />
      ) : orders.length >= 1 ? (
        <div className="view-orders-page">
          <FilterOrders setSearchQuery={setSearchQuery} />
          <section className="orders-section">
            <div className="order-container-wrapper">
              {orders
                .filter((data) => {
                  if (searchQuery !== "") {
                    return (
                      data.status === searchQuery ||
                      data.product.title
                        .toString()
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                    );
                  } else {
                    return data;
                  }
                })
                .map((itm, key) => {
                  let date = new Date(itm.created_at);
                  const yyyy = date.getFullYear();
                  let mm = date.getMonth() + 1;
                  let dd = date.getDate();
                  if (dd < 10) dd = "0" + dd;
                  if (mm < 10) mm = "0" + mm;
                  date = dd + "/" + mm + "/" + yyyy;
                  return (
                    <div key={key}>
                      <div>
                        <p className="order-date">{date}</p>
                        <div
                          className="orders-container"
                          onClick={() =>
                            nav(
                              `/view-order-product/${itm.order_id}/${itm.product._id}`
                            )
                          }
                        >
                          <section className="orders-item-details">
                            <div className="orders-item-image">
                              <img src={itm.product.image1} alt="" />
                            </div>
                            <div className="orders-item-title-and-prise">
                              <h6
                                style={{
                                  textDecoration:
                                    itm.status === "cancelled"
                                      ? "line-through"
                                      : null,
                                }}
                              >
                                {itm.product.title}
                              </h6>
                              <Rating
                                id={itm.product._id}
                                style={{
                                  width: "45px",
                                  height: "25px",
                                  margin: "10px 0",
                                }}
                              />
                              <p className="total-prise-and-quantity">
                                Prise : {itm.prise}
                                Quantity :{itm.quantity}
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
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>
        </div>
      ) : (
        <EmptyItemsPage
          text="No Orders Available"
          image={emptyOrder}
          imageSize="200px"
        />
      )}
    </>
  );
}

export default OrdersPage;
