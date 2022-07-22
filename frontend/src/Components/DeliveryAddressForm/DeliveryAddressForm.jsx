import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "./DeliveryAddressForm.css";
import DeliveryAddressInputBox from "../../Components/DeliveryAddressInputBox/DeliveryAddressInputBox";
import axios from "axios";

function DeliveryAddressForm() {
  const [shippingAddress, setShippingAddress] = useState({});
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/getshippingaddress`)
      .then((res) => {
        setShippingAddress(res.data);
      });
  });

  const onSaveAddress = (data) => {
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/addshippingaddress`, data)
      .then((res) => {});
  };

  return (
    <div className="delivery-address-form">
      <form onSubmit={handleSubmit(onSaveAddress)}>
        <h2>Delivery Address</h2>
        <div className="inp-pair">
          <div className="inp-container">
            <DeliveryAddressInputBox
              placeholder={shippingAddress ? shippingAddress.name : "Full Name"}
              register={register}
              registerName="name"
              required={true}
              label="Full Name"
            />
            <error className="err">
              {errors.name?.type === "required" && `* Full Name is required`}
            </error>
          </div>

          <div className="inp-container">
            <DeliveryAddressInputBox
              placeholder={
                shippingAddress ? shippingAddress.mobile : "Mobile Number"
              }
              register={register}
              registerName="mobile"
              required={true}
              label="Mobile Number"
            />
            <error className="err">
              {errors.mobile?.type === "required" &&
                `* Mobile number is required`}
            </error>
          </div>
        </div>
        <div className="inp-pair">
          <div className="inp-container">
            <DeliveryAddressInputBox
              placeholder={
                shippingAddress ? shippingAddress.pincode : "Pincode"
              }
              register={register}
              registerName="pincode"
              required={true}
              label="Pincode"
            />
            <error className="err">
              {errors.pincode?.type === "required" && `* Pin Code is required`}
            </error>
          </div>
          <div className="inp-container">
            <DeliveryAddressInputBox
              register={register}
              registerName="locality"
              required={true}
              placeholder={
                shippingAddress ? shippingAddress.locality : "Locality"
              }
              label="Locality"
            />
            <error className="err">
              {errors.locality?.type === "required" &&
                `* Locality number is required`}
            </error>
          </div>
        </div>
        <div className="inp-container">
          <textarea
            {...register("address", { required: true })}
            placeholder={
              shippingAddress
                ? shippingAddress.address
                : "Address (Area and Street) & House No"
            }
          ></textarea>
          <br />

          <error className="err">
            {errors.address?.type === "required" &&
              "* Address number is required"}
          </error>
        </div>

        <div className="inp-pair">
          <div className="inp-container">
            <DeliveryAddressInputBox
              register={register}
              registerName="district"
              required={true}
              placeholder={
                shippingAddress
                  ? shippingAddress.district
                  : "City/District/Town"
              }
              label="District"
            />

            <error className="err">
              {errors.district?.type === "required" &&
                `* This Field is required`}
            </error>
          </div>
          <div className="inp-container">
            <select
              className="select-state "
              {...register("state", { required: true })}
            >
              <option value="">State</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Andaman and Nicobar Islands">
                Andaman and Nicobar Islands
              </option>
              <option value="Arunachal Pradesh">Arunachal Pradesh</option>
              <option value="Assam">Assam</option>
              <option value="Bihar">Bihar</option>
              <option value="Chandigarh">Chandigarh</option>
              <option value="Chhattisgarh">Chhattisgarh</option>
              <option value="Dadar and Nagar Haveli">
                Dadar and Nagar Haveli
              </option>
              <option value="Daman and Diu">Daman and Diu</option>
              <option value="Delhi">Delhi</option>
              <option value="Lakshadweep">Lakshadweep</option>
              <option value="Puducherry">Puducherry</option>
              <option value="Goa">Goa</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Haryana">Haryana</option>
              <option value="Himachal Pradesh">Himachal Pradesh</option>
              <option value="Jammu and Kashmir">Jammu and Kashmir</option>
              <option value="Jharkhand">Jharkhand</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Kerala">Kerala</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Manipur">Manipur</option>
              <option value="Meghalaya">Meghalaya</option>
              <option value="Mizoram">Mizoram</option>
              <option value="Nagaland">Nagaland</option>
              <option value="Odisha">Odisha</option>
              <option value="Punjab">Punjab</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Sikkim">Sikkim</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Telangana">Telangana</option>
              <option value="Tripura">Tripura</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Uttarakhand">Uttarakhand</option>
              <option value="West Bengal">West Bengal</option>
            </select>
            <br />
            {/* <div className="pt-"> */}
            <error className="err">
              {errors.state?.type === "required" && `* This Field is required`}
            </error>
            {/* </div> */}
          </div>
        </div>

        <div className="inp-pair">
          <div className="inp-container">
            <DeliveryAddressInputBox
              register={register}
              registerName="landmark"
              required={false}
              label="Landmark"
              placeholder={
                shippingAddress
                  ? shippingAddress.landmark
                  : "Land Mark (Optional)"
              }
            />
          </div>
          <div className="inp-container no-er">
            <DeliveryAddressInputBox
              register={register}
              registerName="altPhone"
              required={false}
              label="Alternate Phone Number"
              placeholder={
                shippingAddress
                  ? shippingAddress.altPhone
                  : "Altranate Phone (Optional)"
              }
            />
          </div>
        </div>

        <button type="submit">
          {shippingAddress ? "Update Address" : "Add Address"}
        </button>
      </form>
    </div>
  );
}

export default DeliveryAddressForm;
