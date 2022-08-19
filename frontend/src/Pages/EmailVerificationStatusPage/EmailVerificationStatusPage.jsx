import React from "react";
import { Link } from "react-router-dom";
import "./EmailVerificationStatusPage.css";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import SimpleNavbar from "../../Components/SimpleNavbar/SimpleNavbar";

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
          <SimpleNavbar />

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
