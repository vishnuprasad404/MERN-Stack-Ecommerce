import React from "react";
import "./AdminDashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import BarChart from "../BarChart/BarChart";
import { useFetch } from "../../Hooks/useFetch";
import PieChart from "../PieChart/PieChart";
import { Link, useNavigate } from "react-router-dom";

function AdminDashboard() {
  const nav = useNavigate();
  const { data: orders } = useFetch("/admin/orders");
  const { data: products } = useFetch("/products");
  const { data: users } = useFetch("/admin/get-all-user");

  return (
    <div className="admin-dashboard">
      <h2 className="dashboard-title">Dashboard</h2>
      <div className="dashboard-total-box-container-wrapper">
        <div
          className="dashboard-total-container"
          onClick={() => nav("/admin/users")}
        >
          <div className="dashboard-total-container-icon icon1">
            <FontAwesomeIcon icon={faUsers} />
          </div>
          <div className="dashboard-total-container-info">
            <h5>Total Users</h5>
            <p>{users.length}</p>
          </div>
        </div>
        <div
          className="dashboard-total-container "
          onClick={() => nav("/admin/orders")}
        >
          <div className="dashboard-total-container-icon icon2">
            <FontAwesomeIcon icon={faUsers} />
          </div>
          <div className="dashboard-total-container-info">
            <h5>Total Orders</h5>
            <p>{orders.length}</p>
          </div>
        </div>
        <div
          className="dashboard-total-container "
          onClick={() => nav("/admin/products")}
        >
          <div className="dashboard-total-container-icon icon3">
            <FontAwesomeIcon icon={faUsers} />
          </div>
          <div className="dashboard-total-container-info">
            <h5>Total Products</h5>
            <p>{products.length}</p>
          </div>
        </div>
      </div>
      <div className="charts-container">
        <BarChart data={orders} />
        <PieChart data={products} />
      </div>
      <div className="latest-orders-container">
        <h5>Latest Orders</h5>
        <table>
          {orders.slice(0, 6).map((itm, key) => {
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
                  <td>{key + 1}</td>
                  <td className="latest-order-status-username">
                    {itm.username}
                  </td>
                  <td>{itm.email}</td>
                  <td>₹ {itm.prise}</td>
                  <td>
                    {" "}
                    <h1
                      className={`latest-order-status ${
                        itm.status === "placed"
                          ? "lo-pending"
                          : itm.status === "dispatched"
                          ? "lo-dispatched"
                          : itm.status === "completed"
                          ? "lo-completed"
                          : itm.status === "cancelled"
                          ? "lo-cancelled"
                          : null
                      }`}
                    >
                      {itm.status === "placed" ? "pending" : itm.status}
                    </h1>{" "}
                  </td>
                  <td>{date}</td>
                </tr>
              </tbody>
            );
          })}
        </table>
        <Link to="/admin/orders" className="link">
          see more
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;
