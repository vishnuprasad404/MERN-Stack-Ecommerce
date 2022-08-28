import React, { useState } from "react";
import "./SignupPage.css";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Loading } from "../../Components/Loading/Loading";
import Notification from "../../Components/Notification/Notification";
import { RegisterUserProvider } from "../../ApiRenderController";
import { useEffect } from "react";

function SignupPage() {
  const [loading, setLoading] = useState(false);
  let [notify, setNotify] = useState({ display: "none" });
  useEffect(() => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    let res = await RegisterUserProvider(data);
    if (res) {
      console.log(res);
      setLoading(false);
      if (res.userExist) {
        setNotify({
          display: "flex",
          text: "User alredy exist on this email",
          type: "WARNING",
        });
        setTimeout(() => {
          setNotify({ display: "none" });
        }, 2000);
      }
      if (res.emailSended) {
        setNotify({
          display: "flex",
          text: `A verification link has been sent to your email account`,
          type: "SUCCESS",
        });
      }
    }
  };

  return (
    <div className="signup-page">
      <div className="wave">
        <svg
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
          xmlns="http://www.w3.org/2000/svg"
          // style={{ fill: "#b2b2d8", width: "120%", height: 600 }}
          className="wave-svg"
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
      <div className="signup-page-container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1>Create An Account</h1>
          <input
            type="text"
            placeholder="Username"
            className="signup-input"
            {...register("username", { required: true })}
          />
          <span className="err">
            {errors.username?.type === "required" && "*Username is required"}
          </span>

          <input
            type="text"
            placeholder="Email"
            className="signup-input"
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
            type="text"
            placeholder="Phone number"
            className="signup-input"
            {...register("phone", {
              required: true,
              minLength: 10,
              maxLength: 10,
            })}
          />
          <span className="err">
            {errors.phone?.type === "required" && "*Phone is required"}
            {errors.phone?.type === "minLength" && "*Phone number is invalid !"}
            {errors.phone?.type === "maxLength" && "*Phone number is invalid !"}
          </span>

          <input
            type="password"
            placeholder="Password"
            className="signup-input"
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
              "Create Account"
            ) : (
              <Loading
                iconSize="8px"
                style={{ height: "10px", width: "100%", position: "static" }}
              />
            )}
          </button>
          <p style={{ fontSize: "12px" }}>
            Alredy have an account{" "}
            <Link style={{ textDecoration: "none" }} to="/signin">
              SignIn
            </Link>{" "}
          </p>
        </form>
      </div>
      <Notification
        status={notify}
        style={{ width: "450px" }}
        parentStyle={{
          top: "20px",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      />
    </div>
  );
}

export default SignupPage;
