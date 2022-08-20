import React, { useState } from "react";
import "./ForgetPassRequestPage.css";
import { useForm } from "react-hook-form";
import Notification from "../../Components/Notification/Notification";
import axios from "axios";
import SimpleNavbar from "../../Components/SimpleNavbar/SimpleNavbar";
import { Loading } from "../../Components/Loading/Loading";

function ForgetPassRequestPage() {
  const [notify, setNotify] = useState({ display: "none" });
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSendVerification = (data) => {
    setLoading(true);
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/user/password-reset`, {
        email: data.email,
      })
      .then((res) => {
        setLoading(false);
        setNotify({
          display: "flex",
          text: `${res.data.message}`,
          type: `${res.data.status === "FAILED" ? "DANGER" : res.data.status}`,
        });
        if (res.data.status !== "SUCCESS") {
          setTimeout(() => {
            setNotify({ display: "none" });
          }, 2000);
        }
      });
  };

  return (
    <div className="password-reset-request-page">
      <SimpleNavbar />
      <div className="password-reset-request-form-container">
        <form onSubmit={handleSubmit(onSendVerification)}>
          <h2>Reset Password</h2>
          <input
            type="email"
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
          <button type="submit">
            {loading ? (
              <Loading style={{ height: "auto" }} color="white" />
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
      <Notification
        status={notify}
        style={{ width: "500px" }}
        parentStyle={{
          top: "80px",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      />
    </div>
  );
}

export default ForgetPassRequestPage;
