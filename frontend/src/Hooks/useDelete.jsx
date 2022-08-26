import axios from "axios";
import { useState } from "react";

export const useDelete = () => {
  const [loading, seLoading] = useState(false);

  const execute = (endPoint, { data }, callback) => {
    seLoading(true);
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}${endPoint}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
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
