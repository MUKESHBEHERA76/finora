import axios from "axios";
import Cookies from "js-cookie";
import API_CONFIG from "../config";

export const getTransactions = async ({ filter, startDate, endDate }) => {
  try {
    const token = Cookies.get("token");
    const user = Cookies.get("user"); // saved as JSON
    const email = user ? JSON.parse(user).email : null;
    const application = API_CONFIG.APPLICATION_NAME;

    if (!token || !email) {
      throw new Error("Missing token or Email");
    }

    const params = { filter, email, application };
    if (filter === "custom") {
      if (!startDate || !endDate) throw new Error("Start date and end date required for custom filter");
      params.startdate = startDate;
      params.endDate = endDate;
    }

    const response = await axios.get(
      `${API_CONFIG.BASE_URL}${API_CONFIG.GET_TRANSACTIONS}`,
      {
        params,
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data;
  } catch (error) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error(error.message || "Unknown error occurred");
  }
};
