import React, { useEffect, useState } from "react";
import "./DeliveryAddressPage.css";
import Navbar from "../../Components/Navbar/Navbar";
import DeliveryAddressForm from "../../Components/DeliveryAddressForm/DeliveryAddressForm";
import DeliveryAddressContainer from "../../Components/DeliveryAddressContainer/DeliveryAddressContainer";
import {GetDeliveryAddressProvider} from '../../ApiRenderController'

function DeliveryAddressPage() {
  const [shippingAddress, setShippingAddress] = useState({});
  useEffect(() => {
    getShippingAddress()
  });

  const getShippingAddress=async()=>{
    let res = await GetDeliveryAddressProvider()
    setShippingAddress(res)
  }

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
