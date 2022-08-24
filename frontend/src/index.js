import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { StoreContext } from "./context/StoreContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StoreContext>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StoreContext>
);
