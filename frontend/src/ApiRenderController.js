import axios from "axios";
let cancelToken;
cancelToken = axios.CancelToken.source();

//------------create a order from user start------------//
export const CreateOrderProvider = async (orderProduct) => {
  let res = await axios.post(
    `${process.env.REACT_APP_BASE_URL}/create-order`,
    orderProduct
  );
  return res.data;
};
//------------create a order from user end------------//

//------------add item to users cart api start-------------//
export const AddToCartProvider = async (pid, prise) => {
  let res = await axios.post(
    `${process.env.REACT_APP_BASE_URL}/addtocart`,
    {
      pid: pid,
      prise: parseInt(prise),
    },
    { cancelToken: cancelToken.token }
  );
  return res.data;
};
//------------add item to users cart api end-------------//

//------------add item to users wishlist api start-------------//
export const AddToFavoritesProvider = async (pid) => {
  let res = await axios.post(
    `${process.env.REACT_APP_BASE_URL}/addtofavorites`,
    { item: pid },
    { cancelToken: cancelToken.token }
  );
  return res.data;
};
//------------add item to users wishlist api end-------------//

// get temp order start //

export const GetOrderProvider = async (order_id) => {
  let res = await axios.get(
    `${process.env.REACT_APP_BASE_URL}/get-order/${order_id}`,
    { cancelToken: cancelToken.token }
  );
  return res.data;
};

// get temp order end //

// get delivery address start //

export const GetDeliveryAddressProvider = async () => {
  let res = await axios.get(
    `${process.env.REACT_APP_BASE_URL}/getshippingaddress`,
    { cancelToken: cancelToken.token }
  );
  return res.data;
};

//get deliver address end //

// add delivery address start //

export const AddDeliverAddressProvider = async (data) => {
  let res = await axios.post(
    `${process.env.REACT_APP_BASE_URL}/addshippingaddress`,
    data,
    { cancelToken: cancelToken.token }
  );
  return res.data;
};

// add delivery address end //

// get all user orders start //

export const GetAllOrdersProvider = async () => {
  let res = await axios.get(
    `${process.env.REACT_APP_BASE_URL}/user/get-orders`,
    { cancelToken: cancelToken.token }
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
  let res = await axios.put(
    `${process.env.REACT_APP_BASE_URL}/change-order-item-quantity/${id}/${item}/${prise}/${quantity}`,
    { cancelToken: cancelToken.token }
  );
  return res.data;
};

// change order products item quantity end //

// remove Checkout item from order start//

export const RemoveCheckoutItemProvider = async (order_id, item_id) => {
  const res = await axios.delete(
    `${process.env.REACT_APP_BASE_URL}/remove-checkout-item/${order_id}/${item_id}`,
    { cancelToken: cancelToken.token }
  );
  return res.data
};

// remove Checkout item from order end//

// get user own review start //

export const GetUserOwnReviewProvider = async (pid) => {
  let res = await axios.get(
    `${process.env.REACT_APP_BASE_URL}/user/review/${pid}`,
    { cancelToken: cancelToken.token }
  );
  return res.data;
};

// get user own review end //

// add review by user start //

export const AddProductReviewProvider = async (data) => {
  let res = await axios.post(
    `${process.env.REACT_APP_BASE_URL}/add-review`,
    data,
    { cancelToken: cancelToken.token }
  );
  return res.data;
};

// add review by user end //

// register user or signup  start

export const RegisterUserProvider = async (data) => {
  let res = await axios.post(
    `${process.env.REACT_APP_BASE_URL}/user/signup`,
    data,
    { cancelToken: cancelToken.token }
  );
  return res.data;
};

//register user end

// login user or sign in user start

export const LoginUserProvider = async (data) => {
  let res = await axios.post(
    `${process.env.REACT_APP_BASE_URL}/user/signin`,
    data,
    { cancelToken: cancelToken.token }
  );
  return res.data;
};

// login user or sign in user end

// logout user start //

export const LogoutUserProvider = async () => {
  let res = await axios.get(`${process.env.REACT_APP_BASE_URL}/signout`, {
    cancelToken: cancelToken.token,
  });
  return res.data;
};

//logout user end

// checkout products start //

export const CheckoutProductsProvider = async (
  product_id,
  total,
  payment_methord
) => {
  let res = await axios.put(
    `${process.env.REACT_APP_BASE_URL}/place-order/${product_id}/${total}/${payment_methord} `,
    { cancelToken: cancelToken.token }
  );
  return res.data;
};

// checkout products end //

//get users wishlist start //

export const GetAllWishlistProvider = async () => {
  let res = await axios.get(`${process.env.REACT_APP_BASE_URL}/getfavorites`, {
    cancelToken: cancelToken.token,
  });
  return res.data;
};
// get users wishlist end //

// remove favorites item start //

export const RemoveFavoritesProvider = async (id) => {
  let res = await axios.delete(
    `${process.env.REACT_APP_BASE_URL}/removefavoriteitem/${id}`,
    { cancelToken: cancelToken.token }
  );
  return res.data;
};

// remove favorites item end //

//remove cart item start //

export const RemoveCartItemProvider = async (cid, pid) => {
  let res = await axios.delete(
    `${process.env.REACT_APP_BASE_URL}/deletecartitem/${cid}/${pid}`,
    { cancelToken: cancelToken.token }
  );
  return res.data;
};

//remove cart item end //

// manage cart quantity start //

export const ManageCartItemQuantityProvider = async (
  cid,
  pid,
  quantity,
  prise
) => {
  await axios.put(
    `${process.env.REACT_APP_BASE_URL}/managequantity/${cid}/${pid}/${quantity}/${prise}`,
    { cancelToken: cancelToken.token }
  );
};

// manage cart quantity end //

// get users cart product start //

export const GetAllCartProductProvider = async () => {
  let res = await axios.get(
    `${process.env.REACT_APP_BASE_URL}/getcartproducts`,
    { cancelToken: cancelToken.token }
  );
  return res.data;
};

// get users cart product end //

//get users cart total start //

export const GetCartTotalProvider = async () => {
  let res = await axios.get(`${process.env.REACT_APP_BASE_URL}/getcarttotal`, {
    cancelToken: cancelToken.token,
  });
  return res.data;
};

//get users cart total end //

// cancel ordered product start//

export const CancelOrderProvider = async (order_id, pid, quantity) => {
  let res = await axios.delete(
    `${process.env.REACT_APP_BASE_URL}/user/cancel-order/${order_id}/${pid}/${quantity}`,
    { cancelToken: cancelToken.token }
  );
  return res.data;
};

// cancel ordered product end//

//----------------------------admin get data---------------------//

export const AdminGetAllOrdersProvider = async () => {
  let res = await axios.get(`${process.env.REACT_APP_BASE_URL}/admin/orders`, {
    cancelToken: cancelToken.token,
  });
  return res.data;
};
