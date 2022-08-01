import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faCartPlus, faBars, faTrash } from "@fortawesome/free-solid-svg-icons";
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
  const { title, image, disPrise, cutPrise, inStock, pid, favorites } = props;

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
      <div className="col-6 col-sm-4 col-md-3 col-lg-2 product-column">
        <div className="card product-card">
          <div className="product-image-container">
            <img src={image} alt="img" />
          </div>
          <div className="card-body">
            <h6 className="card-title product-card-title">{title}</h6>
            <p className="card-text mb-0">
              ${disPrise}
              <del>{cutPrise}</del>
            </p>
            {inStock ? (
              <span
                className="instock"
                style={{ color: inStock >= 1 ? "green" : "red" }}
              >
                {inStock >= 1 ? "inStock" : "outofStock"}
              </span>
            ) : null}
            <div className="product-action-btns mt-3">
              <button className="buy" onClick={onPurchase}>
                Buy Now
              </button>
              <FontAwesomeIcon
                icon={favorites ? faTrash : faHeart}
                className="fav-icon"
                onClick={addToFavorites}
              />
              <FontAwesomeIcon
                icon={faCartPlus}
                className="cart-icon"
                onClick={addToCart}
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
