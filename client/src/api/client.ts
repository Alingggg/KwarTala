import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

export const allowRegistration =
  import.meta.env.VITE_ALLOW_REGISTRATION === "true";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default api;
