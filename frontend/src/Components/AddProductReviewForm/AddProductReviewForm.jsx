import React, { useState } from "react";
import "./AddProductReviewForm.css";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Loading } from "../Loading/Loading";
import { usePost } from "../../Hooks/usePost";
import { useFetch } from "../../Hooks/useFetch";

function AddProductReviewForm({ pid }) {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const { execute, loading: addReviewLoading } = usePost("/add-review");
  const { data: isReview } = useFetch(`/user/review/${pid}`);
  const [ratingHover, setRatingHover] = useState();
  const [rating, setRating] = useState("");

  const addReview = async (data) => {
    data.id = pid;
    execute({ data: data });
  };
  return (
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
                      ratingValue <=
                      (ratingHover || rating ? rating : isReview.rating)
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
          {errors.rating?.type === "required" && "Please add a rating"}
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
          {errors.feedback?.type === "required" && "Please add your feedback"}
        </span>
        <button type="submit" className="review-btn">
          {addReviewLoading ? (
            <Loading style={{ height: "auto" }} />
          ) : isReview ? (
            "Update Review"
          ) : (
            "Add Review"
          )}
        </button>
      </form>
    </div>
  );
}

export default AddProductReviewForm;
