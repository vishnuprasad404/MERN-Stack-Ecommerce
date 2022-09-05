import React from "react";
import "./AdminDashboardLink.css";

function AdminDashboardLink(props) {
  return (
    <div style={{backgroundColor : `${props.bgColor}`}} className="admin-dashboard-link">
      <h1>{props.title}</h1>
      <p>{props.subtitle}</p>
    </div>
  );
}

export default AdminDashboardLink;
