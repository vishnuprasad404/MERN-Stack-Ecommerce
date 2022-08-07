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
import { EContextData } from "../../EContextData";
import { useEffect } from "react";

function AdminPage() {
  const [pageContent, setPageContent] = useState("all-products");
  const [sidebarState, setSidebarState] = useState("");
  useEffect(()=>{
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  },[])
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
        <EContextData.Provider value={{ pageContent, setPageContent }}>
          <div className="sidebar" style={{ display: `${sidebarState}` }}>
            <h3>Admin Dashboard</h3>
            <SidebarContent icon={faDashboard} title="Dashboard" path="" />
            <SidebarContent icon={faBolt} title="Orders" path="orders" />
            <SidebarContent
              icon={faMobile}
              title="All Products"
              path="products"
            />
            <SidebarContent
              icon={faPlus}
              title="Add Product"
              path="product/add"
            />
            <SidebarContent icon={faUsers} title="Users" path="users" />
            <SidebarContent icon={faRightFromBracket} title="LogOut" />
          </div>
          <div className="admin-page-content">
            <Outlet />
          </div>
        </EContextData.Provider>
      </div>
    </div>
  );
}

function SidebarContent(props) {
  const { path, title, icon } = props;
  const nav = useNavigate();
  return (
    <div className="sidebar-content" onClick={() => nav(path)}>
      <FontAwesomeIcon icon={icon} className="icon" />
      <p>{title}</p>
    </div>
  );
}

export default AdminPage;
