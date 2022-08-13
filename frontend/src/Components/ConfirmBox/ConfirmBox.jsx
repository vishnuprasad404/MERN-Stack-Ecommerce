import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import "./ConfirmBox.css";

function ConfirmBox({ text, open, onClose, onDialog }) {
  if (!open) {
    return null;
  }
  return (
    <div onClick={onClose} className="overlay">
      <div className="model-container" onClick={(e) => e.stopPropagation()}>
        <h6 className="model-text">{text}</h6>
        <FontAwesomeIcon
          icon={faClose}
          className="model-small-close-btn"
          onClick={onClose}
        />
        <button
          className="model-btn cancel-btn"
          onClick={() => onDialog(false)}
        >
          Cancel
        </button>
        <button
          className="model-btn continue-btn"
          onClick={() => onDialog(true)}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default ConfirmBox;
