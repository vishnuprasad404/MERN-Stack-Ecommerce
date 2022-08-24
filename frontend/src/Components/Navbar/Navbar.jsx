import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightToBracket,
  faHeart,
  faCartPlus,
  faUser,
  faSearch,
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import {
  GetAllCartProductProvider,
  LogoutUserProvider,
} from "../../ApiRenderController";
import { useStore } from "../../Hooks/useStore";

function Navbar() {
  const { state, dispatch } = useStore();
  const { user, cart } = state;
  const nav = useNavigate();
  const [drawer, setDrawer] = useState(false);

  const openDrawer = () => {
    setDrawer(drawer === true ? false : true);
  };

  const onSearch = (event) => {
    if (event.key === "Enter") {
      nav(`/products?item=${event.target.value}`);
    }
  };

  // useEffect(() => {
  //   const getCart = async () => {
  //     let res = await GetAllCartProductProvider();
  //     dispatch({
  //       type: "ADD_TO_CART",
  //       payload: [...res],
  //     });
  //   };
  //   getCart();
  // }, [dispatch]);

  return (
    <>
      <div className="navbar">
        <div className="nav-title">
          <FontAwesomeIcon
            onClick={openDrawer}
            icon={!drawer ? faBars : faXmark}
            className="navbar-bar"
          />
          ECART
        </div>
        <div className={drawer ? "toggler" : "nav-links"}>
          <Link className="nav-link nl-1" to="/">
            Home
          </Link>
          <Link className="nav-link nl-2" to="/products">
            Products
          </Link>
          <Link className="nav-link nl-3" to="/orders">
            My Orders
          </Link>
          <Link
            className="nav-link toggler-link nl-4"
            to={user ? "/account" : "/signin"}
          >
            {user ? "Account" : "Sign In"}
          </Link>
          <Link className="nav-link nl-5" to="/help">
            Help
          </Link>
          {user ? (
            <Link
              className="nav-link nl-5 toggler-link"
              to="/signin"
              onClick={() => LogoutUserProvider()}
            >
              Logout
            </Link>
          ) : null}
        </div>
        <div className="nav-icons">
          <div className="nav-search">
            <FontAwesomeIcon icon={faSearch} className="nav-search-icon" />
            <input
              onKeyDown={onSearch}
              type="text"
              placeholder="Search Products"
            />
          </div>
          <Link to="/favorites">
            <FontAwesomeIcon icon={faHeart} className="nav-icon fav" />
          </Link>
          <span className="cart">
            <Link to="/cart">
              <FontAwesomeIcon icon={faCartPlus} className="nav-icon" />
            </Link>
            <span className="cart-count">{cart.length}</span>
          </span>
          {user ? (
            <FontAwesomeIcon
              icon={faUser}
              className="nav-icon prof"
              onClick={() => nav("/account")}
            />
          ) : null}
          {!user ? (
            <FontAwesomeIcon
              icon={faRightToBracket}
              className="nav-icon signin"
              onClick={() => nav("/signin")}
            />
          ) : null}
        </div>
      </div>
    </>
  );
}

export default Navbar;
