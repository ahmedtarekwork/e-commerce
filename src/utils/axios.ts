import axios from "axios";

const baseURL = "https://e-commerce-nextjs-api.vercel.app";

axios.defaults.baseURL = baseURL;
axios.defaults.withCredentials = true;

export default axios;
