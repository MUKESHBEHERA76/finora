import axios from "axios";
import Cookies from "js-cookie";
import API_CONFIG from "../config";

const getAuthHeaders = () => {
  const token = Cookies.get("token");
  if (!token) throw new Error("Missing token");
  return { Authorization: `Bearer ${token}` };
};

const getUserAppData = () => {
  const user = Cookies.get("user");
  const email = user ? JSON.parse(user).email : null;
  if (!email) throw new Error("Missing user email");
  return { email, application: API_CONFIG.APPLICATION_NAME };
};

export const getTransactions = async ({ filter, startDate, endDate }) => {
  try {
    const { email, application } = getUserAppData();
    const params = { filter, email, application };

    if (filter === "custom") {
      if (!startDate || !endDate) {
        throw new Error("Start date and end date required for custom filter");
      }
      params.startDate = startDate;
      params.endDate = endDate;
    }

    const response = await axios.get(
      `${API_CONFIG.BASE_URL}${API_CONFIG.GET_TRANSACTIONS}`,
      { params, headers: getAuthHeaders() }
    );

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

export const insertTransaction = async (formData) => {
  try {
    const { email, application } = getUserAppData();
    const response = await axios.post(
      `${API_CONFIG.BASE_URL}${API_CONFIG.INSERT_TRANSACTIONS}`,
      { email, application, ...formData },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

export const editTransaction = async (formData) => {
  try {
    const { email, application } = getUserAppData();
    const response = await axios.put(
      `${API_CONFIG.BASE_URL}${API_CONFIG.EDIT_TRANSACTIONS}`,
      { email, application, ...formData },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

export const deleteTransaction = async (tnID) => {
  try {
    const { email, application } = getUserAppData();
    const response = await axios.delete(
      `${API_CONFIG.BASE_URL}${API_CONFIG.DELETE_TRANSACTIONS}`,
      {
        params: { email, application, tnID },
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};
