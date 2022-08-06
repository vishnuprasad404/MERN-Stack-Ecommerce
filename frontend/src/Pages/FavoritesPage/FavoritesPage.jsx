import React, { useEffect, useState } from "react";
import "./FavoritesPage.css";
import Navbar from "../../Components/Navbar/Navbar";
import CategorySubItems from "../../Components/CategorySubItem/CategorySubItem";
import EmptyItemsPage from "../../Components/EmptyItemsPage/EmptyItemsPage";
import empty_wishlist from "../../Assets/empty-wishlist.png";
import Rating from "../../Components/Rating/Rating";
import {
  GetAllWishlistProvider,
  AddToCartProvider,
  RemoveFavoritesProvider,
} from "../../ApiRenderController";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Notification from "../../Components/Notification/Notification";
import { useContext } from "react";
import { EContextData } from "../../EContextData";
import { useNavigate } from "react-router-dom";
import {Loading} from '../../Components/Loading/Loading'

function FavoritesPage() {
  const {user } = useContext(EContextData)
  const nav = useNavigate()
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [notify, setNotify] = useState({display : 'none'})
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    getAllWishlist();
  }, []);

  const getAllWishlist = async () => {
    let res = await GetAllWishlistProvider();
    setFavoriteProducts(res);
  };

  const addToCart = async (id, prise) => {
    if (user) {
      let result = await AddToCartProvider(id, prise);
      if (result.itemAdded) {
        setNotify({
          display: "flex",
          text: "Item added to cart",
          type: "SUCCESS",
        });
        setTimeout(() => {
          setNotify({ display: "none" });
        }, 2000);
      }
      if (result.inCart) {
        setNotify({
          display: "flex",
          text: "Item already in cart",
          type: "WARNING",
        });
        setTimeout(() => {
          setNotify({ display: "none" });
        }, 2000);
      }
    } else {
      nav("/signin");
    }
  };
  const removeFavorites = (id, key) => {
    console.log(id);
    let new_fav = favoriteProducts;
    new_fav.splice(key, 1);
    setFavoriteProducts([...new_fav]);
    RemoveFavoritesProvider(id);
  };

  return (
    <>
      <Navbar />
      <CategorySubItems />
      {favoriteProducts.length >= 1 ? (
        <>
          <div className="favorites-page">
            <div className="row gy-5">
              {favoriteProducts.map((itm, key) => {
                return (
                  <div
                    className="col-6 col-sm-4 col-md-3 col-lg-2 favorite-card"
                    key={key}
                  >
                    <div className="card">
                      <div className="card-img-top" onClick={()=>nav(`/product/${itm.item}`)}>
                        <img width="40%" src={itm.product[0].image1} alt="" />
                      </div>
                      <div className="card-body">
                        <Rating
                          id={itm.item}
                          style={{ marginBottom: "10px",width: '45px',height: "22px" }}
                        />
                        <h6 className="fav-title card-title">
                          {itm.product[0].title}
                        </h6>
                        <p className="fav-prise">
                        ₹ {itm.product[0].discountPrise}
                          <del>{itm.product[0].orginalPrise}</del>
                        </p>
                        <button
                          className="w-100 mt-3 p-2 fav-to-cart-btn"
                          onClick={() =>
                            addToCart(itm.item, itm.product[0].discountPrise)
                          }
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                    <FontAwesomeIcon
                      icon={faTrash}
                      onClick={() => removeFavorites(itm.item, key)}
                      className="favorite-remove-btn"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <EmptyItemsPage image={empty_wishlist} text="YOUR WHISHLIST IS EMPTY" />
      )}
       <Notification
        status={notify}
        parentStyle={{
          top: "50px",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      />
    </>
  );
}

export default FavoritesPage;
 