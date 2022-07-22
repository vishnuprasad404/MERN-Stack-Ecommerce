import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./Product.css";
import axios from "axios";
import { EContextData as GlobalData } from "../../EContextData";
import Notification from "../Notification/Notification";
import { AddToCartProvider } from "../FetchDataProviders/AddToCartProvider";

function Product(props) {
  const { user } = useContext(GlobalData);
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
  } = props;

  const onPurchase = () => {
    if (user) {
      let orderObj = {
        item: pid,
        quantity: 1,
        prise: parseInt(disPrise),
      };
      axios
        .post(`${process.env.REACT_APP_BASE_URL}/create-order`, [orderObj])
        .then((res) => {
          if (res.data) {
            nav(`/checkout/${res.data.OrderId}`);
          }
        });
    } else {
      nav("/signin");
    }
  };

  const addToCart = () => {
    AddToCartProvider(pid,disPrise)
  };

  const addToFavorites = () => {
    if (user) {
      axios
        .post(`${process.env.REACT_APP_BASE_URL}/addtofavorites`, { item: pid })
        .then((res) => {
          if (res.data.itemAdded) {
            alert("Item Added to Favorites");
          } else if (res.data.itemExist) {
            alert("Item Alredy in Favorites");
          }
        });
    } else {
      nav("/signin");
    }
  };

  return (
    <>
      <div className={`product ${className}`} style={{ width: width }}>
        <div
          className="product-image-container"
          onClick={() => nav(`/product/${pid}`)}
        >
          <img width="50%" src={image} alt="" />
        </div>
        <div className="product-info">
          <p className="title">{title}</p>
          {/* <Rating size="14px" id={pid} reviewDisplay="none" /> */}
          <div className="product-prise">
            <p className="discount-prise">$ {disPrise}</p>
            <del className="cut-prise">{cutPrise}</del>
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
          <div className="product-actions">
            <button
              style={{
                width: `${goCart ? "100%" : ""}`,
                backgroundColor: `${inStock < 1 ? "#b9d6ff" : null}`,
              }}
              disabled={inStock < 1 ? true : false}
              onClick={() => {
                goCart === "true" ? addToCart() : onPurchase();
              }}
              className="buy"
            >
              {btnText ? btnText : inStock < 1 ? "Out of Stock" : "BUY NOW"}
            </button>
            <div
              className="action-icons"
              style={{ display: `${goCart ? "none" : "flex"}` }}
            >
              <FontAwesomeIcon
                className="action-icon addcart"
                icon={faCartPlus}
                style={{ display: `${inStock < 1 ? "none" : null}` }}
                onClick={addToCart}
              />
              <FontAwesomeIcon
                className="action-icon addfav"
                icon={faHeart}
                onClick={addToFavorites}
                style={{ display: `${inStock < 1 ? "none" : null}` }}
              />
            </div>
          </div>
        </div>
      </div>
      <Notification />
    </>
  );
}

export default Product;
