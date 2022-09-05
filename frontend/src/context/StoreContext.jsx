import { useEffect } from "react";
import { createContext, useReducer } from "react";
import { useFetch } from "../Hooks/useFetch";

export const Store = createContext();

const InitialState = {
  admin: false,
  user: false,
  deliveryAddress: {},
  cart: [],
};
const reducer = (state, action) => {  
  switch (action.type) {
    case "ADD_USER":
      return { ...state, user: action.payload };
    case "REMOVE_USER":
      return { ...state, user: action.payload };
    case "ADD_ADMIN":
      return { ...state, admin: action.payload };
    case "ADD_TO_CART":
      return { ...state, cart: [...state.cart, ...action.payload] };
    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((c) => {
          return c.item !== action.payload.id;
        }),
      };
    case "REMOVE_ALL_FROM_CART":
      return {
        ...state,
        cart: action.payload,
      };
    case "SET_ADDRESS":
      return { ...state, deliveryAddress: action.payload };
    default:
      return state;
  }
};

export const StoreContext = ({ children }) => {
  const { data: cart } = useFetch("/getcartproducts");
  const { data: deliveryAddress } = useFetch("/getshippingaddress");
  useEffect(() => {
    if (cart.length > 0) {
      dispatch({
        type: "ADD_TO_CART",
        payload: cart,
      });
    }
    dispatch({
      type: "SET_ADDRESS",
      payload: deliveryAddress,
    });
  }, [cart, deliveryAddress]);

  const [state, dispatch] = useReducer(reducer, InitialState);
  return (
    <Store.Provider value={{ state, dispatch }}>{children}</Store.Provider>
  );
};
