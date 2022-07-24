import React, { useEffect, useState } from "react";
import "./AdminViewProducts.css";
import Paginate from "react-paginate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { Loading } from "../Loading/Loading";
import axios from "axios";

function AdminViewProducts() {
  const nav = useNavigate();
  const [adminViewProducts, setAdminViewProducts] = useState([]);
  const [adminViewProductsFilterd, setAdminViewProductsFilterd] =
    useState(adminViewProducts);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalProducts, setTotalProducts] = useState("");
  const [inStock, setInStock] = useState("");
  const [outOfStock, setOutOfStock] = useState("");
  const [loading, setLoading] = useState(new Set());

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/products`).then((res) => {
      setAdminViewProducts(res.data);
      setAdminViewProductsFilterd(res.data);
    });
  }, []);
  useEffect(() => {
    setTotalProducts(adminViewProducts.length);
    let out_of_stock = adminViewProducts.filter((itm) => {
      return itm.inStock < 1;
    });
    setInStock(adminViewProducts.length - out_of_stock.length);
    setOutOfStock(out_of_stock.length);
  }, [adminViewProducts]);

  const filterProducts = (e) => {
    let query = e.target.value.toLowerCase();
    let filterdData = adminViewProducts.filter((data, key) => {
      return (
        data.title.toLowerCase().includes(query) ||
        data.category.toLowerCase().includes(query)
      );
    });
    setAdminViewProductsFilterd(filterdData);
  };

  const filterProductsByStock = () => {
    let filterdData = adminViewProducts.filter((data) => {
      return data.inStock < 1;
    });
    setAdminViewProductsFilterd(filterdData);
  };

  // remove products start//

  const removeProduct = (id, selectedIndex) => {
    console.log(selectedIndex);
    setLoading((prev) => new Set([...prev, selectedIndex]));
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}/admin/remove-product/${id}`)
      .then((res) => {
        if (res.data) {
          adminViewProducts.splice(selectedIndex, 1);
        }
      });
  };

  //remove products end//

  //--------------->> Paginate Products..------------------->>//

  const allProductPage = 5;
  const pagesVisited = pageNumber * allProductPage;

  const displayProducts = adminViewProductsFilterd
    .slice(pagesVisited, pagesVisited + allProductPage)
    .map((itm, key) => {
      return (
        <tbody>
          <td data-label="Id">{key + 1}</td>
          <td data-label="Product">
            {" "}
            <img width="40px" src={itm.image1} alt="" />
          </td>
          <td data-label="Title" className="admin-product-title">
            {itm.title}
          </td>
          <td data-label="Category">{itm.category}</td>
          <td data-label="Prise">${itm.discountPrise}</td>
          <td data-label="Date Added">{itm.created_at}</td>
          <td
            data-label="Date Added"
            style={{ color: itm.inStock >= 1 ? "green" : "red" }}
          >
            {itm.inStock >= 1 ? "inStock" : "outofStock"}
          </td>
          <td data-label="Remove">
            {!loading.has(key) ? (
              <FontAwesomeIcon
                icon={faTrash}
                className="admin-product-remove-btn"
                onClick={() => {
                  removeProduct(itm._id, key);
                }}
              />
            ) : (
              <Loading iconSize="17px" color="black" />
            )}
          </td>
          <td data-label="Edit">
            <FontAwesomeIcon
              icon={faEdit}
              className="admin-product-edit-btn"
              onClick={() => nav("/admin/product/update/id")}
            />
          </td>
        </tbody>
      );
    });

  const pageCount = Math.ceil(adminViewProductsFilterd.length / allProductPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <div className="admin-view-products">
      <h2 className="heading">Product Inventory</h2>
      <div className="products-types">
        <div className="product-type">
          <h5>Total products</h5>
          <h2>{totalProducts}</h2>
        </div>
        <div className="product-type">
          <h5>In stock</h5>
          <h2>{inStock}</h2>
        </div>
        <div
          className="product-type"
          style={{ cursor: "pointer" }}
          onClick={filterProductsByStock}
        >
          <h5>Out of stock</h5>
          <h2>{outOfStock}</h2>
        </div>
      </div>

      <div className="products-filter-container">
        <div className="filter">
          <p>Category :</p>
          <select onChange={filterProducts}>
            <option
              value=""
              onClick={() => setAdminViewProductsFilterd(adminViewProducts)}
            >
              All
            </option>
            <option value="mobiles">Mobiles</option>
            <option value="appliences">Appliences</option>
            <option value="headphones">Headphones</option>
            <option value="electronics">Electronics</option>
            <option value="headphones">Desktops & Computer accessories</option>
            <option value="headphones">Headphones</option>
            <option value="headphones">Headphones</option>
          </select>
        </div>
        <div className="filter filter-search">
          <FontAwesomeIcon icon={faSearch} />
          <input
            type="text"
            placeholder="Search Product"
            onChange={filterProducts}
          />
        </div>
      </div>

      <div className="admin-products-list-container">
        <table className="admin-products-list-table">
          <thead>
            <th>id</th>
            <th>Product</th>
            <th>Title</th>
            <th>Category</th>
            <th>Prise</th>
            <th>Date Added</th>
            <th>Stock</th>
            <th>Remove</th>
            <th>Edit</th>
          </thead>
          {displayProducts}
        </table>
        <Paginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={pageCount}
          onPageChange={changePage}
          containerClassName={"pagination-container"}
          previousLinkClassName={"previous-btn"}
          nextLinkClassName={"next-btn"}
          disabledClassName={"pagination-disabled-btn"}
          activeClassName={"pagination-active"}
        />
      </div>
    </div>
  );
}

export default AdminViewProducts;
