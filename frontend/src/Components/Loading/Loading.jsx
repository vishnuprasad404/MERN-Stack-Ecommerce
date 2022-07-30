import React from "react";
import "./Loading.css";

export function Loading(props) {
  const { style, iconSize, color, iconSpace } = props;
  return (
    <div className="loading" style={style}>
      <div class="dots-container">
        <div
          style={{
            width: iconSize,
            height: iconSize,
            color: color,
            margin: iconSpace,
          }}
          class="pulse-dot pulse-dot-1"
        ></div>
        <div
          style={{
            width: iconSize,
            height: iconSize,
            color: color,
            margin: iconSpace,
          }}
          class="pulse-dot pulse-dot-2"
        ></div>
        <div
          style={{
            width: iconSize,
            height: iconSize,
            color: color,
            margin: iconSpace,
          }}
          class="pulse-dot pulse-dot-3"
        >
          {" "}
        </div>
      </div>
    </div>
  );
}
