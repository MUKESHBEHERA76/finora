import axios from "axios";
import API_CONFIG from "../config";

export const signIn = async (email, pass, clientInfo) => {
  try {
    const response = await axios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.SIGN_IN}`, {
      email,
      pass,
      clientInfo,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Something went wrong. Please try again.",
    };
  }
};
