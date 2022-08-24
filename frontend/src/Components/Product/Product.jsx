import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./Product.css";
import {
  AddToCartProvider,
  AddToFavoritesProvider,
  CreateOrderProvider,
} from "../../ApiRenderController";
import Notification from "../Notification/Notification";
import Rating from "../../Components/Rating/Rating";
import { Loading } from "../../Components/Loading/Loading";
import { useStore } from "../../Hooks/useStore";

function Product({
  title,
  image,
  disPrise,
  cutPrise,
  inStock,
  pid,
  Mapkey,
  skelton,
  buttonStyle,
  cartIconStyle,
  favIconStyle,
  cardStyle,
  notificationStyle,
}) {
  const { state, dispatch } = useStore();
  const { user } = state;
  const [notify, setNotify] = useState({ display: "none" });
  const nav = useNavigate();
  const [loading1, setLoading1] = useState(new Set());

  const onPurchase = async (selectedIndex) => {
    setLoading1((prev) => new Set([...prev, selectedIndex]));
    if (user) {
      let orderObj = {
        item: pid,
        quantity: 1,
        prise: parseInt(disPrise),
      };
      let res = await CreateOrderProvider([orderObj]);
      if (res) {
        setLoading1((prev) => {
          const updated = new Set(prev);
          updated.delete(selectedIndex);
          return updated;
        });
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
        dispatch({
          type: "ADD_TO_CART",
          payload: [{pid,disPrise}],
        });
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
        key={Mapkey}
        className="col-6 col-sm-4 col-md-3 col-lg-2 product-column"
      >
        <div className="card product-card" style={cardStyle}>
          <div
            className={`${
              !skelton ? "product-image-container" : "skelton-image-container"
            }`}
            onClick={() => nav(`/product/${pid}`)}
          >
            {!skelton ? <img src={image} alt="img" /> : null}
          </div>
          <div className="card-body">
            {!skelton ? (
              <Rating
                id={pid}
                style={{ marginBottom: "10px", width: "45px", height: "25px" }}
              />
            ) : null}
            <h6
              className={`card-title product-card-title ${
                skelton ? "skelton-product-title" : null
              }`}
            >
              {title}
            </h6>
            <p
              className={`card-text mb-0 ${skelton ? "skelton-prise" : null} `}
            >
              {!skelton ? "₹ " : null}
              {disPrise}
              <del>{cutPrise}</del>
            </p>
            {!skelton ? (
              <span
                className="instock"
                style={{ color: inStock >= 1 ? "green" : "red" }}
              >
                {inStock >= 1 ? "inStock" : "outofStock"}
              </span>
            ) : null}
            <div className="product-action-btns">
              <button
                style={buttonStyle}
                className={`${skelton ? "skelton-btn" : "buy"}`}
                onClick={() => onPurchase(Mapkey)}
              >
                {!loading1.has(Mapkey) ? (
                  "Buy Now"
                ) : (
                  <Loading
                    iconSize="5px"
                    style={{
                      height: "5px",
                      width: "100%",
                      position: "static",
                    }}
                    iconSpace="5px"
                  />
                )}
              </button>
              {!skelton ? (
                <>
                  <FontAwesomeIcon
                    style={favIconStyle}
                    icon={faHeart}
                    className="fav-icon"
                    onClick={addToFavorites}
                  />
                  <FontAwesomeIcon
                    style={cartIconStyle}
                    icon={faCartPlus}
                    className="cart-icon"
                    onClick={addToCart}
                  />
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <Notification
        status={notify}
        parentStyle={{
          ...notificationStyle,
          top: "30px",
          right: "20px",
          justifyContent: "flex-end",
        }}
      />
    </>
  );
}

export default Product;
