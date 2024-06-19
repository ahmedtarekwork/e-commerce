import axios from "axios";

// utils
import cookies from "js-cookie";

const baseURL = "http://localhost:5000";
// const baseURL = "https://e-commerce-api-nlu9.onrender.com";

axios.defaults.baseURL = baseURL;
axios.interceptors.request.use((data) => {
  const token = cookies.get("dashboard-jwt-token");
  data.headers.Authorization = "Bearer " + token;

  return data;
});

export default axios;
