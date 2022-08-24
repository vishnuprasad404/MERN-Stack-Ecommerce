import { useEffect } from "react";
import { createContext, useReducer } from "react";
import { useFetch } from "../Hooks/useFetch";

export const Store = createContext();

const InitialState = {
  user: false,
  admin: false,
  cart: [],
};
const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_USER":
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
    default:
      return state;
  }
};

export const StoreContext = ({ children }) => {
  const { data } = useFetch("/getcartproducts");

  useEffect(() => {
    if (data.length > 0) {
      dispatch({
        type: "ADD_TO_CART",
        payload: data,
      });
    }
  }, [data]);

  const [state, dispatch] = useReducer(reducer, InitialState);
  // console.log(state);
  return (
    <Store.Provider value={{ state, dispatch }}>{children}</Store.Provider>
  );
};
