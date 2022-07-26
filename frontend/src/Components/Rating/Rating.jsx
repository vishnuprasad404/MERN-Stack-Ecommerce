import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import "./Rating.css";

function Rating(props) {
  const [rating, setRating] = useState();
  const [reviews, setReviews] = useState();
  const { id, style ,reviewDisplay,eachUser} = props;

  useEffect(() => {
    if(!eachUser){
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/get-all-reviews/${id}`)
      .then((res) => {
        let rate = res.data.total_ratings;
        setRating(rate.toFixed(1));
        setReviews(res.data.total_reviews);
      });
    }else{
      setRating(`${eachUser.rate}.0`)
    }
  },[eachUser,id]); 

  return (
    <div className="rating" >
      <div
        className="rating-box"
        style={{
          ...style,
          backgroundColor:
            rating >= 3
              ? "rgba(106, 183, 255, 0.719)"
              : rating < 3 && rating > 1
              ? "rgba(255, 136, 106, 0.719)"
              : "rgba(255, 0, 0, 0.719)",
        }}
      >
        <span>{rating ? rating : "0"}</span>
        <FontAwesomeIcon icon={faStar} className="rating-star" />
      </div>
      <span className="rating-review" style={{display : reviewDisplay ? 'flex' : 'none'}}>({reviews ? reviews : "0"}) Reviews</span>
    </div>
  );
}

export default Rating;
