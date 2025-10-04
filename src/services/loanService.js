import axios from "axios";
import Cookies from "js-cookie";
import API_CONFIG from "../config";

// Register Loan
export const registerLoan = async (payload) => {
  try {
    const token = Cookies.get('token');
    const user = Cookies.get('user');
    const email = user ? JSON.parse(user).email : null;
    const application = API_CONFIG.APPLICATION_NAME;

    if (!token || !email) throw new Error('Missing token or email');

    const response = await axios.post(
      `${API_CONFIG.BASE_URL}${API_CONFIG.REGISTER_LOAN}`,
      { email, application, ...payload },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return response.data;
  } catch (err) {
    if (err.response?.data?.error) throw new Error(err.response.data.error);
    throw new Error(err.message || 'Something went wrong, try again');
  }
};

// Get Loans
export const getLoans = async (isActive = true) => {
  try {
    const token = Cookies.get("token");
    const user = Cookies.get("user");
    const email = user ? JSON.parse(user).email : null;
    const application = API_CONFIG.APPLICATION_NAME;

    if (!token || !email) throw new Error("Missing token or Email");

    const response = await axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.LIST_LOANS}`, {
      params: { email, application, isActive },
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    if (error.response?.data?.error) throw new Error(error.response.data.error);
    throw new Error(error.message || "Unable to fetch loans");
  }
};

// Fetch Loan Document
export const fetchLoanDocument = async (documentId) => {
  try {
    const token = Cookies.get("token");
    const user = Cookies.get("user");
    const email = user ? JSON.parse(user).email : null;
    const application = API_CONFIG.APPLICATION_NAME;

    if (!token || !email) throw new Error("Missing token or Email");

    const response = await axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.FETCH_DOCUMENT}`, {
      params: { email, application, documentId },
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    if (error.response?.data?.error) throw new Error(error.response.data.error);
    throw new Error(error.message || "Unable to fetch document");
  }
};

// ✅ Foreclose Loan
// Foreclose Loan API
export const forcloseLoan = async ({ loanRefnumber, forecloseDate, forcloseAmountPaid, shortNote }) => {
  try {
    const token = Cookies.get("token");
    const user = Cookies.get("user");
    const email = user ? JSON.parse(user).email : null;
    const application = API_CONFIG.APPLICATION_NAME;

    if (!token || !email) throw new Error("Missing token or Email");

    const payload = {
      email,
      application,
      loanRefnumber,
      forecloseDate,
      forcloseAmountPaid: forcloseAmountPaid.toString(), // send as string
      shortNote,
    };

    const response = await axios.post(
      `${API_CONFIG.BASE_URL}${API_CONFIG.FORCLOSE_LOAN}`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return response.data;
  } catch (err) {
    if (err.response?.data?.error) throw new Error(err.response.data.error);
    throw new Error(err.message || "Unable to foreclose loan");
  }
};
