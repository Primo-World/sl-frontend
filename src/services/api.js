import axios from "axios";
import { API_BASE_URL } from "@env"; // 👈 pulls from .env

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: attach JWT token if using auth
api.interceptors.request.use(
  async (config) => {
    // import AsyncStorage from "@react-native-async-storage/async-storage";
    // const token = await AsyncStorage.getItem("token");

    const token = null; // replace with AsyncStorage logic if needed
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
