import React, { useState } from "react";
import "./AdminManageProduct.css";
import { useForm } from "react-hook-form";
import { useParams, useSearchParams } from "react-router-dom";
import { Loading } from "../Loading/Loading";
import { usePost } from "../../Hooks/usePost";
import { useUpdate } from "../../Hooks/useUpdate";
import DragAndDrop from "../DragAndDrop/DragAndDrop";
import Notification from "../Notification/Notification";

function AdminManageProduct() {
  const [files, setFiles] = useState([]);
  const { action } = useParams();
  const [searchParams] = useSearchParams();
  let id = searchParams.get("id");
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const { loading: addProductLoading, execute: executeAddProduct } =
    usePost("/admin/addproduct");
  const { loading: updateProductLoading, execute: executeUpdate } = useUpdate();
  const [notify, setNotify] = useState({ display: "none" });

  const manageProduct = (data) => {
    let formData = new FormData();

    // let formData = new FormData();
    formData.append("title", data.title);
    formData.append("orgPrise", data.orgPrise);
    formData.append("disPrise", data.disPrise);
    formData.append("inStock", data.inStock);
    formData.append("description", data.description);
    formData.append("category", data.category);
    // append array of image to form data//
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }
    //;

    if (action === "add") {
      executeAddProduct({ data: formData }, (res) => {
        if (res) {
          setNotify({
            display: "flex",
            text: res.message,
            type: res.status === "FAILED" ? "WARNING" : res.status,
          });
          setTimeout(() => {
            setNotify({
              display: "none",
            });
          }, 2000);
        }
      });
    } else {
      executeUpdate(
        `/admin/update-product/${id}`,
        { data: formData },
        (res) => {
          setNotify({
            display: "flex",
            text: res.message,
            type: res.status === "FAILED" ? "WARNING" : res.status,
          });
          setTimeout(() => {
            setNotify({
              display: "none",
            });
          }, 2000);
        }
      );
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
          onSubmit={handleSubmit(manageProduct)}
          className="admin-add-product-form"
        >
          <input
            type="text"
            placeholder="Product Title"
            {...register("title", {
              required: action === "update" ? false : true,
            })}
          />
          <span className="err">
            {errors.title?.type === "required" && "*Product Title is required"}
          </span>
          <input
            type="number"
            placeholder="Orginal Prise"
            {...register("orgPrise", {
              required: action === "update" ? false : true,
            })}
          />
          <span className="err">
            {errors.orgPrise?.type === "required" &&
              "*Orginal Prise is required"}
          </span>
          <input
            type="number"
            placeholder="Discount Prise"
            {...register("disPrise", {
              required: action === "update" ? false : true,
            })}
          />
          <span className="err">
            {errors.disPrise?.type === "required" &&
              "*Discount Prise is required"}
          </span>
          <input
            type="number"
            placeholder="Product inStock"
            {...register("inStock", {
              required: action === "update" ? false : true,
            })}
          />
          <span className="err">
            {errors.inStock?.type === "required" && "*inStock is required"}
          </span>
          <textarea
            rows="6"
            placeholder="Product Description"
            {...register("description", {
              required: action === "update" ? false : true,
            })}
          ></textarea>
          <span className="err">
            {errors.description?.type === "required" &&
              "*Product Description is required"}
          </span>
          <select
            {...register("category", {
              required: action === "update" ? false : true,
            })}
          >
            <option value="">Category</option>
            <option value="mobiles">Mobiles</option>
            <option value="headphones">Headphones</option>
            <option value="electronics">Electronics</option>
            <option value="appliences">Appliences</option>
            <option value="watches">Watches</option>
            <option value="desktops">Desktops & Accessories</option>
          </select>
          <span className="err">
            {errors.category?.type === "required" &&
              "*Product Category is required"}
          </span>
          <button className="add-product-btn" type="submit">
            {!addProductLoading && !updateProductLoading ? (
              action === "add" ? (
                "Add Product"
              ) : (
                "Update"
              )
            ) : (
              <Loading style={{ height: "auto" }} />
            )}
          </button>
        </form>
      </div>
      <div className="admin-add-product-image-container">
        <DragAndDrop files={files} setFiles={setFiles} />
      </div>
      <Notification
        status={notify}
        style={{ width: "600px" }}
        parentStyle={{
          width: "80%",
          height: "100px",
          top: "20px",
          alignItems: "flex-end",
          justifyContent: "flex-end",
        }}
      />
    </div>
  );
}

export default AdminManageProduct;
