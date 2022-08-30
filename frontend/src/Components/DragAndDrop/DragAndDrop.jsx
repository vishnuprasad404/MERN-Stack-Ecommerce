import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import "./DragAndDrop.css";

function DragAndDrop({ files, setFiles, count = 4 }) {
  const inputRef = useRef(null);
  const [isdragOver, setIsdragOver] = useState(false);
  const [imageError, setImageError] = useState();

  const addFiles = (fileList) => {
    if (fileList.length <= count && files.length < count) {
        setImageError(null)
      for (let i = 0; i < fileList.length; i++) {
        setFiles((current) => [...current, fileList[i]]);
      }
    }else{
        setImageError({
            message : "A product contain maximum four images!"
        })
    }
  };

  const removeFile = (selectedIndex) => {
    console.log(files);
    files.splice(selectedIndex, 1);
    setFiles([...files]);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsdragOver(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsdragOver(false);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsdragOver(true);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addFiles([...e.dataTransfer.files]);
    setIsdragOver(false);
  };

  return (
    <React.Fragment>
      <div
        className={`dragndrop ${isdragOver ? "dragOverActive" : null}`}
        onClick={() => inputRef.current.click()}
        onDrop={(e) => handleDrop(e)}
        onDragOver={(e) => handleDragOver(e)}
        onDragEnter={(e) => handleDragEnter(e)}
        onDragLeave={(e) => handleDragLeave(e)}
      >
        <span className="inner">
          Drag & drop or images or <span className="browse">Browse</span>{" "}
        </span>
        <input
          type="file"
          name="images"
          multiple
          className="file-input"
          onChange={(e) => addFiles([...e.target.files])}
          ref={inputRef}
        />
      </div>
      <div className="image-preview-container">
        {files &&
          files.map((itm, key) => {
            let preview = URL.createObjectURL(itm);
            return (
              <div
                className="image-preview"
                key={key}
                //    style={{backgroundImage: `url(${preview})`}}
              >
                <FontAwesomeIcon
                  icon={faClose}
                  className="remove-icon"
                  onClick={() => removeFile(key)}
                />
                <img src={preview} alt="" />
              </div>
            );
          })}
      </div>
      <span className="image-error">{imageError && imageError.message}</span>
    </React.Fragment>
  );
}

export default DragAndDrop;
