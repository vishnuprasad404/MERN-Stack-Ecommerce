import React from "react";
import "./Loading.css";

export function Loading({ style, iconSize, color, iconSpace }) {
  return (
    <div className="loading" style={style}>
      <div className="dots-container">
        <div
          style={{
            width: iconSize,
            height: iconSize,
            background: color,
            margin: iconSpace,
          }}
          className="pulse-dot pulse-dot-1"
        ></div>
        <div
          style={{
            width: iconSize,
            height: iconSize,
            background: color,
            margin: iconSpace,
          }}
          className="pulse-dot pulse-dot-2"
        ></div>
        <div
          style={{
            width: iconSize,
            height: iconSize,
            background: color,
            margin: iconSpace,
          }}
          className="pulse-dot pulse-dot-3"
        >
          {" "}
        </div>
      </div>
    </div>
  );
}

export function SmallLoading({ smallLoadingStyle }) {
  return (
    <div className="spinner-container" style={smallLoadingStyle}>
      <div className="spinner"></div>
    </div>
  );
}
