import React from "react";
import "./CategoryBannerItem.css";
import { HashLink as Link } from "react-router-hash-link";

function CategoryBannerItem({ image, text, to }) {
  return (
    <Link
      to={`/products?item=${to}#allproducts`}
      className="category-banner-item"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="banner-cover">
        <h2>{text}</h2>
      </div>
    </Link>
  );
}

export default CategoryBannerItem;
