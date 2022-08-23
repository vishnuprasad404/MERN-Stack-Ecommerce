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
    getShippingAddress();
  });

  const getShippingAddress = async () => {
    let res = await GetDeliveryAddressProvider();
    console.log(res);
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
            <SmallLoading
              smallLoadingStyle={{ margin: "30px 0", width: "95%" }}
            />
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
