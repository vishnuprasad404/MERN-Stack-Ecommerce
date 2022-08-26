import React from "react";
import { useForm } from "react-hook-form";
import "./DeliveryAddressForm.css";
import DeliveryAddressInputBox from "../../Components/DeliveryAddressInputBox/DeliveryAddressInputBox";
import { Loading } from "../../Components/Loading/Loading";
import { usePost } from "../../Hooks/usePost";
import { useStore } from "../../Hooks/useStore";
import { useUpdate } from "../../Hooks/useUpdate";
import { useNavigate, useSearchParams } from "react-router-dom";

function DeliveryAddressForm() {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");
  const nav = useNavigate();
  const { state, dispatch } = useStore();
  const { deliveryAddress } = state;
  const { execute, loading } = usePost("/add/deliveryAddress");
  const { execute: updateAddress, loading: updateAddressLoading } = useUpdate();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSaveAddress = (data) => {
    if (!deliveryAddress) {
      execute({ data: data }, (result) => {
        // after add or update delivery address
        dispatch({
          type: "SET_ADDRESS",
          payload: data,
        });

        if (redirect) {
          nav(redirect);
        }
      });
    } else {
      updateAddress(
        "/update/deliveryAddress",
        { data: data },
        (res, error) => {}
      );
    }
  };

  return (
    <div className="delivery-address-form">
      <form onSubmit={handleSubmit(onSaveAddress)}>
        <div className="inp-pair">
          <div className="inp-container">
            <DeliveryAddressInputBox
              placeholder={deliveryAddress ? deliveryAddress.name : "Full Name"}
              register={register}
              registerName="name"
              required={deliveryAddress ? false : true}
              label="Full Name"
            />
            <span className="address-err">
              {errors.name?.type === "required" && `* Full Name is required`}
            </span>
          </div>

          <div className="inp-container">
            <DeliveryAddressInputBox
              placeholder={
                deliveryAddress ? deliveryAddress.mobile : "Mobile Number"
              }
              register={register}
              registerName="mobile"
              required={deliveryAddress ? false : true}
              label="Mobile Number"
            />
            <span className="address-err">
              {errors.mobile?.type === "required" &&
                `* Mobile number is required`}
            </span>
          </div>
        </div>
        <div className="inp-pair">
          <div className="inp-container">
            <DeliveryAddressInputBox
              placeholder={
                deliveryAddress ? deliveryAddress.pincode : "Pincode"
              }
              register={register}
              registerName="pincode"
              required={deliveryAddress ? false : true}
              label="Pincode"
            />
            <span className="address-err">
              {errors.pincode?.type === "required" && `* Pin Code is required`}
            </span>
          </div>
          <div className="inp-container">
            <DeliveryAddressInputBox
              register={register}
              registerName="locality"
              required={deliveryAddress ? false : true}
              placeholder={
                deliveryAddress ? deliveryAddress.locality : "Locality"
              }
              label="Locality"
            />
            <span className="address-err">
              {errors.locality?.type === "required" &&
                `* Locality number is required`}
            </span>
          </div>
        </div>
        <div className="inp-container">
          <textarea
            {...register("address", {
              required: deliveryAddress ? false : true,
            })}
            placeholder={
              deliveryAddress
                ? deliveryAddress.address
                : "Address (Area and Street) & House No"
            }
          ></textarea>
          <br />

          <span className="address-err">
            {errors.address?.type === "required" &&
              "* Address number is required"}
          </span>
        </div>

        <div className="inp-pair">
          <div className="inp-container">
            <DeliveryAddressInputBox
              register={register}
              registerName="district"
              required={deliveryAddress ? false : true}
              placeholder={
                deliveryAddress
                  ? deliveryAddress.district
                  : "City/District/Town"
              }
              label="District"
            />

            <span className="address-err">
              {errors.district?.type === "required" &&
                `* This Field is required`}
            </span>
          </div>
          <div className="inp-container">
            <select
              className="select-state "
              {...register("state", {
                required: deliveryAddress ? false : true,
              })}
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
            <span className="address-err">
              {errors.state?.type === "required" && `* This Field is required`}
            </span>
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
                deliveryAddress
                  ? deliveryAddress.landmark
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
                deliveryAddress
                  ? deliveryAddress.altPhone
                  : "Altranate Phone (Optional)"
              }
            />
          </div>
        </div>

        <button type="submit">
          {loading || updateAddressLoading ? (
            <Loading style={{ height: "0px" }} iconSpace="5px" iconSize="5px" />
          ) : deliveryAddress ? (
            "Update Address"
          ) : (
            "Add Address"
          )}
        </button>
      </form>
    </div>
  );
}

export default DeliveryAddressForm;
