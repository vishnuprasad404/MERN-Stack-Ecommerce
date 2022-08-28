import React from "react";
import "./AdminLoginPage.css";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Loading } from "../../Components/Loading/Loading";
import { useState } from "react";
import Notification from "../../Components/Notification/Notification";
import { useStore } from "../../Hooks/useStore";
function AdminLoginPage() {
  const nav = useNavigate();
  const { dispatch } = useStore();
  const [loading, setLoading] = useState(false);
  const [notify, setNotify] = useState({ display: "none" });
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const onAdminLogin = (data) => {
    setLoading(true);
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/admin/signin`, data)
      .then((res) => {
        setLoading(false);
        if (res.data) {
          dispatch({
            type: "ADD_ADMIN",
            payload: true,
          });
          setNotify({
            display: "flex",
            text: "Admin login Successfully",
            type: "SUCCESS",
          });
          setTimeout(() => {
            nav("/admin");
            setNotify({ display: "none" });
          }, 1000);
        } else {
          setNotify({
            display: "flex",
            text: "Username or password is incorrect!",
            type: "DANGER",
          });
          setTimeout(() => {
            setNotify({ display: "none" });
          }, 1000);
        }
      });
  };
  return (
    <div className="admin-login-page">
      <form onSubmit={handleSubmit(onAdminLogin)}>
        <h2>Admin Login</h2>
        <input
          type="text"
          placeholder="Username"
          className="admin-login-input"
          {...register("username", { required: true })}
        />
        <span className="err">
          {errors.username?.type === "required" && "*Username is required"}
        </span>
        <input
          type="password"
          placeholder="Password"
          className="admin-login-input"
          {...register("password", { required: true, minLength: 8 })}
        />
        <span className="err">
          {errors.password?.type === "required" && "*Password is required"}
          {errors.password?.type === "minLength" &&
            "*Password much contain atlest 8 character"}
        </span>
        <button type="submit" className="admin-login-btn">
          {!loading ? (
            "Login"
          ) : (
            <Loading color="white" style={{ height: "auto" }} iconSize="5px" />
          )}
        </button>
      </form>
      <Notification
        status={notify}
        parentStyle={{
          top: "20px",
          alignItems: "flex-end",
          justifyContent: "center",
          background: "none",
        }}
      />
    </div>
  );
}

export default AdminLoginPage;
