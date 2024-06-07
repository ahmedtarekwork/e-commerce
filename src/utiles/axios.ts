import axios from "axios";

// utils
import cookies from "js-cookie";

// const baseURL = "https://e-commerce-api-nlu9.onrender.com";
const baseURL = "http://localhost:5000";

axios.defaults.baseURL = baseURL;

const axiosWithToken = axios.create({ baseURL });
axiosWithToken.interceptors.request.use((data) => {
  const token = cookies.get("dashboard-jwt-token");
  data.headers.Authorization = "Bearer " + token;

  return data;
});

export { axiosWithToken };

export default axios;
