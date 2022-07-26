import React, { useEffect, useState } from "react";
import "./OrdersItemDetailPage.css";
import Navbar from "../../Components/Navbar/Navbar";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";

function OrdersItemDetailPage() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const [rating, setRating] = useState();
  const [ratingHover, setRatingHover] = useState();
  const [starPersentageRounded, setStarPersentageRounded] = useState("");
  const [totalReviews, setTotalReviews] = useState(0);
  const { id } = useParams();
  const [product, setProduct] = useState();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/user/get-orders`)
      .then((res) => {
        let getItem = res.data.find((data) => {
          return data.item === id;
        });
        setProduct(getItem);
      });

    axios
      .get(`${process.env.REACT_APP_BASE_URL}/get-all-reviews/${id}`)
      .then((res) => {
        let star = res.data.total_ratings;
        let starTotal = 5;
        const starPersentage = (star / starTotal) * 100;
        const starPersentageRoundedTemp = `${
          Math.round(starPersentage / 10) * 10
        }%`;
        setStarPersentageRounded(starPersentageRoundedTemp);
        setTotalReviews(res.data.total_reviews ? res.data.total_reviews : 0);
      });
  }, [id]);

  const addReview = (data) => {
    data.id = id;
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/add-review`, data)
      .then((res) => {
        console.log(res.data);
      });
  };

  return (
    <>
      <Navbar />
      {product ? (
        <div className="view-orders-item-details">
          <section className="view-orders-product-detail-section">
            <div className="view-orders-item-details-container">
              <section className="step-wizard">
                <ul className="step-wizard-list">
                  <li className={`step-wizard-item `}>
                    <span className="progress-count"></span>
                    <span className="progress-label">Placed</span>
                  </li>
                  <li className={`step-wizard-item ${product.status === "placed" ? "current-item" : null }`}>
                    <span className="progress-count"></span>
                    <span className="progress-label">Processing</span>
                  </li>
                  <li className={`step-wizard-item ${product.status === "dispatched" ? "current-item" : null }`}>
                    <span className="progress-count"></span>
                    <span className="progress-label">Shipped</span>
                  </li>
                  <li className={`step-wizard-item ${product.status === "completed" ? "current-item" : null }`}>
                    <span className="progress-count"></span>
                    <span className="progress-label">Deliverd</span>
                  </li>
                </ul>
              </section>
              <span className="orders-devider"></span>
              <section className="view-orders-product-detail-content-section">
                <div className="purshased-item-image-container">
                  <div className="purshased-item-image">
                    <img width="100%" src={product.product.image1} alt="" />
                  </div>
                  <div className="purchased-item-title-and-rating">
                    <p>{product.product.title}</p>
                    {starPersentageRounded ? (
                      <div className="stars-outer">
                        <div
                          className="stars-inner"
                          style={{ width: starPersentageRounded }}
                        ></div>
                        <span className="total-review">
                          ({totalReviews} Reviews)
                        </span>
                      </div>
                    ) : null}
                    <br />
                    <p>
                      $ {product.prise} (quantity : {product.quantity})
                    </p>
                  </div>
                </div>
                <div className="purchased-item-action">
                  <button>Buy again</button>
                  {product.status === "placed" ? (
                    <button> Cancel Order</button>
                  ) : null}
                  {product.status === "pending" ? (
                    <button> Complete Order</button>
                  ) : null}
                  {/* <FontAwesomeIcon icon={faRoadCircleCheck}/> */}
                </div>
                {product.status === "completed" ? (
                  <div className="add-review">
                    <p>Add a review</p>
                    <form onSubmit={handleSubmit(addReview)}>
                      <div className="order-rating-stars">
                        {[...Array(5)].map((star, i) => {
                          const ratingValue = i + 1;
                          return (
                            <label>
                              <input
                                type="radio"
                                name="rating"
                                value={ratingValue}
                                {...register("rating", { required: true })}
                                onClick={() => setRating(ratingValue)}
                              />
                              <FontAwesomeIcon
                                icon={faStar}
                                className="order-rating-star"
                                style={{
                                  color: `${
                                    ratingValue <= (ratingHover || rating)
                                      ? "gold"
                                      : "lightgrey"
                                  }`,
                                }}
                                onMouseEnter={() => setRatingHover(ratingValue)}
                                onMouseLeave={() => setRatingHover(null)}
                              />
                            </label>
                          );
                        })}
                      </div>
                      <error className="err">
                        {errors.rating?.type === "required" &&
                          "Please add a rating"}
                      </error>
                      <textarea
                        rows="5"
                        placeholder="Write a review"
                        {...register("feedback", { required: true })}
                      ></textarea>
                      <error className="err">
                        {errors.feedback?.type === "required" &&
                          "Please add your feedback"}
                      </error>
                      <button type="submit" className="review-btn">
                        Submit Review
                      </button>
                    </form>
                  </div>
                ) : null}
              </section>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}

export default OrdersItemDetailPage;
