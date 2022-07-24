import React, { useState } from "react";
import "./AdminSelectImage.css";

function AdminSelectImage(props) {
  const { setImage, setImage1, setImage2, setImage3 ,updateImg} = props;
  const [imagePreview, setImagePreview] = useState(); 
  const [imagePreview1, setImagePreview1] = useState();
  const [imagePreview2, setImagePreview2] = useState();
  const [imagePreview3, setImagePreview3] = useState();

  const selectImage = (e) => {
    setImage(e.target.files[0]);
    let tempPreview = URL.createObjectURL(e.target.files[0]);
    setImagePreview(tempPreview);
  };
  const selectImage1 = (e, key) => {
    setImage1(e.target.files[0]);
    let tempPreview = URL.createObjectURL(e.target.files[0]);
    setImagePreview1(tempPreview);
  };
  const selectImage2 = (e, key) => {
    setImage2(e.target.files[0]);
    let tempPreview = URL.createObjectURL(e.target.files[0]);
    setImagePreview2(tempPreview);
  };
  const selectImage3 = (e, key) => {
    setImage3(e.target.files[0]);
    let tempPreview = URL.createObjectURL(e.target.files[0]);
    setImagePreview3(tempPreview);
  };



  return (
    <div className="admin-select-image">
      <input type="file" accept="image/*" id="image" onChange={selectImage} />
      <label htmlFor="image">
        <div
          onDragOver={(e) => {
            alert(e);
          }}
          style={{ backgroundImage: `url(${imagePreview || updateImg.img1})` }}
          className="image-container"
        >
          {!imagePreview && !updateImg.img1 ? "drag and drop or select image" : ""}
        </div>
      </label>
      <div className="admin-select-sub-image">
        <input
          type="file"
          accept="image/*"
          id="image1"
          onChange={selectImage1}
        />
        <label htmlFor="image1">
          <div
            style={{ backgroundImage: `url(${imagePreview1 || updateImg.img2})` }}
            className="sub-image-container"
          >
            {" "}
            {!imagePreview && !updateImg.img2 ? "image1" : ""}
          </div>
        </label>
        <input
          type="file"
          accept="image/*"
          id="image2"
          onChange={selectImage2}
        />
        <label htmlFor="image2">
          <div
            style={{ backgroundImage: `url(${imagePreview2 || updateImg.img3})` }}
            className="sub-image-container"
          >
            {!imagePreview && !updateImg.img3 ? "image2" : ""}
          </div>
        </label>
        <input
          type="file"
          accept="image/*"
          id="image3"
          onChange={selectImage3}
        />
        <label htmlFor="image3">
          <div
            style={{ backgroundImage: `url(${imagePreview3 || updateImg.img4})` }}
            className="sub-image-container"
          >
            {!imagePreview && !updateImg.img4  ? "image3" : ""}
          </div>
        </label>
      </div>
    </div>
  );
}

export default AdminSelectImage;
