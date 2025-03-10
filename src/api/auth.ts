import axiosInstance from "@/services/apiClient";
// Login user API call
export const loginUser = async (data: { email: string; password: string }) => {
  const response = await axiosInstance.client.post("/api/users/login", data);
  return response.data; // Return token & user info
};

// Register user API call
export const registerUser = async (data: FormData) => {
  const response = await axiosInstance.client.post("/api/users/register", data);
  return response.data; // Return user info
};

// Verify email API call
export const verifyEmail = async (data: { email: string; otp: string }) => {
  const response = await axiosInstance.client.post(
    "/api/users/verify-email",
    data
  );
  return response.data; // Return user info
};

export const forgotPassword = async (data: { email: string }) => {
  const response = await axiosInstance.client.put(
    "/api/users/forgot-password",
    data
  );
  return response.data;
};

export const verifyForgotPasswordOtp = async (data: {
  email: string;
  forgotPasswordOTP?: string; // Optional for cases where `otp` is used
}) => {
  const response = await axiosInstance.client.put(
    "/api/users/verify-forgot-password-otp",
    data
  );
  return response.data;
};

export const resetPassword = async (data: {
  email: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  const response = await axiosInstance.client.put(
    "/api/users/reset-password",
    data
  );
  return response.data;
};

// Get user profile API call

export const updateUser = async (id: string, data: FormData) => {
  try {
    console.log(id);
    const response = await axiosInstance.client.put(
      `/api/users/update-user/${id}`,
      data
    );
    return response.data; // Return updated user info
  } catch (error) {
    console.log("Error updating user:", error);
    throw error; // Rethrow or handle the error as needed
  }
};

export const getUserDetails = async () => {
  const response = await axiosInstance.client.get("/api/users/me");
  return response.data;
};
