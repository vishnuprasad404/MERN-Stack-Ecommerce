import React, { useContext, useEffect, useState } from "react";
import "./CartPage.css";
import Navbar from "../../Components/Navbar/Navbar";
import Rating from "../../Components/Rating/Rating";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import EmptyItemsPage from "../../Components/EmptyItemsPage/EmptyItemsPage";
import empty_cart from "../../Assets/empty-cart.webp";
import { EContextData as GlobalData } from "../../EContextData";
import { Loading } from "../../Components/Loading/Loading";
function CartPage() {
  const { user } = useContext(GlobalData);

  const nav = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrise, setTotalPrise] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/getcartproducts`)
      .then((res) => {
        setCartItems(res.data);
        setLoading(false);
        if (res.data.length >= 1) {
          axios
            .get(`${process.env.REACT_APP_BASE_URL}/getcarttotal`)
            .then((res) => {
              setTotalPrise(res.data.total);
            });
        }
      });
  }, []);

  const manageQuantity = (cart, key, action) => {
    let temp = cartItems;
    if (action === "inc") {
      temp[key].quantity += 1;
      temp[key].prise =
        temp[key].prise + parseInt(cartItems[key].product.discountPrise);
      setCartItems([...temp]);
    } else {
      temp[key].quantity -= 1;
      temp[key].prise =
        temp[key].prise - parseInt(cartItems[key].product.discountPrise);
      setCartItems([...temp]);
    }
    axios.put(
      `${process.env.REACT_APP_BASE_URL}/managequantity/${cart._id}/${cart.item}/${temp[key].quantity}/${temp[key].prise}`
    );
  };

  const deleteCartItem = (cid, pid, key) => {
    let cartItemCopy = cartItems;
    cartItemCopy.splice(key, 1);
    setCartItems([...cartItemCopy]);
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}/deletecartitem/${cid}/${pid}`)
      .then((res) => {
        if (res.data) {
          alert("item Deleted");
        } else {
          alert("Item not Deleted");
        }
      });
  };

  const orderProduct = () => {
    if (user) {
      let itemDetails = cartItems.map((itm) => {
        return {
          item: itm.item,
          quantity: itm.quantity,
          prise: itm.prise,
        };
      });
      axios
        .post(`${process.env.REACT_APP_BASE_URL}/create-order`, itemDetails)
        .then((res) => {
          if (res.data) {
            nav(`/checkout/${res.data.OrderId}`);
          }
        });
    }
  };

  return (
    <>
      <Navbar />
      {!loading && cartItems.length >= 1 ? (
        <div className="cart-page" id="myCart">
          <div className="cart-item-container-wrapper">
            {cartItems.map((itm, key) => {
              return (
                <div className="cart-item-container">
                  <div
                    className="cart-item-image"
                    onClick={() => nav(`/product/${itm.product._id}`)}
                  >
                    <img width="99%" src={itm.product.image1} alt="" />
                  </div>
                  <div className="cart-item-details">
                    <h4>{itm.product.title}</h4>
                    <Rating
                      id={itm.item}
                      style={{
                        marginTop: "5px",
                        marginBottom: "5px",
                        width: "50px",
                        height: "25px",
                      }}
                    />
                    <p>$ {itm.prise}</p>
                    <p style={{ color: "grey" }}>Quantity</p>
                    <div className="cart-item-action">
                      <button
                        disabled={itm.quantity <= 1 ? true : false}
                        className="quantity-btn"
                        onClick={() => manageQuantity(itm, key, "dec")}
                      >
                        -
                      </button>
                      <p className="quantity">{itm.quantity}</p>
                      <button
                        disabled={
                          itm.quantity >= itm.product.inStock ? true : false
                        }
                        className="quantity-btn"
                        onClick={() => manageQuantity(itm, key, "inc")}
                      >
                        +
                      </button>
                      <FontAwesomeIcon
                        className="cart-item-remove-btn"
                        icon={faTrash}
                        onClick={() => {
                          deleteCartItem(itm._id, itm.item, key);
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="cart-total-container-wrapper">
            <div className="cart-total-container">
              <h3>Prise Details</h3>
              <div className="total-items">
                <p>Total Items</p>
                <p>{cartItems.length}</p>
              </div>
              <div className="total-amount">
                <p>Total Amount</p>
                <p>$ {totalPrise}</p>
              </div>
              <button className="buy-cart" onClick={orderProduct}>
                BUY NOW
              </button>
            </div>
          </div>
        </div>
      ) : !loading && cartItems.length < 1 ? (
        <EmptyItemsPage image={empty_cart} text="YOUR CART IS EMPTY" />
      ) : (
        <Loading height="400px" />
      )}
    </>
  );
}

export default CartPage;
