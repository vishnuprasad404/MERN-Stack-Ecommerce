import React, { useState } from "react";
import "./AdminPage.css";
import { Outlet, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBolt,
  faDashboard,
  faMobile,
  faPlus,
  faRightFromBracket,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

function AdminPage() {
  const [sidebarState, setSidebarState] = useState("");
  const [sidebarActive, setSidebarActive] = useState("Dashboard");

  return (
    <div className="admin-page">
      <div className="admin-navbar">
        <FontAwesomeIcon
          className="icon"
          icon={faBars}
          onClick={() => {
            setSidebarState(sidebarState === "" ? "block" : "");
          }}
        />
        Admin Dashboard
      </div>
      <div className="admin-content" onClick={() => setSidebarState("")}>
        <div className="sidebar" style={{ display: `${sidebarState}` }}>
          <h3>Admin Dashboard</h3>
          <SidebarContent
            icon={faDashboard}
            title="Dashboard"
            path=""
            setSidebarActive={setSidebarActive}
            sidebarActive={sidebarActive}
          />
          <SidebarContent
            icon={faBolt}
            title="Orders"
            path="orders"
            setSidebarActive={setSidebarActive}
            sidebarActive={sidebarActive}
          />
          <SidebarContent
            icon={faMobile}
            title="All Products"
            setSidebarActive={setSidebarActive}
            sidebarActive={sidebarActive}
            path="products"
          />
          <SidebarContent
            icon={faPlus}
            title="Add Product"
            sidebarActive={sidebarActive}
            setSidebarActive={setSidebarActive}
            path="product/add"
          />
          <SidebarContent
            icon={faUsers}
            title="Users"
            path="users"
            setSidebarActive={setSidebarActive}
            sidebarActive={sidebarActive}
          />
          <SidebarContent icon={faRightFromBracket} title="LogOut" />
        </div>
        <div className="admin-page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function SidebarContent({
  path,
  title,
  icon,
  setSidebarActive,
  sidebarActive,
}) {
  const nav = useNavigate();
  return (
    <div
      className={`sidebar-content ${
        sidebarActive === title ? "sidebar-active" : null
      }`}
      onClick={() => {
        nav(path);
        setSidebarActive(title);
      }}
    >
      <FontAwesomeIcon icon={icon} className="icon" />
      <p>{title}</p>
    </div>
  );
}

export default AdminPage;
