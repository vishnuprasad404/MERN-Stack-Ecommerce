import React from "react";
import { Link } from "react-router-dom";
import "./EmailVerificationStatusPage.css";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";

function EmailVerificationStatusPage() {
  const { email } = useParams();
  const [verified, setVerified] = useState();

  useEffect(() => {
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/user/verified`, { email: email })
      .then((res) => {
        setVerified(res.data);
      });
  }, [email]);

  return (
    <>
      {verified ? (
        <div className="verification-status-page">
          <nav className="simple-navbar">
            <h4>Ecart</h4>
            <ul className="simple-nav-links">
              <li>
                <Link className="link" to="/signin">
                  SignIn
                </Link>
              </li>
              <li>
                <Link className="link" to="/signup">
                  Create an account
                </Link>
              </li>
            </ul>
          </nav>
          <div className="container">
            <h1>User Verification</h1>
            <div
              className={`verification-status-bar ${
                verified === true ? "verified" : "not-verified"
              }`}
            >
              <h6>
                You have been successfully verified. You can login now!{" "}
                <Link className="link" to="/signin">
                  Login
                </Link>{" "}
              </h6>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default EmailVerificationStatusPage;
