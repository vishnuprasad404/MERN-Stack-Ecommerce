import React, { useContext, useEffect, useState, useRef } from "react";
import "./CartPage.css";
import Navbar from "../../Components/Navbar/Navbar";
import Rating from "../../Components/Rating/Rating";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import EmptyItemsPage from "../../Components/EmptyItemsPage/EmptyItemsPage";
import empty_cart from "../../Assets/emptyCart.gif";
import { EContextData as GlobalData } from "../../EContextData";
import { Loading, SmallLoading } from "../../Components/Loading/Loading";
import {
  RemoveCartItemProvider,
  CreateOrderProvider,
  ManageCartItemQuantityProvider,
  GetAllCartProductProvider,
  GetCartTotalProvider,
} from "../../ApiRenderController";
import ConfirmBox from "../../Components/ConfirmBox/ConfirmBox";

function CartPage() {
  const { user } = useContext(GlobalData);
  const nav = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrise, setTotalPrise] = useState("");
  const [loading, setLoading] = useState(true);
  const [changeQuantityLoading, setChangeQuantityLoading] = useState(new Set());
  const [removeCartLoading, setRemoveCartLoading] = useState(new Set());
  const [orderLoading, setOrderLoading] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const refrence = useRef();

  useEffect(() => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    getCart();
  }, []);

  const getCart = async () => {
    let res = await GetAllCartProductProvider();
    setCartItems(res);
    if (res) {
      setLoading(false);
      if (res.length >= 1) {
        let total = await GetCartTotalProvider();
        if (total) {
          setTotalPrise(total.total);
        }
      }
    }
  };

  const manageQuantity = (cart, key, action) => {
    setChangeQuantityLoading((prev) => new Set([...prev, key]));
    let temp = cartItems;
    if (action === "inc") {
      temp[key].quantity += 1;
      temp[key].prise =
        temp[key].prise + parseInt(cartItems[key].product.discountPrise);
      ManageCartItemQuantityProvider(
        cart._id,
        cart.item,
        temp[key].quantity,
        temp[key].prise
      );
      // setCartItems([...temp]);
      setTimeout(() => {
        setChangeQuantityLoading((prev) => {
          const updated = new Set(prev);
          updated.delete(key);
          return updated;
        });
        getCart();
      }, 100);
    } else {
      temp[key].quantity -= 1;
      temp[key].prise =
        temp[key].prise - parseInt(cartItems[key].product.discountPrise);
      ManageCartItemQuantityProvider(
        cart._id,
        cart.item,
        temp[key].quantity,
        temp[key].prise
      );
      setTimeout(() => {
        setChangeQuantityLoading((prev) => {
          const updated = new Set(prev);
          updated.delete(key);
          return updated;
        });
        getCart();
      }, 100);
    }
  };

  const deleteCartItem = (cid, pid, selectedIndex) => {
    setShowModel(true);
    refrence.current = selectedIndex;
    refrence.cart_id = cid;
    refrence.product_id = pid;
  };

  const areUSureDelete = async (choose) => {
    if (choose) {
      setShowModel(false);
      setRemoveCartLoading((prev) => new Set([...prev, refrence.current]));
      let res = await RemoveCartItemProvider(
        refrence.cart_id,
        refrence.product_id
      );
      if (res) {
        if (res === true) {
          let cartItemCopy = cartItems;
          cartItemCopy.splice(refrence.current, 1);
          setCartItems([...cartItemCopy]);
        }
        setRemoveCartLoading((prev) => {
          const updated = new Set(prev);
          updated.delete(refrence.current);
          return updated;
        });
      }
    } else {
      setShowModel(false);
    }
  };

  const orderProduct = async () => {
    setOrderLoading(true);
    if (user) {
      let OrderDetails = cartItems.map((itm) => {
        return {
          item: itm.item,
          quantity: itm.quantity,
          prise: itm.prise,
        };
      });
      let res = await CreateOrderProvider(OrderDetails);
      if (res) {
        setOrderLoading(false);
        nav(`/checkout/${res.OrderId}`);
      }
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
                <div className="cart-item-container" key={key}>
                  <div
                    className="cart-item-image"
                    onClick={() => nav(`/product/${itm.product._id}`)}
                  >
                    <img width="99%" src={itm.product.image1} alt="" />
                  </div>
                  <div className="cart-item-details">
                    <h4>{itm.product.title}</h4>
                    <div className="rating-and-prise">
                      <Rating
                        id={itm.item}
                        style={{
                          marginTop: "5px",
                          marginBottom: "5px",
                          width: "50px",
                          height: "25px",
                        }}
                      />
                      <span>₹ {itm.prise}</span>
                    </div>
                    <div className="cart-item-action">
                      <button
                        disabled={
                          itm.quantity <= 1 || changeQuantityLoading.has(key)
                            ? true
                            : false
                        }
                        className="quantity-btn"
                        onClick={() => manageQuantity(itm, key, "dec")}
                      >
                        -
                      </button>
                      <span className="quantity">{itm.quantity}</span>
                      <button
                        disabled={
                          itm.quantity >= itm.product.inStock ||
                          changeQuantityLoading.has(key)
                            ? true
                            : false
                        }
                        className="quantity-btn"
                        onClick={() => manageQuantity(itm, key, "inc")}
                      >
                        +
                      </button>
                      <div className="cart-item-remove-btn">
                        {!removeCartLoading.has(key) ? (
                          <FontAwesomeIcon
                            icon={faTrash}
                            onClick={() => {
                              deleteCartItem(itm._id, itm.item, key);
                            }}
                          />
                        ) : (
                          <SmallLoading />
                        )}
                      </div>
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
                <p>₹ {totalPrise}</p>
              </div>
              <button
                className="buy-cart"
                onClick={orderProduct}
                style={{
                  backgroundColor: orderLoading ? "rgb(218, 218, 218)" : null,
                }}
              >
                {!orderLoading ? (
                  "BUY NOW"
                ) : (
                  <Loading style={{ height: "auto" }} />
                )}
              </button>
            </div>
          </div>
        </div>
      ) : !loading && cartItems.length < 1 ? (
        <EmptyItemsPage image={empty_cart} text="YOUR CART IS EMPTY" imageSize="600px"/>
      ) : (
        <Loading height="400px" />
      )}
      <ConfirmBox
        text="Are you sure want to delete?"
        open={showModel}
        onDialog={areUSureDelete}
        onClose={() => setShowModel(false)}
      />
    </>
  );
}

export default CartPage;
