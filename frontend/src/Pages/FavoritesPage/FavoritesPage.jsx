import React, { useEffect, useState } from "react";
import "./FavoritesPage.css";
import Navbar from "../../Components/Navbar/Navbar";
import CategorySubItems from "../../Components/CategorySubItem/CategorySubItem";
import Product from "../../Components/Product/Product";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import EmptyItemsPage from "../../Components/EmptyItemsPage/EmptyItemsPage";
import empty_wishlist from "../../Assets/empty-wishlist.png";

function FavoritesPage() {
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [skelton, setSkelton] = useState(true)
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/getfavorites`).then((res) => {
      setFavoriteProducts(res.data);
      setSkelton(false)
    });
  }, []);

  const removeFavoriteItem = (id, key) => {
    let temp_fav = favoriteProducts;

    temp_fav.splice(key, 1);

    setFavoriteProducts([...temp_fav]);
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}/removefavoriteitem/${id}`)
      .then((res) => {
        if (res.data) {
          alert("Item Removed"); 
        }
      });
  };

  return (
    <>
      <Navbar />
      <CategorySubItems />
      {favoriteProducts.length >= 1 ? (
        <>
          <div className="favorites-page container">
            {favoriteProducts.map((itm, key) => {
              return (
                <div className="fav-product-container">
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="fav-btn"
                    style={{display: skelton ? "none" : null}}
                    onClick={() => removeFavoriteItem(itm.item, key)}
                  />
                  <Product
                    className="fav-product"
                    width="auto"
                    title={itm.product[0].title}
                    image={itm.product[0].image1}
                    disPrise={itm.product[0].discountPrise}
                    cutPrise={itm.product[0].orginalPrise}
                    btnText="Add to cart"
                    pid={itm.item}
                    goCart="true"
                    visible={!skelton}
                  />
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <EmptyItemsPage image={empty_wishlist} text="YOUR WHISHLIST IS EMPTY" />
      )}
    </>
  );
}

export default FavoritesPage;
