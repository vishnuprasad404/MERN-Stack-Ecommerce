import React from "react";
import "./Notification.css";
import { ReactNotifications } from "react-notifications-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faExclamationCircle,
  faInfo,
} from "@fortawesome/free-solid-svg-icons";

function Notification() {
  return (
    <div className="notification">
      <ReactNotifications />
    </div>
  );
}

export function Notify(text, type) {
  return (
    <div
      className="notify"
      style={{
        color: `${
          type === "SUCCESS"
            ? "rgb(81, 255, 0)"
            : type === "INFO"
            ? "rgb(81, 185, 255)"
            : "rgb(255, 30, 0)"
        }`,
      }}
    >
      <FontAwesomeIcon
        icon={
          type === "SUCCESS"
            ? faCheckCircle
            : type === "INFO"
            ? faInfo
            : faExclamationCircle
        }
      />
      <span>{text}</span>
    </div>
  );
}

export default Notification;
