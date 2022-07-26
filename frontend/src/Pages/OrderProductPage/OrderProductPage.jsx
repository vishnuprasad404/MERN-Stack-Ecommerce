import React, { useEffect, useState } from "react";
import "./OrderProductPage.css";
import Navbar from "../../Components/Navbar/Navbar";
import DeliveryAddressContainer from "../../Components/DeliveryAddressContainer/DeliveryAddressContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Loading, SmallLoading } from "../../Components/Loading/Loading";
import {
  GetOrderProvider,
  GetDeliveryAddressProvider,
  ChangeOrderQuantityProvider,
  RemoveCheckoutItemProvider,
} from "../../ApiRenderController";
import Notification from "../../Components/Notification/Notification";
import Carousal from "react-elastic-carousel";

function OrderProductPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState();
  const [checkOutProducts, setCheckOutProducts] = useState([]);
  const [productTotal, setProductTotal] = useState(0);
  const [paymentMethord, setPaymentMethord] = useState("online");
  const { OrderId } = useParams();
  const [notify, setNotify] = useState({ display: "none" });
  const [quantityLoading, setQuantityLoading] = useState(new Set());
  const [addressLoading, setAddressLoading] = useState(true);
  const [removeOrderItemLoading, setRemoveOrderItemLoading] = useState(
    new Set()
  );

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
        setAddressLoading(false);
        setAddress(deliveryDetails);
      } else {
        setAddressLoading(false);
      }
    };
    GetOrderDetails();
  });

  const changeOrderItemQuantity = async (itm, action, selectedIndex) => {
    setQuantityLoading((prev) => new Set([...prev, selectedIndex]));
    if (action === "increese") {
      let new_prise = parseInt(itm.prise) + parseInt(itm.product.discountPrise);
      let new_quantity = itm.quantity + 1;
      let res = await ChangeOrderQuantityProvider(
        itm._id,
        itm.item,
        new_prise,
        new_quantity
      );
      if (res) {
        setQuantityLoading((prev) => {
          const updated = new Set(prev);
          updated.delete(selectedIndex);
          return updated;
        });
      }
    } else {
      let new_prise = parseInt(itm.prise) - parseInt(itm.product.discountPrise);
      let new_quantity = itm.quantity - 1;
      let res = await ChangeOrderQuantityProvider(
        itm._id,
        itm.item,
        new_prise,
        new_quantity
      );
      if (res) {
        setQuantityLoading((prev) => {
          const updated = new Set(prev);
          updated.delete(selectedIndex);
          return updated;
        });
      }
    }
  };

  const removeCheckoutItem = async (OrderId, ItemId, key) => {
    setRemoveOrderItemLoading((prev) => new Set([...prev, key]));
    const res = await RemoveCheckoutItemProvider(OrderId, ItemId);
    if (res) {
      setRemoveOrderItemLoading((prev) => {
        const updated = new Set(prev);
        updated.delete(key);
        return updated;
      });
    }
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
    <div className="order-product-page" id="order">
      <>
        <Navbar />
        <div className="order-product-container" id="order">
          <div className="order-product-item-container-wrapper">
            <div className="order-item-container-wrapper">
              <Carousal>
                {checkOutProducts.map((itm, key) => {
                  return (
                    <div className="order-item" key={key}>
                      <div className="order-item-image">
                        <img
                          width="100%"
                          src={itm.product.thumbnail}
                          alt="product"
                        />
                      </div>
                      <div className="order-item-details">
                        <p className="order-product-title">
                          {itm.product.title}
                        </p>
                        <div className="order-item-prise-container">
                          <p className="dis-prise">₹ {itm.prise}</p>
                          <del className="org-prise">
                            {itm.product.orginalPrise}
                          </del>
                        </div>
                        <div className="order-item-quantity">
                          <button
                            disabled={
                              itm.quantity <= 1 || quantityLoading.has(key)
                                ? true
                                : false
                            }
                            className="order-product-quantity-btn"
                            onClick={() =>
                              changeOrderItemQuantity(itm, "decreese", key)
                            }
                          >
                            -
                          </button>
                          <p>{itm.quantity}</p>
                          <button
                            disabled={
                              itm.quantity >= itm.product.inStock ||
                              quantityLoading.has(key)
                                ? true
                                : false
                            }
                            className="order-product-quantity-btn"
                            onClick={() =>
                              changeOrderItemQuantity(itm, "increese", key)
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="remove-order-product-btn">
                        {!removeOrderItemLoading.has(key) ? (
                          <FontAwesomeIcon
                            icon={faTrash}
                            style={{
                              display: `${
                                checkOutProducts.length < 2 ? "none" : null
                              }`,
                            }}
                            onClick={() =>
                              removeCheckoutItem(itm._id, itm.item, key)
                            }
                          />
                        ) : (
                          <SmallLoading />
                        )}
                      </div>
                    </div>
                  );
                })}
              </Carousal>
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
                  onChange={() => setPaymentMethord("online")}
                />
                <p>Online Payment</p>
              </div>
              <div className="check-out-select-payment">
                <input
                  type="checkbox"
                  checked={paymentMethord === "cod" ? true : false}
                  onChange={() => setPaymentMethord("cod")}
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
            {addressLoading ? (
              <SmallLoading
                smallLoadingStyle={{
                  margin: `30px 0`,
                  height: "auto",
                  width: "95%",
                }}
              />
            ) : address ? (
              <DeliveryAddressContainer
                name={address.name}
                phone={address.phone}
                address={address.address}
                state={address.state}
                pincode={address.pincode}
              />
            ) : null}
            <Link
              to={`/delivery-address?redirect=/checkout/${OrderId}`}
              className="change-address-link"
            >
              {addressLoading
                ? null
                : address
                ? "change address"
                : "add Delivery address"}
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
