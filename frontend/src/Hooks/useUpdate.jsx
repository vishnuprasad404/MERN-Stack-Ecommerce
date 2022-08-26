import axios from "axios";
import { useState } from "react";

export const useUpdate = () => {
  const [loading, seLoading] = useState(false);

  const execute = (endPoint, { data }, callback) => {
    seLoading(true);
    axios
      .put(`${process.env.REACT_APP_BASE_URL}${endPoint}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          "content-type": "application/json",
        },
      })
      .then((result) => {
        seLoading(false);
        callback(result.data, null);
      })
      .catch((error) => {
        seLoading(false);
        callback(null, error.message);
      });
  };

  return { loading, execute };
};
