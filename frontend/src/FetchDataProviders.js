import axios from "axios";

export const CreateOrderProvider = async (pid, prise) => {
  let orderObj = {
    item: pid,
    quantity: 1,
    prise: parseInt(prise),
  };
  let res = await axios.post(`${process.env.REACT_APP_BASE_URL}/create-order`, [
    orderObj,
  ]);
  return res.data;
};

export const AddToCartProvider = async (pid, prise) => {
  let res = await axios.post(`${process.env.REACT_APP_BASE_URL}/addtocart`, {
    pid: pid,
    prise: parseInt(prise),
  });
  return res.data;
};

export const AddToFavoritesProvider = async (pid) => {
  let res = await axios.post(
    `${process.env.REACT_APP_BASE_URL}/addtofavorites`,
    { item: pid }
  );
  return res.data;
};