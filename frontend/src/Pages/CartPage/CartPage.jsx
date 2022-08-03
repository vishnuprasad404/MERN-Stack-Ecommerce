import React, { useContext, useEffect, useState } from "react";
import "./CartPage.css";
import Navbar from "../../Components/Navbar/Navbar";
import Rating from "../../Components/Rating/Rating";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import EmptyItemsPage from "../../Components/EmptyItemsPage/EmptyItemsPage";
import empty_cart from "../../Assets/empty-cart.webp";
import { EContextData as GlobalData } from "../../EContextData";
import { Loading, SmallLoading } from "../../Components/Loading/Loading";
import Paginate from "react-paginate";
import {
  RemoveCartItemProvider,
  CreateOrderProvider,
  ManageCartItemQuantityProvider,
  GetAllCartProductProvider,
  GetCartTotalProvider,
} from "../../ApiRenderController";

function CartPage() {
  const { user } = useContext(GlobalData);
  const nav = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrise, setTotalPrise] = useState("");
  const [loading, setLoading] = useState(true);
  const [removeCartLoading, setRemoveCartLoading] = useState(new Set());
  const [pageNumber, setPageNumber] = useState(0);

  useEffect(() => {
    getCart();
  }, []);

  const getCart = async () => {
    let res = await GetAllCartProductProvider();
    setCartItems(res);
    if (res) {
      setLoading(false);
      if (res.length >= 1) {
        let total = await GetCartTotalProvider();
        if (total) {
          setTotalPrise(total.total);
        }
      }
    }
  };

  const manageQuantity = (cart, key, action) => {
    let temp = cartItems;
    if (action === "inc") {
      temp[key].quantity += 1;
      temp[key].prise =
        temp[key].prise + parseInt(cartItems[key].product.discountPrise);
      ManageCartItemQuantityProvider(
        cart._id,
        cart.item,
        temp[key].quantity,
        temp[key].prise
      );
      setCartItems([...temp]);
      setTimeout(() => {
        getCart();
      }, 100);
    } else {
      temp[key].quantity -= 1;
      temp[key].prise =
        temp[key].prise - parseInt(cartItems[key].product.discountPrise);
      ManageCartItemQuantityProvider(
        cart._id,
        cart.item,
        temp[key].quantity,
        temp[key].prise
      );
      setCartItems([...temp]);
      setTimeout(() => {
        getCart();
      }, 100);
    }
  };

  const deleteCartItem = async (cid, pid, selectedIndex) => {
    setRemoveCartLoading((prev) => new Set([...prev, selectedIndex]));
    let res = await RemoveCartItemProvider(cid, pid);
    if (res) {
      if (res === true) {
        let cartItemCopy = cartItems;
        cartItemCopy.splice(selectedIndex, 1);
        setCartItems([...cartItemCopy]);
      }
      setRemoveCartLoading((prev) => {
        const updated = new Set(prev);
        updated.delete(selectedIndex);
        return updated;
      });
    }
  };

  const orderProduct = async () => {
    if (user) {
      let OrderDetails = cartItems.map((itm) => {
        return {
          item: itm.item,
          quantity: itm.quantity,
          prise: itm.prise,
        };
      });
      let res = await CreateOrderProvider(OrderDetails);
      if (res) {
        nav(`/checkout/${res.OrderId}`);
      }
    }
  };
  const ordersPerPage = 3;
  const pagesVisited = pageNumber * ordersPerPage;
  const pageCount = Math.ceil(cartItems.length / ordersPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };
  return (
    <>
      <Navbar />
      {!loading && cartItems.length >= 1 ? (
        <div className="cart-page" id="myCart">
          <div className="cart-item-container-wrapper">
            {cartItems
              .slice(pagesVisited, pagesVisited + ordersPerPage)

              .map((itm, key) => {
                return (
                  <div className="cart-item-container" key={key}>
                    <div
                      className="cart-item-image"
                      onClick={() => nav(`/product/${itm.product._id}`)}
                    >
                      <img width="99%" src={itm.product.image1} alt="" />
                    </div>
                    <div className="cart-item-details">
                      <h4>{itm.product.title}</h4>
                      <div className="rating-and-prise">
                        <Rating
                          id={itm.item}
                          style={{
                            marginTop: "5px",
                            marginBottom: "5px",
                            width: "50px",
                            height: "25px",
                          }}
                        />
                        <span>$ {itm.prise}</span>
                      </div>
                      <div className="cart-item-action">
                        <button
                          disabled={itm.quantity <= 1 ? true : false}
                          className="quantity-btn"
                          onClick={() => manageQuantity(itm, key, "dec")}
                        >
                          -
                        </button>
                        <span className="quantity">{itm.quantity}</span>
                        <button
                          disabled={
                            itm.quantity >= itm.product.inStock ? true : false
                          }
                          className="quantity-btn"
                          onClick={() => manageQuantity(itm, key, "inc")}
                        >
                          +
                        </button>
                        <div className="cart-item-remove-btn">
                          {!removeCartLoading.has(key) ? (
                            <FontAwesomeIcon
                              icon={faTrash}
                              onClick={() => {
                                deleteCartItem(itm._id, itm.item, key);
                              }}
                            />
                          ) : (
                            <SmallLoading />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            {cartItems.length > 3 ? (
              <Paginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                pageCount={pageCount}
                onPageChange={changePage}
                containerClassName={"pagination-container"}
                previousLinkClassName={"previous-btn"}
                nextLinkClassName={"next-btn"}
                disabledClassName={"pagination-disabled-btn"}
                activeClassName={"pagination-active"}
              />
            ) : null}
          </div>
          <div className="cart-total-container-wrapper">
            <div className="cart-total-container">
              <h3>Prise Details</h3>
              <div className="total-items">
                <p>Total Items</p>
                <p>{cartItems.length}</p>
              </div>
              <div className="total-amount">
                <p>Total Amount</p>
                <p>$ {totalPrise}</p>
              </div>
              <button className="buy-cart" onClick={orderProduct}>
                BUY NOW
              </button>
            </div>
          </div>
        </div>
      ) : !loading && cartItems.length < 1 ? (
        <EmptyItemsPage image={empty_cart} text="YOUR CART IS EMPTY" />
      ) : (
        <Loading height="400px" />
      )}
    </>
  );
}

export default CartPage;
