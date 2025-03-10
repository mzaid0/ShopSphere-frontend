import axios from "axios";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const success = (response: any) => response;

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_BASEURL,
  withCredentials: true,
});

client.interceptors.request.use((config) => {
  return config;
});

client.interceptors.response.use(success, (error) => {
  if (
    error.response?.status === 401 &&
    window.location.href !== "/login" &&
    error.response?.data?.message ===
      "Authentication token is required, Please Login first"
  ) {
    // Redirect to login page on 401 errors
    window.location.href = "/login";
  }

  // Properly reject the error for React Query
  return Promise.reject(error);
});

const axiosInstance = { client };

export default axiosInstance;
