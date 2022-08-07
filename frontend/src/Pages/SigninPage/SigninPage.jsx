import React, { useContext, useState } from "react";
import "./SigninPage.css";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { EContextData as GlobalData } from "../../EContextData";
import { Loading } from "../../Components/Loading/Loading";
import Notification from "../../Components/Notification/Notification";
import { LoginUserProvider } from "../../ApiRenderController";
import { useEffect } from "react";

function SigninPage() {
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(GlobalData);
  const [notify, setNotify] = useState({ display: "none" });
  const nav = useNavigate();
  useEffect(()=>{
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  },[])
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    let res = await LoginUserProvider(data);
    if (res) {
      setLoading(false);
      if (res.userFound !== true) {
        setNotify({
          display: "flex",
          text: "User not found on this email",
          type: "WARNING",
        });
        setTimeout(() => {
          setNotify({ display: "none" });
        }, 2000);
      }
      if (res.isLoggedIn === true) {
        setNotify({
          display: "flex",
          text: "Loggin successfully",
          type: "SUCCESS",
        });
        setTimeout(() => {
          setNotify({ display: "none" });
          setUser(res);
          nav(
            window.location.pathname !== "/signin"
              ? window.location.pathname
              : "/"
          );
        }, 500);
      } else if (res.isLoggedIn === false) {
        setNotify({
          display: "flex",
          text: "Email or password is incorrect,user not found",
          type: "DANGER",
        });
        setTimeout(() => {
          setNotify({ display: "none" });
        }, 2000);
      }
    }
  };

  return (
    <div className="signin-page" id="signin">
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
          <span className="err">
            {errors.email?.type === "required" && "*Email is required"}
            {errors.email?.type === "pattern" && "*Email is invalid !"}
          </span>

          <input
            className="signin-input"
            type="password"
            placeholder="Password"
            {...register("password", { required: true, minLength: "8" })}
          />
          <span className="err">
            {errors.password?.type === "required" && "*Password is required"}
            {errors.password?.type === "minLength" &&
              "*Password much contain atlest 8 character"}
          </span>

          <button
            className="form-btn"
            type="submit"
            style={{ background: loading ? "rgb(241, 241, 241)" : null }}
          >
            {!loading ? (
              "SignIn"
            ) : (
              <Loading
                iconSize="8px"
                color="red"
                style={{ height: "10px", width: "100%" }}
              />
            )}
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
