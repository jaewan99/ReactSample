import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000", // Your NestJS backend
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: async (data: { name: string; password: string }) => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  register: async (data: { name: string; email: string; password: string }) => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};

export default api;
