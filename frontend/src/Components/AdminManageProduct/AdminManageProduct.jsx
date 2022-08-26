import React, { useState } from "react";
import "./AdminManageProduct.css";
import AdminSelectImage from "./AdminSelectImage/AdminSelectImage";
import { useForm } from "react-hook-form";
import { useParams, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { Loading } from "../Loading/Loading";
import { useFetch } from "../../Hooks/useFetch";
import { usePost } from "../../Hooks/usePost";
import { useUpdate } from "../../Hooks/useUpdate";

function AdminManageProduct() {
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
  const { data } = useFetch("/products");
  const { loading: addProductLoading, execute } = usePost("/admin/addproduct");
  const { loading: updateProductLoading, execute: executeUpdate } = useUpdate();

  useEffect(() => {
    if (action === "update") {
      if (data.length > 0) {
        let product = data.filter((item) => {
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
      }
    }
  }, [action, id, data]);

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
        execute({ data: formData }, (result, error) => {
          if (result) {
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
        executeUpdate(
          `/admin/update-product/${id}`,
          {
            data: {
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
            },
          },
          (result, error) => {
            if (result) {
              alert("Item Updated");
            } else {
              alert("item Cannot be Updated");
            }
          }
        );
      } else {
        if (
          image !== undefined &&
          image1 !== undefined &&
          image2 !== undefined &&
          image3 !== undefined
        ) {
          executeUpdate(
            `/admin/update-product/${id}`,
            { data: formData },
            (result, error) => {
              if (result) {
                alert("Item Updated");
              } else {
                alert("item Cannot be Updated");
              }
            }
          );
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
          <span className="err">
            {errors.title?.type === "required" && "*Product Title is required"}
          </span>
          <input
            type="number"
            placeholder="Orginal Prise"
            defaultValue={action === "update" ? updateProduct.orginalPrise : ""}
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
            defaultValue={
              action === "update" ? updateProduct.discountPrise : ""
            }
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
            defaultValue={action === "update" ? updateProduct.inStock : ""}
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
            defaultValue={action === "update" ? updateProduct.description : ""}
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
