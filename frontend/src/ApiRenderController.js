import axios from "axios";

//------------create a order from user start------------//
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
//------------create a order from user end------------//

//------------add item to users cart api start-------------//
export const AddToCartProvider = async (pid, prise) => {
  let res = await axios.post(`${process.env.REACT_APP_BASE_URL}/addtocart`, {
    pid: pid,
    prise: parseInt(prise),
  });
  return res.data;
};
//------------add item to users cart api end-------------//

//------------add item to users wishlist api start-------------//
export const AddToFavoritesProvider = async (pid) => {
  let res = await axios.post(
    `${process.env.REACT_APP_BASE_URL}/addtofavorites`,
    { item: pid }
  );
  return res.data;
};
//------------add item to users wishlist api end-------------//

// get temp order start //

export const GetOrderProvider = async (order_id) => {
  let res = await axios.get(
    `${process.env.REACT_APP_BASE_URL}/get-order/${order_id}`
  );
  return res.data;
};

// get temp order end //

// get delivery address start //

export const GetDeliveryAddressProvider = async () => {
  let res = await axios.get(
    `${process.env.REACT_APP_BASE_URL}/getshippingaddress`
  );
  return res.data;
};

//get deliver address end //

// add delivery address start //

export const AddDeliverAddressProvider = async (data) => {
  let res = await axios.post(
    `${process.env.REACT_APP_BASE_URL}/addshippingaddress`,
    data
  );
  return res.data
};

// add delivery address end //

// get all user orders start //

export const GetAllOrdersProvider = async () => {
  let res = await axios.get(
    `${process.env.REACT_APP_BASE_URL}/user/get-orders`
  );
  return res.data;
};

// get all user orders end //

// change order products item quantity start //

export const ChangeOrderQuantityProvider = async (
  id,
  item,
  prise,
  quantity
) => {
  axios.put(
    `${process.env.REACT_APP_BASE_URL}/change-order-item-quantity/${id}/${item}/${prise}/${quantity}`
  );
};

// change order products item quantity end //

// remove Checkout item from order start//

export const RemoveCheckoutItemProvider = async (order_id, item_id) => {
  axios.delete(
    `${process.env.REACT_APP_BASE_URL}/remove-checkout-item/${order_id}/${item_id}`
  );
};

// remove Checkout item from order end//

// get user own review start //

export const GetUserOwnReviewProvider = async (pid) => {
  let res = await axios.get(
    `${process.env.REACT_APP_BASE_URL}/user/review/${pid}`
  );
  return res.data;
};

// get user own review end //

// add review by user start //

export const AddProductReviewProvider = async (data) => {
  let res = axios.post(`${process.env.REACT_APP_BASE_URL}/add-review`, data);
  return res.data;
};

// add review by user end //

// register user or signup  start

export const RegisterUserProvider = async (data) => {
  let res = await axios.post(
    `${process.env.REACT_APP_BASE_URL}/user/signup`,
    data
  );
  return res.data;
};

//register user end

// login user or sign in user start

export const LoginUserProvider = async (data) => {
  let res = await axios.post(
    `${process.env.REACT_APP_BASE_URL}/user/signin`,
    data
  );
  return res.data;
};

// login user or sign in user end

// checkout products start //

export const CheckoutProductsProvider = async (
  product_id,
  total,
  payment_methord
) => {
  let res = await axios.put(
    `${process.env.REACT_APP_BASE_URL}/place-order/${product_id}/${total}/${payment_methord} `
  );
  return res.data;
};

// checkout products end //

//get users wishlist start //

export const GetAllWishlistProvider = async () => {
  let res = await axios.get(`${process.env.REACT_APP_BASE_URL}/getfavorites`);
  return res.data;
};
// get users wishlist end //

// remove favorites item start //

export const RemoveFavoritesProvider = async (id) => {
  await axios.delete(
    `${process.env.REACT_APP_BASE_URL}/removefavoriteitem/${id}`
  );
};

// remove favorites item end //
