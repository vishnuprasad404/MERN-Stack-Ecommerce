import React from "react";
import "./AdminDashboard.css";
import AdminDashboardLink from "../AdminDashboardLink/AdminDashboardLink";


function AdminDashboard() {

  return (
    <div className="admin-dashboard">
      <div
        className="admin-banner-image"
      >
      </div>

      <div className="admin-dashboard-links">
        <AdminDashboardLink
          title="Orders"
          subtitle="350"
          bgColor="rgb(152, 195, 250)"
        />
        <AdminDashboardLink
          title="Products"
          subtitle="350"
          bgColor="rgb(154, 253, 195)"
        />
        <AdminDashboardLink
          title="Users"
          subtitle="350"
          bgColor="rgb(252, 174, 100)"
        />
      </div>
    </div>
  );
}

export default AdminDashboard;
