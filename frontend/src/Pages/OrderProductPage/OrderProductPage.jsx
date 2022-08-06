import React, { useEffect, useState } from "react";
import "./OrderProductPage.css";
import Navbar from "../../Components/Navbar/Navbar";
import DeliveryAddressContainer from "../../Components/DeliveryAddressContainer/DeliveryAddressContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Loading } from "../../Components/Loading/Loading";
import {
  GetOrderProvider,
  GetDeliveryAddressProvider,
  ChangeOrderQuantityProvider,
  RemoveCheckoutItemProvider,
} from "../../ApiRenderController";
import Notification from "../../Components/Notification/Notification";

function OrderProductPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState();
  const [checkOutProducts, setCheckOutProducts] = useState([]);
  const [productTotal, setProductTotal] = useState(0);
  const [paymentMethord, setPaymentMethord] = useState("online");
  const { OrderId } = useParams();
  const [notify, setNotify] = useState({ display: "none" });

  useEffect(() => {
    const GetOrderDetails = async () => {
      let order = await GetOrderProvider(OrderId);
      if (order) {
        if (order.length >= 1) {
          setCheckOutProducts(order);
          setProductTotal(
            order[0].order_total >= 1 ? order[0].order_total : order[0].prise
          );
        } else {
          nav("*");
        }
      }
      let deliveryDetails = await GetDeliveryAddressProvider();
      if (deliveryDetails) {
        setAddress(deliveryDetails);
      }
    };
    GetOrderDetails();
  });

  const changeOrderItemQuantity = (itm, action) => {
    if (action === "increese") {
      let new_prise = parseInt(itm.prise) + parseInt(itm.product.discountPrise);
      let new_quantity = itm.quantity + 1;
      ChangeOrderQuantityProvider(itm._id, itm.item, new_prise, new_quantity);
    } else {
      let new_prise = parseInt(itm.prise) - parseInt(itm.product.discountPrise);
      let new_quantity = itm.quantity - 1;
      ChangeOrderQuantityProvider(itm._id, itm.item, new_prise, new_quantity);
    }
  };

  const removeCheckoutItem = (OrderId, ItemId) => {
    RemoveCheckoutItemProvider(OrderId, ItemId);
  };

  const onCheckOut = async () => {
    if (address) {
      setLoading(true);
      axios
        .put(
          `${process.env.REACT_APP_BASE_URL}/place-order/${checkOutProducts[0]._id}/${productTotal}/${paymentMethord} `
        )
        .then((res) => {
          if (res.data.status === "placed") {
            setLoading(false);
            nav(`/order-placed-successfully/${checkOutProducts[0]._id}`);
          } else if (res.data.status === "pending") {
            var options = {
              key: process.env.REACT_APP_RAZORPAY_KEY_ID,
              amount: parseInt(productTotal),
              currency: "INR",
              name: "Ecart Online",
              description: "Test Transaction",
              image: "https://example.com/your_logo",
              order_id: res.data.order.id,
              handler: function (response) {
                verifyOnlinePayment(response, res.data.order);
              },
              prefill: {
                name: "Vishnu Prasad N",
                email: "ecart@online.com",
                contact: "9999222255",
              },
              notes: {
                address: "Ecart Corporate Office",
              },
              theme: {
                color: "#3399cc",
              },
            };
            var rzp1 = new window.Razorpay(options);
            let isOpend = rzp1.open();
            if (isOpend) {
              setLoading(false);
            }
          }
        });
    } else {
      setNotify({
        display: "flex",
        type: "WARNING",
        text: "Please add a delivery address!",
      });
      setTimeout(() => {
        setNotify({ display: "none" });
      }, 3000);
    }
  };

  const verifyOnlinePayment = async (payment, order) => {
    setLoading(true);
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/verify-online-payment`, {
        payment,
        order,
      })
      .then((res) => {
        if (res.data) {
          setLoading(false);
        }
        if (res.data.paymentVerified === true) {
          nav(`/order-placed-successfully/${checkOutProducts[0]._id}`);
        }
      });
  };

  return (
    <div className="order-product-page">
      <>
        <Navbar />
        <div className="order-product-container">
          <div className="order-product-item-container-wrapper">
            <div className="order-item-container-wrapper">
              {checkOutProducts.map((itm) => {
                return (
                  <div className="order-item">
                    <div className="order-item-image">
                      <img
                        width="100%"
                        src={itm.product.image1}
                        alt="product"
                      />
                    </div>
                    <div className="order-item-details">
                      <p className="order-product-title">{itm.product.title}</p>
                      <div className="order-item-prise-container">
                        <p className="dis-prise">₹ {itm.prise}</p>
                        <del className="org-prise">
                          {itm.product.orginalPrise}
                        </del>
                      </div>
                      <div className="order-item-quantity">
                        <button
                          disabled={itm.quantity <= 1 ? true : false}
                          className="order-product-quantity-btn"
                          onClick={() =>
                            changeOrderItemQuantity(itm, "decreese")
                          }
                        >
                          -
                        </button>
                        <p>{itm.quantity}</p>
                        <button
                          disabled={
                            itm.quantity >= itm.product.inStock ? true : false
                          }
                          className="order-product-quantity-btn"
                          onClick={() =>
                            changeOrderItemQuantity(itm, "increese")
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <FontAwesomeIcon
                      icon={faTrash}
                      style={{
                        display: `${
                          checkOutProducts.length < 2 ? "none" : null
                        }`,
                      }}
                      onClick={() => removeCheckoutItem(itm._id, itm.item)}
                      className="remove-order-product-btn"
                    />
                  </div>
                );
              })}
            </div>
            <div className="check-out-details">
              <p className="check-out-heading">Prise Details</p>
              <div className="total-check-out-product">
                <p>Total Items</p>
                <p>{checkOutProducts.length}</p>
              </div>
              <div className="total-check-out-prise">
                <p>Total Prise</p>
                <p>₹ {productTotal}</p>
              </div>
              <p className="check-out-heading">Payment Methord</p>
              <div className="check-out-select-payment">
                <input
                  type="checkbox"
                  checked={paymentMethord === "online" ? true : false}
                  onClick={() => setPaymentMethord("online")}
                />
                <p>Online Payment</p>
              </div>
              <div className="check-out-select-payment">
                <input
                  type="checkbox"
                  checked={paymentMethord === "cod" ? true : false}
                  onClick={() => setPaymentMethord("cod")}
                />
                <p>Cash on delivery (COD)</p>
              </div>
              <button className="check-out-btn" onClick={onCheckOut}>
                {!loading ? (
                  "Check Out"
                ) : (
                  <Loading iconSize="10px" style={{ height: "auto" }} />
                )}
              </button>
            </div>
          </div>
          <div className="order-product-address-container">
            <h4>Shipping Address</h4>
            {address ? (
              <DeliveryAddressContainer
                name={address.name}
                phone={address.phone}
                address={address.address}
                state={address.state}
                pincode={address.pincode}
              />
            ) : null}
            <Link to="/delivery-address" className="change-address-link">
              {address ? "change address" : "add Delivery address"}
            </Link>
          </div>
        </div>
      </>
      <Notification
        status={notify}
        parentStyle={{ top: "60px", justifyContent: "flex-end" }}
      />
    </div>
  );
}

export default OrderProductPage;
