import axios from "axios";
import Cookies from "js-cookie";
import API_CONFIG from "../config";

export const getDashboardInfo = async () => {
  try {
    const token = Cookies.get("token");
    const user = Cookies.get("user");
    const email = user ? JSON.parse(user).email : null;
    const application = API_CONFIG.APPLICATION_NAME;

    if (!token || !email) {
      throw new Error("Missing token or Email");
    }

    const response = await axios.get(
      `${API_CONFIG.BASE_URL}${API_CONFIG.GET_DASHBOARD_INFO}`,
      {
        params: { email, application },
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data;
  } catch (error) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error(error.message || "Something went wrong, please try after sometime");
  }
};
