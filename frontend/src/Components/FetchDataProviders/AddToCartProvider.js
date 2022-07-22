import axios from "axios";
import { Store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { Notify } from "../Notification/Notification";
// import { EContextData } from "../../EContextData.js";
// import { useContext } from "react";
// import { useNavigate } from "react-router-dom";

export async function AddToCartProvider(pid, prise) {
  axios
    .post(`${process.env.REACT_APP_BASE_URL}/addtocart`, {
      pid: pid,
      prise: parseInt(prise),
    })
    .then((res) => {
      console.log(res.data);
      if (res.data.inCart) {
        Store.addNotification({
          content: Notify("Item already in cart", "INFO"),
          type: "info",
          width: "100px",
          container: "top-right",
          dismiss: {
            duration: 2000,
          },
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          
        });
      }
      if (res.data.itemAdded) {
        Store.addNotification({
          content: Notify("Item added to cart", "SUCCESS"),
          type: "success",
          width: "300px",
          insert: "top",
          container: "top-right",
          dismiss: {
            duration: 2000,
          },
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
        });
      }
    });

}
