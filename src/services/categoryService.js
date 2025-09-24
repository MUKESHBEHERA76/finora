import axios from "axios";
import Cookies from "js-cookie";
import API_CONFIG from "../config";

export const getCategories = async () => {
  try {
    const token = Cookies.get("token");
    const user = Cookies.get("user"); // saved as JSON
    const userID = user ? JSON.parse(user).email : null;
    const application=`${API_CONFIG.APPLICATION_NAME}`

    if (!token || !userID) {
      throw new Error("Missing token or userID");
    }

    const response = await axios.get(
      `${API_CONFIG.BASE_URL}${API_CONFIG.GET_CATEGORIES}`,
      {
        params: { userID,application },
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
