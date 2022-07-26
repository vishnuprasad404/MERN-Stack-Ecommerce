import React, { useState } from "react";
import { useEffect } from "react";
import Rating from "../Rating/Rating";
import "./Review.css";
import axios from "axios";

function Review(props) {
  const { id } = props;
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/get-all-reviews/${id}`)
      .then((res) => {
        setReviews(res.data.userRatings);
      });
  }, [id]);

  return (
    <div className="review">
      {reviews.map((itm) => {
        return (
          <div className="review-container">
            <div className="review-rating-and-username">
              <Rating id={id} eachUser={{rate : itm.rating}} style={{width : '45px',height : '22px'}} />
              <h6 className="review-username">{itm.user}</h6>
            </div>
            <p className="review-feedback">{itm.feedback}</p>
          </div>
        );
      })}
    </div>
  );
}

export default Review;
