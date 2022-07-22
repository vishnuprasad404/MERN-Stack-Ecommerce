import React, { useEffect, useState } from "react";
import "./DeliveryAddressPage.css";
import Navbar from "../../Components/Navbar/Navbar";
import DeliveryAddressForm from "../../Components/DeliveryAddressForm/DeliveryAddressForm";
import DeliveryAddressContainer from "../../Components/DeliveryAddressContainer/DeliveryAddressContainer";
import axios from "axios";

function DeliveryAddressPage() {
  const [shippingAddress, setShippingAddress] = useState({});
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/getshippingaddress`)
      .then((res) => {
        setShippingAddress(res.data);
      });
  });
  return (
    <>
      <Navbar />
      <div className="delivery-address-page">
        <div className="delivery-address-page-form-container">
          <DeliveryAddressForm />
        </div>
        <div className="delivery-address-list-container">
          {shippingAddress ? <DeliveryAddressContainer
            name={shippingAddress.name}
            phone={shippingAddress.mobile}
            address={shippingAddress.address}
            state={shippingAddress.state}
            pincode={shippingAddress.pincode}
          /> : null}
        </div>
      </div>
    </>
  );
}

export default DeliveryAddressPage;
