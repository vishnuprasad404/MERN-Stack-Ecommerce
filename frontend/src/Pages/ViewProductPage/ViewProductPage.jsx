import React, { useContext, useEffect, useState } from "react";
import "./ViewProductPage.css";
import Rating from "../../Components/Rating/Rating";
import Review from "../../Components/Review/Review";
import Navbar from "../../Components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt, faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import axios from "axios";
import { EContextData } from "../../EContextData";

function ViewProductPage() {
  const {user} = useContext(EContextData)
  const { id } = useParams();
  const nav = useNavigate();

  const [product, setProduct] = useState();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/products`).then((res) => {
      let proObj = res.data.find((itm) => {
        return itm._id === id;
      });
      setProduct(proObj);
      console.log(product);
    });
    axios.get(`${process.env.REACT_APP_BASE_URL}/get-all-reviews/${id}`).then((res)=>{
      console.log(res.data);
    })
  },[id,product]);
  const [productImage, setProductImage] = useState();

  const addToCart = (pid, prise) => {
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/addtocart`, {
        pid: pid,
        prise: parseInt(prise),
      })
      .then((res) => {
        if (res.data.inCart) {
          alert("Item Alredy In Cart");
        }
        if (res.data.itemAdded) {
          alert("item Added Successfully");
        }
      });
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
      nav("/signin"); 
    }
  };

  return (
    <div className="view-product-page">
      <Navbar />
      {product ? (
        <>
          <div className="view-product-page-left-container">
            <div className="view-product-image-container">
              <img
                width="80%"
                src={productImage ? productImage : product.image1}
                alt=""
              />
            </div>
            <div className="sub-image-container-wrapper">
              <div className="sub-image-container">
                <div
                  className="sub-image"
                  onClick={() => setProductImage(product.image2)}
                  onMouseEnter={() => setProductImage(product.image2)}
                  onMouseLeave={() => {
                    setProductImage(product.image1);
                  }}
                >
                  <img width="90%" src={product.image2} alt="" />
                </div>
              </div>{" "}
              <div className="sub-image-container">
                <div
                  className="sub-image"
                  onClick={() => setProductImage(product.image3)}
                  onMouseEnter={() => setProductImage(product.image3)}
                  onMouseLeave={() => {
                    setProductImage(product.image1);
                  }}
                >
                  <img width="90%" src={product.image3} alt="" />
                </div>
              </div>{" "}
              <div className="sub-image-container">
                <div
                  className="sub-image"
                  onClick={() => setProductImage(product.image4)}
                  onMouseEnter={() => setProductImage(product.image4)}
                  onMouseLeave={() => {
                    setProductImage(product.image1);
                  }}
                >
                  <img width="90%" src={product.image4} alt="" />
                </div> 
              </div>
            </div>
            <div className="view-product-btns">
              <button
                style={{ display: `${product.inStock < 1 ? "none" : null}` }}
                onClick={() => addToCart(product._id, product.discountPrise)}
              >
                <FontAwesomeIcon icon={faCartPlus} /> ADD TO CART
              </button>
              <button
                style={{ width: `${product.inStock < 1 ? "300px" : null}` }}
                onClick={onPurchase}
              >
                <FontAwesomeIcon icon={faBolt} />{" "}
                {product.inStock < 1 ? "Comming Soon" : "BUY NOW"}
              </button>
            </div>
          </div>

          <div className="view-product-page-right-container">
            <h4>{product.title}</h4>
            <Rating id={id} margin="20px 0px 0px 0px"/>
     
            <div className="prise">
              <p className="dis-prise">$ {product.discountPrise}</p>
              <del className="cut-prise">{product.orginalPrise}</del>
            </div>
            <p className="product-heading">Product Description</p>
            <p className="description">{product.description}</p>
            <p className="product-heading">Reviews</p>
            <div className="review-container-wrapper">
              <Review
                name="Vishnu"
                message="This is a good phone in this budjet"
                id={id}
              />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default ViewProductPage;
