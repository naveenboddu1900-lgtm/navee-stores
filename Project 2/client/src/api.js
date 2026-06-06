import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
});

api.interceptors.request.use((request) => {
  const token = localStorage.getItem("collabspace_token");
  if (token) request.headers.Authorization = `Bearer ${token}`;
  return request;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("collabspace_token");
    }
    return Promise.reject(error);
  },
);

export function errorMessage(error) {
  return (
    error.response?.data?.message ||
    error.message ||
    "Something went wrong. Please try again."
  );
}
