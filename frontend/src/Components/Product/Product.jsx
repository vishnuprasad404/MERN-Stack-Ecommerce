import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./Product.css";
import Notification from "../Notification/Notification";
import Rating from "../../Components/Rating/Rating";
import { Loading } from "../../Components/Loading/Loading";
import { useStore } from "../../Hooks/useStore";
import { usePost } from "../../Hooks/usePost";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { SmallLoading } from "../Loading/Loading";

function Product({
  title,
  image,
  disPrise,
  cutPrise,
  inStock,
  pid,
  Mapkey,
  buttonStyle,
  cartIconStyle,
  favIconStyle,
  cardStyle,
  notificationStyle,
  showInstock,
}) {
  const { state, dispatch } = useStore();
  const { user } = state;
  const [notify, setNotify] = useState({ display: "none" });
  const nav = useNavigate();
  const [loading1, setLoading1] = useState(new Set());
  const [addToFavoriteLoading, setAddToFavoriteLoading] = useState(new Set());
  const [cartLoading, setCartLoading] = useState(new Set());

  //
  const { execute: addtoCart } = usePost("/addtocart");
  const { execute: addtoFav } = usePost("/addtofavorites");
  const { execute: createOrder } = usePost("/create-order");
  //
  const onPurchase = async (selectedIndex) => {
    setLoading1((prev) => new Set([...prev, selectedIndex]));
    if (user) {
      let order = {
        item: pid,
        quantity: 1,
        prise: parseInt(disPrise),
      };
      createOrder({ data: [order] }, (res, err) => {
        setLoading1((prev) => {
          const updated = new Set(prev);
          updated.delete(selectedIndex);
          return updated;
        });
        nav(`/checkout/${res.OrderId}`);
      });
    } else {
      nav("/signin");
    }
  };

  const addToCart = async (selectedIndex) => {
    if (user) {
      setCartLoading((prev) => new Set([...prev, Mapkey]));
      addtoCart({ data: { pid, disPrise } }, (result, err) => {
        if (result) {
          setCartLoading((prev) => {
            let updated = new Set(prev);
            updated.delete(selectedIndex);
            return updated;
          });
        }
        if (result.itemAdded) {
          dispatch({
            type: "ADD_TO_CART",
            payload: [{ pid, disPrise }],
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
      });
    } else {
      nav("/signin");
    }
  };

  const addToFavorites = async (selectedIndex) => {
    if (user) {
      setAddToFavoriteLoading((prev) => new Set([...prev, Mapkey]));
      addtoFav({ data: { pid } }, (res, err) => {
        if (res) {
          setAddToFavoriteLoading((prev) => {
            let updated = new Set(prev);
            updated.delete(selectedIndex);
            return updated;
          });
        }
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
      });
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
            className="product-image-container"
            onClick={() => nav(`/product/${pid}`)}
          >
            <LazyLoadImage
              effect="blur"
              src={image}
              alt="img"
              className="img"
              width="auto"
              style={{ display: "flex", justifyContent: "center" }}
            />
          </div>
          <div className="card-body">
            <Rating
              id={pid}
              style={{
                marginBottom: "10px",
                width: "45px",
                height: "24px",
              }}
            />
            <h6 className="card-title product-card-title">{title}</h6>
            <p className="card-text mb-0">
              ₹{disPrise}
              <del>{cutPrise}</del>
            </p>
            {showInstock === true ? (
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
                className="buy"
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
              {inStock >= 1 ? (
                <>
                  <div className="fav-icon">
                    {!addToFavoriteLoading.has(Mapkey) ? (
                      <FontAwesomeIcon
                        style={favIconStyle}
                        icon={faHeart}
                        className="fav-icon"
                        onClick={() => addToFavorites(Mapkey)}
                      />
                    ) : (
                      <SmallLoading />
                    )}
                  </div>
                  <div className="cart-icon">
                    {!cartLoading.has(Mapkey) ? (
                      <FontAwesomeIcon
                        style={cartIconStyle}
                        icon={faCartPlus}
                        onClick={() => {
                          addToCart(Mapkey);
                        }}
                      />
                    ) : (
                      <SmallLoading />
                    )}
                  </div>
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
