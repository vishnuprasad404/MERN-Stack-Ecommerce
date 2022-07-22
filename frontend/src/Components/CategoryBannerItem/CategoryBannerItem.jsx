import React from "react";
import "./CategoryBannerItem.css";

function CategoryBannerItem(props) {
  return (
    <div className="category-banner-item" style={{backgroundImage: `url(${props.image})`}}>
      <div className="banner-cover">
        <h2>{props.text}</h2>
      </div>
    </div>
  );
}

export default CategoryBannerItem;
