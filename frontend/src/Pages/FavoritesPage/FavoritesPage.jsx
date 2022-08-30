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
import { useNavigate } from "react-router-dom";
import { Loading, SmallLoading } from "../../Components/Loading/Loading";
import { useStore } from "../../Hooks/useStore";

function FavoritesPage() {
  const { state } = useStore();
  const { user } = state;
  const nav = useNavigate();
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [notify, setNotify] = useState({ display: "none" });
  const [loading, setLoading] = useState(true);
  const [addToCartLoading, setAddToCartLoading] = useState(new Set());
  const [favoriteRemoveLoading, setFavoriteRemoveLoading] = useState(new Set());

  useEffect(() => {
    getAllWishlist();
  }, []);

  const getAllWishlist = async () => {
    let res = await GetAllWishlistProvider();
    setFavoriteProducts(res);
    setLoading(false);
  };

  const addToCart = async (id, prise, key) => {
    if (user) {
      setAddToCartLoading((prev) => new Set([...prev, key]));
      let result = await AddToCartProvider(id, prise);
      if (result) {
        setAddToCartLoading((prev) => {
          const updated = new Set(prev);
          updated.delete(key);
          return updated;
        });
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
      }
    } else {
      nav("/signin");
    }
  };
  const removeFavorites = async (id, key) => {
    setFavoriteRemoveLoading((prev) => new Set([...prev, key]));
    let res = await RemoveFavoritesProvider(id);
    if (res) {
      setFavoriteRemoveLoading((prev) => {
        const update = new Set(prev);
        update.delete(key);
        return update;
      });
      let new_fav = favoriteProducts;
      new_fav.splice(key, 1);
      setFavoriteProducts([...new_fav]);
    }
  };

  return (
    <>
      <Navbar />
      <CategorySubItems />

      {loading ? (
        <Loading />
      ) : favoriteProducts.length >= 1 ? (
        <d>
          <div className="favorites-page">
            <div className="row gy-5">
              {favoriteProducts.map((itm, key) => {
                return (
                  <div
                    className="col-6 col-sm-4 col-md-3 col-lg-2 favorite-card-col"
                    key={key}
                  >
                    <div className="card favorite-card">
                      <div
                        className="card-img-top"
                        onClick={() => nav(`/product/${itm.item}`)}
                      >
                        <img width="40%" src={itm.product.thumbnail} alt="" />
                      </div>
                      <div className="card-body">
                        <Rating
                          id={itm.item}
                          style={{
                            marginBottom: "10px",
                            width: "45px",
                            height: "22px",
                          }}
                        />
                        <h6 className="fav-title card-title">
                          {itm.product.title}
                        </h6>
                        <p className="fav-prise">
                          ₹ {itm.product.discountPrise}
                          <del>{itm.product.orginalPrise}</del>
                        </p>
                        <button
                          className="p-2 fav-to-cart-btn"
                          onClick={() =>
                            addToCart(itm.item, itm.product.discountPrise, key)
                          }
                        >
                          {!addToCartLoading.has(key) ? (
                            "Add to Cart"
                          ) : (
                            <Loading
                              style={{ height: "30px" }}
                              iconSize="5px"
                            />
                          )}
                        </button>
                      </div>
                    </div>
                    <div
                      className="favorite-remove-btn"
                      onClick={() => removeFavorites(itm.item, key)}
                    >
                      {!favoriteRemoveLoading.has(key) ? (
                        <FontAwesomeIcon icon={faTrash} />
                      ) : (
                        <SmallLoading />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </d>
      ) : (
        <EmptyItemsPage
          image={empty_wishlist}
          text="YOUR WHISHLIST IS EMPTY"
          imageSize="300px"
        />
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
