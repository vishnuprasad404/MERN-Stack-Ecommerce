import React from "react";
import "./Footer.css";
import { HashLink as Link } from "react-router-hash-link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faGoogle,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

function Footer() {
  return (
    <footer className="footer text-white w-100">
      <div className="footer-social-media-container">
        <span>Get connected with us on social networks</span>
        <div className="footer-social-media-icons">
          <a href="http://www.google.com/">
            <FontAwesomeIcon icon={faGoogle} className="footer-icon" />
          </a>
          <a href="http://www.facebook.com/">
            <FontAwesomeIcon icon={faFacebook} className="footer-icon" />
          </a>
          <a href="http://www.instagram.com/">
            <FontAwesomeIcon icon={faInstagram} className="footer-icon" />
          </a>
        </div>
      </div>
      <div className="container-fluid p-5 footer-container">
        <div className="row">
          <div className="col-md-3 footer-content">
            <h5>Ecart</h5>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa
              saepe quibusdam debitis. Fugit molestias doloremque corrupti.
              Praesentium, eligendi modi. Numquam.
            </p>
          </div>
          <div className="col-md-3 footer-content">
            <h5>Products</h5>
            <ul>
              <li>Mobiles</li>
              <li>Home Appliences</li>
              <li>Headphones</li>
              <li>Desktops & Computer Accessories</li>
            </ul>
          </div>
          <div className="col-md-3 footer-content">
            <h5>Useful Links</h5>
            <ul>
              <li>
                <Link className="footer-link" to="/orders">
                  My orders
                </Link>
              </li>
              <li>
                <Link className="footer-link" to="/products#allproducts">
                  All Products
                </Link>
              </li>
              <li>
                <Link className="footer-link" to="/cart#myCart">
                  My Cart
                </Link>
              </li>
              <li>
                <Link className="footer-link" to="/help">
                  Help
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-md-3 footer-content">
            <h5>Contacts</h5>
            <ul>
              <li>India ,Kerala,Pathanamthitta</li>
              <li>ecartonline@gmail.com</li>
              <li>+91 1000203043</li>
              <li>+91 1000203043</li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-4 copy-right">
          © 2022 eCart All Rights Reserved Designed and Developed <br /> by
          vishnu prasad
        </div>
      </div>
    </footer>
  );
}

export default Footer;
