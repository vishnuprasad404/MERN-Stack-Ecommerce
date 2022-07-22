import React, { useContext, useState } from "react";
import "./SigninPage.css";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { EContextData as GlobalData } from "../../EContextData";
import { Loading } from "../../Components/Loading/Loading";


function SigninPage() {
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(GlobalData);
  const nav = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = (data) => {
    setLoading(true)
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/user/signin`, data)
      .then((res) => {
        setLoading(false)
        if(!res.data){
          alert("User not found on this email");
        }
        if (res.data.userFound === false) {
          alert("Email or Password is incorrect. User not Found");
        }
        if (res.data.isLoggedIn) {
          alert("loggin succes");
          setUser(res.data);
          nav(window.location.pathname !== "/signin" ? window.location.pathname : '/');
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
          {!loading ? (
              "SignIn"
            ) : (
              <Loading iconSize="1.5rem" color="white" />
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
    </div>
  );
}

export default SigninPage;
