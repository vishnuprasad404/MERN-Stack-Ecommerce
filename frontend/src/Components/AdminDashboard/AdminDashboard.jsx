import React, { useState, useContext } from "react";
import "./AdminDashboard.css";
import { EContextData } from "../../EContextData";
import AdminDashboardLink from "../AdminDashboardLink/AdminDashboardLink";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'

function AdminDashboard() {
  const { setPageContent } = useContext(EContextData);
  const [bannerImage, setBannerImage] = useState();

  const selectBannerImage = (e) => {
    setBannerImage(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <div className="admin-dashboard">
      <div
        style={{
          backgroundImage: `url(${
            bannerImage
              ? bannerImage
              : "https://d2nb51khh83712.cloudfront.net/images/large/Youtube_Banner_Size_34749296f8.png"
          })`,
        }}
        className="admin-banner-image"
      >
        <input
          type="file"
          accept="image/*"
          id="file"
          onChange={selectBannerImage}
        />
        <label htmlFor="file" className="update-banner">
          <FontAwesomeIcon icon={faPenToSquare}/>
        </label>
      </div>

      <div className="admin-dashboard-links">
        <AdminDashboardLink
          title="Orders"
          subtitle="350"
          onClick={() => setPageContent("orders")}
          bgColor="rgb(152, 195, 250)"
        />
        <AdminDashboardLink
          title="Products"
          subtitle="350"
          onClick={() => setPageContent("all-products")}
          bgColor="rgb(154, 253, 195)"
        />
        <AdminDashboardLink
          title="Users"
          subtitle="350"
          onClick={() => setPageContent("users")}
          bgColor="rgb(252, 174, 100)"
        />
      </div>
    </div>
  );
}

export default AdminDashboard;
