import React, { useState } from "react";
import "./AdminViewOrders.css";
import Paginate from "react-paginate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleDot } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import axios from "axios";

function AdminViewOrders() {
  const [orders, setOrders] = useState([]);
  const [filterOrders, setFilterOrders] = useState(orders);
  const [active, setActive] = useState("");
  const [pageNumber, setPageNumber] = useState(0);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/admin/orders`).then((res) => {
      console.log(res.data);
      setOrders(res.data);
      setFilterOrders(res.data);
    });
  }, []);

  const selectStatus = (key) => {
    setActive(key);
    console.log(active);
    var filterdData = orders.filter((data, index) => {
      return data.status === key;
    });
    setFilterOrders(filterdData);
  };

  const ordersPerPage = 5;
  const pagesVisited = pageNumber * ordersPerPage;

  const displayOrders = filterOrders
    .slice(pagesVisited, pagesVisited + ordersPerPage)
    .map((itm, key) => {
      return (
        <tbody
          style={{
            textDecoration: `${
              itm.status === "cancelled"
                ? "line-through rgb(255, 0, 0)"
                : "none"
            }`,
          }}
        >
          <td data-label="ID"># {key + 1}</td>
          <td data-label="Product">
            <img width="50px" src={itm.product.image1} alt="" />
          </td>
          <td data-label="Title" className="admin-orders-title">{itm.product.title}</td>
          <td data-label="User">{itm.username}</td>
          <td data-label="Place"></td>
          <td data-label="Phone">{itm.prise}</td>
          <td data-label="Date">{itm.created_at}</td>
          <td data-label="Prise">$ {itm.prise}</td>
          <td
            data-label="Status"
            style={{
              color: `${
                itm.status === "cancelled"
                  ? "red"
                  : itm.status === "placed"
                  ? "rgb(255, 144, 53)"
                  : "green"
              }`,
            }}
          >
            <div className="status-container">
              <FontAwesomeIcon
                icon={itm.status === "completed" ? faCircleCheck : faCircleDot}
              />
              <span style={{ marginLeft: "10px" }}>
                {itm.status === "placed"
                  ? "Pending"
                  : itm.status === "dispatched"
                  ? "Dispatched"
                  : itm.status === "completed"
                  ? "Completed"
                  : "Canceled"}
              </span>
            </div>
          </td>
          <td
            style={{
              display: `${itm.status === "cancelled" ? "none" : "flex"}`,
            }}
          >
            <select>
              <option value="">Change Status</option>
              <option value="dispatch">Dispatch</option>
              <option value="complete">Complete</option>
            </select>
          </td>
        </tbody>
      );
    });

  const pageCount = Math.ceil(filterOrders.length / ordersPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <div className="admin-view-orders">
      <h2>Order</h2>
      <p>{orders.length} Orders Found</p>
      <div className="orders-types-selector">
        <p
          style={{ color: `${active === "" ? "blue" : "black"}` }}
          onClick={() => {
            setActive("");
            setFilterOrders(orders);
          }}
        >
          All Orders
        </p>
        <p
          style={{ color: `${active === "dispatched" ? "blue" : "black"}` }}
          onClick={() => selectStatus("dispatched")}
        >
          Dispatched
        </p>
        <p
          style={{ color: `${active === "placed" ? "blue" : "black"}` }}
          onClick={() => selectStatus("placed")}
        >
          Pending
        </p>
        <p
          style={{ color: `${active === "completed" ? "blue" : "black"}` }}
          onClick={() => selectStatus("completed")}
        >
          Completed
        </p>
        <p
          style={{ color: `${active === "cancelled" ? "blue" : "black"}` }}
          onClick={() => selectStatus("cancelled")}
        >
          Cancelled
        </p>
      </div>
      <div className="orders-list">
        <table className="table">
          <thead>
            <th>id</th>
            <th>Product</th>
            <th>Title</th>
            <th>name</th>
            <th>Place</th>
            <th>Phone</th>
            <th>Date</th>
            <th>Prise</th>
            <th>Status</th>
            <th>Action</th>
          </thead>
          {displayOrders}
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

export default AdminViewOrders;
