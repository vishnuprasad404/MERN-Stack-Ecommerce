import React from "react";
import Rating from "../Rating/Rating";
import "./Review.css";

function Review(props) {
  return (
    <div className="review">
      <p className="user-name">{props.name}</p>
      <Rating id={props.id} reviewDisplay="none" eachUser={true} margin="10px 0px" fontSize="10px" height='25px' width='50px'/>
      <p className="review-content">{props.message}</p>
    </div>
  );
}

export default Review;
