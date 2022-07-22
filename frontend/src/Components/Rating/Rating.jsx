import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import "./Rating.css";

function Rating(props) {
  const [rating, setRating] = useState();
  const [review, setReview] = useState();
  const { id, reviewDisplay, eachUser, width, height, margin, fontSize } =
    props;

  useEffect(() => {
    if (!eachUser) {
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/get-all-reviews/${id}`)
        .then((res) => {
          let star = res.data.total_ratings;
          setRating(Math.round(star).toFixed(1));
          setReview(res.data.total_reviews);
        });
    } else {
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/get-all-reviews/${id}`)
        .then((res) => {
          // console.log();
          let star = res.data.total_ratings;
          setRating(Math.round(star).toFixed(1));
          setReview(res.data.total_reviews);
        });
    }
  }, [id, eachUser]);

  return (
    <div className="rating" style={{margin : margin}}>
      <div
        className="rating-stars"
        style={{
          backgroundColor: `${
            rating <= 1
              ? "rgb(255, 60, 60)"
              : rating <= 2
              ? "rgb(250, 179, 121)"
              : "rgb(148, 194, 255)"
          }`,
          width: width,
          height: height,
          fontSize: fontSize,
        }}
      >
        <span>{rating < 1 ? rating : '0'}</span>
        <FontAwesomeIcon icon={faStar} className="rating-icon" />
      </div>
      <span style={{ display: reviewDisplay }} className="total-review">
        ({review ? review : '0'} Reviews)
      </span>
    </div>
  );
}

export default Rating;
