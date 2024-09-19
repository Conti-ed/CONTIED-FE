import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";
import { SERVER_URL } from "../api";
import { setupTokenRefresh } from "./auth";

const getAuthToken = (): string | undefined => {
  return Cookies.get("accessToken");
};

const api: AxiosInstance = axios.create({
  baseURL: SERVER_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

setupTokenRefresh(api);

export default api;
