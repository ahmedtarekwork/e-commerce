import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://e-commerce-nextjs-api.vercel.app";

axios.defaults.baseURL = baseURL;
axios.defaults.withCredentials = true;

export default axios;
