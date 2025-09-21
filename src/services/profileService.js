// src/services/profileService.js
import API_CONFIG from "../config";
import Cookies from "js-cookie";

export const getProfileInfo = async (email) => {
  try {
    const token = Cookies.get("token"); // get token from cookie
    const res = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.GET_PROFILE_INFO}?email=${email}&application=${API_CONFIG.APPLICATION_NAME}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching profile info:", err);
    return { error: "Something went wrong" };
  }
};
