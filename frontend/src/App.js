import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage/HomePage";
import SigninPage from "./Pages/SigninPage/SigninPage";
import SignupPage from "./Pages/SignupPage/SignupPage";
import ErrorPage from "./Pages/ErrorPage/ErrorPage";
import ProductsPage from "./Pages/ProductsPage/ProductsPage";
import ViewProductPage from "./Pages/ViewProductPage/ViewProductPage";
import CartPage from "./Pages/CartPage/CartPage";
import OrdersPage from "./Pages/OrdersPage/OrdersPage";
import FavoritesPage from "./Pages/FavoritesPage/FavoritesPage";
import AccountPage from "./Pages/AccountPage/AccountPage";
import AdminPage from "./Pages/AdminPage/AdminPage";
import AdminLoginPage from "./Pages/AdminLoginPage/AdminLoginPage";
import AdminAddProduct from "./Components/AdminManageProduct/AdminManageProduct";
import AdminDashboard from "./Components/AdminDashboard/AdminDashboard";
import AdminViewOrders from "./Components/AdminViewOrders/AdminViewOrders";
import AdminViewProducts from "./Components/AdminViewProducts/AdminViewProducts";
import AdminViewUsers from "./Components/AdminViewUsers/AdminViewUsers";
import OrderProductPage from "./Pages/OrderProductPage/OrderProductPage";
import DeliveryAddressPage from "./Pages/DeliveryAddressPage/DeliveryAddressPage";
import { useEffect } from "react";
import axios from "axios";
import OrderPlacedNotifyPage from "./Pages/OrderPlacedNotifyPage/OrderPlacedNotifyPage";
import OrdersItemDetailPage from "./Pages/OrdersItemDetailPage/OrdersItemDetailPage";
import EmailVerificationStatusPage from "./Pages/EmailVerificationStatusPage/EmailVerificationStatusPage";
import ForgetPassRequestPage from "./Pages/ForgetPassRequestPage/ForgetPassRequestPage";
import PasswordResetPage from "./Pages/PasswordResetPage/PasswordResetPage";
import { ScrollToTop } from "./ScrollToTop";
import { useStore } from "./Hooks/useStore";

function App() {
  const { state, dispatch } = useStore();
  const { user, admin } = state;

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/admin`).then((res) => {
      dispatch({
        type: "ADD_ADMIN",
        payload: res.data.isLoggedIn,
      });
    });
    axios.get(`${process.env.REACT_APP_BASE_URL}/user`).then((res) => {
      dispatch({
        type: "ADD_USER",
        payload: res.data,
      });
    });
  }, [dispatch]);

  return (
    <div className="App">
      <ScrollToTop />
      <Routes>
        <Route
          path="/admin-login"
          element={admin ? <AdminPage /> : <AdminLoginPage />}
        />
        <Route
          path="/admin"
          element={admin ? <AdminPage /> : <AdminLoginPage />}
        >
          <Route path="" element={<AdminDashboard />} />
          <Route path="orders" element={<AdminViewOrders />} />
          <Route path="products" element={<AdminViewProducts />} />
          <Route path="product/:action" element={<AdminAddProduct />} />
          <Route path="users" element={<AdminViewUsers />} />
        </Route>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={!user ? <SignupPage /> : <HomePage />} />
        <Route path="/signin" element={!user ? <SigninPage /> : <HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ViewProductPage />} />
        <Route path="/cart" element={user ? <CartPage /> : <SigninPage />} />
        <Route
          path="/orders"
          element={user ? <OrdersPage /> : <SigninPage />}
        />
        <Route
          path="/view-order-product/:orderId/:productId"
          element={user ? <OrdersItemDetailPage /> : <SigninPage />}
        />
        <Route
          path="/favorites"
          element={user ? <FavoritesPage /> : <SigninPage />}
        />
        <Route
          path="/account"
          element={user ? <AccountPage /> : <SigninPage />}
        />
        <Route
          path="/delivery-address"
          element={user ? <DeliveryAddressPage /> : <SigninPage />}
        />
        <Route
          path="/checkout/:OrderId"
          element={user ? <OrderProductPage /> : <SigninPage />}
        />
        <Route
          path="/order-placed-successfully/:OrderId"
          element={user ? <OrderPlacedNotifyPage /> : <SigninPage />}
        />
        <Route
          path="/user/verify-email/:email"
          element={<EmailVerificationStatusPage />}
        />
        <Route
          path="/user/password-reset"
          element={<ForgetPassRequestPage />}
        />
        <Route
          path="/user/password-reset/create-password/:userId/:verificationToken"
          element={<PasswordResetPage />}
        />

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
}

export default App;
