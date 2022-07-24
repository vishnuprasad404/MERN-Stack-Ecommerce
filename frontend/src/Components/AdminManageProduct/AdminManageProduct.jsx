import React, { useState } from "react";
import "./AdminManageProduct.css";
import AdminSelectImage from "./AdminSelectImage/AdminSelectImage";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

function AdminManageProduct() {
  const { action } = useParams();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const [image, setImage] = useState();
  const [image1, setImage1] = useState();
  const [image2, setImage2] = useState();
  const [image3, setImage3] = useState();
  const [imageError, setimageError] = useState("none");

  useEffect(()=>{
    if(action === 'update'){
      axios.get(`${process.env.REACT_APP_BASE_URL}/product`).then((res)=>{
        
      })
    }
  })

  const onAddProduct = (data) => {
    console.log(image);
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("orgPrise", data.orgPrise);
    formData.append("disPrise", data.disPrise);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("inStock", data.inStock);

    formData.append("image1", image);
    formData.append("image2", image1);
    formData.append("image3", image2);
    formData.append("image4", image3);

    if (
      image !== undefined &&
      image1 !== undefined &&
      image2 !== undefined &&
      image3 !== undefined
    ) {
      if(action === 'add'){
        axios
        .post(`${process.env.REACT_APP_BASE_URL}/admin/addproduct`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log(res.data);
          if (res.data) {
            alert("Item Added");
            
          } else {
            alert("item Cannot be added");
          }
        });
      }else if(action === 'update'){
        axios
        .put(`${process.env.REACT_APP_BASE_URL}/admin/update-product`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log(res.data);
          if (res.data) {
            alert("Item Updated");
            
          } else {
            alert("item Cannot be updated");
          }
        });
      }
    } else {
      setimageError("block");
    }
  };

  return (
    <div className="admin-add-product">
      <div className="admin-add-product-form-container">
        <h1>
          {action === "add"
            ? "Add Product"
            : action === "update"
            ? "Update Product"
            : null}
        </h1>
        <form
  
          onSubmit={handleSubmit(onAddProduct)}
          className="admin-add-product-form"
        >
          <input
            type="text"
            placeholder="Product Title"
            {...register("title", { required: true })}
          />
          <error className="err">
            {errors.title?.type === "required" && "*Product Title is required"}
          </error>
          <input
            type="number"
            placeholder="Orginal Prise"
            {...register("orgPrise", { required: true })}
          />
          <error className="err">
            {errors.orgPrise?.type === "required" &&
              "*Orginal Prise is required"}
          </error>
          <input
            type="number"
            placeholder="Discount Prise"
            {...register("disPrise", { required: true })}
          />
          <error className="err">
            {errors.disPrise?.type === "required" &&
              "*Discount Prise is required"}
          </error>
          <input
            type="number"
            placeholder="Product inStock"
            {...register("inStock", { required: true })}
          />
          <error className="err">
            {errors.inStock?.type === "required" && "*inStock is required"}
          </error>
          <textarea
            rows="6"
            placeholder="Product Description"
            {...register("description", { required: true })}
          ></textarea>
          <error className="err">
            {errors.description?.type === "required" &&
              "*Product Description is required"}
          </error>
          <select {...register("category", { required: true })}>
            <option value="">Category</option>
            <option value="mobiles">Mobiles</option>
            <option value="headphones">Headphones</option>
            <option value="electronics">Electronics</option>
            <option value="appliences">Appliences</option>
            <option value="watches">Watches</option>
            <option value="desktops">Desktops & Accessories</option>
          </select>
          <error className="err">
            {errors.category?.type === "required" &&
              "*Product Category is required"}
          </error>
          <button className="add-product-btn" type="submit">
            {action === "add"
              ? "ADD PRODUCT"
              : action === "update"
              ? "Update"
              : null}
          </button>
        </form>
      </div>
      <div className="admin-add-product-image-container">
        <AdminSelectImage
          setImage={setImage}
          setImage1={setImage1}
          setImage2={setImage2}
          setImage3={setImage3}
        />
        <p style={{ fontSize: "10px", color: "red", display: `${imageError}` }}>
          *A product must contain three images
        </p>
      </div>
    </div>
  );
}

export default AdminManageProduct;
