import { useContext } from "react";
import { Store } from "../context/StoreContext";

export const useStore = () => {
  const { state, dispatch } = useContext(Store);
  return { state, dispatch };
};
