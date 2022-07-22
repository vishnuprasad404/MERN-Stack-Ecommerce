import React, { useContext, useState } from "react";
import "./UpdateAccountForm.css";
import { useForm } from "react-hook-form";
import { EContextData } from "../../EContextData";
import axios from "axios";
import { Loading } from "../../Components/Loading/Loading";

function UpdateAccountForm() {
  const { user } = useContext(EContextData);
  const [changePassword, setChangePassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const updateProfile = (data) => {
    setLoading(true);
    if (!changePassword) {
      axios
        .post(`${process.env.REACT_APP_BASE_URL}/updateaccount`, {
          username: data.username,
          phone: data.phone,
          email: data.email,
        })
        .then((res) => {
          if (res.data) {
            setLoading(false);
          }
          if (res.data.updated) {
            alert("updated");
          } else {
            alert("network issue");
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
            setLoading(false);
          }
          if (res.data.passMatched === false) {
            alert("Current Password Doesn't Match");
          }
          if (res.data.updated) {
            alert("Updated Successfully");
          }
        });
    }
  };

  const activeChangePassword = () => {
    setChangePassword(changePassword ? false : true);
  };

  return (
    <div className="update-account-form">
      <form onSubmit={handleSubmit(updateProfile)}>
        <h6>Personal Details</h6>
        <div className="input-area">
          <input
            type="text"
            {...register("username", { required: true })}
            defaultValue={user.user.username}
          />
          <label>Username</label>
          <error className="form_err">
            {errors.username?.type === "required" && "*Username is required"}
          </error>
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
          <error className="form_err">
            {errors.phone?.type === "required" && "*Phone number is required"}
            {errors.phone?.type === "minLength" && "*Phone number is invalid !"}
            {errors.phone?.type === "maxLength" && "*Phone number is invalid !"}
          </error>
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
            <error className="form_err">
              {errors.email?.type === "required" && "*Email is required"}
              {errors.email?.type === "pattern" && "*Email is invalid !"}
            </error>
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
              <input type="checkbox" checked={changePassword} />
              change password
            </div>
            <error className="form_err">
              {errors.current_password?.type === "required" &&
                "*Current Password is required"}
              {errors.current_password?.type === "minLength" &&
                "*Password much contain atlest 8 character"}
            </error>
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
          <error className="form_err">
            {errors.new_password?.type === "required" &&
              "*New Password is required"}
            {errors.new_password?.type === "minLength" &&
              "*Password much contain atlest 8 character"}
          </error>
        </div>
        <button>
          {loading ? (
            "Update Profile"
          ) : (
            <Loading color="white" iconSize="2rem" />
          )}
        </button>
      </form>
    </div>
  );
}

export default UpdateAccountForm;
