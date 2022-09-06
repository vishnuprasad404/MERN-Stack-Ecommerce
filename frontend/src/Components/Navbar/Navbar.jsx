import React, { useState} from "react";
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
import { useStore } from "../../Hooks/useStore";
import { useFetch } from "../../Hooks/useFetch";
import icon from "../../Assets/icon.png";

function Navbar({searchTerm}) {
  const { state, dispatch } = useStore();
  const { user, cart } = state;
  const nav = useNavigate();
  const [drawer, setDrawer] = useState(false);

  const openDrawer = () => {
    setDrawer(drawer === true ? false : true);
  };

  const onSearch = (event) => {
    nav(`/products?item=${event.target.value}`);
  };

  const OnLogOut = () => {
    const { data } = useFetch("/signout");
    if (data) {
      dispatch({
        type: "REMOVE_USER",
        payload: false,
      });
    }
  };

  return (
    <>
      <div className="navbar">
        <div className="nav-title">
          <FontAwesomeIcon
            onClick={openDrawer}
            icon={!drawer ? faBars : faXmark}
            className="navbar-bar"
          />
          <img src={icon} width="30px" alt="" style={{ marginRight: "10px" }} />
          ECART
        </div>
        <div className={drawer ? "toggler-container" : null} onClick={()=>setDrawer(false)}>
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
                onClick={OnLogOut}
              >
                Logout
              </Link>
            ) : null}
          </div>
        </div>
        <div className="nav-icons">
          <div className="nav-search">
            <FontAwesomeIcon icon={faSearch} className="nav-search-icon" />
            <input
              onChange={onSearch}
              type="text"
              placeholder="Search Products"
              value={searchTerm}
              autoFocus={searchTerm  ? true : false}
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
