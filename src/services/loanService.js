import axios from 'axios';
import Cookies from 'js-cookie';
import API_CONFIG from '../config';

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
