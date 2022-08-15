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
import UpdateAccountForm from "../../Components/UpdateAccountForm/UpdateAccountForm";
import { useEffect } from "react";
import { LogoutUserProvider } from "../../ApiRenderController";
import { Loading } from "../../Components/Loading/Loading";
import Notification from '../../Components/Notification/Notification'

function AccountPage() {
  const { user } = useContext(GlobalData);
  const [loading, setLoading] = useState(true)
  const [notify, setNotify] = useState({display : 'none'})
  const nav = useNavigate();

  useEffect(() => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    if(user){
      setLoading(false)
    }
  }, [user]);

  const onLogOut = async () => {
    let res = await LogoutUserProvider();
    if (res) {
      nav("/signin");
    }
  };

  return (
    <>
      <Navbar />
      {!loading && user ? <div className="account-page container">
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
          <div className="account-link-container" onClick={onLogOut}>
            <FontAwesomeIcon icon={faPowerOff} className="icon" />

            <p> Logout</p>
          </div>
        </div>
        <div className="account-page-right">
          <UpdateAccountForm setNotify={setNotify}/>
        </div>
      </div> : <Loading/>}
      <Notification
        status={notify}
        parentStyle={{
          top: "60px",
          alignItems: "flex-end",
          justifyContent: "flex-end",
        }}
      />
    </>
  );
}

export default AccountPage;
