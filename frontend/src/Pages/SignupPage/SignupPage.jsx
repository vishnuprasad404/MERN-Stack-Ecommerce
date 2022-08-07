import React, { useContext, useState } from "react";
import "./SignupPage.css";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { EContextData } from "../../EContextData";
import { Loading } from "../../Components/Loading/Loading";
import Notification from "../../Components/Notification/Notification";
import { RegisterUserProvider } from "../../ApiRenderController";
import { useEffect } from "react";

function SignupPage() {
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(EContextData);
  let [notify, setNotify] = useState({ display: "none" });
  const nav = useNavigate();
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
      if (res.isUserAdded) {
        setNotify({
          display: "flex",
          text: "Account Created Successfully",
          type: "SUCCESS",
        });
        setTimeout(() => {
          setNotify({ display: "none" });
          setUser(res.data.user);
          nav("/");
        }, 1000);
      }
    }
  };

  return (
    <div className="signup-page">
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
