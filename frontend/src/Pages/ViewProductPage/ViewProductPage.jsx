import React, { useEffect, useState } from "react";
import "./ViewProductPage.css";
import Rating from "../../Components/Rating/Rating";
import Review from "../../Components/Review/Review";
import Navbar from "../../Components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt, faCartPlus, faHeart } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import axios from "axios";
import Notification from "../../Components/Notification/Notification";
import { AddToCartProvider } from "../../ApiRenderController";
import { Loading } from "../../Components/Loading/Loading";
import { useStore } from "../../Hooks/useStore";
import { usePost } from "../../Hooks/usePost";
import { SmallLoading } from "../../Components/Loading/Loading";

function ViewProductPage() {
  const { state } = useStore();
  const { execute: addtoFav, loading: addToFavLoading } =
    usePost("/addtofavorites");
  const { user } = state;
  const { id } = useParams();
  const nav = useNavigate();
  const [product, setProduct] = useState();
  const [notify, setNotify] = useState({ display: "none" });
  const [loading, setloading] = useState(true);
  const [productImage, setProductImage] = useState();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/products`).then((res) => {
      setloading(false);
      let proObj = res.data.find((itm) => {
        return itm._id === id;
      });
      setProduct(proObj);
    });
  }, [id]);

  const addToCart = async (pid, prise) => {
    if (user) {
      let result = await AddToCartProvider(pid, prise);
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
      nav(`/signin?redirect=/product/${id}`);
    }
  };
  const onPurchase = () => {
    if (user) {
      let orderObj = {
        item: id,
        quantity: 1,
        prise: parseInt(product.discountPrise),
      };
      axios
        .post(`${process.env.REACT_APP_BASE_URL}/create-order`, [orderObj])
        .then((res) => {
          if (res.data) {
            nav(`/checkout/${res.data.OrderId}`);
          }
        });
    } else {
      nav(`/signin?redirect=/product/${id}`);
    }
  };

  const addToFavorites = async () => {
    if (user) {
      addtoFav({ data: { pid: id } }, (res, err) => {
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
    <div className="view-product-page" id="view-product">
      <Navbar />
      {loading ? (
        <div className="view-product-page-loading-container">
          <Loading />
        </div>
      ) : product ? (
        <>
          <div className="view-product-page-left-container">
            <div className="view-product-image-container">
              <img
                width="80%"
                src={productImage ? productImage : product.images[0]}
                alt=""
              />
              <div className="view-product-favorite-icon">
                {!addToFavLoading ? (
                  <FontAwesomeIcon icon={faHeart} onClick={addToFavorites} />
                ) : (
                  <SmallLoading />
                )}
              </div>
            </div>
            <div className="sub-image-container-wrapper">
              {product &&
                product.images.map((item, key) => {
                  return (
                    <div className="sub-image-container">
                      <div
                        className="sub-image"
                        onClick={() => setProductImage(item)}
                        onMouseEnter={() => setProductImage(item)}
                      >
                        <img width="90%" src={item} alt="" />
                      </div>
                    </div>
                  );
                })}
            </div>
            <div className="view-product-btns">
              <button
                style={{ display: `${product.inStock < 1 ? "none" : null}` }}
                onClick={() => addToCart(product._id, product.discountPrise)}
              >
                <FontAwesomeIcon icon={faCartPlus} /> ADD TO CART
              </button>
              <button
                style={{
                  cursor: product.inStock < 1 ? "not-allowed" : null,
                }}
                onClick={product.inStock >= 1 ? onPurchase : null}
                className={`${product.inStock < 1 ? "comming-soon-btn" : null}`}
              >
                <FontAwesomeIcon icon={faBolt} />{" "}
                {product.inStock < 1 ? "Comming Soon" : "BUY NOW"}
              </button>
            </div>
          </div>

          <div className="view-product-page-right-container">
            <h4>{product.title}</h4>
            <Rating id={id} reviewDisplay={true} />

            <div className="prise">
              <p className="dis-prise">$ {product.discountPrise}</p>
              <del className="cut-prise">{product.orginalPrise}</del>
            </div>
            <p className="product-heading">Product Description</p>
            <p className="description">{product.description}</p>
            <p className="product-heading">Reviews</p>
            <div className="review-container-wrapper">
              <Review id={id} />
            </div>
          </div>
        </>
      ) : null}
      <Notification
        status={notify}
        parentStyle={{
          top: "50px",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      />
    </div>
  );
}

export default ViewProductPage;
