const API_CONFIG = {
  BASE_URL: "http://localhost:3000",
  APPLICATION_NAME:"Finora",
  SIGN_IN: "/signIn",
  SIGN_UP:"/signUp",
  GET_PROFILE_INFO: "/getProfileInfo",
  SEND_OTP:"/initiateOtp",
  VERIFY_OTP:"/verifyOtp",
  GET_CATEGORIES:'/getCategory',
  GET_TRANSACTIONS:'/getTransactions',
  INSERT_TRANSACTIONS:'/insertTransaction',
  EDIT_TRANSACTIONS:'/editTransaction',
  DELETE_TRANSACTIONS:'/deleteTransaction',
  GET_DASHBOARD_INFO:'/getDashboardInfo',
  UPLOAD_DOCUMENT:'/uploadDoc',
  FETCH_DOCUMENT:'/fetchDoc',
  DELETE_DOCUMENT:'/deleteDoc',
  UPDATE_DOCUMENT:'/updateDoc',
  REGISTER_LOAN:'/registerLoan',
  LIST_LOANS:'/getLoans',
  FORCLOSE_LOAN:'/forcloseLoan'
};

export default API_CONFIG;