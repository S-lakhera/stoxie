import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // Use VITE_ prefix with import.meta.env
  
});

export default API;
