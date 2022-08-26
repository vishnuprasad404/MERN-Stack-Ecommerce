import React, { useState } from "react";
import "./AdminViewProducts.css";
import Paginate from "react-paginate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { SmallLoading } from "../Loading/Loading";
import { useFetch } from "../../Hooks/useFetch";
import { useDelete } from "../../Hooks/useDelete";

function AdminViewProducts() {
  const nav = useNavigate();
  const { data: adminViewProducts } = useFetch("/products");
  const { execute } = useDelete();
  const [pageNumber, setPageNumber] = useState(0);
  const [loading, setLoading] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");



  const removeProduct = (id, selectedIndex) => {
    setLoading((prev) => new Set([...prev, selectedIndex]));
    execute(`/admin/remove-product/${id}`, {}, (result) => {
      if (result) {
        setTimeout(() => {
          setLoading((prev) => {
            const updated = new Set(prev);
            updated.delete(selectedIndex);
            return updated;
          });
          adminViewProducts.splice(selectedIndex, 1);
        }, 1000);
      }
    });
  };

  //remove products end//

  //--------------->> Paginate Products..------------------->>//

  const allProductPage = 8;
  const pagesVisited = pageNumber * allProductPage;

  const displayProducts = adminViewProducts
    .filter((data, key) => {
      if (searchQuery === "") {
        return data;
      } else if (searchQuery === 1) {
        return data.inStock >= 1;
      } else if (searchQuery === 0) {
        return data.inStock < 1;
      } else {
        return (
          data.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          data.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
    })
    .slice(pagesVisited, pagesVisited + allProductPage)
    .map((itm, key) => {
      let date = new Date(itm.created_at);
      const yyyy = date.getFullYear();
      let mm = date.getMonth() + 1;
      let dd = date.getDate();
      if (dd < 10) dd = "0" + dd;
      if (mm < 10) mm = "0" + mm;
      date = dd + "/" + mm + "/" + yyyy;
      return (
        <tbody key={key}>
          <tr>
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
            <td data-label="Date Added">{date}</td>
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
                <SmallLoading
                  smallLoadingStyle={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                />
              )}
            </td>
            <td data-label="Edit">
              <FontAwesomeIcon
                icon={faEdit}
                className="admin-product-edit-btn"
                onClick={() => nav(`/admin/product/update/?id=${itm._id}`)}
              />
            </td>
          </tr>
        </tbody>
      );
    });

  const pageCount = Math.ceil(adminViewProducts.length / allProductPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <div className="admin-view-products">
      <h2 className="heading">Product Inventory</h2>
      <div className="products-types">
        <div className="product-type">
          <h5>Total products</h5>
          <h2>{adminViewProducts && adminViewProducts.length}</h2>
        </div>
        <div className="product-type" onClick={() => setSearchQuery(1)}>
          <h5>In stock</h5>
          <h2>
            {adminViewProducts &&
              adminViewProducts.filter((e) => {
                return e.inStock > 0;
              }).length}
          </h2>
        </div>
        <div
          className="product-type"
          style={{ cursor: "pointer" }}
          onClick={() => setSearchQuery(0)}
        >
          <h5>Out of stock</h5>
          <h2>
            {
              adminViewProducts.filter((e) => {
                return e.inStock < 1;
              }).length
            }
          </h2>
        </div>
      </div>

      <div className="products-filter-container">
        <div className="filter">
          <p>Category :</p>
          <select onChange={(e) => setSearchQuery(e.target.value)}>
            <option
              value=""
              // onClick={() => setAdminViewProductsFilterd(adminViewProducts)}
            >
              All
            </option>
            <option value="mobiles">Mobiles</option>
            <option value="appliences">Appliences</option>
            <option value="headphones">Headphones</option>
            <option value="electronics">Electronics</option>
            <option value="desktops">Desktops & Computer accessories</option>
            <option value="watches">Watches</option>
          </select>
        </div>
        <div className="filter filter-search">
          <FontAwesomeIcon icon={faSearch} />
          <input
            type="text"
            placeholder="Search Product"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-products-list-container">
        <table className="admin-products-list-table">
          <thead>
            <tr>
              <th>id</th>
              <th>Product</th>
              <th>Title</th>
              <th>Category</th>
              <th>Prise</th>
              <th>Date Added</th>
              <th>Stock</th>
              <th>Remove</th>
              <th>Edit</th>
            </tr>
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
