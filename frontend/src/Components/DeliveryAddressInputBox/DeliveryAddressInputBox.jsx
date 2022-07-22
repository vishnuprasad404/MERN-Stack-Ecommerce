import React from "react";
import "./DeliveryAddressInputBox.css";

function DeliveryAddressInputBox(props) {
  const { placeholder, register, registerName, required, defValue, label } =
    props;
  return (
    <div className="delivery-address-input-box">
      <input
        type="text"
        placeholder={placeholder}
        defaultValue={defValue}
        {...register(registerName, { required: required })}
      />
      <label>{label}</label>
    </div>
  );
}

export default DeliveryAddressInputBox;
