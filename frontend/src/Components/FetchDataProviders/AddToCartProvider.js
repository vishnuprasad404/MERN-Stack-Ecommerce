import axios from "axios";
import "react-notifications-component/dist/theme.css";

export async function AddToCartProvider(pid, prise) {
  axios
    .post(`${process.env.REACT_APP_BASE_URL}/addtocart`, {
      pid: pid,
      prise: parseInt(prise),
    })
    .then((res) => {
      console.log(res.data);
      if (res.data.inCart) {

      }
      if (res.data.itemAdded) {
      
      }
    });

}
