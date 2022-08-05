import React, { useEffect, useState } from "react";
import "./OrdersItemDetailPage.css";
import Navbar from "../../Components/Navbar/Navbar";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import Rating from "../../Components/Rating/Rating";
import { Loading } from "../../Components/Loading/Loading";
import {
  GetAllOrdersProvider,
  GetUserOwnReviewProvider,
  AddProductReviewProvider,
} from "../../ApiRenderController";

function OrdersItemDetailPage() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const [rating, setRating] = useState();
  const [ratingHover, setRatingHover] = useState();
  const { id } = useParams();
  const [product, setProduct] = useState();
  const [isReview, setIsReview] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const GetAllOrders = async () => {
      let res = await GetAllOrdersProvider();
      if (res) {
        setLoading(false);
        let getItem = res.find((data) => {
          return data.item === id;
        });
        setProduct(getItem);
        let review = await GetUserOwnReviewProvider(getItem.product._id);
        if (review) {
          setIsReview(review);
          setRating(review.rating);
        }
      }
    };
    GetAllOrders();
  }, [id]);

  const addReview = async (data) => {
    data.id = id;
    let res = await AddProductReviewProvider(data);
    console.log(res);
  };

  return (
    <>
      <Navbar />
      {product && !loading ? (
        <div className="view-orders-item-details">
          <section className="view-orders-product-detail-section">
            <div className="view-orders-item-details-container">
              <span className="orders-devider"></span>
              <section className="view-orders-product-detail-content-section">
                <div className="purshased-item-image-container">
                  <div className="purshased-item-image">
                    <img width="100%" src={product.product.image1} alt="" />
                  </div>
                  <div className="purchased-item-title-and-rating">
                    <p>{product.product.title}</p>
                    <Rating
                      id={id}
                      style={{ marginBottom: "10px" }}
                      displayReview={true}
                    />
                    <p>
                      $ {product.prise} (quantity : {product.quantity})
                    </p>
                  </div>
                </div>
                <div className="purchased-item-action">
                  <button className="buy-again-btn">Buy again</button>
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
                          let ratingValue = i + 1;
                          return (
                            <label key={i}>
                              <input
                                type="radio"
                                name="rating"
                                value={ratingValue}
                                {...register("rating", {
                                  required: isReview ? false : true,
                                })}
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
                      <span className="err">
                        {errors.rating?.type === "required" &&
                          "Please add a rating"}
                      </span>
                      <textarea
                        rows="5"
                        placeholder="Write a review"
                        defaultValue={isReview ? isReview.feedback : null}
                        {...register("feedback", {
                          required: isReview ? false : true,
                        })}
                      ></textarea>
                      <span className="err">
                        {errors.feedback?.type === "required" &&
                          "Please add your feedback"}
                      </span>
                      <button type="submit" className="review-btn">
                        {isReview ? "Update Review" : "Submit Review"}
                      </button>
                    </form>
                  </div>
                ) : null}
              </section>
            </div>
          </section>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default OrdersItemDetailPage;
