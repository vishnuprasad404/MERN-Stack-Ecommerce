import React, { useEffect, useState } from "react";
import CategorySubItem from "../CategorySubItem/CategorySubItem";
import "./HomeSection.css";
import Product from "../../Components/Product/Product";
import Banner from "../Banner/Banner";
import axios from "axios";
import Carousel from "react-elastic-carousel";
import banner1small from "../../Assets/1656769214608.jpg";
import banner1 from "../../Assets/infinix.webp";
import banner2 from "../../Assets/realme.webp";
import banner3 from "../../Assets/gaming.webp";

import { Link } from "react-router-dom";
import CategoryBannerItem from "../CategoryBannerItem/CategoryBannerItem";

function HomeSection() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/products`).then((res) => {
      let data = res.data.filter((item) => {
        return item.inStock >= 1;
      });
      setProducts(data);
    });
  },[products]);

  return (
    <div className="home-section">
      <CategorySubItem /> 
      <Carousel
        enableAutoPlay={true}
        autoPlaySpeed={3000}
        easing="ease"
        enableTilt={true}
      >
        <Banner image={window.screen.width <= "500" ? banner1small : banner1} />
        <Banner image={banner2}/>
        <Banner image={banner3} />
        <Banner image={banner1} />
        <Banner image={banner2} />
      </Carousel>
      <div className="products-container">
        {products.slice(0, 5).map((itm) => {
          return (
            <Product
              title={itm.title}
              image={itm.image1}
              disPrise={itm.discountPrise}
              cutPrise={itm.orginalPrise}
              pid={itm._id}
              inStock={itm.inStock}
            />
          );
        })}
      </div>
      <center>
        <Link className="see-more" to="/products">
          see more...
        </Link>
      </center>
      <section className="category-banner-section">
        <CategoryBannerItem
          text="mobiles"
          image="https://static.toiimg.com/thumb/msid-80596648,width-1200,height-900,resizemode-4/.jpg"
        />
        <CategoryBannerItem
          text="electronics"
          image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS90UcICoxR5aDusj0yu_FlWl-rLjeADYZ4Lk7IObPch-0pOEGFYz_ndLz-5aShTp7oLto&usqp=CAU"
        />
        <CategoryBannerItem
          text="Appliences"
          image="data:image/jpeg;base64,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"
        />
        <CategoryBannerItem
          text="Desktops"
          image="https://media.wired.com/photos/59ea9a8358c149756896692c/master/pass/imac_5k_JV1.jpg"
        />
      </section>
    </div>
  );
}

export default HomeSection;
//
