import React from "react";
import "./Notification.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faCircleInfo,
  faExclamationCircle,
  faWarning,
} from "@fortawesome/free-solid-svg-icons";

function Notification({ style, status ,parentStyle}) {
  return (
    <div className="notification-container position-fixed" style={parentStyle}>
      <div
        className={`alert notification ${
          status.type === "SUCCESS"
            ? "alert-success"
            : status.type === "WARNING"
            ? "alert-warning"
            : status.type === "INFO"
            ? "alert-primary"
            : status.type === "DANGER"
            ? "alert-danger"
            : "alert-info"
        } alert-dismissible fade show`}
        role="alert"
        style={{ ...style, display: status.display }}
      >
        <FontAwesomeIcon
          icon={
            status.type === "SUCCESS"
              ? faCheckCircle
              : status.type === "WARNING"
              ? faWarning
              : status.type === "INFO"
              ? faCircleInfo
              : status.type === "DANGER"
              ? faExclamationCircle
              : faCheckCircle
          }
          className="notification-icon"
        />
        {status.text}
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="alert"
        ></button>
      </div>
    </div>
  );
}

export default Notification;
