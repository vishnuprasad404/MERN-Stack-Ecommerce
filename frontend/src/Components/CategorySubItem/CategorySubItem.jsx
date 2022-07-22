import React, { useState } from "react";
import "./CategorySubItem.css";
import { useNavigate } from "react-router-dom";

function CategorySubItem() {
  const [categoryMockData] = useState([
    {
      title: "Top Offers",
      image:
        "https://rukminim2.flixcart.com/flap/128/128/image/f15c02bfeb02d15d.png?q=100",
      category: "offer",
    },
    {
      title: "Mobiles",
      image:
        "https://oasis.opstatics.com/content/dam/oasis/page/2021/9-series/spec-image/9/Arcticsky_9.png",
      category: "mobiles",
    },
    {
      title: "Headphones",
      image:
        "https://images.philips.com/is/image/PhilipsConsumer/TASH402LF_00-IMS-en_IQ?$jpglarge$&wid=1250",
      category: "headphones",
    },
    {
      title: "Electronics",
      image: "https://m.media-amazon.com/images/I/71vZypjNkPS._SL1500_.jpg",
      category: "electronics",
    },
    {
      title: "Home Appliences",
      image:
        "https://www.reliancedigital.in/medias/LG-FHD0905SWS-Washing-Machines-491959410-i-1-1200Wx1200H?context=bWFzdGVyfGltYWdlc3wzMDU1MDl8aW1hZ2UvanBlZ3xpbWFnZXMvaGM1L2hjOC85NTU3ODA3MjM1MTAyLmpwZ3xiZjExNjZjMWIwMzIxMzNhNjA3NTVlMzNlYmZiYzMzY2E0NDNkNjAwMTYwYzFkMzEzY2Y0NGM3N2ZjNWEwNDE3",
      category: "appliences",
    },
    {
      title: "Watches",
      image:
        "https://rukminim1.flixcart.com/image/332/398/kmxsakw0/watch/8/e/v/stylis-men-s-all-new-looks-sports-design-nester-original-imagfq9ybfkzeyry.jpeg?q=50",
      category: "watches",
    },
    {
      title: "Desktop",
      image:
        "https://static.acer.com/up/Resource/Acer/Desktop/Aspire-C24/images/20201014/Acer-Aspire_C24-1651_modelpreview.png",
      category: "desktop",
    },
  ]);
  const nav = useNavigate();
  return (
    <div className="category-list-container">
      {categoryMockData.map((itm) => {
        return (
          <div onClick={() => nav(`/products?item=${itm.category}`)} className="category-list-item">
            <img width="28px" src={itm.image} alt="" />
            <p>{itm.title}</p>
          </div>
        );
      })}
    </div>
  );
}

export default CategorySubItem;
