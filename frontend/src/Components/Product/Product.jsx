import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faCartPlus,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./Product.css";
import { EContextData as GlobalData } from "../../EContextData";
import {
  AddToCartProvider,
  AddToFavoritesProvider,
  CreateOrderProvider,
} from "../../FetchDataProviders";
import Notification from "../Notification/Notification";

function Product(props) {
  const { user } = useContext(GlobalData);
  const [notify, setNotify] = useState({ display: "none" });
  const nav = useNavigate();
  const {
    className,
    width,
    title,
    image,
    disPrise,
    cutPrise,
    inStock,
    pid,
    btnText,
    goCart,
    visible,
  } = props;

  const onPurchase = async () => {
    if (user) {
      let res = await CreateOrderProvider(pid, disPrise);
      console.log(res);
      if (res) {
        nav(`/checkout/${res.OrderId}`);
      }
    } else {
      nav("/signin");
    }
  };

  const addToCart = async () => {
    if (user) {
      let result = await AddToCartProvider(pid, disPrise);
      if (result.itemAdded) {
        setNotify({
          display: "flex",
          text: "Item added to cart",
          type: "SUCCESS",
        });
        setTimeout(() => {
          setNotify({ display: "none" });
        }, 2000);
      }
      if (result.inCart) {
        setNotify({
          display: "flex",
          text: "Item already in cart",
          type: "WARNING",
        });
        setTimeout(() => {
          setNotify({ display: "none" });
        }, 2000);
      }
    } else {
      nav("/signin");
    }
  };

  const addToFavorites = async () => {
    if (user) {
      let res = await AddToFavoritesProvider(pid);
      if (res.itemAdded) {
        setNotify({
          display: "flex",
          text: "Item added to your wishlist",
          type: "SUCCESS",
        });
        setTimeout(() => {
          setNotify({ display: "none" });
        }, 2000);
      }
      if (res.itemExist) {
        setNotify({
          display: "flex",
          text: "Item already in your wishlist",
          type: "WARNING",
        });
        setTimeout(() => {
          setNotify({ display: "none" });
        }, 2000);
      }
    } else {
      nav("/signin");
    }
  };

  return (
    <>
      <div
        className={`product ${className}`}
        style={{
          width: width,
          display: visible ? "flex" : "block",
          height: !visible ? "320px" : null,
        }}
      >
        <div
          className={`${
            visible ? "product-image-container" : "skelton-image-container"
          }`}
          onClick={() => nav(`/product/${pid}`)}
        >
          {visible ? <img width="50%" src={image} alt="" /> : null}
        </div>
        <div className="product-info">
          <p className={`${visible ? "title" : "skelton-title"}`}>
            {visible ? title : ""}
          </p>
          <div className={`${visible ? "product-prise" : "skelton-prise"}`}>
            <p className="discount-prise">{visible ? `$ ${disPrise}` : ""}</p>
            <del className="cut-prise">{visible ? cutPrise : ""}</del>
          </div>
          {inStock ? (
            <p
              className="product-stock"
              style={{
                fontSize: "11px",
                color: `${inStock < 1 ? "red" : "green"}`,
              }}
            >
              {inStock < 1 ? "Out of stock" : "inStock"}
            </p>
          ) : null}
          <div
            className="product-actions"
            style={{
              marginTop: !visible ? "10px" : null,
              width: !visible ? "70%" : null,
            }}
          >
            <button
              style={{
                width: `${goCart ? "100%" : ""}`,
                backgroundColor: `${inStock < 1 ? "#b9d6ff" : null}`,
              }}
              disabled={inStock < 1 ? true : false}
              onClick={() => {
                goCart === "true" ? addToCart() : onPurchase();
              }}
              className={`${visible ? "buy" : "skelton-btn"}`}
            >
              {btnText ? btnText : inStock < 1 ? "Out of Stock" : "BUY NOW"}
            </button>
            <div
              className="action-icons"
              style={{ display: `${goCart ? "none" : "flex"}` }}
            >
              <FontAwesomeIcon
                className={`${
                  visible ? "action-icon addcart" : "skelton-icon"
                }`}
                icon={visible ? faCartPlus : faBars}
                style={{ display: `${inStock < 1 ? "none" : null}` }}
                onClick={addToCart}
              />
              <FontAwesomeIcon
                className={`${visible ? "action-icon addfav" : "skelton-icon"}`}
                icon={visible ? faHeart : faBars}
                onClick={addToFavorites}
                style={{ display: `${inStock < 1 ? "none" : null}` }}
              />
            </div>
          </div>
        </div>
      </div>
      <Notification
        status={notify}
        parentStyle={{
          top: "50px",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      />
    </>
  );
}

export default Product;
