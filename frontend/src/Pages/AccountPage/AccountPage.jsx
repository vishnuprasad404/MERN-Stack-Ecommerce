import React, { useContext, useState } from "react";
import "./AccountPage.css";
import Navbar from "../../Components/Navbar/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAddressBook,
  faCartShopping,
  faHeart,
  faPowerOff,
  faShop,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { EContextData as GlobalData } from "../../EContextData";
import axios from "axios";
import UpdateAccountForm from "../../Components/UpdateAccountForm/UpdateAccountForm";

function AccountPage() {
  const { user } = useContext(GlobalData);
  const nav = useNavigate();

  return (
    <>
      <Navbar />
      <div className="account-page container">
        <div className="account-page-left">
          <div className="user-avatar-name-container">
            <div className="avatar"></div>
            <h4>
              <span>Welcome</span>,<br /> {user.user.username}
            </h4>
          </div>

          <div
            className="account-link-container"
            onClick={() => nav("/favorites")}
          >
            <FontAwesomeIcon icon={faHeart} className="icon" />
            <p> Go to Favorites</p>
          </div>
          <div className="account-link-container" onClick={() => nav("/cart")}>
            <FontAwesomeIcon icon={faCartShopping} className="icon" />
            <p> Go to Cart</p>
          </div>
          <div
            className="account-link-container"
            onClick={() => nav("/orders")}
          >
            <FontAwesomeIcon icon={faShop} className="icon" />
            <p> Go to My Orders</p>
          </div>
          <div
            className="account-link-container"
            onClick={() => nav("/delivery-address")}
          >
            <FontAwesomeIcon icon={faAddressBook} className="icon" />
            <p> Delivery Address</p>
          </div>
          <div
            className="account-link-container"
            onClick={() =>
              axios.get(`${process.env.REACT_APP_BASE_URL}/signout`)
            }
          >
            <FontAwesomeIcon icon={faPowerOff} className="icon" />

            <p> Logout</p>
          </div>
        </div>
        <div className="account-page-right">
          <UpdateAccountForm />
        </div>
      </div>
    </>
  );
}

export default AccountPage;
