import React, { useEffect, useRef, useState } from "react";
import "./OrdersItemDetailPage.css";
import Navbar from "../../Components/Navbar/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import Rating from "../../Components/Rating/Rating";
import Footer from "../../Components/Footer/Footer";
import { Loading } from "../../Components/Loading/Loading";
import {
  GetAllOrdersProvider,
  CreateOrderProvider,
  CancelOrderProvider,
} from "../../ApiRenderController";
import AddProductReviewForm from "../../Components/AddProductReviewForm/AddProductReviewForm";
import ConfirmBox from "../../Components/ConfirmBox/ConfirmBox";
import { useStore } from "../../Hooks/useStore";

function OrdersItemDetailPage() {
  const { state } = useStore();
  const { user } = state;
  const { orderId, productId } = useParams();
  const [orderdItem, setOrderdItem] = useState();
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [buyAgainLoading, setBuyAgainLoading] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const reference = useRef();
  const nav = useNavigate();

  useEffect(() => {
    const GetAllOrders = async () => {
      let res = await GetAllOrdersProvider();
      if (res) {
        setLoading(false);
        let item = res.filter((data) => {
          return data.order_id === orderId && data.product._id === productId;
        });
        setOrderdItem(item);
        console.log(item);
      }
    };
    GetAllOrders();
  }, [orderId, productId]);

  const buyAgain = async (pid, prise) => {
    if (user) {
      setBuyAgainLoading(true);
      let orderObj = {
        item: pid,
        quantity: 1,
        prise: parseInt(prise),
      };
      let res = await CreateOrderProvider([orderObj]);
      if (res) {
        setBuyAgainLoading(false);
        nav(`/checkout/${res.OrderId}`);
      }
    } else {
      nav("/signin");
    }
  };

  const cancelOrder = (pro_id,quantity) => {
    setShowModel(true);
    reference.current = pro_id;
    reference.quantity = quantity
  };
  const confirmCancelOrder = async (choose) => {
    if (choose) {
      setCancelLoading(true);
      setShowModel(false);
      let res = await CancelOrderProvider(
        orderdItem[0].order_id,
        reference.current,
        reference.quantity
      );
      if (res) {
        setCancelLoading(false);
        nav("/orders");
      }
    } else {
      setCancelLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      {orderdItem && !loading ? (
        <div className="view-orders-item-details">
          <section className="view-orders-product-detail-section">
            <div className="view-orders-item-details-container">
              <span className="orders-devider"></span>
              <section className="view-orders-product-detail-content-section">
                <div className="purshased-item-image-container">
                  <div className="purshased-item-image">
                    <img
                      width="100%"
                      src={orderdItem[0].product.thumbnail}
                      alt=""
                    />
                  </div>
                  <div className="purchased-item-title-and-rating">
                    <p>{orderdItem[0].product.title}</p>
                    <Rating
                      id={orderdItem[0].product._id}
                      style={{ marginBottom: "10px" }}
                      displayReview={true}
                    />
                    <p>
                      ₹ {orderdItem[0].prise} (quantity :{" "}
                      {orderdItem[0].quantity})
                    </p>
                  </div>
                </div>
                <div className="purchased-item-action">
                  {orderdItem[0].status === "placed" ||
                  orderdItem[0].status === "dispatched" ||
                  orderdItem[0].status === "completed" ? (
                    <button
                      className="buy-again-btn"
                      onClick={() =>
                        buyAgain(
                          orderdItem[0].product._id,
                          orderdItem[0].product.discountPrise
                        )
                      }
                    >
                      {!buyAgainLoading ? (
                        <FontAwesomeIcon
                          icon={faCartPlus}
                          style={{ marginRight: "8px" }}
                        />
                      ) : null}
                      {!buyAgainLoading ? (
                        "Buy again"
                      ) : (
                        <Loading
                          style={{ height: "auto" }}
                          iconSize="3px"
                          color="white"
                        />
                      )}
                    </button>
                  ) : null}
                  {orderdItem[0].status === "placed" ? (
                    <button
                      className="cancel-order-btn"
                      onClick={() => cancelOrder(orderdItem[0].product._id,orderdItem[0].quantity)}
                    >
                      {!cancelLoading ? (
                        <FontAwesomeIcon
                          icon={faXmark}
                          style={{ marginRight: "5px" }}
                        />
                      ) : null}
                      {cancelLoading ? (
                        <Loading
                          style={{ height: "auto" }}
                          iconSize="3px"
                          color="white"
                        />
                      ) : (
                        "Cancel Order"
                      )}
                    </button>
                  ) : null}
                  {orderdItem[0].status === "pending" ? (
                    <button
                      className="complete-order-btn"
                      onClick={() => nav(`/checkout/${orderId}`)}
                    >
                      <FontAwesomeIcon
                        icon={faCartPlus}
                        style={{ marginRight: "5px" }}
                      />
                      Complete Order
                    </button>
                  ) : null}
                </div>
                {orderdItem[0].status === "completed" ? (
                  <AddProductReviewForm pid={orderdItem[0].product._id} />
                ) : null}
              </section>
            </div>
            <ConfirmBox
              open={showModel}
              text="Are you sure want to cancel order?"
              onClose={() => setShowModel(false)}
              onDialog={confirmCancelOrder}
            />
          </section>
        </div>
      ) : (
        <Loading />
      )}
      <Footer />
    </>
  );
}

export default OrdersItemDetailPage;
