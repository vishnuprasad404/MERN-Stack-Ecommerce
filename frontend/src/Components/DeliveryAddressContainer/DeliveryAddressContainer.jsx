import React from "react";
import "./DeliveryAddressContainer.css";

function DeliveryAddressContainer(props) {
  const { name, number, pincode, address, state } = props;
  return (
    <div className="delivery-address-list">
      <p>Details :</p>
      <p>
        {name} <span style={{ marginLeft: "15px" }}>{number}</span>
      </p>
      <p>
        {address},{state}-{pincode}
      </p>
    </div>
  );
}

export default DeliveryAddressContainer;
