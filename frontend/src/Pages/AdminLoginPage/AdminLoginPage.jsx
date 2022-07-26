import React from "react";
import "./AdminLoginPage.css";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {Loading} from '../../Components/Loading/Loading'
import { useState } from "react";

function AdminLoginPage() {
  const nav = useNavigate()
  const [loading, setLoading] = useState(false)
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const onAdminLogin = (data) => {
    setLoading(true)
    axios.post(`${process.env.REACT_APP_BASE_URL}/admin/signin`,data).then((res)=>{
      setLoading(false)
      if(res.data){
        alert('admin login success')
        nav('/admin')
      }else{
        alert("admin login faild")
      }
    })
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
          <error className="err">
            {errors.username?.type === "required" && "*Username is required"}
          </error>
          <input
            type="password"
            placeholder="Password"
            className="admin-login-input"
            {...register("password", { required: true,minLength : 8 })}

          />
          <error className="err">
            {errors.password?.type === "required" && "*Password is required"}
            {errors.password?.type === "minLength" &&
              "*Password much contain atlest 8 character"}
          </error>
          <button type="submit" style={{background : loading ? "lightgrey" : null}}>{!loading ? 'Login' : <Loading iconSize="19px" color="grey"/>}</button>
        </form>
    </div>
  );
}

export default AdminLoginPage;
