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
      <select className="delivery-address-list-action fas fa-bars">
        <option value=""></option>
        <option value="default">Set as default</option>
        <option value="remove">Remove</option>
        <option value="edit">Eidt</option>
      </select>
    </div>
  );
}

export default DeliveryAddressContainer;
