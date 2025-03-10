import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "./firebase";
import axiosInstance from "@/services/apiClient";
import useAuthStore from "@/store/authStore";

export const googleLogin = async (): Promise<void> => {
  try {
    const response = await signInWithPopup(auth, provider);
    const displayName = response.user.displayName || "";
    const nameParts = displayName.split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";
    const email = response.user.email ?? "";
    const avatar = response.user.photoURL ?? "";
    const userData = { firstName, lastName, email, avatar };
    const apiResponse = await axiosInstance.client.post(
      "/api/users/google-register",
      userData
    );
    console.log("API Response:", apiResponse.data);
    const { setUser } = useAuthStore.getState();
    setUser(apiResponse.data.user);
    if (apiResponse.data.user && apiResponse.data.user.role === "Admin") {
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/";
    }
  } catch (error) {
    console.error("Google login error:", error);
  }
};

export interface FacebookResponse {
  name?: string;
  email?: string;
  picture?: {
    data?: {
      url?: string;
    };
  };
}

export const facebookLoginHandler = async (
  response: FacebookResponse
): Promise<void> => {
  try {
    const displayName = response.name || "";
    const nameParts = displayName.split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";
    const email = response.email ?? "";
    const avatar = response.picture?.data?.url ?? "";
    const userData = { firstName, lastName, email, avatar };
    console.log("Facebook user data:", userData);
    const apiResponse = await axiosInstance.client.post(
      "/api/users/facebook-register",
      userData
    );
    console.log("API Response:", apiResponse.data);
    const { setUser } = useAuthStore.getState();
    setUser(apiResponse.data.user);
    if (apiResponse.data.user && apiResponse.data.user.role === "Admin") {
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/";
    }
  } catch (error) {
    console.error("Facebook login error:", error);
  }
};
