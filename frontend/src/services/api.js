import axios from "axios";
import toast from "react-hot-toast";

import { clearSession, loadSession } from "../utils/session";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
  timeout: 15000
});

api.interceptors.request.use((config) => {
  if (config.skipAuth) {
    return config;
  }

  const session = loadSession();
  if (session?.access) {
    config.headers.Authorization = `Bearer ${session.access}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const detail =
      error?.response?.data?.detail ||
      error?.response?.data?.code ||
      "";
    const isTokenError =
      status === 401 ||
      (typeof detail === "string" &&
        (detail.toLowerCase().includes("token") || detail.toLowerCase().includes("not valid")));

    if (!error?.config?.skipAuth && isTokenError) {
      clearSession();
      if (window.location.pathname.startsWith("/admin")) {
        toast.error("Your session expired. Please sign in again.");
        window.location.replace("/admin/login");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
