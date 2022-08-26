import axios from "axios";
import { useState } from "react";

export const usePost = (endPoint) => {
  const [loading, setLoading] = useState(false);

  const execute = ({ data }, callback) => {
    setLoading(true);
    axios
      .post(`${process.env.REACT_APP_BASE_URL}${endPoint}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          "content-type": "application/json",
        },
      })
      .then((result) => {
        setLoading(false);

        callback(result.data, null);
      })
      .catch((error) => {
        setLoading(false);

        callback(null, error.message);
      });
  };

  return { loading, execute };
};
