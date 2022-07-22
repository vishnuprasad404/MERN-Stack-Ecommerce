import React, { useContext, useState } from "react";
import "./SignupPage.css";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { EContextData } from "../../EContextData";
import { Loading } from "../../Components/Loading/Loading";

function SignupPage() {
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(EContextData);
  const nav = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = (data) => {
    setLoading(true);
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/user/signup`, data)
      .then((res) => {
        if (res.data) {
          setLoading(false);
        }
        if (res.data.userExist) {
          alert("User Alredy Exist");
        }
        if (res.data.isUserAdded) {
          setUser(res.data.user);
          alert("Account Created Successfully");
          nav("/");
        }
      });
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
          <error className="err">
            {errors.username?.type === "required" && "*Username is required"}
          </error>

          <input
            type="text"
            placeholder="Email"
            className="signup-input"
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
            type="text"
            placeholder="Phone number"
            className="signup-input"
            {...register("phone", {
              required: true,
              minLength: 10,
              maxLength: 10,
            })}
          />
          <error className="err">
            {errors.phone?.type === "required" && "*Phone is required"}
            {errors.phone?.type === "minLength" && "*Phone number is invalid !"}
            {errors.phone?.type === "maxLength" && "*Phone number is invalid !"}
          </error>

          <input
            type="password"
            placeholder="Password"
            className="signup-input"
            {...register("password", { required: true, minLength: "8" })}
          />
          <error className="err">
            {errors.password?.type === "required" && "*Password is required"}
            {errors.password?.type === "minLength" &&
              "*Password much contain atlest 8 character"}
          </error>

          <button className="form-btn" type="submit">
            {!loading ? (
              "Create Account"
            ) : (
              <Loading iconSize="1.5rem" color="white" />
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
    </div>
  );
}

export default SignupPage;
