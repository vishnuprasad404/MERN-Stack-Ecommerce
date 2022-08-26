import axios from "axios";
import { useEffect, useState } from "react";

export const useFetch = (endPoint) => {
  const [fetchData, setFetchData] = useState({
    loading: true,
    data: [],
    error: undefined,
  });

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}${endPoint}`)
      .then((response) => {
        setFetchData({
          loading: false,
          data: response.data,
          error: undefined,
        });
      })
      .catch((error) => {
        console.log(error);
        setFetchData({
          loading: false,
          data: [],
          error: error.message,
        });
      });
  }, [endPoint]);

  return { ...fetchData };
};
