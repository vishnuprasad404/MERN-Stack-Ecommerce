import React, { useEffect, useState } from "react";
import "./OrderProductPage.css";
import Navbar from "../../Components/Navbar/Navbar";
import DeliveryAddressContainer from "../../Components/DeliveryAddressContainer/DeliveryAddressContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Loading } from "../../Components/Loading/Loading";

function OrderProductPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({});
  const [checkOutProducts, setCheckOutProducts] = useState([]);
  const [productTotal, setProductTotal] = useState(0);
  const [paymentMethord, setPaymentMethord] = useState("online");
  const { OrderId } = useParams();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/get-order/${OrderId}`)
      .then((res) => {
        if (res.data.length >= 1) {
          setCheckOutProducts(res.data);
          setProductTotal(
            res.data[0].order_total >= 1
              ? res.data[0].order_total
              : res.data[0].prise
          );
        } else {
          nav("*");
        }
      });
    axios 
      .get(`${process.env.REACT_APP_BASE_URL}/getshippingaddress`)
      .then((res) => {
        setAddress(res.data);
      });
  });

  const changeOrderItemQuantity = (itm, action) => {
    if (action === "increese") {
      let new_prise = parseInt(itm.prise) + parseInt(itm.product.discountPrise);
      let new_quantity = itm.quantity + 1;
      axios.put(
        `${process.env.REACT_APP_BASE_URL}/change-order-item-quantity/${itm._id}/${itm.item}/${new_prise}/${new_quantity}`
      );
    } else {
      let new_prise = parseInt(itm.prise) - parseInt(itm.product.discountPrise);
      let new_quantity = itm.quantity - 1;
      axios.put(
        `${process.env.REACT_APP_BASE_URL}/change-order-item-quantity/${itm._id}/${itm.item}/${new_prise}/${new_quantity}`
      );
    }
  };

  const removeCheckoutItem = (OrderId, ItemId) => {
    axios.delete(
      `${process.env.REACT_APP_BASE_URL}/remove-checkout-item/${OrderId}/${ItemId}`
    );
  };

  const onCheckOut = () => {
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
          //=======================razorpay ui start================//
          var options = {
            key: process.env.REACT_APP_RAZORPAY_KEY_ID,
            amount: parseInt(productTotal),
            currency: "INR",
            name: "Acme Corp",
            description: "Test Transaction",
            image: "https://example.com/your_logo",
            order_id: res.data.order.id,
            handler: function (response) {
              verifyOnlinePayment(response, res.data.order);
            },
            prefill: {
              name: "Gaurav Kumar",
              email: "gaurav.kumar@example.com",
              contact: "9999999999",
            },
            notes: {
              address: "Razorpay Corporate Office",
            },
            theme: {
              color: "#3399cc",
            },
          };
          var rzp1 = new window.Razorpay(options);
          let opened = rzp1.open();

          if (opened) {
            setLoading(false);
          }
          //=======================razorpay ui end==================//
        }
      });
  };

  const verifyOnlinePayment = (payment, order) => {
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
                      <p className="title">{itm.product.title}</p>
                      <div className="order-item-prise-container">
                        <p className="dis-prise">$ {itm.prise}</p>
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
                <p>$ {productTotal}</p>
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
                  <Loading color="grey" iconSize="1.5rem" />
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
    </div>
  );
}

export default OrderProductPage;
