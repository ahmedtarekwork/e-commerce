import axios from "axios";

let baseURL = "https://e-commerce-nextjs-api.vercel.app";

if (process.env.NODE_ENV === "test") baseURL = "http://localhost";
if (process.env.NODE_ENV === "development") baseURL = "http://localhost:3000";

axios.defaults.baseURL = baseURL;
axios.defaults.withCredentials = true;

export default axios;
