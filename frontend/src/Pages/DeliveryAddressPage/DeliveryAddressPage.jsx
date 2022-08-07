import React, { useEffect, useState } from "react";
import "./DeliveryAddressPage.css";
import Navbar from "../../Components/Navbar/Navbar";
import DeliveryAddressForm from "../../Components/DeliveryAddressForm/DeliveryAddressForm";
import DeliveryAddressContainer from "../../Components/DeliveryAddressContainer/DeliveryAddressContainer";
import { GetDeliveryAddressProvider } from "../../ApiRenderController";
import { SmallLoading } from "../../Components/Loading/Loading";

function DeliveryAddressPage() {
  const [shippingAddress, setShippingAddress] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    getShippingAddress();
  });

  const getShippingAddress = async () => {
    let res = await GetDeliveryAddressProvider();
    setShippingAddress(res);
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="delivery-address-page">
        <div className="delivery-address-page-form-container">
          <DeliveryAddressForm />
        </div>
        <div className="delivery-address-list-container">
          <h3>Delivery Address</h3>
          {loading ? (
            <SmallLoading smallLoadingStyle={{ marginTop: "20px" }} />
          ) : shippingAddress ? (
            <DeliveryAddressContainer
              name={shippingAddress.name}
              phone={shippingAddress.mobile}
              address={shippingAddress.address}
              state={shippingAddress.state}
              pincode={shippingAddress.pincode}
            />
          ) : null}
        </div>
      </div>
    </>
  );
}

export default DeliveryAddressPage;
