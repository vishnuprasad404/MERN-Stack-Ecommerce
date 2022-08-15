import React, { useContext, useState } from "react";
import "./UpdateAccountForm.css";
import { useForm } from "react-hook-form";
import { EContextData } from "../../EContextData";
import axios from "axios";
import { Loading } from "../../Components/Loading/Loading";

function UpdateAccountForm({ setNotify }) {
  const { user } = useContext(EContextData);
  const [changePassword, setChangePassword] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const updateProfile = (data) => {
    setUpdateLoading(true);
    if (!changePassword) {
      axios
        .post(`${process.env.REACT_APP_BASE_URL}/updateaccount`, {
          username: data.username,
          phone: data.phone,
          email: data.email,
        })
        .then((res) => {
          if (res.data) {
            setUpdateLoading(false);
          }
          if (res.data.updated) {
            setNotify({
              display: "flex",
              text: "Account details updated successfully",
              type: "SUCCESS",
            });
            setTimeout(()=>{
              setNotify({
                display : 'none'
              })
            },2000)
          } else {
            setNotify({
              display: "flex",
              text: "Network error try again!",
              type: "WARNING",
            });
            setTimeout(()=>{
              setNotify({
                display : 'none'
              })
            },2000)
          }
        });
    } else {
      axios
        .post(`${process.env.REACT_APP_BASE_URL}/updateaccount`, {
          username: data.username,
          phone: data.phone,
          email: data.email,
          current_password: data.current_password,
          new_password: data.new_password,
        })
        .then((res) => {
          if (res.data) {
            setUpdateLoading(false);
          }
          if (res.data.passMatched === false) {
            setNotify({
              display: "flex",
              text: "Current Password Does't Match!",
              type: "DANGER",
            });
            setTimeout(()=>{
              setNotify({
                display : 'none'
              })
            },2000)
          }
          if (res.data.updated) {
            setNotify({
              display: "flex",
              text: "Account details updated successfully",
              type: "SUCCESS",
            });
            setTimeout(()=>{
              setNotify({
                display : 'none'
              })
            },2000)
          }
        });
    }
  };

  const activeChangePassword = () => {
    setChangePassword(changePassword ? false : true);
  };

  return (
    <div className="update-account-form">
      {user ? (
        <form onSubmit={handleSubmit(updateProfile)}>
          <h6>Personal Details</h6>
          <div className="input-area">
            <input
              type="text"
              {...register("username", { required: true })}
              defaultValue={user.user.username}
            />
            <label>Username</label>
            <span className="form_err">
              {errors.username?.type === "required" && "*Username is required"}
            </span>
          </div>
          <div className="input-area">
            <input
              type="text"
              defaultValue={user.user.phone}
              {...register("phone", {
                required: true,
                minLength: 10,
                maxLength: 10,
              })}
            />
            <label>Phone</label>
            <span className="form_err">
              {errors.phone?.type === "required" && "*Phone number is required"}
              {errors.phone?.type === "minLength" &&
                "*Phone number is invalid !"}
              {errors.phone?.type === "maxLength" &&
                "*Phone number is invalid !"}
            </span>
          </div>

          <h6>Email & Password</h6>
          <div className="email-and-pass-area">
            <div className="input-area">
              <input
                type="email"
                defaultValue={user.user.email}
                {...register("email", {
                  required: true,
                  pattern: "/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i",
                })}
              />
              <label>Email</label>
              <span className="form_err">
                {errors.email?.type === "required" && "*Email is required"}
                {errors.email?.type === "pattern" && "*Email is invalid !"}
              </span>
            </div>{" "}
            <div className="input-area">
              <input
                type="password"
                {...register("current_password", {
                  required: changePassword,
                  minLength: "8",
                })}
                readOnly={changePassword ? false : true}
                style={{
                  outline: `${changePassword ? "1px solid blue" : "none"} `,
                }}
              />
              <label>Current Password</label>
              <br />
              <div className="edit_pass" onClick={activeChangePassword}>
                <input type="checkbox" defaultChecked={changePassword} />
                change password
              </div>
              <span className="form_err">
                {errors.current_password?.type === "required" &&
                  "*Current Password is required"}
                {errors.current_password?.type === "minLength" &&
                  "*Password much contain atlest 8 character"}
              </span>
            </div>
          </div>
          <div className="input-area">
            <input
              type="text"
              {...register("new_password", { required: changePassword })}
              readOnly={changePassword ? false : true}
              style={{
                outline: `${changePassword ? "1px solid blue" : "none"} `,
              }}
            />
            <label>New Password</label>
            <span className="form_err">
              {errors.new_password?.type === "required" &&
                "*New Password is required"}
              {errors.new_password?.type === "minLength" &&
                "*Password much contain atlest 8 character"}
            </span>
          </div>
          <button>
            {updateLoading ? <Loading color="white" style={{height: 'auto'}} /> : "Update Account"}
          </button>
        </form>
      ) : null}
    </div>
  );
}

export default UpdateAccountForm;
