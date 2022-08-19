import React, { useEffect, useState } from "react";
import "./PasswordResetPage.css";
import { useForm } from "react-hook-form";
import Notification from "../../Components/Notification/Notification";
import axios from "axios";
import SimpleNavbar from "../../Components/SimpleNavbar/SimpleNavbar";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning } from "@fortawesome/free-solid-svg-icons";
import Footer from "../../Components/Footer/Footer";
import { Link } from "react-router-dom";

function PasswordResetPage() {
  const { userId, verificationToken } = useParams();
  const [notify, setNotify] = useState({ display: "none" });
  const [validToken, setValidToken] = useState(true);
  const nav = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({
    mode: "onTouched",
  });
  const password = watch("pass");

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/user/check/password-reset/token/${userId}/${verificationToken}`
      )
      .then((res) => {
        setValidToken(res.data);
      });
      
  }, [userId, verificationToken]);

  const resetPassword = (data) => {
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/user/verify/password-reset`, {
        userId: userId,
        Token: verificationToken,
        newPassword: data.pass,
      })
      .then((res) => {
        setNotify({
          display: "flex",
          text: `${res.data.message}`,
          type: `${res.data.status === "FAILED" ? "DANGER" : res.data.status}`,
        });
        if (res.data.status === "SUCCESS") {
          setTimeout(() => {
            setNotify({ display: "none" });
            nav("/signin");
          }, 2000);
        }
      });
  };

  return (
    <>
      <SimpleNavbar />
      {validToken ? (
        <div className="password-reset-page">
          <div className="password-reset-form-container">
            <form onSubmit={handleSubmit(resetPassword)}>
              <h2>Reset Password</h2>
              <input
                type="password"
                onChange={(e) => (password.current = e.target.value)}
                placeholder="Password"
                {...register("pass", {
                  required: true,
                  minLength: "8",
                })}
              />
              <span className="err">
                {errors.pass?.type === "required" && "*password is required"}
                {errors.pass?.type === "minLength" &&
                  "*password contain atleast 8 character"}
              </span>
              <input
                type="password"
                placeholder="Confirm Password"
                {...register("cpass", {
                  required: true,
                  minLength: "8",
                  validate: (value) => value === password,
                })}
              />
              <span className="err">
                {errors.cpass?.type === "required" &&
                  "*confirm Password is required"}
                {errors.cpass?.type === "minLength" &&
                  "*confirm password contain atleast 8 character"}
                {errors.cpass?.type === "validate" &&
                  "*Confirm password did not match"}
              </span>
              <button type="submit">Reset Password</button>
            </form>
          </div>
          <Notification
            status={notify}
            style={{ width: "450px" }}
            parentStyle={{
              top: "50px",
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          />
        </div>
      ) : (
        <div className="container valid-token-error-wrapper">
          <div className="valid-token-error-container">
            <FontAwesomeIcon
              icon={faWarning}
              className="valid-token-error-icon"
            />
            <h6>
              Sorry, Invalid verification token please try again!{" "}
              <Link to="/user/password-reset" className="link">
                Reset Password
              </Link>{" "}
            </h6>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}

export default PasswordResetPage;
