import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
console.log(API_BASE_URL, "baseurl");
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      // Если токен существует, добавляем его в заголовки Authorization
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      originalRequest._retry = true;

      console.warn("Токен недействителен, удаляем...");
      localStorage.removeItem("token");

      window.location.href = "/login";

      return Promise.reject(error);
    }
    return Promise.reject(error);
  },
);

export default apiClient;
