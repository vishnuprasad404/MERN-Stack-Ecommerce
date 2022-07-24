import React, { useState } from "react";
import "./AdminManageProduct.css";
import AdminSelectImage from "./AdminSelectImage/AdminSelectImage";
import { useForm } from "react-hook-form";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { Loading } from "../Loading/Loading";

function AdminManageProduct() {
  const [loading, setLoading] = useState(false);
  const { action } = useParams();
  const [searchParams] = useSearchParams();
  let id = searchParams.get("id");
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const [updateProduct, setUpdateProduct] = useState({
    title: "",
    orginalPrise: "",
    discountPrise: "",
    inStock: "",
    description: "",
    category: "",
  });
  const [image, setImage] = useState();
  const [image1, setImage1] = useState();
  const [image2, setImage2] = useState();
  const [image3, setImage3] = useState();
  const [imageError, setimageError] = useState("none");
  const [updateImagePreview, setUpdateImagePreview] = useState({
    img1: "",
    img2: "",
    img3: "",
    img4: "",
  });
  const [updateImage, setUpdateImage] = useState(false);

  useEffect(() => {
    if (action === "update") {
      axios.get(`${process.env.REACT_APP_BASE_URL}/products`).then((res) => {
        let product_array = [...res.data];
        let product = product_array.filter((item) => {
          return item._id === id;
        });
        setUpdateProduct({
          title: product[0].title,
          orginalPrise: product[0].orginalPrise,
          discountPrise: product[0].discountPrise,
          inStock: product[0].inStock,
          description: product[0].description,
          category: product[0].category,
        });
        setUpdateImagePreview({
          img1: product[0].image1,
          img2: product[0].image2,
          img3: product[0].image3,
          img4: product[0].image4,
        });
      });
    }
  }, [action, id]);

  const manageProduct = (data) => {
    const formData = new FormData();
    formData.append("title", data.title ? data.title : updateProduct.title);
    formData.append(
      "orgPrise",
      data.orgPrise ? data.orgPrise : updateProduct.orginalPrise
    );
    formData.append(
      "disPrise",
      data.disPrise ? data.disPrise : updateProduct.discountPrise
    );
    formData.append(
      "description",
      data.description ? data.description : updateProduct.description
    );
    formData.append(
      "category",
      data.category ? data.category : updateProduct.category
    );
    formData.append(
      "inStock",
      data.inStock ? data.inStock : updateProduct.inStock
    );
    formData.append("image1", image);
    formData.append("image2", image1);
    formData.append("image3", image2);
    formData.append("image4", image3);

    if (action === "add") {
      if (
        image !== undefined &&
        image1 !== undefined &&
        image2 !== undefined &&
        image3 !== undefined
      ) {
        axios
          .post(
            `${process.env.REACT_APP_BASE_URL}/admin/addproduct`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          )
          .then((res) => {
            console.log(res.data);
            if (res.data) {
              alert("Item Added");
            } else {
              alert("item Cannot be added");
            }
          });
      } else {
        setimageError("block");
      }
    } else {
      if (!updateImage) {
        axios
          .put(`${process.env.REACT_APP_BASE_URL}/admin/update-product/${id}`, {
            title: data.title ? data.title : updateProduct.title,
            discountPrise: data.disPrise
              ? data.disPrise
              : updateProduct.discountPrise,
            orginalPrise: data.orgPrise
              ? data.orgPrise
              : updateProduct.orginalPrise,
            inStock: data.inStock ? data.inStock : updateProduct.inStock,
            description: data.description
              ? data.description
              : updateProduct.description,
            category: data.category ? data.category : updateProduct.category,
          })
          .then((res) => {
            console.log(res.data);
            if (res.data) {
              alert("Item Updated");
            } else {
              alert("item Cannot be Updated");
            }
          });
      } else {
        if (
          image !== undefined &&
          image1 !== undefined &&
          image2 !== undefined &&
          image3 !== undefined
        ) {
          axios
            .put(
              `${process.env.REACT_APP_BASE_URL}/admin/update-product/${id}`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            )
            .then((res) => {
              console.log(res.data);
              if (res.data) {
                alert("Item Updated");
              } else {
                alert("item Cannot be Updated");
              }
            });
        } else {
          setimageError("block");
        }
      }
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
            defaultValue={action === "update" ? updateProduct.title : ""}
            {...register("title", {
              required: action === "update" ? false : true,
            })}
          />
          <error className="err">
            {errors.title?.type === "required" && "*Product Title is required"}
          </error>
          <input
            type="number"
            placeholder="Orginal Prise"
            defaultValue={action === "update" ? updateProduct.orginalPrise : ""}
            {...register("orgPrise", {
              required: action === "update" ? false : true,
            })}
          />
          <error className="err">
            {errors.orgPrise?.type === "required" &&
              "*Orginal Prise is required"}
          </error>
          <input
            type="number"
            placeholder="Discount Prise"
            defaultValue={
              action === "update" ? updateProduct.discountPrise : ""
            }
            {...register("disPrise", {
              required: action === "update" ? false : true,
            })}
          />
          <error className="err">
            {errors.disPrise?.type === "required" &&
              "*Discount Prise is required"}
          </error>
          <input
            type="number"
            placeholder="Product inStock"
            defaultValue={action === "update" ? updateProduct.inStock : ""}
            {...register("inStock", {
              required: action === "update" ? false : true,
            })}
          />
          <error className="err">
            {errors.inStock?.type === "required" && "*inStock is required"}
          </error>
          <textarea
            rows="6"
            placeholder="Product Description"
            defaultValue={action === "update" ? updateProduct.description : ""}
            {...register("description", {
              required: action === "update" ? false : true,
            })}
          ></textarea>
          <error className="err">
            {errors.description?.type === "required" &&
              "*Product Description is required"}
          </error>
          <select
            {...register("category", {
              required: action === "update" ? false : true,
            })}
            defaultValue={action === "update" ? updateProduct.category : ""}
          >
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
            {!loading ? (
              action === "add" ? (
                "Add Product"
              ) : (
                "Update"
              )
            ) : (
              <Loading />
            )}
          </button>
        </form>
      </div>
      <div className="admin-add-product-image-container">
        <AdminSelectImage
          setImage={setImage}
          setImage1={setImage1}
          setImage2={setImage2}
          setImage3={setImage3}
          updateImg={updateImagePreview}
        />
        <p style={{ fontSize: "10px", color: "red", display: `${imageError}` }}>
          *A product must contain three images
        </p>
        {action === "update" ? (
          <label className="update-image">
            {" "}
            <input
              type="checkbox"
              onClick={() => {
                setUpdateImage(updateImage === false ? true : false);
                setUpdateImagePreview({
                  img1: null,
                  img2: null,
                  img3: null,
                  img4: null,
                });
              }}
            />{" "}
            Update images
          </label>
        ) : null}
      </div>
    </div>
  );
}

export default AdminManageProduct;
