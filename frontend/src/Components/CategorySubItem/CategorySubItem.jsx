import React from "react";
import "./CategorySubItem.css";
import { useNavigate } from "react-router-dom";
import desktop from "../../Assets/desktop.png";
import offers from "../../Assets/offers.webp";
import mobiles from "../../Assets/mobiles.png";
import headphones from "../../Assets/headphones.png";
import electronics from "../../Assets/electronics.png";
import appliences from "../../Assets/appliences.png";
import watches from "../../Assets/watches.png";

function CategorySubItem() {
  const categoryMockData = [
    {
      title: "Top Offers",
      image: offers,
      category: "all",
    },
    {
      title: "Mobiles",
      image: mobiles,
      category: "mobiles",
    },
    {
      title: "Headphones",
      image: headphones,
      category: "headphones",
    },
    {
      title: "Electronics",
      image: electronics,
      category: "electronics",
    },
    {
      title: "Home Appliences",
      image: appliences,
      category: "appliences",
    },
    {
      title: "Watches",
      image: watches,
      category: "watches",
    },
    {
      title: "Desktop",
      image: desktop,
      category: "desktop",
    },
  ];
  const nav = useNavigate();
  return (
    <div className="category-list-container">
      {categoryMockData.map((itm, key) => {
        return (
          <div
            onClick={() => nav(`/products?item=${itm.category}`)}
            className="category-list-item"
            key={key}
          >
            <img width="28px" src={itm.image} alt="" loading="lazy" />
            <p>{itm.title}</p>
          </div>
        );
      })}
    </div>
  );
}

export default CategorySubItem;
