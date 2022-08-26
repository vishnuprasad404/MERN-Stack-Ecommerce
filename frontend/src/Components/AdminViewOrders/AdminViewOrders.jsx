import React, { useState } from "react";
import "./AdminViewOrders.css";
import Paginate from "react-paginate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleDot,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { useFetch } from "../../Hooks/useFetch";
import { useUpdate } from "../../Hooks/useUpdate";

function AdminViewOrders() {
  const { data: orders } = useFetch("/admin/orders");
  const {execute}= useUpdate()
  const [filterQuery, setFilterQuery] = useState("");
  const [active, setActive] = useState("");
  const [pageNumber, setPageNumber] = useState(0);

  const selectStatus = (key) => {
    setActive(key);
    setFilterQuery(key);
  };

  const changeOrderStatus = (e, order_id, pid) => {
    execute(`/admin/change-order-status/${order_id}/${e.target.value}/${pid}`,{},(result)=>{
      console.log("results",result);
    })
  };

  const ordersPerPage = 5;
  const pagesVisited = pageNumber * ordersPerPage;

  const displayOrders = orders
    .slice(pagesVisited, pagesVisited + ordersPerPage)
    .filter((data) => {
      if (filterQuery !== "") {
        return data.status === filterQuery;
      } else {
        return data;
      }
    })
    .map((itm, key) => {
      let date = new Date(itm.created_at);
      const yyyy = date.getFullYear();
      let mm = date.getMonth() + 1;
      let dd = date.getDate();
      if (dd < 10) dd = "0" + dd;
      if (mm < 10) mm = "0" + mm;
      date = dd + "/" + mm + "/" + yyyy;
      return (
        <tbody
          key={key}
          style={{
            textDecoration: `${
              itm.status === "cancelled"
                ? "line-through rgb(255, 0, 0)"
                : "none"
            }`,
          }}
        >
          <tr>
            <td data-label="ID">{key + 1}</td>
            <td data-label="Product">
              <img width="50px" src={itm.product.image1} alt="" />
            </td>
            <td data-label="Title" className="admin-orders-title">
              {itm.product.title}
            </td>
            <td data-label="User">{itm.username}</td>
            <td data-label="Place">{itm.address && itm.address.state}</td>
            <td data-label="Phone">{itm.address && itm.address.mobile}</td>
            <td data-label="Date">{date}</td>
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
                  icon={
                    itm.status === "completed" ? faCircleCheck : faCircleDot
                  }
                />
                <span style={{ marginLeft: "10px" }}>
                  {itm.status === "placed"
                    ? "Pending"
                    : itm.status === "dispatched"
                    ? "Dispatched"
                    : itm.status === "completed"
                    ? "Completed"
                    : itm.status === "cancelled"
                    ? "Canceled"
                    : null}
                </span>
              </div>
            </td>
            <td
              style={{
                display: `${
                  itm.status === "cancelled" || itm.status === "completed"
                    ? "none"
                    : "flex"
                }`,
              }}
            >
              <select
                onChange={(e) => changeOrderStatus(e, itm._id, itm.item)}
                value={itm.status}
              >
                <option
                  value=""
                  disabled={
                    itm.status === "pending" ||
                    itm.status === "dispatched" ||
                    itm.status === "completed"
                      ? true
                      : false
                  }
                >
                  Pending
                </option>
                <option
                  value="dispatched"
                  disabled={
                    itm.status === "dispatched" || itm.status === "completed"
                      ? true
                      : false
                  }
                >
                  Dispatched
                </option>
                <option
                  value="completed"
                  disabled={itm.status === "completed" ? true : false}
                >
                  Completed
                </option>
              </select>
            </td>
          </tr>
        </tbody>
      );
    });

  const pageCount = Math.ceil(orders.length / ordersPerPage);

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
            selectStatus("");
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
            <tr>
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
            </tr>
          </thead>
          {displayOrders.length >= 1 ? displayOrders : null}
        </table>
        {displayOrders.length < 1 ? (
          <center className="no-orders">
            {" "}
            <FontAwesomeIcon className="no-user-icon" icon={faSearch} /> No
            users found
          </center>
        ) : null}
        {displayOrders.length >= 1 ? (
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
        ) : null}
      </div>
    </div>
  );
}

export default AdminViewOrders;
