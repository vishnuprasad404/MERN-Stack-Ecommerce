import React, { useContext, useState } from "react";
import "./SigninPage.css";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { EContextData as GlobalData } from "../../EContextData";
import { Loading } from "../../Components/Loading/Loading";
import Notification from "../../Components/Notification/Notification";

function SigninPage() {
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(GlobalData);
  const [notify, setNotify] = useState({ display: "none" });
  const nav = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = (data) => {
    setLoading(true);
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/user/signin`, data)
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          setLoading(false);
        }
        if (res.data.userFound !== true) {
          setNotify({
            display: "flex",
            text: "User not found on this email",
            type: "WARNING",
          });
          setTimeout(() => {
            setNotify({ display: "none" });
          }, 2000);
        }
        if (res.data.isLoggedIn === true) {
          setNotify({
            display: "flex",
            text: "Loggin successfully",
            type: "SUCCESS",
          });
          setTimeout(() => {
            setNotify({ display: "none" });
            setUser(res.data);
            nav(
              window.location.pathname !== "/signin"
                ? window.location.pathname
                : "/"
            );
          }, 1000);
        } else if (res.data.isLoggedIn === false) {
          setNotify({
            display: "flex",
            text: "Email or password is incorrect,user not found",
            type: "DANGER",
          });
          setTimeout(() => {
            setNotify({ display: "none" });
          }, 2000);
        }
      });
  };

  return (
    <div className="signin-page">
      <div className="signin-page-container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1>Sign In</h1>
          <input
            className="signin-input"
            type="text"
            placeholder="Email"
            {...register("email", {
              required: true,
              pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i,
            })}
          />
          <error className="err">
            {errors.email?.type === "required" && "*Email is required"}
            {errors.email?.type === "pattern" && "*Email is invalid !"}
          </error>

          <input
            className="signin-input"
            type="password"
            placeholder="Password"
            {...register("password", { required: true, minLength: "8" })}
          />
          <error className="err">
            {errors.password?.type === "required" && "*Password is required"}
            {errors.password?.type === "minLength" &&
              "*Password much contain atlest 8 character"}
          </error>

          <button className="form-btn" type="submit">
            {!loading ? "SignIn" : <Loading iconSize="1.5rem" color="white" />}
          </button>

          <p style={{ fontSize: "12px" }}>
            Don't have an account{" "}
            <Link style={{ textDecoration: "none" }} to="/signup">
              SignUp
            </Link>{" "}
          </p>
        </form>
      </div>
      <Notification
        status={notify}
        parentStyle={{
          top: "20px",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      />
    </div>
  );
}

export default SigninPage;
