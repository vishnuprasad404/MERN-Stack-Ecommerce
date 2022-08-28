import React, { useState } from "react";
import "./SigninPage.css";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Loading } from "../../Components/Loading/Loading";
import Notification from "../../Components/Notification/Notification";
import { LoginUserProvider } from "../../ApiRenderController";
import { useStore } from "../../Hooks/useStore";

function SigninPage() {
  const [searchParams] = useSearchParams();
  let redirect = searchParams.get("redirect");
  const [loading, setLoading] = useState(false);
  const { dispatch } = useStore();
  const [notify, setNotify] = useState({ display: "none" });
  const nav = useNavigate();
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
      if (res.verified === false) {
        setNotify({
          display: "flex",
          text: "This email is not verified! please verify",
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
          dispatch({
            type: "ADD_USER",
            payload: res,
          });
          if (redirect) {
            nav(redirect);
          } else {
            nav(
              window.location.pathname !== "/signin"
                ? window.location.pathname
                : "/"
            );
          }
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
      {/* wave shape svg */}
      <div className="wave">
        <svg
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
          xmlns="http://www.w3.org/2000/svg"
          // style={{ fill: "#b2b2d8", width: "120%", height: 600 }}
          className='wave-svg'
        >
          <path
            d="M0 0v46.29c47.79 22.2 103.59 32.17 158 28 70.36-5.37 136.33-33.31 206.8-37.5 73.84-4.36 147.54 16.88 218.2 35.26 69.27 18 138.3 24.88 209.4 13.08 36.15-6 69.85-17.84 104.45-29.34C989.49 25 1113-14.29 1200 52.47V0z"
            opacity=".25"
          />
          <path
            d="M0 0v15.81c13 21.11 27.64 41.05 47.69 56.24C99.41 111.27 165 111 224.58 91.58c31.15-10.15 60.09-26.07 89.67-39.8 40.92-19 84.73-46 130.83-49.67 36.26-2.85 70.9 9.42 98.6 31.56 31.77 25.39 62.32 62 103.63 73 40.44 10.79 81.35-6.69 119.13-24.28s75.16-39 116.92-43.05c59.73-5.85 113.28 22.88 168.9 38.84 30.2 8.66 59 6.17 87.09-7.5 22.43-10.89 48-26.93 60.65-49.24V0z"
            opacity=".5"
          />
          <path d="M0 0v5.63C149.93 59 314.09 71.32 475.83 42.57c43-7.64 84.23-20.12 127.61-26.46 59-8.63 112.48 12.24 165.56 35.4C827.93 77.22 886 95.24 951.2 90c86.53-7 172.46-45.71 248.8-84.81V0z" />
        </svg>
      </div>

      <div className="signin-page-container">
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <h1>Login</h1>
          <input
            id="signin-input"
            type="text"
            name="email"
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
            id="signin-input"
            type="password"
            placeholder="Password"
            {...register("password", { required: true, minLength: "8" })}
          />
          <span className="err">
            {errors.password?.type === "required" && "*Password is required"}
            {errors.password?.type === "minLength" &&
              "*Password much contain atlest 8 character"}
          </span>
          <Link className="link forget-pass-link " to="/user/password-reset" >
            Forget password?
          </Link>{" "}
          <button className="form-btn" type="submit">
            {!loading ? (
              "SignIn"
            ) : (
              <Loading
                iconSize="8px"
                color="white"
                style={{ height: "10px", width: "100%" }}
              />
            )}
          </button>
          <p style={{ fontSize: "12px", textAlign: "center" }}>
            Don't have an account{" "}
            <Link style={{ textDecoration: "none" }} to="/signup">
              SignUp
            </Link>{" "}
          </p>
        </form>
      </div>
      <Notification
        status={notify}
        style={{ width: "400px" }}
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
