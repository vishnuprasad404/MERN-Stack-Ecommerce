import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import "./Loading.css";

export function Loading(props) {
  const { width, height, iconSize, color } = props;
  return (
    <div class="loading" style={{ width: `${width}`, height: `${height}` }}>
      <FontAwesomeIcon
        icon={faSpinner}
        className="loading-icon"
        style={{ fontSize: `${iconSize}`, color: `${color}` }}
      />
    </div>
  );
}
